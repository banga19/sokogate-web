<template>
  <div class="store-card">
    <h4 class="store-name">
      <img
        v-if="getStoreLogoUrl(store)"
        :src="getStoreLogoUrl(store)"
        class="store-logo"
        alt=""
      />
      <i v-else class="sokogate icon-shop" />
      {{ store.storeName }}
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
import { getStoreLogoUrl } from "@/utils/banner";
export default {
  props: {
    store: {
      type: Object,
    },
  },
  methods: {
    getStoreLogoUrl(store) {
      return getStoreLogoUrl(store);
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
  display: flex;
  align-items: center;
  gap: 8px;

  .store-logo {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .sokogate {
    font-size: 18px;
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