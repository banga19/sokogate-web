import { GetCategoryLists } from '@/utils/api'
import { mapCategory, normalizeStaticCategory } from "@/utils/category";
import categoryData from "@/layout/HeaderV2/category.data";

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
            listCache = (res.data?.rows || []).map(mapCategory)
            return listCache
        } catch (err) {
            console.log(err)
            // Fallback to static category data when API is unavailable
            listCache = normalizeStaticCategory(categoryData).map(mapCategory)
            return listCache
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
