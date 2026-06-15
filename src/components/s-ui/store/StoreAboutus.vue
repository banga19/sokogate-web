<template>
  <div class="store-about-us">
    <b-container>
      <b-row>
        <b-col cols="12" md="6">
          <sui-image
            v-if="list.length"
            :src="list[0].image"
            :lazy="true"
          ></sui-image>
        </b-col>
        <b-col cols="12" md="6">
          <div class="about-msg" v-html="item.profile"></div>
          <div v-if="item.contact_email || item.contact_phone" class="contact-info">
            <div v-if="item.contact_email" class="contact-item">
              <i class="sicon-Email"></i>
              <a :href="'mailto:' + item.contact_email">{{ item.contact_email }}</a>
            </div>
            <div v-if="item.contact_phone" class="contact-item">
              <i class="el-icon-phone"></i>
              <a :href="'tel:' + item.contact_phone">{{ item.contact_phone }}</a>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image";
import { GetBannerList } from "@/utils/api";
import { normalizeBannerList } from "@/utils/banner";
export default {
  components: { SuiImage },
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
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getBannerList();
  },
  methods: {
    getBannerList() {
      GetBannerList({
        storeId: this.$route.query.id,
        type: Number(this.type),
      }).then((res) => {
        // console.log("GetBannerList", res);
        // Normalize banner data (handles both array and { rows } response formats)
        this.list = normalizeBannerList(res);
      }).catch((err) => {
        console.log("GetBannerList-err", err);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.store-about-us {
  padding: 30px 0;
  @include mobile {
    display: flex;
    flex-direction: column;
  }

  .contact-info {
    margin-top: 20px;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #eee;

    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      font-size: 14px;
      color: #333;

      i {
        font-size: 18px;
        color: #EF2E22;
        flex-shrink: 0;
      }

      a {
        color: #333;
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: #EF2E22;
        }
      }

      & + .contact-item {
        border-top: 1px solid #eee;
        margin-top: 6px;
        padding-top: 12px;
      }
    }
  }
}
</style>