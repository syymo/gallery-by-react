'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
    entry: path.join(__dirname, '../src/index'),
    cache: false,
    devtool: 'sourcemap',
    plugins: [
        //检测相似的文件 或者重复的内容
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false
        }),
        //用来压缩JavaScript代码
        new webpack.optimize.UglifyJsPlugin(),
        //根据引用频度来排序各个模块id 引用的越频繁ID值越短
        new webpack.optimize.OccurenceOrderPlugin(),
        //优化生成的代码段 合并相同的代码段
        new webpack.optimize.AggressiveMergingPlugin(),
        //保证编译过程不能出错
        new webpack.NoErrorsPlugin()
    ],
        module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
    test: /\.(js|jsx)$/,
    loader: 'babel',
    include: [].concat(
        config.additionalPaths, [path.join(__dirname, '/../src')]
    )
});

module.exports = config;
