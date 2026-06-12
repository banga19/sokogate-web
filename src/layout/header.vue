<template>
  <div class="header-wrap">
    <b-container class="header">
      <!-- <div class="header-hd" @click="$utils.jumpto('')"> -->
      <div class="header-hd" @click="$router.push({ path: '/' })">
        <svg class="colorful" aria-hidden="true">
          <use xlink:href="#colorful-SokoGate" />
        </svg>
      </div>
      <div class="header-bd">
        <Hamburger class="icon-hamburger" v-model="isHamburgerActive" />
        <HomeSearch class="search" />
      </div>
    </b-container>
    <b-container class="l">
      <Nav :list="list" />
    </b-container>
    <b-collapse v-model="isHamburgerActive" class="collapse">
      <Nav menu style="display: block" :list="list" />
    </b-collapse>
  </div>
</template>
<script>
import HomeSearch from "@/components/HomeSearch.vue";
import Hamburger from "@/components/hamburger.vue";
import { GetCategoryLists } from "@/utils/api";
import Nav from "./nav";
export default {
  components: {
    HomeSearch,
    Nav,
    Hamburger,
  },
  data() {
    return {
      isHamburgerActive: false,
      list: [],
    };
  },
  created() {
    if (this.$store.state.menu.length > 0) {
      this.list = this.$store.state.menu;
    } else {
      GetCategoryLists()
        .then((res) => {
          // console.log(res, "getCategoryList");
          this.list = res.data.rows;
          this.$store.commit("setMenu", res.data.rows);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>
<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.l {
  display: flex;
  @include mobile {
    display: none;
  }
}
.collapse {
  display: none;
  @include mobile {
    display: block;
  }
}
.header {
  &-wrap {
    box-shadow: 0px 4px 5px -4px #ddd;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  min-height: 110px;
  @include mobile {
       padding-inline: 15px;
  }

  &-hd {
    padding: 10px 0;
    cursor: pointer;

    .colorful {
      width: 180px;
      height: 34px;
    }
  }

  &-bd {
    padding: 10px 0;
    flex-grow: 1;
    .icon-hamburger {
      display: none;
    }
    @include mobile {
      display: flex;
      align-items: center;
      .menu{
        height: 35px;
      }

      .search {
        flex-grow: 1;      
      }

      .icon-hamburger {
        display: inline-block;
      }
    }
  }
}
</style>