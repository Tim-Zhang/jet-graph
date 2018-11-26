// vue.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      delete config.optimization.splitChunks
    }
  }
}