<template>
  <b-container class="account-page">
    <div v-title :data-title="$t('menuitems.order.list')">
      <Breadcrumb :items="items" />
      <order-list />
    </div>
  </b-container>
</template>

<script>
// Order的list页
import OrderList from "@/components/s-ui/order/OrderList.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  components: { OrderList, Breadcrumb },
  data() {
    return {
      items: [
        {
          text: this.$t("index.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.order.list"),
          active: true,
        },
      ],
    };
  },
};
</script>