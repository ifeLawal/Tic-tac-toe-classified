const currentTask = process.env.npm_lifecycle_event;
// const currentTask = "build";
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

const postCSSPlugins = [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-simple-vars"), 
    require("postcss-nested"), 
    require("postcss-hexrgba"), 
    require("autoprefixer")
]

let rootFolder = 'public';


let cssConfig = {
    test: /\.css$/i,
    use: ["css-loader?url=false", { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }]
}

let pages = fse.readdirSync('./app')
            .filter(file => {
                return file.endsWith('.html');
            })
            .map(page => {
                return new HtmlWebpackPlugin({
                    filename: page,
                    template: `./app/${page}`})
            })

let config = {
    // entry: './app/assets/scripts/App.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig,
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-react', 
                                { 
                                    "useBuiltIns": "usage", 
                                    "corejs": 3, 
                                    "targets": "defaults" 
                                }
                            ], '@babel/preset-env'],
                    }
                }
            }
        ]
    }
}

if (currentTask == 'webpack-dev' || currentTask == 'start:client' || currentTask == 'start') {
    cssConfig.use.unshift('style-loader');
    config.entry = {
        app: [
            './app/assets/scripts/App.js'
        ]
    }
    config.output = {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/js/',
        filename: 'bundled.js',
    };

    config.devServer = {
        before: function(app, server) {
            server._watch('./app/**/*.html')
        },
        contentBase: path.join(__dirname,  'public'),
        hot: true,
        port: 3000,
        host: '0.0.0.0'
    };

    config.mode = 'development';
}

if (currentTask == 'build') {
    config.entry = './app/assets/scripts/App.js';
    cssConfig.use.unshift(MiniCssExtractPlugin.loader);
    postCSSPlugins.push(require('cssnano'));
    config.output = {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, rootFolder),
    };
    config.mode = 'production';
    config.optimization = {
        splitChunks: {chunks: 'all'}
    }
    config.plugins.push(
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}))
}

module.exports = config;