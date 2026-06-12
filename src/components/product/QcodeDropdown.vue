<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <i class="sokogate icon-qcode qcode"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        ><div class="qrcode" id="qrcode" ref="qrCodeUrl"></div
      ></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>


<script>
import QRCode from "qrcodejs2";
export default {
  data() {
    return {};
  },
  computed: {
    baseUrl() {
      return (
        process.env.VUE_APP_V1_HOMEPAGE_URL + this.$route.fullPath.slice(1)
      );
    },
  },
  created() {
    this.getqrcode();
  },
  methods: {
    getqrcode() {
      this.$nextTick(() => {
        const qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text: this.baseUrl, // 需要转换为二维码的内容
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        console.log("qrcode:", qrcode);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qcode {
  font-size: 20px;
}
</style>