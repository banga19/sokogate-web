<template>
  <b-container v-title :data-title="$t('authentication')">
    <Breadcrumb :items="items" />
    <authentication-step :active="active" />
    <el-row type="flex" justify="center">
      <el-col :md="10">
        <mobile-authentication @onsuccess="onAuthSuccess" />
      </el-col>
    </el-row>
  </b-container>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import MobileAuthentication from "@/components/authentication/MobileAuthentication";
import AuthenticationStep from "@/components/authentication/AuthenticationStep";
export default {
  components: {
    Breadcrumb,
    MobileAuthentication,
    AuthenticationStep,
  },
  data() {
    return {
      active: 0,
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
  methods: {
    onAuthSuccess() {
      this.$router.push("/v2/authentication/idcardAuthentication");
    },
  },
};
</script>