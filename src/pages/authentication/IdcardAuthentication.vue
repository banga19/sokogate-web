<template>
  <b-container v-title :data-title="$t('authentication')">
    <Breadcrumb :items="items" />
    <authentication-step :active="active" />
    <el-row type="flex" justify="center">
      <el-col :md="10">
        <id-card-authentication @onsuccess="onAuthSuccess" />
      </el-col>
    </el-row>
  </b-container>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import IdCardAuthentication from "@/components/authentication/IdCardAuthentication";
import AuthenticationStep from "@/components/authentication/AuthenticationStep";
export default {
  components: {
    Breadcrumb,
    IdCardAuthentication,
    AuthenticationStep,
  },
  data() {
    return {
      active: 1,
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
      this.$router.push("/v2/authentication/auditcompleted");
    },
  },
};
</script>