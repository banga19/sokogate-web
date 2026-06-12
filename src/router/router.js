import VueRouter from "vue-router";

const ShoppingCart = () => import(/* webpackPrefetch: true */ "@/pages/shopping-cart/index.vue");
const CheckoutCounterPlus = () => import(/* webpackPrefetch: true */ "@/pages/checkout/counter_plus.vue");
const CheckoutPayment = () => import(/* webpackPrefetch: true */ "@/pages/checkout/paymentV2.vue");
const PaymentSuccess = () => import(/* webpackPrefetch: true */ "@/pages/checkout/paymentSuccess.vue");
const MerchantSettlement = () => import(/* webpackPrefetch: true */ "@/pages/merchant-settlement");
const OrderIndex = () => import(/* webpackPrefetch: true */ "@/pages/order");
const Login = () => import(/* webpackPrefetch: true */ "@/pages/user/login");
const GuaranteeIndex = () => import(/* webpackPrefetch: true */ "@/pages/shortcut/guarantee.vue");
const PaymentIndex = () => import(/* webpackPrefetch: true */ "@/pages/shortcut/payment.vue");
const DeliveryIndex = () => import(/* webpackPrefetch: true */ "@/pages/shortcut/delivery.vue");
const aboutIndex = () =>
    import(/* webpackPrefetch: true */ "@/pages/merchant-settlement/about.vue");
const termsConditionsIndex = () =>
    import(/* webpackPrefetch: true */ "@/pages/merchant-settlement/termsConditions.vue");
const sellerPolicyIndex = () =>
    import(/* webpackPrefetch: true */ "@/pages/merchant-settlement/sellerPolicy.vue");
const buyerPolicyIndex = () =>
    import(/* webpackPrefetch: true */ "@/pages/merchant-settlement/buyerPolicy.vue");
const privacyPolicyIndex = () =>
    import(/* webpackPrefetch: true */ "@/pages/merchant-settlement/privacyPolicy.vue");
const shippingRefundIndex = () =>
    import(/* webpackPrefetch: true */ "@/pages/merchant-settlement/shippingRefund.vue");
const wholesalePolicyIndex = () =>
    import(/* webpackPrefetch: true */ "@/pages/merchant-settlement/wholesalePolicy.vue");
const personalCenterIndex = () => import(/* webpackPrefetch: true */ "@/pages/personal-center/index.vue");

const layout = () => import(/* webpackPrefetch: true */ "@/layout/indexV2.vue");
const layoutHome = () => import(/* webpackPrefetch: true */ "@/layout/indexV2Home.vue");

// SEO Market Pages for Zero-Click Google Optimization
const GuineaPage = () => import("@/pages/markets/GuineaPage.vue");
const SenegalPage = () => import("@/pages/markets/SenegalPage.vue");
const GhanaPage = () => import("@/pages/markets/GhanaPage.vue");
const IvoryCoastPage = () => import("@/pages/markets/IvoryCoastPage.vue");
const CameroonPage = () => import("@/pages/markets/CameroonPage.vue");
const SierraLeonePage = () => import("@/pages/markets/SierraLeonePage.vue");
const KenyaPage = () => import("@/pages/markets/KenyaPage.vue");
const ZimbabwePage = () => import("@/pages/markets/ZimbabwePage.vue");

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

export const routes = [
    {
        path: "/v2/",
        name: "test",
        component: layout,
        redirect: "index",
        meta: {
            title: "Sokogate",
        },
    },
    {
        path: "/",
        name: "index",
        component: layoutHome,
        children: [
            {
                path: "",
                name: "yrdy",
                component: () => import("@/pages/product/Home/index.vue"),
            },
        ],
    },
    {
        path: "/v2/flutterwave",
        name: "flutterwave",
        component: () => import("@/components/payment/Appflutterwave")
    },
    {
        path: "/v2/login",
        name: "login",
        component: Login,
    },
    {
        path: "/v2/about",
        name: "About Sokogate",
        component: aboutIndex,
    },
    {
        path: "/v2/privacy-policy",
        name: "privacy Policy",
        component: privacyPolicyIndex,
    },
    {
        path: "/v2/forgetPassword",
        name: "forgetPassword",
        component: () => import("@/pages/user/forgetPassword.vue"),
    },
    {
        path: "/v2/register",
        name: "register",
        component: () => import("@/pages/user/register.vue"),
    },
    {
        path: "/v2/",
        name: "layout",
        component: layout,
        redirect: "index",
        children: [
            {
                path: "/merchant-settlement",
                name: "merchant_settlement",
                component: MerchantSettlement,
            },
            {
                path: "/v2/trade-assurance",
                name: "Trade Assurance",
                component: () =>
                    import("@/pages/merchant-settlement/tradeAssurance.vue"),
            },
            {
                path: "/v2/order",
                name: "order_index",
                component: OrderIndex,
            },
            {
                path: "/v2/guarantee",
                name: "guarantee",
                component: GuaranteeIndex,
            },
            {
                path: "/v2/payment",
                name: "v2payment",
                component: PaymentIndex,
            },
            {
                path: "/v2/delivery",
                name: "delivery",
                component: DeliveryIndex,
            },
            {
                path: "/v2/terms-conditions",
                name: "terms Conditions",
                component: termsConditionsIndex,
            },
            {
                path: "/v2/seller-policy",
                name: "seller Policy",
                component: sellerPolicyIndex,
            },
            {
                path: "/v2/buyer-policy",
                name: "buyer Policy",
                component: buyerPolicyIndex,
            },
            {
                path: "/v2/shipping-refund",
                name: "shipping & Refund",
                component: shippingRefundIndex,
            },
            {
                path: "/v2/wholesale-policy",
                name: "wholesale Policy",
                component: wholesalePolicyIndex,
            },
            {
                path: "/v2/personal-center",
                name: "Personal Center",
                component: personalCenterIndex,
            },
            {
                path: "/v2/personal-center/address-management",
                name: "Address management",
                component: () => import("@/pages/personal-center/address.vue"),
            },
            {
                path: "/v2/personal-center/logistics-management",
                name: "Logistics management",
                component: () => import("@/pages/personal-center/logistics.vue"),
            },
            {
                path: "/v2/personal-center/account",
                name: "ACCOUNT SETTINGS",
                component: () => import("@/pages/personal-center/account.vue"),
            },
            {
                path: "/v2/personal-center/coupon",
                name: "MY COUPON",
                component: () => import("@/pages/personal-center/coupon.vue"),
            },
            {
                path: "/v2/personal-center/inquiry",
                name: "MY INQUIRY",
                component: () => import("@/pages/personal-center/inquiry.vue"),
            },
            {
                path: "/v2/personal-center/evaluation",
                name: "EVALUATION MANAGEMENT",
                component: () => import("@/pages/personal-center/evaluation.vue"),
            },
            {
                path: "/v2/personal-center/refund",
                name: "Refund management",
                component: () => import("@/pages/personal-center/refund.vue"),
            },
            {
                path: "/v2/order/detail",
                name: "OrderDetail",
                component: () => import("@/pages/order/detail.vue"),
            },
            {
                path: "/v2/product/list",
                name: "cetegort",
                component: () => import("@/pages/product/cetegortList.vue"),
                meta: {
                    keepAlive: true,
                },
            },
            {
                path: "/v2/product/detail",
                name: "Product details",
                component: () => import("@/pages/product/detail.vue"),
            },
            {
                path: "/v2/store/collections",
                name: "Collections",
                component: () => import("@/pages/store/collections"),
            },
            {
                path: "/v2/store/storeList",
                name: "StoreList",
                component: () => import("@/pages/store/storeList"),
            },
            {
                path: "/v2/store/about",
                name: "About",
                component: () => import("@/pages/store/about"),
            },
            {
                path: "/v2/collection/collection",
                name: "Collection",
                component: () => import("@/pages/collection/collection"),
            },
            {
                path: "/v2/authentication/mobileAuthentication",
                name: "mobileAuthentication",
                component: () => import("@/pages/authentication/mobileAuthentication"),
            },
            {
                path: "/v2/authentication/idcardAuthentication",
                name: "idcardAuthentication",
                component: () => import("@/pages/authentication/IdcardAuthentication"),
            },
            {
                path: "/v2/authentication/waitingapproval",
                name: "waitingapproval",
                component: () => import("@/pages/authentication/waitingapproval"),
            },
            {
                path: "/v2/authentication/auditcompleted",
                name: "auditcompleted",
                component: () => import("@/pages/authentication/auditcompleted"),
            },
            {
                path: "/v2/aboutus",
                name: "aboutus",
                component: () => import("@/pages/personal-center/aboutus")
            },
        ],
    },
    {
        path: "/v2/",
        name: "streamline",
        component: layout,
        redirect: "index",
        children: [
            {
                path: "/v2/shopping-cart",
                name: "shoppingCart",
                component: ShoppingCart,
            },
            {
                path: "/v2/checkout/counter_plus",
                name: "checkoutCounterPlus",
                component: CheckoutCounterPlus,
            },
            {
                path: "/v2/checkout/payment",
                name: "payment",
                component: CheckoutPayment,
            },
            {
                path: "/v2/checkout/paymentSuccess",
                name: "paymentSuccess",
                component: PaymentSuccess,
            },
        ],
    },
    // SEO Market Pages - Zero-Click Google Optimization
    {
        path: "/guinea",
        component: layout,
        children: [
            { path: "", name: "guinea", component: GuineaPage }
        ]
    },
    {
        path: "/senegal",
        component: layout,
        children: [
            { path: "", name: "senegal", component: SenegalPage }
        ]
    },
    {
        path: "/ghana",
        component: layout,
        children: [
            { path: "", name: "ghana", component: GhanaPage }
        ]
    },
    {
        path: "/cote-divoire",
        component: layout,
        children: [
            { path: "", name: "cote-divoire", component: IvoryCoastPage }
        ]
    },
    {
        path: "/cameroon",
        component: layout,
        children: [
            { path: "", name: "cameroon", component: CameroonPage }
        ]
    },
    {
        path: "/sierra-leone",
        component: layout,
        children: [
            { path: "", name: "sierra-leone", component: SierraLeonePage }
        ]
    },
    {
        path: "/kenya",
        component: layout,
        children: [
            { path: "", name: "kenya", component: KenyaPage }
        ]
    },
    {
        path: "/zimbabwe",
        component: layout,
        children: [
            { path: "", name: "zimbabwe", component: ZimbabwePage }
        ]
    },
    { path: "*", redirect: "/" },
];