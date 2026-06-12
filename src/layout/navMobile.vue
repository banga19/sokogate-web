<template>
  <div class="productCategoryNav">
    <span class="button" @click="drawer = true">
      <el-button icon="el-icon-s-unfold" circle></el-button>
    </span>
    <el-drawer :visible.sync="drawer" size="80%" direction="ltr" :modal-append-to-body="true" :append-to-body="true"
      :with-header="false">
      <div class="list">
        <el-tree :data="filterList" :props="defaultProps" icon-class=" " @node-click="onNodeClick">
          <template #default="{ node, data }">
            <span class="item">
              <i class="icon sokogate" :class="iconMap[data.categoryName]" />
              <span class="text">
                {{ categoryLabel(data.categoryName) }}
              </span>
              <i class="icon arrow el-icon-arrow-right"></i>
            </span>
          </template>
        </el-tree>
        <span class="item" @click="navtoProductlist()">
          <i class="sokogate category-list icon-more" />
          <span class="text">{{ $t(`category.more`) }}</span>
          <i class="icon arrow el-icon-arrow-right"></i>
        </span>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import useNav from './useNav'

export default {
  name: 'NavMobile',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drawer: false,
      defaultProps: {
        children: 'children',
        label: 'categoryName',
      }
    }
  },
  computed: {
    iconMap() {
      return useNav(this).iconMap
    },
    filterList() {
      return useNav(this).filterList
    }
  },
  methods: {
    onNodeClick(data) {
      this.navtoProductlist(data.id)
    },
    navtoProductlist(id) {
      return useNav(this).navtoProductlist(id)
    },
    categoryLabel(name) {
      if (!name) return ''
      const translated = this.$t(`category.${name}`)
      return translated === `category.${name}` ? name : translated
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/style/_responsive.scss' as *;
$mainColor: #ef2e22;

.list {
  padding: 8px 0 8px 8px;

  ::v-deep {
    .el-tree-node {
      margin-bottom: 8px;
    }

    .el-tree-node__expand-icon {
      display: none;
    }

  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    column-gap: 4px;
    color: #000;

    .text {
      flex: 1;
      font-size: 18px;
      /* 溢出显示省略号 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .icon {
      text-align: center;
      font-size: 20px;

      &.arrow {
        width: 2em;
        cursor: pointer;
      }
    }
  }
}

.productCategoryNav {
  position: fixed;
  left: 4px;
  bottom: 4px;
  z-index: 201;

  .button {
    position: sticky;
    bottom: 0;
  }
}
</style>
