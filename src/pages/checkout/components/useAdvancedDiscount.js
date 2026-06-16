/**
 * 计算链式乘算的优惠, 并给出每一步优惠的具体金额
 * @param {number} originalPrice
 * @param {Array} discounts
 * @returns
 */
export function useAdvancedDiscount(originalPrice, discounts) {
    let _originalPrice = originalPrice
    let _discounts = discounts

    const discountSteps = () => {
        let currentPrice = _originalPrice
        const steps = []

        for (const discount of _discounts) {
            if (discount.active) {
                const previousPrice = currentPrice
                currentPrice = currentPrice * discount.rate
                steps.push({
                    type: discount.type,
                    name: discount.name,
                    discountAmount: previousPrice - currentPrice,
                    rate: discount.rate,
                    priceAfterDiscount: currentPrice,
                })
            }
        }

        return steps
    }

    const totalPrice = () => {
        const steps = discountSteps()
        return steps.length > 0
            ? steps[steps.length - 1].priceAfterDiscount
            : _originalPrice
    }

    const totalDiscount = () => {
        return _originalPrice - totalPrice()
    }

    return {
        discountSteps,
        totalPrice,
        totalDiscount,
    }
}
