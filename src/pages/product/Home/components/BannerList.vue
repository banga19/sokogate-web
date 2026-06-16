<template>
  <div class="banner-list-main">
    <b-carousel v-if="banner.length" :interval="3000" controls indicators label-prev="" label-next="">
      <b-carousel-slide v-for="(item, index) in banner" :key="`bannerList_${index}`" class="bg-carousel">
        <template #img>
          <div @click="handleClick(item)" class="imgBox" :class="{ canClick: item.toStoreId }">
            <SuiImage :src="item.src" height="100%" />
          </div>
        </template>
      </b-carousel-slide>
    </b-carousel>

    <el-skeleton v-else slot="placeholder" style="width: 100%; height: 100%" :loading="true" animated>
      <template slot="template">
        <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import SuiImage from '@/components/s-ui/media/Image'
import shipping from '@/assets/home/swiper/shipping.jpg'
import manShop from '@/assets/home/swiper/manShop.png'
import womenShop1 from '@/assets/home/swiper/womenShop1.png'
import kids1 from '@/assets/home/swiper/kids1.png'
import phoneShop from '@/assets/home/swiper/phoneShop.png'
import jaiju from '@/assets/home/swiper/jaiju.png'
import jiadian from '@/assets/home/swiper/jiadian.png'
import freeShipping from '@/assets/home/swiper/freeShipping.png'

const { proxy } = getCurrentInstance()

defineProps({
  title: '',
  type: '',
})

const emit = defineEmits(['success'])
onMounted(() => {
  emit('success')
})

const banner = ref([
  {
    src: shipping,
    color: '#000000',
  },
  {
    src: manShop,
    color: '#000000',
    toStoreId: '64c1cf84bf766f2989d8aa65',
  },
  {
    src: womenShop1,
    color: '#df70a6',
    toStoreId: '62e7825dccd73eba90a28692',
  },
  {
    src: kids1,
    color: '#e1e0e3',
    toStoreId: '655bf32e14e14e5e5ee0ae0c',
  },
  {
    src: phoneShop,
    color: '#644895',
    toStoreId: '66f24e690d3279116e2695ba',
  },
  {
    src: jaiju,
    color: '#d2cfc7',
    id: '61b017cca00181bf8190e94a',
  },
  {
    src: jiadian,
    color: '#91dce9',
    id: '61b017cca00181bf8190e94d',
  },
  {
    src: freeShipping,
    color: '#198ad9',
    type: 10,
  },
])

function handleClick(item) {
  if (item.toStoreId) {
    proxy.$router.push({
      path: '/v2/store/collections',
      query: { id: item.toStoreId },
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/_responsive.scss';

.banner-list-main {
  height: 100%;

  .bg-carousel {
    background: #fff;
  }

  .imgBox {
    height: 100%;
  }



}

.canClick {
  cursor: pointer;
}
</style>
