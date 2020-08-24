const rollup = require('rollup')
const fs = require('fs')
const tempfile = require('tempfile')
const ClosureCompiler = require('google-closure-compiler').compiler
const rollupPluginJson = require('rollup-plugin-json')
const rollupPluginUrl = require('rollup-plugin-url')
const { execFile } = require('child_process')
const advzip = require('advzip-bin')
const minifyHtml = require('html-minifier').minify
const webglConstants = require('@luma.gl/constants')

function asyncCompile (compiler) {
  return new Promise(resolve => compiler.run((...args) => resolve(args)))
}

const closureCompilerPlugin = {
  name: 'closure-compiler',
  async transformBundle (code) {
    const jsFilename = tempfile()
    const mapFilename = tempfile()

    fs.writeFileSync(jsFilename, code)

    const compiler = new ClosureCompiler({
      js: jsFilename,
      create_source_map: mapFilename,
      process_common_js_modules: true,
      language_out: 'ECMASCRIPT_NEXT',
      compilation_level: 'ADVANCED'
    })

    const [exitCode, stdOut, stdErr] = await asyncCompile(compiler)

    if (exitCode != 0) {
      throw new Error(`closure compiler exited ${exitCode}: ${stdErr}`)
    }

    return {
      code: stdOut,
      map: JSON.parse(fs.readFileSync(mapFilename))
    }
  }
}

const replaceEnvs = {
  transformBundle (code) {
    return code.replace(/process.env.NODE_ENV/g, '"production"')
  }
}

const transformConstToLet = {
  transformBundle (code) {
    return code.replace(/\bconst\b/g, 'let')
  }
}

const minifyShaders = {
  transformBundle (code) {
    return code.replace(/"\/\*glsl\*\/([\s\S]+?)"/g, shaderCode => {
      const s = JSON.parse(shaderCode)
      return JSON.stringify(
        s.substr(8)
          .replace(/\b0(\.\d+)\b/g, (g0, g1) => g1)
          .replace(/\b(\d+\.)0\b/g, (g0, g1) => g1)
          .replace(/\s+/g, ' ')
      )
    })
  }
}

const transformGlConsts = {
  transformBundle (code) {
    for (let [key, value] of Object.entries(webglConstants)) {
      code = code.replace(new RegExp(`([^a-zA-Z.])(gl\\.${key}\\b)`), (g0, g1) => g1 + value)
    }
    return code
  }
}

// Rename certain words and rewrite patterns which closure compiler usually doesn't mangle, such that
// it actually does mangle them.
const preMangle = {
  transformBundle (code) {
    // TODO
    return code
  }
}

const plugins = [
  rollupPluginJson(),
  rollupPluginUrl({
    limit: Infinity
  }),
  transformConstToLet,
  transformGlConsts,
  preMangle,
  replaceEnvs,
  closureCompilerPlugin,
  minifyShaders
]

if (!fs.existsSync('dist')){
  fs.mkdirSync('dist');
}

const inputOptions = {
  input: 'src/entry.js',
  plugins
}
const outputOptions = {
  file: 'dist/build.js',
  format: 'es'
}

function advZip () {
  return new Promise((resolve, reject) => {
    execFile(advzip, ['-4', '-i', 1000, '-a', './dist/dist.zip', './dist/index.html'], err => {
      if (err) { return reject(err) }
      resolve()
    })
  })
}

async function build() {
  const bundle = await rollup.rollup(inputOptions)
  const { code } = await bundle.generate(outputOptions)

  let minifiedHtml = minifyHtml(
    fs.readFileSync('index.html', { encoding: 'utf-8' }),
    {
      collapseWhitespace: true,
      minifyCSS: true,
      removeAttributeQuotes: true
    }
  )

  let newScriptTag = `<script>${code}</script>`
  minifiedHtml = minifiedHtml.replace(/<script[^>]+><\/script>/, m => newScriptTag)

  fs.writeFileSync('dist/index.html', minifiedHtml, { encoding: 'utf-8' })

  await advZip()

  const finalFileSize = fs.readFileSync('./dist/dist.zip').byteLength

  const limit = 13 * 1024
  const perc = (finalFileSize * 100 / limit).toFixed(1)
  console.log(`Final file size: ${finalFileSize} (${perc}% of 13kb)`)

  if (finalFileSize > limit) {
    console.error(`That's ${finalFileSize - limit} too many bytes!`)
  } else {
    console.log(`${limit - finalFileSize} bytes left!`)
  }
}

build()
