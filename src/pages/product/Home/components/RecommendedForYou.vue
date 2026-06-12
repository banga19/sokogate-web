<template>
  <ProductCard>
    <template #title>
      <div class="title">
        <div class="text">{{ $t('productHome.Recommended For You') }}</div>
      </div>
    </template>
    <el-skeleton :loading="loading" animated>
      <template slot="template">
        <div class="grid">
          <div class="item" v-for="i in 8">
            <div class="imgBox">
              <el-skeleton-item variant="image" class="img" />
            </div>
            <div class="name"><el-skeleton-item variant="text" /></div>
            <div class="price"><el-skeleton-item variant="text" style="width: 50%;" /></div>
            <div class="origin"><el-skeleton-item variant="text" style="width: 30%;" /></div>
          </div>
        </div>
        <div class="grid">
        </div>
      </template>
      <template>
        <div>
          <div class="grid">
            <div class="item" v-for="item in dataList" @click="gotoDetail(item)">
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
              <div class="origin">{{ item.oringin }}</div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </ProductCard>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image"
import SuiProductPrice from "@/components/product/Price.vue";
import ProductCard from './ProductCard.vue'
import { GetOrderListbyStatus, GetCartList, GetSpuListByIds, GetSpuList, GetSpuListbyNewproduct } from "@/utils/api"
import { get, shuffle } from 'lodash'

export default {
  name: 'RecommendedForYou',
  components: {
    SuiImage,
    SuiProductPrice,
    ProductCard
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      dataList: [],
      layoutMode: 'Mobile',
      columnNumber: 3,
    }
  },
  computed: {
    titleText() {
      return this.$t('productHome.Recommended For You') || 'Recommended For You'
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
      try {
        const [categoryProducts, recommRes] = await Promise.all([
          this.getProductByCategory(),
          GetSpuListbyNewproduct({
            categoryId: "",
            desc: 1,
            page: 1,
            orderKey: "created_at",
            pageSize: 8,
            search: "",
          }),
        ])
        const recommProducts = get(recommRes, 'data.rows', []).slice(0, 8 - categoryProducts.length)
         this.dataList = shuffle([...categoryProducts, ...recommProducts].map(item => ({
             ...item,
             img: item.img || (item.galleryList && item.galleryList[0]) || ''
           })))
        this.loading = false
      } catch (error) {

      }
      this.$emit('success')
    },
    async getProductByCategory() {
      let result = []
      if (!this.$store.getters.authTokenIsValid) {
        return result
      }
      const orderRes = await GetOrderListbyStatus({
        desc: 1,
        orderKey: "created_at",
        page: 1,
        pageSize: 1,
        status: 101
      })
      const orderList = get(orderRes, 'data.rows[0].orderList')
      let orderProductId
      if (Array.isArray(orderList)) {
        orderProductId = get(orderList.find(i => i.productId), 'productId')
      }

      const cartRes = await GetCartList()
      const cartProductId = get(cartRes, 'data.rows[0].spu.id')

      const categoryRes = await GetSpuListByIds({
        idList: [orderProductId, cartProductId].filter(i => i)
      })
      const categoryResRows = get(categoryRes, 'data.rows')

      if (Array.isArray(categoryResRows)) {
        const categoryIdList = categoryResRows.map(i => i.categoryIdList)
        const categoryProducts = []
        for (let i = 0; i < categoryIdList.length; i++) {
          const categoryIds = categoryIdList[i];
          const res = await this.getCountResult(5, categoryIds)
          categoryProducts.push(res)
        }
        result = this.evenCount(6, categoryProducts)
      }
      return result
    },
    evenCount(count, array) {
      const result = []
      const map = {}
      for (let i = 0; i < 9; i++) {
        array.forEach(ary => {
          if (ary[i] && !map[ary[i].id]) {
            map[ary[i].id] = true
            result.push(ary[i])
          }
        })
        if (result.length >= count) {
          break
        }
      }
      return result.slice(0, count)
    },
    async getCountResult(count, categoryIds) {
      const result = []
      const map = {}
      let maxLimit = categoryIds.length
      const getCategory = this.NextCategoryGenerator(categoryIds)
      while (result.length < count && maxLimit > 0) {
        maxLimit--
        const res = await getCategory()
        const rows = get(res, 'data.rows')
        if (Array.isArray(rows) && rows.length) {
          for (let i = 0; i < rows.length; i++) {
            const item = rows[i];
            if (item && !map[item.id]) {
              map[item.id] = true
              result.push(item)
            }
            if (result.length === count) {
              break
            }
          }
        }
      }
      return result
    },
    NextCategoryGenerator(categoryIds) {
      let index = categoryIds.length
      return function () {
        index--
        return GetSpuList({
          categoryId: categoryIds[index],
          desc: 0,
          orderKey: '',
          page: 1,
          pageSize: 5,
        })
      }
    },
    gotoDetail(item) {
      window.open("/v2/product/detail?id=" + item.id);
    }
  }
}

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  row-gap: 1.563vw;
  column-gap: 2%;

  .item {
    width: 23%;
    // height: 7.552vw;
    cursor: pointer;

    .imgBox {
      border-radius: .417vw;
      overflow: hidden;
      width: 100%;
      height: 7.292vw;
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

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .origin {
      font-size: .625vw;
      color: #aaa;
    }
  }
}
</style>