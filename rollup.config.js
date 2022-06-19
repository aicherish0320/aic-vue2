import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    format: 'umd',
    name: 'Vue',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

/*
  在 Node 中使用 cjs，在 webpack 中使用 esm，前端里直接 script 引入，
  使用 iife umd
*/
