var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

var HtmlWebpackPlugin = require('html-webpack-plugin')

/*---------------------------------START 配置多入口---------------------------------------*/
const isPro = process.env.NODE_ENV=='production'
console.log("process.env.NODE_ENV="+process.env.NODE_ENV+"  "+isPro)
console.log("当前环境："+(isPro?"build":"dev"))

var _DEFAULT_TEMPLATE = "index.html"
var _DEFAULT_CHUNK = ['index']
//配置生成的入口html文件，注意依赖，basic为通用的依赖
var _pages = [
  {name:"index.html",chunks:['basic','index']},
  {name:"mobile.html", chunks:['basic','mobile']}
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


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    index: './src/index/main.js',
    mobile:'./src/mobile/main.js',
    //通用的组件，统一打包
    basic: ['vue', 'vue-router', 'axios']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'A':resolve('src/_assets'),
      'C':resolve('src/_components'),
      'index':resolve('src/index'),
      'mobile':resolve('src/mobile')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins:_htmlPlugins
}
