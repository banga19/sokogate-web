import { isMobile } from '@/utils'

export default {
    namespaced: true,
    state: () => ({
        currentNav: {
            name: '0',
        },
        country: '',
        countryEnName: '',
        layoutMode: isMobile() ? 'Mobile' : 'PC',
    }),
    getters: {
        getCurrentNav(state) {
            return state.currentNav
        },
    },
    mutations: {
        setCurrentNav(state, name) {
            state.currentNav = name
        },
        setCountry(state, country) {
            state.country = country
        },
        setCountryEnName(state, countryEn) {
            state.countryEnName = countryEn
        },
        setLayoutMode(state, mode) {
            state.layoutMode = mode
        },
    },
}
