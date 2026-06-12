<template>
  <div class="bigpic-box">
    <section class="card-col">
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
          ></b-card-img>
        </div>
        <b-card-text class="bigpic-price">
          ${{ $utils.formatToDecimal(item.price) }}
        </b-card-text>
        <b-card-text class="bigpic-text">
          {{ item.name }}
        </b-card-text>
      </b-card>
    </section>
  </div>
</template>



<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
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
.bigpic-box {
  .card-col {
    cursor: pointer;
    background-color: #fff;
    box-sizing: border-box;
    display: inline-block;
    .card {
      border: none;
      .card-body {
        padding: 0;
      }
      .card-cover {
        overflow: hidden;
        height: 0;
        padding-bottom: 133%;
        .card-img-top {
          object-fit: contain;
          -webkit-user-drag: none;
        }
      }
    }
  }
}

.bigpic-price {
  min-height: 10px;
  text-align: center;
  font-size: 14px;
  color: #000;
  font-weight: 900;
  margin-bottom: 0;
}

.bigpic-text {
  display: block;
  margin: auto;
  font-size: 12px;
  text-align: center;
  color: #666;
  min-height: 50px;
  max-width: 350px;
}
</style>