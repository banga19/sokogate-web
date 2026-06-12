<template>
  <div class="offline-payment">
    <b-button class="btn" variant="outline-primary" disabled>
      <i class="sokogate icon" :class="names[mode].icon" />
      <div>{{ $t("order." + names[mode].name) }}</div>
    </b-button>
    ({{ $t("common.comingsoon") }})
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      names: [
        {},
        {
          name: "visa",
          icon: "icon-Visa",
        },
        {
          name: "paypal",
          icon: "icon-paypal",
        },
        {
          name: "alipay",
          icon: "icon-alipay",
        },
        {
          name: "wechatpay",
          icon: "icon-wechatpay",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.offline {
  &-payment {
    .btn-outline-primary.btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border-color: #ef2e22;
      color: #ef2e22;
      flex-direction: column;
      width: 100%;
      height: 150px;

      &::active {
        color: #fff;
        background-color: #ef2e22;
      }

      &:hover {
        color: #fff;
        background-color: #ef2e22;
      }
    }

    .icon {
      font-size: 48px;
      margin-right: 10px;
    }
  }
}
</style>