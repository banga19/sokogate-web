<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/v2/product/home' }">
      {{ $t("menuitems.home") }}
    </el-breadcrumb-item>

    <el-breadcrumb-item
      v-for="(item, index) in [
        ...items,
        ...categoryBreadcrumbItems,
        ...spuBreadcrumbItems,
      ]"
      :key="item.label + '_breadcrumb_' + index"
      :to="
        index + 1 === item.length ? '' : { path: item.path, query: item.query }
      "
      :replace="item.replace"
    >
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    categoryid: {
      type: String,
      default: "",
    },
    spu: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    spuBreadcrumbItems() {
      return this.spu.id
        ? [
            {
              label: this.spu.spuName,
              path: "/v2/product/detail",
              query: {
                id: this.spu.id,
              },
            },
          ]
        : [];
    },
    categoryBreadcrumbItems() {
      return this.currentCategoryList.map((v) => {
        return {
          label: this.$t(`category.${v.name}`),
          path: "/v2/product/list",
          query: {
            cid: v.id,
          },
        };
      });
    },
    allCategoryList() {
      return this.$store.state.menu.reduce((a, v) => {
        const { children, ...others } = v;
        const gc = children.reduce((a, v) => {
          const { children, ...others } = v;
          return [...a, others, ...children];
        }, []);
        return [...a, others, ...children, ...gc];
      }, []);
    },
    currentCategory() {
      return this.allCategoryList.find((v) => v.id === this.categoryid);
    },
    currentCategoryList() {
      return this.findParent(this.currentCategory).map((v) => {
        return {
          id: v.id,
          name: v.categoryName,
        };
      });
    },
  },
  methods: {
    findParent(current) {
      if (current && current.parentId) {
        const parent = this.allCategoryList.find(
          (v) => v.id === current.parentId
        );
        if (parent) {
          const allParent = this.findParent(parent);
          if (allParent) {
            return [...allParent, current];
          } else {
            return [parent, current];
          }
        } else {
          return [current];
        }
      } else {
        return [];
      }
    },
  },
};
</script>

<style lang="scss">
.el-breadcrumb {
  padding: 20px 8px;

  &__inner {
    max-width: 100px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>