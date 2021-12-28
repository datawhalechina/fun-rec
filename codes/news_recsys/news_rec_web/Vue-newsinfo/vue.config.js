module.exports = {
    // 第三方插件配置
    pluginOptions: {
        pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
        }
    },
    publicPath: './', // 基本路径 默认'/'，部署应用包时的基本 URL
    outputDir: 'dist', // 输出文件目录 生产环境构建文件的目录
    assetsDir: "static", //相对于outputDir的静态资源(js、css、img、fonts)目录
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件

    chainWebpack: config => {
        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))  //使用@代替src
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {// 为生产环境修改配置...
            config.mode = 'production';
            config["performance"] = {//打包文件大小配置
                "maxEntrypointSize": 10000000,  // 入口起点的最大体积
                "maxAssetSize": 30000000  // 生成文件的最大体积
            }
        }
    }
}
