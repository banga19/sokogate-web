<template>
  <div class="card-list">
    <b-card :header="header">
      <slot></slot>
    </b-card>
  </div>
</template>



<script>
export default {
  props: {
    header: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.card-list {
    .card-body {
        padding: 0;
    }
    .card-header {
        background-color: #faf5f5;
        padding-left: 3%;
        color: #873535;
        font-size: 15px;
        line-height: 20px;
        @include mobile {
            padding-left: 9%;
        }
    }
}
</style>