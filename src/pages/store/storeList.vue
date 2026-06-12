<template>
<div v-title :data-title="$t('common.store')">
  <b-container>
    <b-row v-for="(item, index) in list" :key="`store` + index" class="store-box">
      <b-col cols="12" md="3">
        <store-card :store="item" />
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import StoreCard from "@/components/product/StoreCard";
import { GetStorebyName } from "@/utils/api";
export default {
  components: {
    StoreCard,
  },
  data() {
    return {
      list: [],
      keyword: "",
    };
  },
  created() {
    this.keyword = this.$route.query.search ? this.$route.query.search : "";
    this.getStorebyName(this.keyword);
  },

  methods: {
    getStorebyName(keyword) {
      GetStorebyName({
        storeName: keyword,
      }).then((res) => {
        // console.log(res, "getStorebyName");
        this.list = res.data.rows;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.store-box{
  margin-top: 3%;
}
</style>