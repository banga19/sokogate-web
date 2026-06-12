<template>
  <b-container v-title :data-title="$t('authentication')">
    <Breadcrumb :items="items" />
    <authentication-step :active="active" />
    <el-row type="flex" justify="center">
      <el-col :span="10" :md="8">
        <auditcompleted />
      </el-col>
    </el-row>
  </b-container>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import AuthenticationStep from "@/components/authentication/AuthenticationStep";
import Auditcompleted from "@/components/authentication/Auditcompleted";
export default {
  components: {
    Breadcrumb,
    AuthenticationStep,
    Auditcompleted,
  },
  data() {
    return {
      active: 4,
      items: [
        {
          text: this.$t("menuitems.home"),
          to: { name: "Product Home" },
        },
        {
          text: this.$t("authentication"),
          to: { name: "authentication" },
        },
      ],
    };
  },
};
</script>