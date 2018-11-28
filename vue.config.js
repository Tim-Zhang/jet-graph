// vue.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.sourceMap = false
      delete config.optimization.splitChunks
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV !== 'production') return
    config.plugin('copy').tap(args => {
      args[0][0].ignore.push('meta.json')
      args[0][0].ignore.push('*.rrd')
      return args
    })

    config.plugin('html').tap(args => {
      args[0].minify.minifyCSS = true
      return args
    })
  }
}