/**
 * Get当前语言下的国际化文本
 * @param {string} text
 * @param {Record<string, Object>} transMap
 * @param {string} language
 * @returns
 */
export function getTransText(text, transMap, language) {
    if (transMap !== null) {
        const transResult = Object.prototype.hasOwnProperty.call(
            transMap,
            language
        )
        if (transResult) {
            return transMap[language].value
        } else {
            return text
        }
    } else {
        return text
    }
}
