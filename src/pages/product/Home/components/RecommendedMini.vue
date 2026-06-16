<template>
  <ProductCard :title="title">
    <template #title>
      <div class="title" @click="handleClick">
        <div class="text">{{ $t(title) }}</div>
        <div class="el-icon-arrow-right"></div>
      </div>
    </template>
    <el-skeleton :loading="loading" animated>
      <template slot="template">
        <div class="grid" :class="{ mobile: layoutMode === 'Mobile' }">
          <div class="item" v-for="item in columnNumber" :style="{ width: 90 / columnNumber + '%' }">
            <div class="imgBox">
              <el-skeleton-item variant="image" class="img" />
            </div>
            <div class="name"><el-skeleton-item variant="text" /></div>
            <div class="price"><el-skeleton-item variant="text" style="width: 50%;" /></div>
          </div>
        </div>
      </template>
      <template>
        <div>
        <div class="grid" :class="{ mobile: layoutMode === 'Mobile' }">
            <div class="item" v-for="item in dataList" @click="gotoDetail(item)"
              :style="{ width: 90 / columnNumber + '%' }">
              <div class="imgBox">
                <div class="img">
                   <SuiImage :src="item.img" cut="405h539" :lazy="true"
                     :title="getTransText(item.spuName, item.translationMap)" />
                </div>
              </div>
                <div class="name" :title="getTransText(item.spuName, item.translationMap)">
                  {{ getTransText(item.spuName, item.translationMap) }}
                </div>
              <div class="price">
                <SuiProductPrice :value="item.minPrice" :form="item.currency" color="#000" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </ProductCard>
</template>

<script>
import { GetSpuListbyNewproduct, GetSpu } from '@/utils/api'
import ProductCard from './ProductCard.vue';
import SuiImage from "@/components/s-ui/media/Image"
import SuiProductPrice from "@/components/product/Price.vue";
import { get } from 'lodash'

export default {
  name: 'RecommendedMini',
  components: {
    ProductCard,
    SuiImage,
    SuiProductPrice
  },
  props: {
    title: String,
    active: {
      type: Boolean,
      default: false
    },
    categoryId: String,
    productIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: true,
      dataList: []
    }
  },
  computed: {
    columnNumber() {
      try {
        return this.$store.state.nav.layoutMode === 'PC' ? 3 : 3
      } catch (e) { return 3 }
    },
    layoutMode() {
      try { return this.$store.state.nav.layoutMode } catch (e) { return 'Mobile' }
    }
  },
  watch: {
    active() {
      this.queryData()
    }
  },
  mounted() {
    this.$watch(() => this.active, (val) => {
      setTimeout(() => {
        if (val === false) {
          this.queryData()
        }
      }, 3000);
    }, { immediate: true })
  },
  methods: {
    getTransText(text, transMap) {
      try {
        const lang = this.$store.state.language || 'en'
        if (transMap && transMap[lang]) return transMap[lang].value
        return text
      } catch (e) { return text }
    },
    async queryData() {
      if (this.productIds && this.productIds.length) {
        const responseList = await Promise.all(this.productIds.map(id => {
          return GetSpu({ id })
        }))
        const result = []
        responseList.forEach(response => {
          result.push(get(response, 'data', {}))
        })
        this.dataList = result.map(item => ({
          ...item,
          img: (item.img || (item.galleryList && item.galleryList[0]) || (Array.isArray(item.images) ? item.images[0] : '') || '').replace(/\?x-oss-process=style\/w64(?:\([^)]*\))?$/, '')
        }))
        this.loading = false
        return
      }
      try {
        const response = await GetSpuListbyNewproduct({
          categoryId: this.categoryId,
          desc: 1,
          page: 1,
          orderKey: "created_at",
          pageSize: this.columnNumber,
          search: "",
        })
        this.dataList = get(response, 'data.rows', []).map(item => ({
          ...item,
          img: item.img || (item.galleryList && item.galleryList[0]) || (Array.isArray(item.images) ? item.images[0] : '') || ''
        }))
        this.loading = false
      } catch (error) {

      }
    },
    gotoDetail(item) {
      window.open("/v2/product/detail?id=" + item.id);
    },
    handleClick() {
      this.$router.push({
        path: "/v2/product/list",
        query: {
          cid: this.categoryId,
        },
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: .26vw;
  margin-bottom: .26vw;

  &.mobile {
    .item {
      height: auto;

      .imgBox {
        height: 23vw;
      }
    }

  }

  .item {
    // width: 30%;
    height: 9.375vw;
    cursor: pointer;

    .imgBox {
      border-radius: .417vw;
      overflow: hidden;
      width: 100%;
      height: 7,292vw;

      .img {
        width: 100%;
        height: 100%;
        background-color: #cfcfcf;

        &:hover .sui-image {
          transition: all 0.2s;
          transform: scale(1.2);
        }
      }

    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>