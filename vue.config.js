module.exports = {
    lintOnSave: false,
    css: {
        loaderOptions: {
            less: {
                modifyVars: {},
                javascriptEnabled: true
            }
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title= '照片集'
                return args
            })
    },
    devServer: {
        // development server port 8000
        // port: 8000,
        // host: 'localhost',
        open: true,
        // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
        proxy: {
            '/': {
                target: 'http://127.0.0.1:7001',
                // target: 'http://egg.liubo.ink',
                ws: false,
                changeOrigin: true
            },
        },
    },
}