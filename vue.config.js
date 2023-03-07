/**
 * * proxy 요청을 보낼 서버 주소
 * ? proxy서버가 웹서버로 요청을 대신함으로써 CORS를 해결.
 * ? 개발환경에서는 가능하지만 결국엔 서버에서 처리해야함.
 */
// const target = "http://127.0.0.1:80";
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin')
const { SourceMapDevToolPlugin } = require('webpack')

module.exports = {
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        prependData: `@import '@/assets/scss/index.scss';`,
      },
    },
  },
  configureWebpack: {
    devtool: 'cheap-eval-source-map',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/'),
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new RetryChunkLoadPlugin({
        retryDelay: 1500,
        maxRetries: 2,
        cacheBust: `function() {
          return Date.now();
        }`,
        lastResortScript: 'window.location.reload(true)',
      }),
      new SourceMapDevToolPlugin({
        filename: '[file].map',
      }),
    ],
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch') // prefetch 삭제

    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('vue-loader')
      .loader('vue-loader-v16')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')

    // config.module
    //   .rule("file")
    //   .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
    //   .use("url-loader")
    //   .loader("url-loader")
    //   .options({
    //     limit: 10000,
    //     name: "assets/fonts/[name].[ext]",
    //   })
    //   .end();
  },
  devServer: {
    port: 8181,
    overlay: false,
    // proxy: {
    //   // * proxy 요청을 보낼 api 시작 부분
    //   "^/api": {
    //     target,
    //     changeOrigin: true,
    //   },
    // },
  },
}
