const path = require('path')
module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    devServer: {
        // pen: process.platform === 'darwin',
        // host: '0.0.0.0',
        port: 8082, // CHANGE YOUR PORT HERE!
        // https: true,
        // hotOnly: false,
    },
    // configureWebpack: {
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.ts$/,
    //                 use: "ts-loader",
    //                 exclude: /node_modules/
    //             }
    //         ]
    //     },
    //     resolve: {
    //         extensions: [".ts", ".js"]
    //     },
    //     output: {
    //         filename: "bundle.js",
    //         path: path.resolve(__dirname, "dist")
    //     }
    // }
    chainWebpack: config => {
        config.module
            .rule('ts')
            .test(/\.ts$/)
            .use('ts-loader')
            .loader('ts-loader')
            .end()
    }
}