<template>
  <ProductCard :title="$t('productHome.Recommended')">
    <div class="Recommended">
      <el-skeleton :loading="loading" animated>
        <template slot="template">
          <div class="grid">
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
          </div>
        </template>
        <template>
          <div>
            <div class="grid">
              <div class="img" v-for="item in newProductList" @click="gotoDetail(item)">
                 <SuiImage :src="item.img" cut="405h539" :lazy="true"
                   :title="getTransText(item.spuName, item.translationMap)" />
               </div>
             </div>
           </div>
           <div class="name">{{ $t('productHome.Popular products') }}</div>
         </template>
       </el-skeleton>
       <el-skeleton :loading="loading" animated>
         <template slot="template">
           <div class="grid">
             <el-skeleton-item variant="image" class="img" />
             <el-skeleton-item variant="image" class="img" />
             <el-skeleton-item variant="image" class="img" />
             <el-skeleton-item variant="image" class="img" />
           </div>
         </template>
         <template>
           <div>
             <div class="grid">
               <div class="img" v-for="item in featuredProductList" @click="gotoDetail(item)">
                 <SuiImage :src="item.img" cut="405h539" :lazy="true"
                   :title="getTransText(item.spuName, item.translationMap)" />
              </div>
            </div>
          </div>
          <div class="name">{{ $t('productHome.Selected Products') }}</div>
        </template>
      </el-skeleton>
    </div>
  </ProductCard>

</template>

<script>
import { GetSpuListbyNewproduct, GetRecommListbyTypes } from '@/utils/api'
import ProductCard from './ProductCard.vue'
import SuiImage from "@/components/s-ui/media/Image"
import { get } from 'lodash'

export default {
  name: 'Recommended',
  components: {
    ProductCard,
    SuiImage
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
      newProductList: [],
      featuredProductList: []
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
        const [newProductRes, featuredProductsRes] = await Promise.all([
          GetRecommListbyTypes({ types: [112] }),
          GetRecommListbyTypes({ types: [111] }),
        ])
        this.newProductList = get(newProductRes, 'data[0].spuList', []).slice(0, 4).map(item => ({
          ...item,
          img: item.img || (item.galleryList && item.galleryList[0]) || (Array.isArray(item.images) ? item.images[0] : '') || ''
        }))
        this.featuredProductList = get(featuredProductsRes, 'data[0].spuList', []).slice(0, 4).map(item => ({
          ...item,
          img: item.img || (item.galleryList && item.galleryList[0]) || (Array.isArray(item.images) ? item.images[0] : '') || ''
        }))
        this.loading = false
      } catch (error) {

      }
      this.$emit('success')
    },
    gotoDetail(item) {
      window.open("/v2/product/detail?id=" + item.id);
    }
  }
}
</script>

<style lang="scss" scoped>
.Recommended {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  height: calc(100% - 32px);
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;

  .img {
    width: 80px;
    height: 80px;
    overflow: hidden;
    background-color: #cfcfcf;
    border-radius: 4px;
    cursor: pointer;

    &:hover .sui-image {
      transition: all 0.2s;
      transform: scale(1.2);
    }
  }
}

.name {
  font-size: 14px;
  margin-bottom: 5px;
}
</style>
