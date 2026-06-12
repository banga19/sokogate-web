<template>
  <el-dialog :title="$t('settings.CRL')" :visible.sync="dialogVisible" width="355px" :append-to-body="true"
    :close-on-click-modal="false">
    <div class="title">{{ $t('settings.settingChoose') }}</div>

    <div class="settingCard">
      <div class="name">{{ $t('settings.changeCountry') }}</div>
      <div class="text">
        <SuiFlag :name="$store.state.nav.countryEnName" />
        <el-autocomplete v-model="countryInput" :fetch-suggestions="querySearchCountry"
          @select="handleSelectCountry"></el-autocomplete>
      </div>
    </div>

    <div class="settingCard">
      <el-dropdown class="languageSelect" @command="localeChange" :hide-on-click="false" placement="bottom">
        <div>
          <div class="name">{{ $t('settings.changeLanguage') }}</div>
          <div>{{ $store.state.nav.country }}</div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in languageList" :key="index" :command="item.value"
            :class="{ selected: $i18n.locale == item.value }">
            <SuiFlag :name="item.name" />
            {{ $t('locale.' + item.label) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="settingCard">
      <el-dropdown class="languageSelect" @command="localeCurrency" :hide-on-click="false" placement="bottom">
        <div>
          <div class="name">{{ $t('settings.changeCurrency') }}</div>
          <div>
            {{
              $store.state.currency === 'XOF'
                ? 'FCFA'
                : $store.state.currency
            }}
          </div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="USD">
            <SuiFlag name="United States" />USD
          </el-dropdown-item>
          <el-dropdown-item command="CNY">
            <SuiFlag name="China" />CNY
          </el-dropdown-item>
          <el-dropdown-item command="HKD">
            <SuiFlag name="Hong Kong" />HKD
          </el-dropdown-item>
          <el-dropdown-item command="EUR">
            <SuiFlag name="eur" />EUR
          </el-dropdown-item>
          <el-dropdown-item command="GBP">
            <SuiFlag name="United Kingdom" />GBP
          </el-dropdown-item>
          <el-dropdown-item command="JPY">
            <SuiFlag name="Japan" />JPY
          </el-dropdown-item>
          <el-dropdown-item command="CAD">
            <SuiFlag name="Canada" />CAD
          </el-dropdown-item>
          <el-dropdown-item command="KRW">
            <SuiFlag name="Korea, Republic of" />KRW
          </el-dropdown-item>
          <el-dropdown-item command="AUD">
            <SuiFlag name="Australia" />AUD
          </el-dropdown-item>
          <el-dropdown-item command="more" divided>
            <currency-select @select="selectCurrency"></currency-select>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-dialog>
</template>

<script>
import SuiFlag from '@/components/product/Flag'
import CurrencySelect from '@/components/CurrencySelect'
import { GeCountryV2List } from '@/utils/api'

export default {
  name: 'PersonalitySetting',
  components: {
    SuiFlag,
    CurrencySelect
  },
  data() {
    return {
      dialogVisible: false,
      countryInput: '',
      allCountry: [],
      loading: false,
      error: false,
      countryList: [],
      languageList: [
        { value: 'zh', label: 'zh-hans', name: 'China' },
        { value: 'en', label: 'en', name: 'United States' },
        { value: 'fra', label: 'fr', name: 'France' },
        { value: 'spa', label: 'es', name: 'Spain' },
        { value: 'pt', label: 'pt', name: 'Portugal' },
        { value: 'ara', label: 'ar', name: 'United Arab Emirates' },
        { value: 'ru', label: 'ru', name: 'Belarus' },
        { value: 'per', label: 'fa', name: 'Iran, Islamic Republic of' },
        { value: 'hi', label: 'id', name: 'India' },
      ]
    }
  },
  computed: {
    countryMap() {
      return {
        zh: 'cn',
        fra: 'fr',
        spa: 'es',
        pt: 'pt',
        per: 'fa',
      }
    }
  },
  mounted() {
    const language = localStorage.getItem('language')
    if (!language) {
      this.localeChange()
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
      this.getCountryName()
      this.initCountry()
    },
    localeChange(setlanguage) {
      const countryInfo = this.languageList.find(i => i.value === setlanguage)
      if (countryInfo) {
        this.$store.commit('setLanguage', setlanguage)
        this.$nextTick(() => {
          this.initCountry()
        })
      }

      if (
        ['en', 'zh', 'fra', 'spa', 'pt', 'ara', 'ru', 'per', 'hi'].includes(
          setlanguage
        )
      ) {
        this.$i18n.locale = setlanguage
      } else {
        if (['zh', 'zh-CN', 'zh-TW', 'zh-HK'].includes(navigator.language)) {
          this.$i18n.locale = 'zh'
          this.$store.commit('setLanguage', 'zh')
        } else if (
          ['en', 'fra', 'spa', 'pt', 'ara', 'ru', 'per', 'hi'].includes(
            navigator.language
          )
        ) {
          this.$i18n.locale = navigator.language
          this.$store.commit('setLanguage', navigator.language)
        }
      }

      const country = this.allCountry.map(item => {
        return {
          nameEn: item.nameEn,
          name: this.countryMap[this.$i18n.locale]
            ? item.name[this.countryMap[this.$i18n.locale]]
            : item.nameEn,
          currency: item.currency,
          id: item.id,
        }
      })

      this.countryList = country
    },
    localeCurrency(currency) {
      if (currency === 'FCFA') {
        this.$store.commit('setCurrency', 'XOF')
      } else {
        this.$store.commit('setCurrency', currency)
      }
    },
    selectCurrency(e) {
      if (e === 'FCFA') {
        this.$store.commit('setCurrency', 'XOF')
      } else {
        this.$store.commit('setCurrency', e)
      }
    },
    initCountry() {
      let country_en = localStorage.getItem('country_en')
      this.loading = true
      GeCountryV2List()
        .then(res => {
          this.loading = false
          this.allCountry = res.data.rows.map(v => {
            return {
              nameEn: v.name,
              name: JSON.parse(v.translations),
              currency: v.currency,
              id: v.id,
            }
          })
          let countryIpList = this.allCountry.filter(item => {
            return item.nameEn === country_en
          })
          localStorage.setItem('countryIpList', JSON.stringify(countryIpList))

          const country = this.allCountry.map(item => {
            return {
              nameEn: item.nameEn,
              value: this.countryMap[this.$i18n.locale]
                ? item.name[this.countryMap[this.$i18n.locale]]
                : item.nameEn,
              currency: item.currency,
              id: item.id,
            }
          })
          this.countryList = country
        })
        .catch(err => {
          console.log('GetCountryList-err:', err)
          this.loading = false
          this.error = true
        })
    },
    getCountryName() {
      try {
        this.countryInput = this.$store.state.nav.country
        if (this.countryInput) {
          return
        }
        const userInfo = JSON.parse(localStorage.getItem('currentUser'));
        const country = localStorage.getItem('country');
        if (country) {
          this.countryInput = country;
        } else {
          this.countryInput = userInfo.country;
        }
      } catch (error) {

      }
    },
    querySearchCountry(queryString, cb) {
      var results = queryString ? this.countryList.filter(this.countryFilter(queryString)) : this.countryList;
      cb(results);
    },
    countryFilter(queryString) {
      return (arrayItem) => {
        return (arrayItem.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
          || (arrayItem.nameEn.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      };
    },
    handleSelectCountry(item) {
      this.countryInput = item.nameEn
      this.changeCountry(item.nameEn)
    },
    changeCountry(countryEn) {
      this.$store.commit('nav/setCountryEnName', countryEn)
      this.$store.commit(
        'nav/setCountry',
        this.$t('categorys.' + countryEn)
      )
      localStorage.setItem('country_en', countryEn)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 16px;
}

.settingCard {
  padding: 12px 16px;
  box-shadow: 0 0 5px #aaa;
  border-radius: 4px;

  &+.settingCard {
    margin-top: 16px;
  }

  .languageSelect {
    width: 100%;
  }

  .name {
    color: #000;
  }

  .text {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
}
</style>
