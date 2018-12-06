const webpack = require('webpack');
let path = require("path");

module.exports ={
    entry: {
        client: ['./src/index.js']
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: "/static/"
    },

    plugins: [
        new webpack.NamedModulesPlugin()
    ],
    devServer: {
        contentBase: './public',
        disableHostCheck: true,
        hot: true
    },
    devtool: "source-map",

    module: {
        rules: [{
            exclude: /(node_modules)/,
            test: /\.jsx?$/,
            loaders: "babel-loader",
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
};