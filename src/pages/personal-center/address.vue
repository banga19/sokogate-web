<template>
  <b-container class="account-page">
    <div v-title :data-title="$t('menuitems.account.address')">
      <Breadcrumb :items="items" />

      <b-row>
        <b-col cols="12" md="4">
          <Card />
        </b-col>

        <b-col cols="12" md="8">
          <Icon iconClass="Frame2"></Icon>
          <card-group :header="$t('account.Address')">
            <select-address v-model="userAddressId" />
          </card-group>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>



<script>
// 地址管理
import Breadcrumb from "@/components/Breadcrumb.vue";
import Card from "@/components/Card.vue";
import CardGroup from "@/components/CardGroup.vue";
import SelectAddress from "@/components/SelectAddress";
import Icon from "@/components/Icon";
export default {
  components: { Breadcrumb, Card, CardGroup, SelectAddress, Icon },
  data() {
    return {
      userAddressId: 0,
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
          text: this.$t("menuitems.account.address"),
          active: true,
        },
      ],
    };
  },
};
</script>


<style lang="scss" scoped>
.account-page {
  .iconimg {
    color: #873535;
    font-size: 20px;
    position: absolute;
    top: 1.5%;
    left: 2%;
  }
}
</style>