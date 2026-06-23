<template>
  <div class="Header">
    <Tabs class="tabs" :active-name="activeName" :stretch="true" @tab-click="handleClick">
<el-tab-pane v-for="item in tabs" :key="item.id" :label="$t(item.name)" :name="item.id" :info="item.name"
       :categoryName="item.categoryName"></el-tab-pane>
    </Tabs>
  </div>
</template>

<script>
import Tabs from './tabs/index.vue'
import categoryData from './category.data';

export default {
  name: 'HeaderV2',
  components: {
    Tabs
  },
  computed: {
    activeName() {
      return this.$store.state.nav.currentNav ? this.$store.state.nav.currentNav.name : ''
    },
    tabs() {
      return categoryData.map(i => ({ id: i.id, name: i.name, categoryName: i.categoryName }))
    }
  },
  methods: {
    handleClick(tab, event) {
      const { name } = tab
      if (name === '0') {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
        this.$router.push('/v2/product/list')
      } else {
        this.$router.push({
          path: '/v2/product/list',
          query: { cid: name }
        })
      }
      this.$store.commit('nav/setCurrentNav', {
        name,
        label: tab.$attrs.info,
        categoryName: tab.$attrs.categoryName,
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Header {
  height: 50px;
  box-shadow: 3px 5px 5px #efefef;

  .tabs {
    ::v-deep {
      .el-tabs__item {
        min-width: 140px;
        height: 50px;
        line-height: 50px;
        transition: all 0.3s;
      }

      .el-tabs__header {
        margin: 0;
      }

      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }
      }

      // .el-tabs__active-bar {
      //   display: none;
      // }

      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        font-size: 16px;
        top: 4px;

        &.is-disabled {
          display: none;
        }
      }
    }
  }

}
</style>