const SitemapPlugin = require('sitemap-webpack-plugin').default;
const CompressionWebpackPlugin = require('compression-webpack-plugin');


const paths = [
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
    // Zero-Click SEO - 8 African market pages
    { path: "/guinea", priority: 0.9, changefreq: "monthly" },
    { path: "/senegal", priority: 0.9, changefreq: "monthly" },
    { path: "/ghana", priority: 0.9, changefreq: "monthly" },
    { path: "/cote-divoire", priority: 0.9, changefreq: "monthly" },
    { path: "/cameroon", priority: 0.9, changefreq: "monthly" },
    { path: "/sierra-leone", priority: 0.9, changefreq: "monthly" },
    { path: "/kenya", priority: 0.9, changefreq: "monthly" },
    { path: "/zimbabwe", priority: 0.9, changefreq: "monthly" },


];

module.exports = {
    configureWebpack: {
        plugins: [
             new CompressionWebpackPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: new RegExp('\.(js|css)$'),
                // 只处理大于xx字节 的文件，默认：0
                threshold: 10240,
                // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
                minRatio: 0.8, // 默认: 0.8
                // 是否删除源文件，默认: false          deleteOriginalAssets: false
            }),
            new SitemapPlugin({
                base: process.env.VUE_APP_V2_HOMEPAGE_URL || 'https://www.sokogate.com',
                paths: paths.map(x => x.path),
                options: {
                    filename: 'sitemap.xml',
                    lastmod: true,
                    changefreq: 'hourly',
                    priority: 0.8
                }
            })
        ]
    },
    chainWebpack: config => {
        config.plugins.delete('prefetch');
    },
    outputDir: process.env.outputDir,
    publicPath: '/',
    lintOnSave: false,
    // source map
    productionSourceMap: false,
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: false
            }
        },
        historyApiFallback: {
            rewrites: [
                { from: /^\/guinea$/, to: '/' },
                { from: /^\/senegal$/, to: '/' },
                { from: /^\/ghana$/, to: '/' },
                { from: /^\/cote-divoire$/, to: '/' },
                { from: /^\/cameroon$/, to: '/' },
                { from: /^\/sierra-leone$/, to: '/' },
                { from: /^\/kenya$/, to: '/' },
                { from: /^\/zimbabwe$/, to: '/' },
            ]
        }
    },
}