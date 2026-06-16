<template>
  <div class="menu" :class="{active: value}" @click="change">
    <div class="hamburger"></div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    change() {
      this.$emit("input", !this.value);
    }
  }
};
</script>
<style lang="scss" scoped>
$menu-size: 36px; // Button size
$line-width: 20px; // 线段宽度
$line-height: 2px; // 线段高度
$line-spacing: 8px; // 线段间距
$line-color: #333; // 线段颜色
.menu {
  // 宽高
  width: $menu-size;
  height: $menu-size;
  // 其他
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 6%;
  position: relative;
  border: 1px solid #979797;
  margin-right: 6px;
}
.hamburger {
  // 水平, 垂直居中
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // 线段样式
  &,
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: $line-width;
    height: $line-height;
    background: $line-color;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    // 过渡时间
    transition: 0.5s;
  }

  // 线段1location
  &::before {
    top: -$line-spacing;
  }

  // 线段3location
  &::after {
    top: $line-spacing;
  }
}
.menu.active {
  .hamburger {
    // 隐藏线段2
    background-color: transparent;
    box-shadow: none;

    // 线段1 旋转定位
    &::before {
      top: 0;
      transform: rotate(45deg);
    }

    // 线段3 旋转定位
    &::after {
      top: 0;
      transform: rotate(135deg);
    }
  }
}
</style>