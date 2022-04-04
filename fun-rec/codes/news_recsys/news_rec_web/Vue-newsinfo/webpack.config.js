// 导入处理路径的模块
const path = require('path');


// 导入在内存中生成 HTML 页面的 插件
// 只要是插件，都一定要 放到 plugins 节点中去
// 这个插件的两个作用：
//  1. 自动在内存中根据指定页面生成一个内存的页面
//  2. 自动，把打包好的 bundle.js 追加到页面中去
const htmlWebpackPlugin = require('html-webpack-plugin');

// 配置vue这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 这个配置文件，起始就是一个 JS 文件，通过 Node 中的模块操作，向外暴露了一个 配置对象
module.exports = {
    mode: 'production', // 生产环境下会自动压缩js代码
    // productionSourceMap: false,
    // path.join拼接入口文件
    entry: path.join(__dirname, './src/main.js'),// 入口，表示，要使用 webpack 打包哪个文件
    output: { // 定义出口文件
        path: path.join(__dirname, './dist'), // 指定 打包好的文件，输出到哪个目录中去
        filename: 'bundle.js' // 这是指定 输出的文件的名称

    },
    // 配置插件的节点
    plugins: [
        // 创建一个在内存中生成HTML页面的插件,指定模板页面，将来会根据指定的页面路径，去生成内存中的index.html,并且自动加载内存中的bundle.js文件。
        new htmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html', // 指定生成的页面的名称
            favicon: './favicon.ico',
            inject: true,
        }),
        // 请确保引入这个插件！
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [ // 文件匹配规则：use代表使用那些模块来处理test所匹配的文件。use中模块的加载顺序是从后到前。
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // 处理css的文件的规则--实施加载
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, // 处理less文件的规则
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, // 处理sass文件的规则
            // 处理图片的loader,如果字节小于7631转成base64位,name可选参数，代表图片的名字,后面参数拼接图片的名字，8位base64+图片名称
            { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=7631&name=images/[hash:8]-[name].[ext]' },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' }, // 处理字体文件的 loader (bootstrap字体图标)
            // 用来处理ES6或者ES7高级语法的loader,相当于一个转换器。会把高级语法转换成ES5浏览器能识别的JS代码
            // 注：参数里exclude: 表示不转换的文件夹。|需要创建.babelrc配置文件，里面配置转换插件的字典和工具
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },

            // 添加支持vue的loader
            { test: /\.vue$/, use: 'vue-loader' }
        ]
    },
    resolve: {
        alias: {  // 设置 Vue 被导入时候的包的路径,一种更方便使用import form导入包得方式
            "vue$": "vue/dist/vue.js"
        }
    },
};
