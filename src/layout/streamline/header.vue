<template>
  <div class="header-wrap">
    <b-container class="header">
      <div class="header-hd" @click="$router.push({ path: '/' })">
        <svg class="colorful" aria-hidden="true">
          <use xlink:href="#colorful-SokoGate" />
        </svg>
      </div>
    </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.header {
  &-wrap {
    box-shadow: 0 8px 8px -4px #ddd;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  min-height: 110px;

  &-hd {
    padding: 10px 0;
    cursor: pointer;

    .colorful {
      width: 180px;
      height: 34px;
    }
  }
}
</style>