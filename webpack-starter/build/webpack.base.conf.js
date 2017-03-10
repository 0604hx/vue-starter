var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var HtmlWebpackPlugin = require('html-webpack-plugin')

/*---------------------------------START 配置多入口---------------------------------------*/
const isPro = process.env.NODE_ENV=='production'
console.log("process.env.NODE_ENV="+process.env.NODE_ENV+"  "+isPro)
console.log("当前环境："+(isPro?"build":"dev"))

var _DEFAULT_TEMPLATE = "./src/index.html"
var _DEFAULT_CHUNK = ['index']
//配置生成的入口html文件，注意依赖，basic为通用的依赖
var _pages = [
  {name:"index.html",chunks:['basic','index']},
  {name:"mobile.html", template:"./src/mobile/index.html",chunks:['basic','mobile']}
]

console.log()
var _htmlPlugins = []
for(var i=0;i<_pages.length;i++){
  const p=_pages[i]
  console.info("[多入口] 添加"+p.name+" , template="+(p.template || _DEFAULT_TEMPLATE)+", chunks="+(p.chunks||_DEFAULT_CHUNK))

  const htmlPlugin={
    filename: isPro? config.build.assetsRoot+"/"+p.name :p.name,
    template: p.template || _DEFAULT_TEMPLATE,
    inject: p.inject===false? false : true,
    chunks: p.chunks || _DEFAULT_CHUNK//isPro?(['manifest','vendor'].concat(p.chunks || _DEFAULT_CHUNK)):p.chunks || _DEFAULT_CHUNK
  }
  //如果是build环境
  if(isPro){
    htmlPlugin['minify']={
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    htmlPlugin['chunksSortMode']= 'dependency'
  }

  _htmlPlugins.push(new HtmlWebpackPlugin(htmlPlugin))
}
console.log("----多入口配置完成，共有"+_htmlPlugins.length+"个入口"+"----")
console.log()
/*---------------------------------END 配置多入口---------------------------------------*/

module.exports = {
  entry: {
    index: './src/index/index.js',
    mobile: './src/mobile/index.js',
    //通用的组件，统一打包
    basic: ['vue', 'vue-router', 'axios']
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'moment-locale':"moment/min/moment-with-locales.min.js",
      'moment-min':"moment/min/moment.min.js",
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/_assets'),
      '_c': path.resolve(__dirname, '../src/_components'),
      '_v': path.resolve(__dirname, '../src/_views'),

      //增加index入口的别名
      'index':path.resolve(__dirname, "../src/index"),
      //增加mobile入口的别名
      'mobile':path.resolve(__dirname, "../src/mobile")
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  vue: {
    loaders: utils.cssLoaders()
  },
  plugins:_htmlPlugins
}
