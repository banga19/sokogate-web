<template>
  <b-container v-title :data-title="$t('authentication')">
    <Breadcrumb :items="items" />
    <authentication-step :active="active" />
    <el-row type="flex" justify="center">
      <el-col :span="10" :md="8">
        <waitingapproval />
      </el-col>
    </el-row>
  </b-container>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import AuthenticationStep from "@/components/authentication/AuthenticationStep";
import Waitingapproval from "@/components/authentication/Waitingapproval";
export default {
  components: {
    Breadcrumb,
    AuthenticationStep,
    Waitingapproval,
  },
  data() {
    return {
      active: 2,
      timer: null,
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
  mounted() {
    this.timer = setTimeout(() => {
      this.$router.push("/v2/authentication/auditcompleted");
    }, 10000);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },
};
</script>