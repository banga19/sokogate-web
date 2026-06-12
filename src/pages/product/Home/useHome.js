import { GetCategoryLists } from '@/utils/api'

let listCache = null
let loading = false

export default function useHome() {
    async function getList() {
        if (listCache) {
            return listCache
        }
        if (loading) {
            return []
        }
        loading = true
        try {
            const res = await GetCategoryLists()
            listCache = res.data?.rows || []
            return listCache
        } catch (err) {
            console.log(err)
            return []
        } finally {
            loading = false
        }
    }

    function getStore(vm) {
        try { return vm?.$store } catch (e) { return undefined }
    }

    function getTopNavActive(vm) {
        const store = getStore(vm)
        if (!store) return null
        return store.getters['nav/getCurrentNav']
    }

    function getIsAllProduct(vm) {
        const topNav = getTopNavActive(vm)
        return !topNav || topNav.name === '0'
    }

    const phoneSearchList = [
        '67b31f45fca330c01db6800b',
        '67b451b1dba4ac6875ec11bc',
        '64bb9da5bf766f2989d8aa1a',
    ]

    async function init(vm) {
        if (!listCache) {
            const store = getStore(vm)
            store?.dispatch && store.dispatch('fetchMenus')
            await getList()
        }
    }

    return {
        get list() { return listCache },
        isAllProduct: getIsAllProduct,
        topNavActive: getTopNavActive,
        init,
        phoneSearchList,
    }
}
