<template>
  <div>
    <div class="box" @click="openPersonalitySetting">
      <div class="icon left">
        <SuiFlag :name="$store.state.nav.countryEnName" />
      </div>
      <div class="text">
        <div class="country">{{ $t('categorys.' + $store.state.nav.countryEnName) }}</div>
        <div class="line">|</div>
        <div class="currency">{{ $store.state.currency }}</div>
      </div>
    </div>
    <PersonalitySetting ref="personalitySettingRef" />
  </div>
</template>

<script>
import SuiFlag from "@/components/product/Flag"

export default {
  name: 'Personality',
  components: {
    SuiFlag,
    PersonalitySetting: () => import("@/components/PersonalitySetting.vue")
  },
  methods: {
    openPersonalitySetting() {
      this.$refs.personalitySettingRef.open()
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  column-gap: 8px;
  cursor: pointer;

  .left {
    width: 36px;
    height: 28px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .sui-flag {
      width: 130%;
      margin: 0;
    }
  }

  .text {
    flex: 1;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    column-gap: 2px;
    background-color: #f9f9f9;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 900;
    font-family: system-ui;

    .country {
      font-size: 10px;
    }
  }

  .right {
    width: 30px;
    height: 30px;
    background-color: #f9f9f9;
    border-radius: 10px;
  }
}
</style>