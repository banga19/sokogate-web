<template>
  <div class="audit-completed">
    <el-row>
      <el-col>
        <el-result
          icon="success"
          :title="$t('common.auditsucceeded')"
          :subTitle="$t('common.authenticationsucceeded')"
          v-if="show"
        >
        </el-result>
        <el-result
          icon="error"
          :title="$t('common.auditfailed')"
          :subTitle="$t('common.authenticationfailed')"
          v-else
        >
        </el-result>
      </el-col>
    </el-row>
  </div>
</template>


<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  computed: {
    currentUser() {
      // console.log("currentUser:", this.$store.state);
      return this.$store.state.user;
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/v2/login");
    }
  },
};
</script>

<style lang="scss" scoped>
.audit-completed {
  margin-bottom: 20%;
}
</style>