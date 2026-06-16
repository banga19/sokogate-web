let loading = false
let currentMethod = null
let pollingCount = 0

// default配置
const defaultConfig = {
    methods: {},
    pollingInterval: 3000,
    maxPollingCount: 100,
}

export function usePay(config = defaultConfig) {
    let _proxy = null

    const getProxy = () => {
        if (!_proxy) {
            _proxy = {
                $store: window.store || {},
            }
        }
        return _proxy
    }

    const mergedConfig = {
        ...defaultConfig,
        ...config,
    }

    const availableMethods = Object.keys(mergedConfig.methods)

    const pollPaymentResult = async request => {
        const method = currentMethod
        if (!method || !mergedConfig.methods[method]?.pollResult) {
            throw new Error(`支付method ${method} 不support轮询查询结果`)
        }

        pollingCount = 0

        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    pollingCount++
                    const result = await mergedConfig.methods[method].pollResult(request)

                    if (result.success || result.code === 'FAILED') {
                        resolve(result)
                        return
                    }

                    if (pollingCount >= mergedConfig.maxPollingCount) {
                        resolve({
                            success: false,
                            code: 'TIMEOUT',
                            message: '支付结果查询超时',
                        })
                        return
                    }

                    setTimeout(poll, mergedConfig.pollingInterval)
                } catch (error) {
                    reject(error)
                }
            }

            poll()
        })
    }

    const pay = async (method, request = {}) => {
        if (!mergedConfig.methods[method]) {
            throw new Error(`不support的支付method: ${method}`)
        }

        loading = true
        currentMethod = method

        try {
            const paymentMethod = mergedConfig.methods[method]
            let processedRequest = request

            if (paymentMethod.beforePay) {
                try {
                    processedRequest = await paymentMethod.beforePay(
                        Object.assign(request, {
                            currency: getProxy().$store.state?.currency,
                        })
                    )
                } catch (error) {
                    console.error(`支付前处理failed: ${error.message}`)
                    throw new Error(error.message)
                }
            }

            const result = await paymentMethod.pay(processedRequest)

            if (
                paymentMethod.pollResult &&
                !result.success &&
                result.code !== 'FAILED'
            ) {
                const polledResult = await pollPaymentResult(processedRequest, result)

                if (paymentMethod.afterPay) {
                    await paymentMethod.afterPay(polledResult, processedRequest)
                }

                return polledResult
            }

            if (paymentMethod.afterPay) {
                await paymentMethod.afterPay(result, processedRequest)
            }

            return result
        } finally {
            loading = false
            pollingCount = 0
        }
    }

    const payDirectly = async (method, request) => {
        if (!mergedConfig.methods[method]) {
            throw new Error(`不support的支付method: ${method}`)
        }

        loading = true

        try {
            const paymentMethod = mergedConfig.methods[method]
            let processedRequest = request

            if (paymentMethod.beforePay) {
                try {
                    processedRequest = await paymentMethod.beforePay(request)
                } catch (error) {
                    console.error(`支付前处理failed: ${error.message}`)
                    throw new Error(error.message)
                }
            }

            const result = await paymentMethod.pay(processedRequest)

            if (paymentMethod.afterPay) {
                await paymentMethod.afterPay(result, processedRequest)
            }

            return result
        } finally {
            loading = false
        }
    }

    return {
        loading: loading,
        currentMethod: currentMethod,
        pollingCount: pollingCount,
        availableMethods,
        pay,
        payDirectly,
    }
}
