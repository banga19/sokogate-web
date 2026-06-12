const SitemapPlugin = require('sitemap-webpack-plugin').default;
const CompressionWebpackPlugin = require('compression-webpack-plugin');


const paths = [
    // SEO Market Pages - Zero-Click Google Optimization
    { path: "/guinea" },
    { path: "/senegal" },
    { path: "/ghana" },
    { path: "/cote-divoire" },
    { path: "/cameroon" },
    { path: "/sierra-leone" },
    { path: "/kenya" },
    { path: "/zimbabwe" },
    {
        path: "/"
    },
    {
        path: "/v2/login"
    },
    // privacy Policy
    {
        path: "/v2/privacy-policy"
    },
    {
        path: "/v2/forgetPassword"
    },
    {
        path: "/v2/register"
    },
    {
        path: "/merchant-settlement"
    },
    {
        path: "/v2/trade-assurance"
    },
    {
        path: "/v2/order"
    },
    // guarantee
    {
        path: "/v2/guarantee"
    },
    // payment
    {
        path: "/v2/payment"
    },
    // delivery
    {
        path: "/v2/delivery"
    },
    // terms Conditions
    {
        path: "/v2/terms-conditions"
    },
    // seller Policy
    {
        path: "/v2/seller-policy"
    },
    // buyer Policy
    {
        path: "/v2/buyer-policy"
    },

    // shipping & Refund
    {
        path: "/v2/shipping-refund"
    },
    // wholesale Policy
    {
        path: "/v2/wholesale-policy"
    },
    // 个人中心
    {
        path: "/v2/personal-center"
    },
    // 个人中心中的地址管理
    {
        path: "/v2/personal-center/address-management"
    },
    // 个人中心中的物流公司管理
    {
        path: "/v2/personal-center/logistics-management"
    },
    // 个人中心中的账户设置
    {
        path: "/v2/personal-center/account"
    },
    // 个人中心中的退款管理
    {
        path: "/v2/personal-center/coupon"
    },
    // 个人中心中的查询管理
    {
        path: "/v2/personal-center/inquiry"
    },
    // 个人中心中的评价管理
    {
        path: "/v2/personal-center/evaluation"
    },
    // 个人中心中的退款管理
    {
        path: "/v2/personal-center/refund"
    },
    // 商品详情
    {
        path: "/v2/order/detail"
    },
    // 商品的分类列表
    {
        path: "/v2/product/list"
    },
    // 商品分类的详情
    {
        path: "/v2/product/detail"
    },
    {
        path: "/v2/store/collections"
    },
    {
        path: "/v2/store/storeList"
    },
    // 店铺的关于我们
    {
        path: "/v2/store/about"
    },
    // 收藏列表
    {
        path: "/v2/collection/collection"
    },
    // 手机号实名认证
    {
        path: "/v2/authentication/mobileAuthentication"
    },
    //身份证实名认证
    {
        path: "/v2/authentication/idcardAuthentication"
    },
    // 实名认证审核中
    {
        path: "/v2/authentication/waitingapproval"
    },
    // 实名认证完成
    {
        path: "/v2/authentication/auditcompleted"
    },
    // 关于我们
    {
        path: "/v2/aboutus"
    },
    {
        path: "/v2/shopping-cart"
    },
    {
        path: "/v2/checkout/counter_plus"
    },
    {
        path: "/v2/checkout/counter"
    },
    {
        path: "/v2/checkout/payment"
    },


];

module.exports = {
    transpileDependencies: [],
    configureWebpack: (config) => {
        const plugins = [
            new CompressionWebpackPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: new RegExp('\.(js|css)$'),
                threshold: 10240,
                minRatio: 0.8
            })
        ];

        // Only generate sitemap in production build, not during serve
        if (process.env.NODE_ENV === 'production') {
            plugins.push(
                new SitemapPlugin({
                    base: process.env.VUE_APP_V2_HOMEPAGE_URL || 'https://sokogate.com',
                    paths: paths.map(x => x.path),
                    options: {
                        filename: 'sitemap.xml',
                        lastmod: true,
                        changefreq: 'hourly',
                        priority: 0.8
                    }
                })
            );
        }

        return { 
            plugins,
            ignoreWarnings: [/legacy JS API deprecated/],
        };
    },
    chainWebpack: config => {
        config.plugins.delete('prefetch');
    },
    outputDir: process.env.outputDir,
    publicPath: process.env.publicPath,
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        client: {
            overlay: {
                warnings: true,
                errors: true
            }
        },
        historyApiFallback: true
    }
}