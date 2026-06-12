<template>
  <div class="nostart-card-box">
    <section v-for="(item, index) in list" :key="index" class="card-col">
      <b-card
        @click="
          $router.push({
            name: 'Product details',
            query: { id: item.productId },
          })
        "
      >
        <div class="card-cover">
          <b-card-img
            top
            :src="item.gallery[0].img + '?x-oss-process=style/w405h539'"
            alt="Image"
            class="cover-img"
          ></b-card-img>
        </div>
        <b-card-text class="nostart-card-text">
          {{ item.name }}
        </b-card-text>
        <div class="nostart-card-msg">
          <b-card-text class="nostart-card-price">
            ${{ $utils.formatToDecimal(item.price) }}
          </b-card-text>
        </div>
      </b-card>
    </section>
  </div>
</template>



<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
};
</script>



<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.nostart-card-box {
  margin-bottom: 0 -10px;
  display: flex;
  flex-wrap: wrap;
  .card-col {
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 1%;
    .card {
      border: none;
      cursor: pointer;
      .card-body {
        padding: 0;
      }
      .card-cover {
        height: 0;
        padding-bottom: 133%;
        .cover-img {
          object-fit: contain;
        }
      }
    }
    @include mobile {
      width: 49%;
    }
    @include tabletLand {
      width: 32.33%;
    }
    @include tabletPro {
      width: 32.33%;
    }
    @include tablet {
      width: 25%;
    }
    @include laptop {
      width: 25%;
    }
    @include desktop {
      width: 20%;
    }
    @include largeScrenn {
      width: 16%;
    }
  }
}

.nostart-card-text {
  margin-top: 1%;
  font-size: 12px;
  color: #303030;
  min-height: 22px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  margin-bottom: 0;
}

.nostart-card-msg {
  display: flex;
  justify-content: flex-start;
  // padding-left: 5px;
  .nostart-card-price {
    color: #000;
    font-weight: 900;
    margin-bottom: 0;
  }
}
</style>