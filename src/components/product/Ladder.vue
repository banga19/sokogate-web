<template>
  <div class="ladder-box">
    <!-- {{ list }} -->
    <!-- <p v-if="$store.state.user.email === 'i@lenneth.cn'">{{ list }}</p> -->
    <div v-for="(item, index) in list" :key="`info-sku-ladder_${index}`">
      <div class="pieces-box">
        <span class="pieces-box-text">
          <template v-if="index < list.length - 1">
            {{ `${item.min}-${item.max}` }}{{ $t("detail.Pieces") }}
          </template>
          <template v-else>
            {{ `${item.min}-` }}{{ $t("detail.Unlimitedpieces") }}
          </template>
        </span>
        <sui-product-price
          :form="spu.currency"
          :value="item.price"
          size="l"
          :erMap="erMap"
        />
        <div v-if="item.leap" class="pieces-box-text">
          {{ item.leap }} {{ $t("detail.days to prepare") }}
        </div>
        <div v-if="item.freeShipping" class="pieces-box-text">
          {{ $t("productDetail.freeshipping") }}
        </div>
      </div>
    </div>
    <div class="flex-item-space" />
  </div>
</template>

<script>
import SuiProductPrice from "./Price";
export default {
  components: {
    SuiProductPrice,
  },
  props: {
    list: {
      type: Array,
    },
    spu: {
      type: Object,
    },
    erMap: {
      type: Object,
    },
  },
  created() {
    console.log("99999999999", this.list);
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.ladder-box {
  display: flex;
  flex-wrap: wrap;

  .pieces-box {
    color: #333;
    padding: 8px 0;
    text-align: center;
    margin: 0 46px;
    @include mobile {
      margin: 0;
    }

    & > .price {
      display: block;
    }

    &:first-child {
      margin-left: 0;
      @include mobile {
        margin-right: 20px;
      }
    }

    &-text {
      font-size: 14px;
      padding: 8px 0;
      display: inline-block;
    }
  }
}
</style>