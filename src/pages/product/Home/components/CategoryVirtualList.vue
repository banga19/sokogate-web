<template>
  <div class="CategoryVirtualList">
    <div class="title" v-if="titleText">{{ titleText }}</div>
    <el-skeleton :loading="loading && dataList.length === 0" animated>
      <template slot="template">
        <div class="grid" :class="{ mobile: layoutMode === 'Mobile' }"
          :style="{ gap: '2%' }">
          <div class="item" v-for="i in 8" :style="{ width: (90 / columnNumber) + '%' }">
            <div class="imgBox">
              <el-skeleton-item variant="image" class="img" />
            </div>
            <div class="name"><el-skeleton-item variant="text" /></div>
            <div class="price"><el-skeleton-item variant="text" style="width: 50%;" /></div>
            <div class="origin"><el-skeleton-item variant="text" style="width: 30%;" /></div>
          </div>
        </div>
      </template>
      <template>
        <div>
          <el-empty v-if="dataList.length === 0" :description="$t('common.noData') || 'No data'"></el-empty>
          <div class="grid" :class="{ mobile: layoutMode === 'Mobile' }"
            :style="{ gap: '2%' }">
            <div class="item" v-for="item in dataList" @click="gotoDetail(item)"
              :style="{ width: (90 / columnNumber) + '%' }">
              <div class="imgBox">
                <div class="img">
                   <SuiImage :src="item.img" cut="405h539" :lazy="true"
                     :title="getTransText(item.spuName, item.translationMap)" />
                </div>
              </div>
              <div class="nameBox">
                 <div class="name" :title="getTransText(item.spuName, item.translationMap)">
                   {{ getTransText(item.spuName, item.translationMap) }}
                 </div>
              </div>
              <div class="price">
                <SuiProductPrice :value="item.minPrice" :form="item.currency" color="#000" />
              </div>
              <div class="origin">{{ item.oringin }}</div>
            </div>
          </div>
          <div v-loading="loading" style="height: 5vh;"></div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import BackToTop from "@/components/s-ui/list/BackToTop";
import { GetSpuListbyNewproduct } from '@/utils/api'
import SuiImage from "@/components/s-ui/media/Image"
import SuiProductPrice from "@/components/product/Price.vue"
import { get, debounce } from 'lodash'

export default {
  name: 'CategoryVirtualList',
  components: {
    BackToTop,
    SuiImage,
    SuiProductPrice
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    title: String,
    categoryId: String,
    categoryName: String,
  },
  data() {
    return {
      loading: false,
      page: 0,
      dataList: [],
      isNotMore: false
    }
  },
  computed: {
    language() {
      try { return this.$store.state.language || 'en' } catch (e) { return 'en' }
    },
    columnNumber() {
      try {
        const mode = this.$store.state && this.$store.state.nav && this.$store.state.nav.layoutMode
        return mode === 'PC' ? 5 : 3
      } catch (e) { return 3 }
    },
    scrollTriggerNumber() {
      try {
        const mode = this.$store.state && this.$store.state.nav && this.$store.state.nav.layoutMode
        return mode === 'PC' ? 600 : 600 + 400
      } catch (e) { return 600 }
    },
    layoutMode() {
      try { return this.$store.state.nav.layoutMode } catch (e) { return 'Mobile' }
    },
    titleText() {
      if (!this.title) return ''
      if (this.categoryId === '0') {
        return this.$t('productHome.Newproduct') || ''
      }
      try { return this.$t(this.title) } catch (e) { return String(this.title) }
    }
  },
  watch: {
    categoryId() {
      this.page = 0
      this.dataList = []
      this.isNotMore = false
      if (!this.categoryId || this.categoryId === '0') {
        return
      }
      this.queryData()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.debounceScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.debounceScroll)
  },
  methods: {
    getTransText(text, transMap) {
      try {
        const lang = this.$store.state.language || 'en'
        if (transMap && transMap[lang]) return transMap[lang].value
        return text
      } catch (e) { return text }
    },
    getScrollTopInVW(number) {
      const scrollInVW = (number / 1920) * 100;
      const vwInPixels = (scrollInVW / 100) * window.innerWidth;
      return vwInPixels;
    },
    handleScroll() {
      const windowHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      if (windowHeight + scrollTop + this.scrollTriggerNumber >= scrollHeight) {
        this.queryData()
      }
    },
    debounceScroll: debounce(function() {
      const windowHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      if (windowHeight + scrollTop + 600 >= scrollHeight) {
        this.queryData()
      }
    }, 150),
    async queryData() {
      if (!this.categoryId || this.loading || this.isNotMore) {
        return false
      }
      try {
        this.page++
        this.loading = true

        const params = {
          desc: 1,
          page: this.page,
          orderKey: "created_at",
          pageSize: 20,
          search: '',
          categoryId: '',
        }
        if (this.categoryName) {
          params.search = this.categoryName
        } else {
          params.categoryId = this.categoryId === '0' ? '' : this.categoryId
        }

        const response = await GetSpuListbyNewproduct(params)
        const rows = get(response, 'data.rows', [])
        this.dataList.push(...rows)
        const total = get(response, 'data.count', 0)
        this.isNotMore = this.dataList.length >= total || this.dataList.length >= 100

      } catch (error) {
        console.log('CategoryVirtualList err', error);
      }
      this.loading = false
    },
    gotoDetail(item) {
      window.open("/v2/product/detail?id=" + item.id);
    }
  }
}

</style>
<style lang="scss" scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2%;

  &.mobile {
    .item {
      height: auto;

      .imgBox {
        height: 23vw;
      }
    }
  }

  .item {
    cursor: pointer;
    padding: 8px 0;

    .imgBox {
      border-radius: .417vw;
      overflow: hidden;
      width: 100%;
      height: 16.146vw;
      margin: 0 auto;

      .img {
        width: 100%;
        height: 100%;
        background-color: #cfcfcf;
        overflow: hidden;

        &:hover .sui-image {
          transition: all 0.2s;
          transform: scale(1.2);
        }
      }
    }

    .nameBox {
      margin-bottom: 16px;
      position: relative;

      .name {
        width: 100%;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: absolute;
      }
    }

    .origin {
      font-size: 10px;
      color: #aaa;
    }
  }
}

.name {
  font-size: .729vw;
  margin-bottom: .26vw;
}
</style>
