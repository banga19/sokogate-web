const SitemapPlugin = require('sitemap-webpack-plugin').default;
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const paths = [
    { path: "/guinea" }, { path: "/senegal" }, { path: "/ghana" },
    { path: "/cote-divoire" }, { path: "/cameroon" }, { path: "/sierra-leone" },
    { path: "/kenya" }, { path: "/zimbabwe" },
    { path: "/" }, { path: "/v2/login" },
    { path: "/v2/privacy-policy" }, { path: "/v2/forgetPassword" },
    { path: "/v2/register" }, { path: "/merchant-settlement" },
    { path: "/v2/trade-assurance" }, { path: "/v2/order" },
    { path: "/v2/guarantee" }, { path: "/v2/payment" }, { path: "/v2/delivery" },
    { path: "/v2/terms-conditions" }, { path: "/v2/seller-policy" },
    { path: "/v2/buyer-policy" }, { path: "/v2/shipping-refund" },
    { path: "/v2/wholesale-policy" },
    { path: "/v2/personal-center" }, { path: "/v2/personal-center/address-management" },
    { path: "/v2/personal-center/logistics-management" }, { path: "/v2/personal-center/account" },
    { path: "/v2/personal-center/coupon" }, { path: "/v2/personal-center/inquiry" },
    { path: "/v2/personal-center/evaluation" }, { path: "/v2/personal-center/refund" },
    { path: "/v2/order/detail" }, { path: "/v2/product/list" }, { path: "/v2/product/detail" },
    { path: "/v2/store/collections" }, { path: "/v2/store/storeList" },
    { path: "/v2/store/about" }, { path: "/v2/collection/collection" },
    { path: "/v2/authentication/mobileAuthentication" },
    { path: "/v2/authentication/idcardAuthentication" },
    { path: "/v2/authentication/waitingapproval" }, { path: "/v2/authentication/auditcompleted" },
    { path: "/v2/aboutus" }, { path: "/v2/shopping-cart" },
    { path: "/v2/checkout/counter_plus" }, { path: "/v2/checkout/counter" },
    { path: "/v2/checkout/payment" },
];

module.exports = {
    transpileDependencies: [],

    configureWebpack: (config) => {
        const plugins = [
            new CompressionWebpackPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: /\.(js|css)$/,
                threshold: 10240,
                minRatio: 0.8,
            }),
        ];

        if (process.env.NODE_ENV === 'production') {
            plugins.push(
                new SitemapPlugin({
                    base: process.env.VUE_APP_V2_HOMEPAGE_URL || 'https://sokogate.com',
                    paths: paths.map((x) => x.path),
                    options: {
                        filename: 'sitemap.xml',
                        lastmod: true,
                        changefreq: 'hourly',
                        priority: 0.8,
                    },
                })
            );
        }

        // Merge splitChunks config for bundle optimization
        const splitChunks = {
            chunks: 'all',
            minSize: 20000,
            maxSize: 250000,
            cacheGroups: {
                vendor: {
                    name: 'chunk-vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                },
                elementUI: {
                    name: 'chunk-element-ui',
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                    priority: 20,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
                bootstrap: {
                    name: 'chunk-bootstrap',
                    test: /[\\/]node_modules[\\/](bootstrap|bootstrap-vue)[\\/]/,
                    priority: 15,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true,
                },
            },
        };

        return {
            plugins,
            optimization: { splitChunks },
            ignoreWarnings: [/legacy JS API deprecated/],
        };
    },

    chainWebpack: (config) => {
        config.plugins.delete('prefetch');

        // Image optimization: inline small images as base64
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap((options) => ({
                ...options,
                limit: 8192,
                name: 'img/[name].[hash:8].[ext]',
            }));
    },

    outputDir: process.env.OUTPUT_DIR || 'dist',
    publicPath: process.env.PUBLIC_PATH || '/',
    // Note: only PUBLIC_PATH (uppercase) — lowercase publicPath conflicts
    // with a Git Bash on Windows environment variable that resolves to
    // "C:/Program Files/Git/" causing broken asset paths.
    lintOnSave: false,
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,

    devServer: {
        client: {
            overlay: {
                warnings: true,
                errors: true,
            },
        },
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: { '^/api': '/api/v2' },
                logLevel: 'debug',
            },
        },
    },
};
