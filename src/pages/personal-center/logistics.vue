<template>

  <b-container class="account-page">
<div v-title :data-title="$t('menuitems.account.Logistics')">
    <Breadcrumb :items="items" />

    <b-row>
      <b-col cols="12" md="4">
        <Card />
      </b-col>

      <b-col cols="12" md="8">
        <Icon iconClass="Frame21"></Icon>
        <card-group :header="$t('menuitems.account.Logistics')">
          <select-logistics
            v-model="logistics.price"
            @change="logisticsChange"
          />
        </card-group>
      </b-col>
    </b-row>
</div>
  </b-container>
</template>



<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Card from "@/components/Card.vue";
import CardGroup from "@/components/CardGroup.vue";
import SelectLogistics from "@/components/SelectLogistics";
import Icon from "@/components/Icon";
export default {
  components: { Breadcrumb, Card, CardGroup, SelectLogistics,Icon },
  data() {
    return {
      logistics: {
        price: 0,
      },
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
          text: this.$t("menuitems.account.Logistics"),
          active: true,
        },
      ],
    };
  },
  methods: {
    logisticsChange(e) {
      this.logistics = {
        ...this.logistics,
        ...e,
      };
    },
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