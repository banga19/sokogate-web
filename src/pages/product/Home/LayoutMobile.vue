<template>
  <div>
    <Nav :list="list" />
    <div class="baseBox" v-show="isAllProduct">
      <div class="box">
        <Personality />
      </div>
    </div>
    <div class="content" v-show="isAllProduct">
      <div class="box carousel">
        <BannerList type="601" @success="step++" class="banner-box" />
      </div>
      <div class="box">
        <RecommendedMini :title="$t('category.Vehicle')" :active="step > 1" categoryId="61b44214d76e9b43e4cc0812" />
      </div>
      <div class="box">
        <RecommendedMini :title="$t('category.Mobile Phones, Smartphones')" :active="step > 1"
          categoryId="61b017cca00181bf8190e585" :productIds="phoneSearchList" />
      </div>
    </div>
    <div class="content">
      <div class="box categoryList">
        <CategoryVirtualList :title="topNavActive.label" :categoryId="topNavActive.name"
          :categoryName="topNavActive.categoryName" />
      </div>
    </div>
  </div>
</template>

<script>
import useHome from './useHome'
const Nav = () => import("@/layout/navMobile.vue")
const BannerList = () => import("./components/BannerList.vue")
const Recommended = () => import("./components/Recommended.vue")
const RecommendedForYou = () => import("./components/RecommendedForYou.vue")
const RecommendedMini = () => import("./components/RecommendedMini.vue")
const Personality = () => import("./components/Info/Personality.vue")
const InfoCard = () => import("./components/Info/InfoCard.vue")
const CategoryVirtualList = () => import("./components/CategoryVirtualList.vue")

export default {
  name: 'LayoutMobile',
  components: {
    Nav,
    BannerList,
    Recommended,
    RecommendedForYou,
    RecommendedMini,
    Personality,
    InfoCard,
    CategoryVirtualList
  },
  data() {
    return {
      step: 0,
      phoneSearchList: [
        '67b31f45fca330c01db6800b',
        '67b451b1dba4ac6875ec11bc',
        '64bb9da5bf766f2989d8aa1a',
      ]
    }
  },
  computed: {
    list() {
      return useHome().list
    },
    isAllProduct() {
      const topNav = useHome().topNavActive(this)
      return !topNav || topNav.name === '0'
    },
    topNavActive() {
      return useHome().topNavActive(this)
    }
  },
  mounted() {
    useHome().init(this)
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 25px;
  background-color: #fbfbfb;
  display: flex;
  flex-direction: column;
  column-gap: 16px;

  &+.content {
    padding-top: 0;
  }

  .box+.box {
    margin-top: 16px;
  }

}

.baseBox {
  padding: 25px 25px 0;
  background-color: #fbfbfb;
}

.carousel {
  width: 100%;
  height: 40vw;

  ::v-deep {
    .bg-carousel {
      height: 40vw;

      .banner_content {
        top: 0%;

        .banner_text {
          font-size: 12px;
        }
      }
    }
  }

}

.box {
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 2px 3px 5px #efefef;
}
</style>