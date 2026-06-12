<template>
  <div>
    <span v-for="(item, index) in list" :key="`link_${index}`">
      <el-link type="info">{{item.title}}</el-link>
      <el-divider v-if="list.length - 1 > index" direction="vertical"></el-divider>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
