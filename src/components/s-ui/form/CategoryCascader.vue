<template>
  <div>
    <el-cascader-panel
      v-loading="loading"
      :value="value"
      :options="tree"
      :props="{ expandTrigger: 'hover', checkStrictly: true }"
      @change="handleChange"
      clearable
      class="w100"
    >
      <template slot-scope="{ node, data }">
        <span>{{ $t(`category.${data.label}`) }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader-panel>
    <!-- <el-breadcrumb class="title" separator="/">
      <el-breadcrumb-item v-for="v in value" :key="v">{{
        $t(`category.${treeMap[v]}`)
      }}</el-breadcrumb-item>
    </el-breadcrumb> -->
  </div>
</template>
<script>
import { renderData } from "@/helper/api.js";
import { findCategoryChildren } from "@/utils";

export default {
  props: {
    value: {
      default: [],
    },
  },
  data() {
    return {
      loading: true,
      tree: [],
      treeMap: {},
    };
  },
  created() {
    this.getCategory();
  },
  methods: {
    getCategory() {
      renderData("GET", "category?orderDir=desc")
        .then((res) => {
          console.log("getCategory-res:", res);
          const tree = findCategoryChildren(null, res.data);
          console.log("tree:", tree);
          this.tree = tree;
          this.treeMap = res.data.reduce(
            (a, v) => ({
              ...a,
              [v._id]: v.categoryName,
            }),
            {}
          );
          this.loading = false;
        })
        .catch((error) => {
          console.log("getCategory-error:", error);
        });
    },
    handleChange(e) {
      console.log("handleChange-e:", e);
      // if (e.length === 1 && this.value.length === 1) {
      //   this.$emit("input", [...this.value, ...e]);
      // } else {
      this.$emit("input", e);
      // }
    },
  },
};
</script>
<style scoped>
.title {
  padding: 10px;
}
.w100 {
  width: 100%;
}
</style>