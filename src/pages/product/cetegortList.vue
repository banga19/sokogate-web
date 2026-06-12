<template>
  <b-container class="product-list">
    <div v-title :data-title="$t('productList.title')">
      <sui-breadcrumb :items="breadcrumbItems" :categoryid="$route.query.cid" />
      <div class="sticky-wrap">
        <div class="sticky-card">
          <product-cetegort-nav :value="currentCategoryList.map((v) => v.id)" />
        </div>
        <product-cetegort-list ref="productList"></product-cetegort-list>
      </div>
      <back-to-top />
      <div class="mobile-category-drawer">
        <el-drawer :visible.sync="drawer" :with-header="false" direction="ltr" size="75%">
          <div class="drawer-list">
            <product-cetegort-nav :value="currentCategoryList.map((v) => v.id)" />
          </div>
        </el-drawer>
        <div class="mobile-category-fab">
          <el-button icon="el-icon-s-unfold" circle @click="drawer = true" size="medium"></el-button>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import BackToTop from "@/components/s-ui/list/BackToTop";
import SuiBreadcrumb from "@/components/s-ui/list/Breadcrumb";
import ProductCetegortNav from "@/components/s-ui/product/ProductCetegortNav";
import ProductCetegortList from "@/components/s-ui/product/ProductCetegortList";
import { GetSpuList } from "@/utils/api";

export default {
  components: {
    BackToTop,
    SuiBreadcrumb,
    ProductCetegortNav,
    ProductCetegortList,
  },
  data() {
    return {
      list: [],
      drawer: false,
    };
  },
  computed: {
    breadcrumbItems() {
      return [
        {
          label: this.$t("productList.title"),
          path: "/v2/product/list",
        },
      ];
    },
    allCategoryList() {
      return (this.$store.state.menu || []).reduce((a, v) => {
        const { children, ...others } = v;
        const gc = (children || []).reduce((a, v) => {
          const { children, ...others } = v;
          return [...a, others, ...(children || [])];
        }, []);
        return [...a, others, ...(children || []), ...gc];
      }, []);
    },
    currentCategory() {
      if (!this.$route.query.cid) return null;
      return this.allCategoryList.find((v) => v.id === this.$route.query.cid);
    },
    currentCategoryList() {
      const parents = this.currentCategory
        ? this.findParent(this.currentCategory)
        : this.allCategoryList.slice(0, 1);
      return parents.map((v) => ({
        id: v.id,
        name: v.categoryName,
      }));
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
    getList() {
      if (!this.$route.query.cid) return;
      const req = {
        categoryId: this.$route.query.cid,
        desc: 0,
        page: 1,
        orderKey: "",
        pageSize: 30,
        search: "",
      };
      GetSpuList(req)
        .then((res) => {
          this.list = res.data.rows.map((item) => ({
              ...item,
              img: item.img || (item.galleryList && item.galleryList[0]) || "",
            }))
        })
        .catch((err) => {
          console.error("GetSpuList", err);
        });
    },
  },
  async created() {
    await this.$store.dispatch("fetchMenus");
    if (this.$route.query.cid) {
      this.getList();
    }
  },
  watch: {
    drawer(open) {
      if (open && !(this.$store.state.menu || []).length) {
        this.$store.dispatch("fetchMenus");
      }
    },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;
.product-list {
  .sticky-wrap {
    display: flex;
  }
  .sticky-card {
    top: 80px;
    margin-right: 20px;
    align-self: flex-start;
    @include mobile {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.mobile-category-drawer {
  display: none;
  @include mobile {
    display: block;
  }
}
.mobile-category-fab {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 201;
}
.drawer-list {
  padding: 12px 8px;
}
</style>
