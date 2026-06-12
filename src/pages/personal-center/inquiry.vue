<template>

  <b-container class="account-page">
<div v-title :data-title="$t('menuitems.account.inquiry')">
    <Breadcrumb :items="items" />
</div>
  </b-container>
</template>



<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  components: { Breadcrumb },
  data() {
    return {
      items: [
        {
          text: this.$t("index.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.account.center"),
          to: { name: "Personal Center" },
        },
        {
          text: this.$t("menuitems.account.inquiry"),
          active: true,
        },
      ],
    };
  },
};
</script>