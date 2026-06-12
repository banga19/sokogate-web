<template>
  <div class="smallpic-card-box">
    <section class="smallpic-card-col">
      <b-card
        @click="
          $router.push({
            name: 'Product details',
            query: { id: list.productId },
          })
        "
        class="smallpic-img"
        img-alt="Card image"
        :img-src="list.gallery[0].img + '?x-oss-process=style/w64'"
        img-left
      >
        <b-card-text class="smallpic-card-text">
          {{ list.name }}
        </b-card-text>
      </b-card>
    </section>
  </div>
</template>



<script>
export default {
  props: {
    list: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>



<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.smallpic-card-box {
  width: 100%;
  .smallpic-card-col {
    padding: 0;
    display: inline-block;
    margin-bottom: 15px;
    .card {
      border: 0;
      min-width: 287px;
      .card-body {
        padding: 1rem 0.5rem 1rem 0.5rem;
      }
    }
    .smallpic-img {
      img {
        margin: auto;
        width: 60px;
        height: 60px;
      }
    }
    .smallpic-card-text {
      text-align: center;
      max-width: 140px;
      line-height: 30px;
      min-height: 20px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.7);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
</style>