<template>
  <div class="banner-list-box">
    <sui-image
      v-if="displayImage"
      :src="displayImage"
      :lazy="true"
      :style="{ height: '108px' }"
    ></sui-image>
    <div class="store-item">
      <img
        v-if="getStoreLogoUrl(item)"
        :src="getStoreLogoUrl(item, 0)"
        class="store-logo"
        alt=""
      />
      <h5 class="store-name">
        {{ item.storeName }}
        <span v-if="item.is_verified" class="verified-badge" :title="$t('common.verified') || 'Verified'">
          <i class="el-icon-success"></i>
        </span>
      </h5>
    </div>
    <div class="store-about">
      <span
        @click="
          $router.push({
            path: '/v2/store/collections',
            query: { id: item.id },
          })
        "
      >
        Home
      </span>
      <span
        @click="
          $router.push({
            path: '/v2/store/about',
            query: { id: item.id },
          })
        "
      >
        About us
      </span>
    </div>
  </div>
</template>


<script>
import SuiImage from "@/components/s-ui/media/Image";
import { GetBannerList } from "@/utils/api";
import { normalizeBannerList, getStoreLogoUrl } from "@/utils/banner";
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
    },
  },
  components: { SuiImage },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    /**
     * Display image for the store banner header.
     * Priority: banner carousel images > store's own banner_url > empty
     */
    displayImage() {
      if (this.items.length && this.items[0].image) {
        return this.items[0].image;
      }
      return this.item.banner_url || '';
    },
  },
  created() {
    this.getBannerList();
  },
  methods: {
    getStoreLogoUrl(item, size) {
      return getStoreLogoUrl(item, size);
    },
    getBannerList() {
      GetBannerList({
        storeId: this.$route.query.id,
        type: Number(this.type),
      }).then((res) => {
        // console.log("GetBannerList", res);
        // Normalize banner data (handles both array and { rows } response formats)
        this.items = normalizeBannerList(res);
        // console.log(this.items, "items");
      }).catch((err) => {
        console.log("GetBannerList-err", err);
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.banner-list-box {
  width: 100%;
  margin-bottom: 5px;
  position: relative;    .store-item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 12px;

    .store-logo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;

      @include mobile {
        width: 36px;
        height: 36px;
      }
    }

    .store-name {
      margin: 0;
      font-weight: 500;
      font-size: 30px;
      color: #000;
      display: flex;
      align-items: center;
      gap: 8px;

      .verified-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1e90ff, #0066cc);
        color: #fff;
        font-size: 14px;
        flex-shrink: 0;
        box-shadow: 0 2px 4px rgba(30, 144, 255, 0.4);

        i {
          font-size: 14px;
        }

        @include mobile {
          width: 20px;
          height: 20px;
          font-size: 12px;

          i {
            font-size: 12px;
          }
        }
      }

      @include mobile {
        font-size: 20px;
      }
    }
    @include mobile {
      left: 9%;
      transform: translate(-9%, -50%);
    }
  }
  .store-about {
    position: absolute;
    right: 9%;
    top: 50%;
    transform: translateY(-50%);
    span {
      cursor: pointer;
      width: auto;
      height: 36px;
      background: #ffffff;
      border-radius: 20px;
      margin-left: 15px;
      padding: 5px 10px;
      color: #000;
    }
  }
}
</style>