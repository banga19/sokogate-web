<template>
  <div>
    <div class="content" v-show="isAllProduct">
      <div class="left">
        <div class="box category">
          <Nav :list="list" />
        </div>
        <div class="box recommended">
          <Recommended :active="step > 0" @success="step++" />
        </div>
      </div>
      <div class="conter">
        <div class="carousel">
          <BannerList type="601" @success="step++" class="banner-box" />
        </div>
        <div class="conterBox">
          <div class="box infoCard">
            <RecommendedForYou :active="step > 1" @success="step++" />
          </div>
          <div class="infoCard mini">
            <div class="box">
              <RecommendedMini :title="$t('category.Vehicle')" :active="step > 2"
                categoryId="61b44214d76e9b43e4cc0812" />
            </div>
            <div class="box">
              <RecommendedMini :title="$t('category.Mobile Phones, Smartphones')" :active="step > 2"
                categoryId="61b017cca00181bf8190e585" :productIds="phoneSearchList" />
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="box info">
          <Personality />
          <InfoCard />
        </div>
      </div>
    </div>
    <div class="categoryBox">
      <div class="box categoryList">
        <CategoryVirtualList :title="topNavActive.label" :categoryId="topNavActive.name"
          :categoryName="topNavActive.categoryName" />
      </div>
    </div>
  </div>
</template>

<script>
import useHome from './useHome';
import Nav from '@/layout/navV2'
const BannerList = () => import("./components/BannerList.vue");
const Recommended = () => import("./components/Recommended.vue");
const RecommendedForYou = () => import("./components/RecommendedForYou.vue");
const RecommendedMini = () => import("./components/RecommendedMini.vue");
const Personality = () => import("./components/Info/Personality.vue");
const InfoCard = () => import("./components/Info/InfoCard.vue");
const CategoryVirtualList = () => import("./components/CategoryVirtualList.vue");

export default {
  name: 'LayoutPC',
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
  align-items: stretch;
  column-gap: 16px;

  .left,
  .right {
    width: 225px;

    .box+.box {
      margin-top: 16px;
    }

    .info {
      height: 100%;
      padding: 15px;
    }
  }

  .left {
    display: flex;
    flex-direction: column;

    .category {
      padding: 0;
      height: 330px;
    }

    .recommended {
      flex: 1
    }
  }

  .conter {
    flex: 1;
    width: calc(100vw - 520px);
    display: flex;
    flex-direction: column;

    .carousel {
      height: 28.75vw;

      ::v-deep {
        .bg-carousel {
          height: 28.75vw;

          .banner_content {
            top: 0%;

            .banner_text {
              font-size: 12px;
            }
          }
        }
      }

    }

    .conterBox {
      margin-top: 16px;
      display: flex;
      column-gap: 16px;
      flex: 1;

      .infoCard {
        width: 49%;
        flex: 1;
      }

      .mini {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        row-gap: 10px;

        .box {
          flex: 1;
        }
      }
    }
  }

}

.categoryBox {
  padding: 25px;
  background-color: #fbfbfb;

  .categoryList {
    width: 100%;
  }
}

.box {
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 2px 3px 5px #efefef;
}
</style>