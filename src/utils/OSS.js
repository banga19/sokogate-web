import request from './request.js'

let ossObject = {
    host: '',
    accessid: '',
    policy: '',
    signature: '',
}

export async function getOSSInfo() {
    try {
        if (checkExpired()) {
            return Promise.resolve(ossObject)
        }
    } catch (error) {}
    await requestOssToken()
    return getOSSInfo()
}

export function getOSSImageFullUrl(fileName) {
    return (
        'https://oss.sokogate.com/' +
        fileName +
        '?x-oss-process=image/format,webp'
    )
}

/** Get OSS upload credentials */
function GetOssToken(params) {
    return request({
        url: `getOssPolicyToken`,
        method: 'POST',
        data: params,
    })
}

async function requestOssToken() {
    return GetOssToken().then(response => {
        ossObject = response.data
    })
}

function checkExpired() {
    if (ossObject && ossObject.expire) {
        const nowUnix = Math.round(new Date().getTime() / 1000)
        // Validity > 1 hour
        if (
            ossObject.expire > nowUnix &&
            ossObject.expire - nowUnix > 60 * 60
        ) {
            return true
        }
    } else {
        throw 'OSS signature not obtained'
    }
}
