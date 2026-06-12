<template>
  <b-form @submit="onSubmit">
    <b-input-group size="lg" class="search-wrap">
      <template v-slot:prepend>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ changeValue }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="$t('common.product')">{{
              $t("common.product")
            }}</el-dropdown-item>
            <el-dropdown-item :command="$t('common.store')">{{
              $t("common.store")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <b-form-input
        :placeholder="this.$t('index.search')"
        v-model.trim="keyword"
        @focus.native="onfocus($event)"
        @input="onInput($event)"
        @blur.native="onBlur($event)"
        debounce
        class="search search-box"
        autocomplete="off"
      ></b-form-input>
      <i
        v-show="keyword.length > 0"
        class="search-clear el-icon-circle-close"
        @click="onClean"
      />
      <template v-slot:append>
        <b-button variant="outline-light" type="submit" class="search-btn">
          <svg class="colorful" aria-hidden="true">
            <use xlink:href="#colorful-a-Group1242" />
          </svg>
        </b-button>
      </template>
      <b-list-group v-show="isFocus && keyword.length > 0 && changeValue === $t('common.product')" class="search-list">
        <b-list-group-item
          v-for="(item, i) in list"
          :key="item.id"
          button
          class="search-result-item"
          @click="
            $router.push({ path: '/v2/product/detail', query: { id: item.id } })
          "
        >
          <img
            v-if="item.img"
            :src="item.img + '?x-oss-process=style/w200'"
            class="search-result-img"
            alt=""
          />
          <span class="search-result-name">{{ item.name || item.spuName }}</span>
          <span class="search-result-price" v-if="item.min_price != null">
            {{ $store.state.currency === 'USD' ? '$' : $store.state.currency }}{{ item.min_price }}
          </span>
        </b-list-group-item>
        <b-list-group-item
          v-if="list.length === 0 && keyword.length > 0"
          disabled
          class="search-result-empty"
        >
          {{ $t('index.noResults') || 'No products found' }}
        </b-list-group-item>
      </b-list-group>
      <b-list-group
        v-show="
          isFocus && keyword.length > 0 && changeValue === $t('common.store')
        "
        class="search-list"
      >
        <b-list-group-item
          v-for="(item, i) in list"
          :key="item.id"
          button
          @click="
            $router.push({
              path: '/v2/store/collections',
              query: { id: item.id },
            })
          "        >
          <span class="search-result-name">{{ item.storeName || item.name }}</span></b-list-group-item
        >
      </b-list-group>
      <!-- @click="$utils.navto(`/v2/product/list/${item._id}`)" -->
    </b-input-group>
  </b-form>
</template>
<script>
function debounce(func, wait = 500) {
  let timeout;
  return function (event) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.call(this, event);
    }, wait);
  };
}
// import { homeSearch } from "@/utils/api_v1";
import { GetSpuList, GetStorebyName } from "@/utils/api";
export default {
  data() {
    return {
      changeValue: this.$t("common.product"),
      keyword: "",
      isFocus: false,
      list: [],
    };
  },
  watch: {
    "$route.query": function (val) {
      if (
        (val && this.$route.path === "/v2/product/list") ||
        this.$route.path === "/v2/store/storeList"
      ) {
        this.keyword = val.search || "";
        // console.log(this.keyword, "keyword");
      } else {
        this.keyword = "";
      }
    },
  },
  created() {
    this.keyword = this.$route.query.search ? this.$route.query.search : "";
  },
  methods: {
    handleCommand(command) {
      // console.log("command", command);
      this.changeValue = command;
    },
    onClean() {
      this.keyword = "";
      this.isFocus = false;
    },
    onBlur() {
      // console.log("onBlur-e", e);
      setTimeout(() => {
        this.isFocus = false;
      }, 500);
    },
    onfocus() {
      // console.log("onfocus-e", e);
      this.isFocus = true;
    },
    onInput: debounce(function (e) {
      if (this.changeValue === this.$t("common.store")) {
        this.getStorebyName(e);
      } else {
        this.getTeacherList(e);
      }
      // this.addKeyword(this.input);
      // this.refreshKeyword();
      // console.log("onInput-e", e);
    }),
    onSubmit(e) {
      e && e.preventDefault();
      // console.log("onSubmit:", e, this.keyword);
      if (
        this.keyword &&
        this.keyword.length > 0 &&
        this.changeValue == this.$t("common.product")
      ) {
        this.$utils.navto("/v2/product/list", { search: `${this.keyword}` });
      } else if (
        this.keyword &&
        this.keyword.length > 0 &&
        this.changeValue == this.$t("common.store")
      ) {
        this.$utils.navto("/v2/store/storeList", {
          search: `${this.keyword}`,
        });
      }
    },
    getStorebyName(keyword) {
      GetStorebyName({
        storeName: keyword,
      }).then((res) => {
        // console.log(res, "getStorebyName");
        this.list = res.data.rows;
      });
    },
    getTeacherList(keyword) {
      GetSpuList({
        search: keyword,
        pageSize: 8,
      }).then((res) => {
        this.list = (res.data.rows || []).map((item) => ({
          ...item,
          img: item.img || (item.galleryList && item.galleryList[0]) || '',
        }));
      }).catch(() => {
        this.list = [];
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.search {
  font-size: 16px;
  &:focus {
    box-shadow: none;
  }
  .input-group-prepend {
    margin: 13px auto;
  }
  &-wrap {
    background: #f9f9f9 0% 0% no-repeat padding-box;
    box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.15);
    border-radius: 25px;
    height: 50px;
    padding-left: 10px;
    max-width: 664px;
    margin-left: auto;
    position: relative;

    input {
      background-color: transparent;
      border: 0;
      height:100%
    }
  }
  &-btn {
    padding: 0;
    margin: 0;
    width: 70px;
    height: 50px;
    border-color:transparent;
    .colorful {
      width: 70px;
      height: 50px;
    }
  }
  &-clear {
    font-size: 30px;
    color: #999;
    padding: 10px;
    transition: 0.5s;
  }
  &-list {
    position: absolute;
    width: calc(100% - 70px);
    top: 55px;
    z-index: 9999;
  }

  &-result-item {
    display: flex !important;
    align-items: center;
    gap: 10px;
    padding: 8px 12px !important;
    border: none !important;
    transition: background 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  &-result-img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  &-result-name {
    flex: 1;
    font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-result-price {
    font-size: 13px;
    color: #ef2e22;
    font-weight: bold;
    white-space: nowrap;
  }

  &-result-empty {
    font-size: 13px;
    color: #999;
    text-align: center;
    border: none !important;
  }
    @include mobile {
        .input-group{
          width: 95%;
        }
        .search-wrap{
          height: 40px;
          .input-group-prepend{
                margin: 10px auto;
          }
          .search-btn{
                height: 40px;
              .colorful{
                  width: 82px;
                  height: 40px;
              }
          }
        }

    }
    @include tabletLand {
       .input-group{
          width: 95%;
        }
    }
}
</style>