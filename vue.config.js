const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const cesiumSource = './node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

const port = 9595

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: 'http://localhost:8301/',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // }
  },
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false,
      rules: [
        // three.js扩展库的使用
        // OrbitControls.js库的引用
        {
          test: require.resolve('three/examples/js/controls/OrbitControls'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/controls/OrbitControls'),
          use: 'exports-loader?THREE.OrbitControls'
        },
        // CSS2DRenderer
        {
          test: require.resolve('three/examples/js/renderers/CSS2DRenderer.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/renderers/CSS2DRenderer.js'),
          use: 'exports-loader?THREE.CSS2DRenderer'
        },
      ]
    }
  },
}