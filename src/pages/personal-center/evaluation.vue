<template>
  <b-container class="account-page">
    <div v-title :data-title="$t('menuitems.account.evaluation')">
      <Breadcrumb :items="items" />

      <b-row>
        <b-col cols="12" md="4">
          <Card />
        </b-col>
        <b-col cols="12" md="8">
          <b-row>
            <b-col cols="12">
              <div class="bd-col">
                <Icon iconClass="Frame12"></Icon>
                <card-group :header="$t('account.EVALUATION')">
                  <b-table striped hover :items="list"></b-table>
                </card-group>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>



<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Card from "@/components/Card.vue";
import CardGroup from "@/components/CardGroup.vue";
import Icon from "@/components/Icon";
export default {
  components: { Breadcrumb, Card, CardGroup, Icon },
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
          text: this.$t("menuitems.account.evaluation"),
          active: true,
        },
      ],
      list: [
        { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
        { age: 21, first_name: "Larsen", last_name: "Shaw" },
        { age: 89, first_name: "Geneva", last_name: "Wilson" },
        { age: 38, first_name: "Jami", last_name: "Carney" },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.account-page {
  position: relative;
  .row {
    margin-bottom: 30px;
  }

  .bd-col {
    margin-top: 0;
    .iconimg {
      color: #873535;
      font-size: 20px;
      position: absolute;
      top: 0.5%;
      left: 2%;
    }
  }
}
</style>