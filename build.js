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
    // Nasty, but works for now and is better than just replacing "process.env.NODE_ENV"
    return code.replace(/\bif\s*\(process.env.NODE_ENV[^}]+\}/g, '')
  }
}

const transformConstToLet = {
  transformBundle (code) {
    return code.replace(/\bconst\b/g, 'let')
  }
}

const transformGlConsts = {
  transformBundle (code) {
    for (let [key, value] of Object.entries(webglConstants)) {
      code = code.replace(new RegExp(`([^a-zA-Z.])gl\\.${key}\\b`, 'g'), (g0, g1) => g1 + value)
    }
    return code
  }
}

// Rename certain words and rewrite patterns which closure compiler usually doesn't mangle, such that
// it actually does mangle them.
const preMangle = {
  transformBundle (code) {
    return code
      .replace(/\borientation/g, 'mOrientation')
      .replace(/\bactions/g, 'mActions')
  }
}

function minifyShaders (code) {
  return code.replace(/"\/\*glsl\*\/([\s\S]+?)"/g, shaderCode => {
    const s = JSON.parse(shaderCode)
    return JSON.stringify(
      s.substr(8)
        .replace(/\s+/g, ' ')
        .replace(/^\s+|\s+$/g, '')
        .replace(/\/\*.+?\*\//g, '')
        .replace(/\b0(\.\d+)\b/g, (g0, g1) => g1)
        .replace(/\b(\d+\.)0\b/g, (g0, g1) => g1)
        .replace(/(\W) /g, (g0, g1) => g1)
        .replace(/ (\W)/g, (g0, g1) => g1)
    )
  })
}

function minifyMore (code) {
  return code
    .replace(/\["(\w+)"\]:/g, (g0, g1) => g1 + ':')
    .replace(/\[(\d+)\]:/g, (g0, g1) => g1 + ':')
    .replace(/window\.localStorage/g, 'localStorage')
}

const postCCMinify = {
  transformBundle (code) {
    return minifyShaders(minifyMore(code))
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
  postCCMinify
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

function createHtml () {
  let minifiedHtml = minifyHtml(
    fs.readFileSync('index.html', { encoding: 'utf-8' }),
    {
      collapseWhitespace: true,
      minifyCSS: true,
      removeAttributeQuotes: true,
      removeOptionalTags: true
    }
  )

  let classNames
  // Yes I know this is terrible
  eval(
    fs.readFileSync(__dirname + '/src/classNames.js', { encoding: 'utf-8' })
      .replace('export const', '')
  )

  Object.entries(classNames).forEach(([key, value]) => {
    minifiedHtml = minifiedHtml.replace(new RegExp(`\\b${key}\\b`, 'g'), value)
  })

  // Hack: undo some renaming :P
  minifiedHtml = minifiedHtml.replace('your s ', 'your screen ')

  return minifiedHtml
}

async function build() {
  const bundle = await rollup.rollup(inputOptions)
  let { code } = await bundle.generate(outputOptions)

  let minifiedHtml = createHtml()

  // Strip "use strict"
  code = code.substring("'use strict';".length)

  let newScriptTag = `<script>${code}</script>`
  minifiedHtml = minifiedHtml
    .replace(/<script[^>]+><\/script>/, m => newScriptTag)

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
