<template>
  <div class="ProductCard">
    <slot name="title">
      <div class="title" v-if="title">
        {{ title }}
      </div>
    </slot>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    title: undefined,
  }
}
</script>

<style lang="scss" scoped>
.ProductCard {
  padding: 1rem;
  height: 100%;

  .title {
    font-family: system-ui;
    margin-bottom: 0.5rem;
  }
}
</style>