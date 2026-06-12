<template>
  <div class="store-card">
    <h4 class="store-name">
      <i class="sokogate icon-shop" />{{ store.storeName }}
    </h4>
    <el-divider></el-divider>
    <button
      class="opt-btn-info"
      @click="$router.push({ path: '/v2/store/collections', query: {id:store.id} })"
    >
      {{$t("productDetail.Gotostore")}} <i class="el-icon-d-arrow-right" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
    },
  },
};
</script>

<style lang="scss">
.store-card {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba($color: #000, $alpha: 0.3);
  border-radius: 10px;
  position: sticky;
  top: 80px;
}
.store-name {
  font-size: 18px;
  padding-bottom: 8px;

  .sokogate {
    font-size: 18px;
    margin-right: 8px;
  }
}
.opt-btn-info {
  cursor: pointer;
  display: inline-block;
  width: 200px;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  background-color: #000;
  border: 0;
  font-size: 16px;
  color: #fff;
  text-align: center;
  transition: 0.5s;

  &:hover {
    color: #fff;
    background-color: #666;
  }
}
</style>