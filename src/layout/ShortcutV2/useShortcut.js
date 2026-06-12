import {
    ref,
    getCurrentInstance,
    nextTick,
    onMounted,
    computed,
    shallowRef,
} from 'vue'
import { GetCartList, UploadFileToOSS } from '@/utils/api'
import ZhLanguage from '@/locale/zh.json'
import { Message } from 'element-ui'
import { get } from 'lodash'
import { getOSSImageFullUrl } from '@/utils/OSS'

export default function useShortcut() {
    const { proxy } = getCurrentInstance()

    const currentUser = computed(() => proxy.$store.state.user)

    const searchText = ref('')
    onMounted(() => {
        initLocalStorage()
        gpsCountry()
        if (proxy.$route.query.search) {
            searchText.value = proxy.$route.query.search
        }
    })

    function handleSearch() {
        if (searchText.value) {
            proxy.$utils.navto('/v2/product/list', {
                search: `${searchText.value}`,
            })
        }
    }

    function initLocalStorage() {
        const token = localStorage.getItem('auth_token')
        const currentUser = localStorage.getItem('currentUser')
        const auth_token_expire = localStorage.getItem('auth_token_expire')
        const user = currentUser ? JSON.parse(currentUser) : null

        const currency = localStorage.getItem('currency')

        if (currency) {
            proxy.$store.commit('setCurrency', currency)
        }

        const language = localStorage.getItem('language')

        if (language) {
            proxy.$store.commit('setLanguage', language)
        }
        if (
            user &&
            user.userId &&
            token &&
            auth_token_expire &&
            auth_token_expire !== 'undefined' &&
            auth_token_expire !== '0'
        ) {
            proxy.$store.commit('login', {
                user,
                token,
                expire: auth_token_expire,
            })
            nextTick(() => getList())
        } else {
            proxy.$store.commit('loginout')
        }
    }

    const cartCount = computed(() => proxy.$store.state.cartCount)
    function getList() {
        if (
            proxy.$store.getters.authTokenIsValid &&
            !proxy.$store.state.cartActivated
        ) {
            GetCartList({})
                .then(res => {
                    proxy.$store.commit(
                        'cartCountSet',
                        get(res, 'data.rows.length')
                    )
                })
                .catch(() => {
                    proxy.$store.commit('cartCountSet', 0)
                })
        }
    }

    /** 定位初始国家 */
    async function gpsCountry() {
        let country_en = localStorage.getItem('country_en')
        if (country_en) {
            proxy.$store.commit('nav/setCountryEnName', country_en)
            proxy.$store.commit(
                'nav/setCountry',
                proxy.$t('categorys.' + country_en)
            )
            return
        }

        const data = {
            key: 'RWMBZ-AZHLJ-GIUFW-KLDDX-PC6IO-U7FIG', //密钥
        }
        const url = 'https://apis.map.qq.com/ws/location/v1/ip' //腾讯地理位置信息接口
        data.output = 'jsonp' // 解决跨域问题
        try {
            await proxy
                .$jsonp(url, data)
                .then(res => {
                    // console.log("ip所属国家", res.result.ad_info.nation);
                    // 根据中文筛出对应值的键
                    // console.log(that.getObjectKey(ZhLanguage.categorys, res.result.ad_info.nation));
                    let countryEn = getObjectKey(
                        ZhLanguage.categorys,
                        get(res, 'result.ad_info.nation')
                    )

                    if (!countryEn) {
                        throw new Error(res)
                    }

                    localStorage.setItem('country_en', countryEn)
                    proxy.$store.commit('nav/setCountryEnName', countryEn)
                    proxy.$store.commit(
                        'nav/setCountry',
                        proxy.$t('categorys.' + countryEn)
                    )
                })
                .catch(error => {
                    console.log('获取地理信息失败')
                    throw new Error(error)
                })
        } catch (error) {
            proxy.$store.commit('nav/setCountryEnName', 'United States')
            proxy.$store.commit(
                'nav/setCountry',
                proxy.$t('categorys.' + 'United States')
            )
        }
    }
    function getObjectKey(object, value) {
        return Object.keys(object).find(key => object[key] == value)
    }

    function createMyShop() {
        window.open('https://vendor.sokogate.com/v2/register')
    }

    function userCommand(command) {
        if (command === 'exit') {
            loginoutConfirm()
        } else if (command === 'authentication') {
            proxy.$router.push('/v2/authentication/mobileAuthentication')
        } else if (command === 'verifymailbox') {
            proxy.$store.commit('setemailVisible', true)
        } else if (command === 'bindmobilenumber') {
            proxy.$store.commit('setmobileVisible', true)
        } else if (command === 'orders') {
            proxy.$router.push('/v2/order')
        } else if (command === 'wishlist') {
            proxy.$router.push('/v2/collection/collection')
        } else if (command === 'my-sokogate') {
            proxy.$router.push({ name: 'Personal Center' })
        }
    }

    function loginoutConfirm() {
        proxy.$bvModal
            .msgBoxConfirm(proxy.$t('login.out-confirm'), {
                title: proxy.$t('api.message'),
                okTitle: proxy.$t('modal.ok'),
                cancelTitle: proxy.$t('modal.cancel'),
            })
            .then(value => {
                if (value) {
                    handleLoginout()
                }
            })
            .catch(err => {
                console.log('catch-err:', err)
            })
    }

    function handleLoginout() {
        proxy.$store.commit('loginout')
        proxy.$router.go(0)
    }

    const uploadLoading = shallowRef()

    async function beforeUpload(file) {
        if (file.type.indexOf('image/') !== 0) {
            Message.error(proxy.$t('upload.limitOnlyImage'))
            throw new Error('只能上传图片')
        }
        if (file.size / 1024 / 1024 > 4) {
            Message.error(proxy.$t('upload.limitFileSize') + ': 4MB')
            throw new Error('图片过大')
        }
        const result = await checkImageResolution(file)
        if (!result.isValid) {
            if (result.width <= 100 || result.height <= 100) {
                Message.error(
                    proxy.$t('upload.imageResolutionToSmall') + ': < 100px'
                )
            } else {
                Message.error(
                    proxy.$t('upload.imageResolutionToLarge') + ': > 4096px'
                )
            }
            throw new Error('图片分辨率不符合')
        }
        uploadLoading.value = proxy.$loading({
            lock: true,
            text: proxy.$t('upload.uploading'),
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
    }
    async function handleUpload(params) {
        return UploadFileToOSS(params.file, 'searchImg/')
            .then(response => {
                return Promise.resolve(getOSSImageFullUrl(response))
            })
            .finally(() => {
                uploadLoading.value.close()
            })
    }
    function handleUploadSuccess(url) {
        proxy.$utils.navto('/v2/product/list', {
            searchImg: encodeURIComponent(url),
        })
    }

    function checkImageResolution(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = function (e) {
                const img = new Image()

                img.onload = function () {
                    const width = img.naturalWidth
                    const height = img.naturalHeight

                    // 检查分辨率是否符合要求。识图接口对图片的分辨率有所要求
                    const isValid =
                        width >= 100 &&
                        width <= 4096 &&
                        height >= 100 &&
                        height <= 4096

                    resolve({
                        isValid,
                        width,
                        height,
                    })
                }

                img.onerror = function () {
                    reject(new Error('图片加载失败'))
                }

                img.src = e.target.result
            }

            reader.onerror = function () {
                reject(new Error('文件读取失败'))
            }

            reader.readAsDataURL(file)
        })
    }

    return {
        currentUser,
        cartCount,
        /** 搜索商品-文字 */
        searchText,
        handleSearch,
        /** 跳转到开店页 */
        createMyShop,
        userCommand,
        beforeUpload,
        handleUpload,
        handleUploadSuccess,
    }
}
