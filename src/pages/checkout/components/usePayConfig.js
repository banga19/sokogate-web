import { OrderPay } from '@/utils/api'
import { UsedCinetPay, UsedQuikkPay } from '@/utils/api'
import { get } from 'lodash'
import AllowedCurrencies, { XOF, XAF, SLE } from './payAllowedCurrencies'

function openPayWindow(paymentUrl, options) {
    const { windowName = 'payment', width = 500, height = 600 } = options

    // 计算居中位置
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2

    const features = `
      width=${width},
      height=${height},
      left=${left},
      top=${top},
      scrollbars=yes,
      resizable=no,
      toolbar=no,
      location=no,
      status=no,
      menubar=no
    `

    const payWindow = window.open(paymentUrl, windowName, features)
    if (!payWindow) {
        throw new Error(
            window.vm.$t(
                'payment.Please allow pop-up windows to complete payment'
            )
        )
    }
    return payWindow
}

export default {
    methods: {
        alipay: {
            name: 'alipay 支付',
            beforePay: async params => {
                if (payAllowedCurrencies.alipay.includes(params.currency)) {
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }

                try {
                    const res = await OrderPay({
                        idList: params.idList,
                        currency: params.currency,
                        payMethod: 301,
                    })
                    if (res.data) {
                        return {
                            ...params,
                            payment_url: res.data.payReturn,
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const payment_url = get(params, 'payment_url')

                    if (payment_url) {
                        openPayWindow(payment_url, {
                            windowName: 'alipay',
                        })
                        return {
                            success: false,
                            code: 'WAITING',
                            message: 'Waiting for payment',
                            data: {},
                        }
                    } else {
                        return {
                            success: false,
                            code: 'FAILED',
                            message: response.errmsg,
                            data: {},
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
            afterPay: async (result, params) => {
                console.log('afterPay', result, params)

                window.vm.$router.replace({
                    path: '/v2/checkout/paymentSuccess',
                    query: {
                        id: params.idList[0],
                        paymentMethod: 'alipay',
                    },
                })

                return {
                    success: 'SUCCESS',
                }
            },
        },
        cinetpay: {
            name: 'cinetpay 支付',
            beforePay: async params => {
                if (XOF.includes(params.currency)) {
                    params.currency = 'XOF'
                } else if (XAF.includes(params.currency)) {
                    params.currency = 'XAF'
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }

                try {
                    const res = await OrderPay({
                        idList: params.idList,
                        currency: params.currency,
                        payMethod: 1201,
                    })
                    if (res.data) {
                        return {
                            ...params,
                            amount: Math.round(res.data.total / 100 / 5) * 5,
                            currency: params.currency,
                            transaction_id: res.data.outTradeNo,
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const response = await UsedCinetPay(params)
                    const payment_url = get(response, 'data.payment_url')

                    if (payment_url) {
                        openPayWindow(payment_url, {
                            windowName: 'cinetpay',
                        })
                        return {
                            success: false,
                            code: 'WAITING',
                            message: 'Waiting for payment',
                            data: response.data,
                        }
                    } else {
                        return {
                            success: false,
                            code: 'FAILED',
                            message: response.errmsg,
                            data: response.data,
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
            afterPay: async (result, params) => {
                console.log('afterPay', result, params)

                window.vm.$router.replace({
                    path: '/v2/checkout/paymentSuccess',
                    query: {
                        id: params.idList[0],
                        paymentMethod: 'cinetpay',
                    },
                })

                return {
                    success: 'SUCCESS',
                }
            },
        },
        flutterwave: {
            name: 'flutterwave 支付',
            beforePay: async params => {
                if (AllowedCurrencies.flutterwave.includes(params.currency)) {
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }
                if (XOF.includes(params.currency)) {
                    params.currency = 'XOF'
                } else if (SLE.includes(params.currency)) {
                    params.currency = 'SLE'
                } else if (XAF.includes(params.currency)) {
                    params.currency = 'XAF'
                }

                const token = localStorage.getItem('auth_token')

                try {
                    const queryData = {
                        email: encodeURIComponent(params.email),
                        phone_number: params.phone_number,
                        idList: params.idList,
                        currency: params.currency,
                        header: encodeURIComponent(token),
                    }
                    return queryData
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const urlParams = [
                        `email=${params.email}`,
                        `phone_number=${params.phone_number}`,
                        `idList=${params.idList}`,
                        `currency=${params.currency}`,
                        `header=${params.header}`,
                    ]
                    window.open(
                        '/v2/flutterwave' + `?${urlParams.join('&')}`,
                        '_blank'
                    )

                    return {
                        success: false,
                        code: 'WAITING',
                        message: 'Waiting for payment',
                        data: response.data,
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
            afterPay: async (result, params) => {
                console.log('afterPay', result, params)

                window.vm.$router.replace({
                    path: '/v2/checkout/paymentSuccess',
                    query: {
                        id: params.idList[0],
                        paymentMethod: 'flutterwave',
                    },
                })

                return {
                    success: 'SUCCESS',
                }
            },
        },
        orange: {
            name: 'orange 支付',
            beforePay: async params => {
                if (AllowedCurrencies.orange.includes(params.currency)) {
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }

                try {
                    const res = await OrderPay({
                        idList: params.idList,
                        currency: params.currency,
                        payMethod: 901,
                    })
                    if (res.data) {
                        return {
                            ...params,
                            payment_url: res.data.payReturn,
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const payment_url = get(params, 'payment_url')

                    if (payment_url) {
                        openPayWindow(payment_url, {
                            windowName: 'orange',
                        })
                        return {
                            success: false,
                            code: 'WAITING',
                            message: 'Waiting for payment',
                            data: {},
                        }
                    } else {
                        return {
                            success: false,
                            code: 'FAILED',
                            message: response.errmsg,
                            data: {},
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
            afterPay: async (result, params) => {
                console.log('afterPay', result, params)

                window.vm.$router.replace({
                    path: '/v2/checkout/paymentSuccess',
                    query: {
                        id: params.idList[0],
                        paymentMethod: 'orange',
                    },
                })

                return {
                    success: 'SUCCESS',
                }
            },
        },
        pawapay: {
            name: 'pawapay 支付',
            beforePay: async params => {
                if (AllowedCurrencies.pawapay.includes(params.currency)) {
                    if (XOF.includes(params.currency)) {
                        params.currency = 'XOF'
                    } else if (SLE.includes(params.currency)) {
                        params.currency = 'SLE'
                    } else if (XAF.includes(params.currency)) {
                        params.currency = 'XAF'
                    }
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }

                try {
                    const res = await OrderPay({
                        idList: params.idList,
                        currency: params.currency,
                        payMethod: 1101,
                    })
                    if (res.data) {
                        return {
                            ...params,
                            payment_url: res.data.payReturn,
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const payment_url = get(params, 'payment_url')

                    if (payment_url) {
                        openPayWindow(payment_url, {
                            windowName: 'pawapay',
                        })
                        return {
                            success: false,
                            code: 'WAITING',
                            message: 'Waiting for payment',
                            data: {},
                        }
                    } else {
                        return {
                            success: false,
                            code: 'FAILED',
                            message: response.errmsg,
                            data: {},
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
            afterPay: async (result, params) => {
                console.log('afterPay', result, params)

                window.vm.$router.replace({
                    path: '/v2/checkout/paymentSuccess',
                    query: {
                        id: params.idList[0],
                        paymentMethod: 'pawapay',
                    },
                })

                return {
                    success: 'SUCCESS',
                }
            },
        },
        paydunya: {
            name: 'paydunya 支付',
            beforePay: async params => {
                if (XOF.includes(params.currency)) {
                    params.currency = 'XOF'
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }

                try {
                    const res = await OrderPay({
                        idList: params.idList,
                        currency: params.currency,
                        payMethod: 701,
                    })
                    if (res.data) {
                        return {
                            ...params,
                            payment_url: res.data.payReturn,
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const payment_url = get(params, 'payment_url')

                    if (payment_url) {
                        openPayWindow(payment_url, {
                            windowName: 'paydunya',
                        })
                        return {
                            success: false,
                            code: 'WAITING',
                            message: 'Waiting for payment',
                            data: {},
                        }
                    } else {
                        return {
                            success: false,
                            code: 'FAILED',
                            message: response.errmsg,
                            data: {},
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
            afterPay: async (result, params) => {
                console.log('afterPay', result, params)

                window.vm.$router.replace({
                    path: '/v2/checkout/paymentSuccess',
                    query: {
                        id: params.idList[0],
                        paymentMethod: 'paydunya',
                    },
                })

                return {
                    success: 'SUCCESS',
                }
            },
        },
        paystack: {
            name: 'paystack 支付',
            beforePay: async params => {
                if (AllowedCurrencies.paystack.includes(params.currency)) {
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }

                try {
                    const res = await OrderPay({
                        idList: params.idList,
                        currency: params.currency,
                        payMethod: 401,
                    })
                    if (res.data) {
                        return {
                            ...params,
                            payment_url: res.data.payReturn,
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const payment_url = get(params, 'payment_url')

                    if (payment_url) {
                        openPayWindow(payment_url, {
                            windowName: 'paystack',
                        })
                        return {
                            success: false,
                            code: 'WAITING',
                            message: 'Waiting for payment',
                            data: {},
                        }
                    } else {
                        return {
                            success: false,
                            code: 'FAILED',
                            message: response.errmsg,
                            data: {},
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
            afterPay: async (result, params) => {
                console.log('afterPay', result, params)

                window.vm.$router.replace({
                    path: '/v2/checkout/paymentSuccess',
                    query: {
                        id: params.idList[0],
                        paymentMethod: 'paystack',
                    },
                })

                return {
                    success: 'SUCCESS',
                }
            },
        },
        quikk: {
            name: 'quikk 支付',
            beforePay: async params => {
                if (AllowedCurrencies.quikk.includes(params.currency)) {
                } else {
                    throw new Error(
                        window.vm.$t('payment.Currency not supported') +
                            params.currency
                    )
                }

                try {
                    const res = await OrderPay({
                        idList: params.idList,
                        currency: params.currency,
                        payMethod: 1001,
                    })
                    if (res.data) {
                        return {
                            ...params,
                            currency: params.currency,
                            id: res.data.outTradeNo,
                            amount: Math.ceil(res.data.total / 100),
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
                throw new Error(
                    window.vm.$t('payment.Failed to create payment order')
                )
            },
            pay: async params => {
                try {
                    const response = await UsedQuikkPay({
                        data: {
                            type: 'charge',
                            id: params.id,
                            attributes: {
                                amount: params.amount,
                                reference: '1234',
                                short_code: '6739990',
                                till_no: '4161722',
                                customer_no: params.phone_number,
                                customer_type: 'msisdn',
                            },
                        },
                    })

                    return {
                        success: true,
                        code: 'SUCCESS',
                        message: response.errmsg,
                        data: response.data,
                    }
                } catch (error) {
                    return {
                        success: false,
                        code: 'FAILED',
                        message: error,
                        data: {},
                    }
                }
            },
        },
    },

    // 自定义轮询配置
    pollingInterval: 2000,
    maxPollingCount: 15,
}
