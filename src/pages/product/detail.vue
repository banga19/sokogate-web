<template>
  <b-container class="product-detail">
    <div v-title :data-title="$t('productDetail.productdetails')">
      <template v-if="error">
        <error-card :data="error" @refresh="getDetail" />
      </template>
      <template v-else>
        <template v-if="spuData.id">
          <sui-breadcrumb
            :items="breadcrumbItems"
            :categoryid="cid"
            :spu="spuData"
          />
        </template>
        <el-skeleton v-else :loading="true" animated>
          <template slot="template">
            <br />
            <div>
              <el-skeleton-item variant="p" style="width: 40%" />
            </div>
            <el-skeleton-item variant="p" style="width: 80%" />
          </template>
        </el-skeleton>
        <br />
        <b-row>
          <!-- 主图｜轮播｜放大镜 -->
          <b-col cols="12" lg="5">
            <template v-if="spuData.galleryList">
              <cover-box
                ref="coverbox"
                :list="[
                  ...colorImageArray,
                  ...FileUrl,
                  ...CoverUrl,
                  ...spuData.galleryList,
                ]"
                :cover-url="CoverUrl[0]"
              />
            </template>
            <el-skeleton v-else :loading="true" animated>
              <template slot="template">
                <div>
                  <el-skeleton-item
                    variant="image"
                    style="width: 450px; height: 450px"
                  />
                  <div class="flex-box">
                    <el-skeleton-item
                      variant="image"
                      style="width: 75px; height: 75px"
                    />
                    <el-skeleton-item
                      variant="image"
                      style="width: 75px; height: 75px"
                    />
                    <el-skeleton-item
                      variant="image"
                      style="width: 75px; height: 75px"
                    />
                    <el-skeleton-item
                      variant="image"
                      style="width: 75px; height: 75px"
                    />
                    <el-skeleton-item
                      variant="image"
                      style="width: 75px; height: 75px"
                    />
                    <el-skeleton-item
                      variant="image"
                      style="width: 75px; height: 75px"
                    />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </b-col>
          <b-col cols="12" lg="7">
            <!-- <p>{{ erMap }}</p> -->
            <template v-if="spuData.specParam">
              <!-- 信息展示 -->
              <info-box :sk-map="skMap" :spu="spuData" :erMap="erMap" />
              <!-- sku选择器 -->
              <!-- <p>{{ selectObj }}</p> -->
              <color-size-select
                :sk-map="skMap"
                :spu="spuData"
                @change="onColorChange"
                :select="selectObj"
                :erMap="erMap"
                :ladder="ladderArray"
              />
              <!-- 订单预览 -->
              <order-pv-card
                :sk-map="skMap"
                :spu="spuData"
                :select="selectObj"
                :erMap="erMap"
                :ladder="ladderArray"
              />
              <!-- 操作 -->
              <detail-operate
                :sk-map="skMap"
                :spu="spuData"
                :select="selectObj"
                :erMap="erMap"
                :ladder="ladderArray"
              />
              <shipping
                :sk-map="skMap"
                :spu="spuData"
                :select="selectObj"
              ></shipping>

              <b-navbar fixed="top" class="scroll-box" v-show="goShow">
                <b-container class="button-box">
                  <div class="opt-btn-addcart" @click="gotoScroll">
                    {{ $t("productDetail.addtocart") }}
                  </div>
                  <div class="opt-btn-gobuy" @click="gotoScroll">
                    {{ $t("productDetail.buynow") }}
                  </div>
                </b-container>
              </b-navbar>
            </template>
            <template v-else>
              <br />
              <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
              <br />
              <el-skeleton :loading="true" animated :rows="6"> </el-skeleton>
              <br />
              <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
            </template>
          </b-col>
        </b-row>
        <!-- {{ selectObj }} -->
        <br />
        <!-- <p v-if="$store.state.user.email === 'i@lenneth.cn'">{{ skMap }}</p> -->
        <br />
        <b-row>
          <b-col cols="12" md="3">
            <template v-if="spuData.store">
              <store-card :store="spuData.store" />
            </template>
          </b-col>
          <b-col cols="12" md="9">
            <el-tabs v-model="detailActiveName" class="sticky-tags">
              <el-tab-pane
                v-if="spuData.attributesList"
                :label="$t('productDetail.Attribute')"
                name="attribute"
              >
                <info-list
                  :value="
                    spuData.attributesList.reduce((a, v) => {
                      return {
                        ...a,
                        [v.key]: v.value,
                      };
                    }, {})
                  "
                />
              </el-tab-pane>
              <el-tab-pane
                v-if="spuData.detailDawingList"
                :label="$t('productDetail.Overview')"
                name="overview"
              >
                <detail-image-list :list="spuData.detailDawingList" />
              </el-tab-pane>
              <el-tab-pane
                :label="$t('productDetail.Description')"
                name="description"
              >
                <!-- {{ spuData.description }} -->
                <sui-text-trans
                  :text="spuData.description"
                  :trans-map="spuData.translationDesMap"
                />
              </el-tab-pane>
              <el-tab-pane :label="$t('productDetail.Review')" name="review"
                >No review</el-tab-pane
              >
            </el-tabs>
          </b-col>
        </b-row>
        <back-to-top />
        <relatedproducts :title="$t('productHome.Related Products')" :productId="spuData.id"
          :productName="spuData.spuName" :categoryIdList="spuData.categoryIdList" />
        <!-- <goto-talking :store="spuData.store" /> -->
      </template>
    </div>
    <DetailToApp />
  </b-container>
</template>
<script async defer crossorigin="anonymous" 
  src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"></script>
<script>
import BackToTop from "@/components/s-ui/list/BackToTop";
import SuiBreadcrumb from "@/components/s-ui/list/Breadcrumb";
import { GetSpu, AddShareLinks } from "@/utils/api";
import CoverBox from "@/components/product/CoverBox";
import InfoBox from "@/components/product/InfoBox";
import ColorSizeSelect from "@/components/product/ColorSizeSelect";
import StoreCard from "@/components/product/StoreCard";
import DetailImageList from "@/components/product/DetailImageList";
import InfoList from "@/components/InfoList";
import OrderPvCard from "@/components/product/OrderPvCard.vue";
import DetailOperate from "@/components/product/DetailOperate";
import ErrorCard from "@/components/s-ui/card/ErrorCard";
import Relatedproducts from "@/components/product/Relatedproducts";
// import GotoTalking from "@/components/GotoTalking";
import Shipping from "@/components/product/Shipping";
import SuiTextTrans from "@/components/s-ui/info/text_trans";
import DetailToApp from "./DetailToApp.vue";

export default {
  components: {
    BackToTop,
    SuiBreadcrumb,
    CoverBox,
    InfoBox,
    ColorSizeSelect,
    StoreCard,
    DetailImageList,
    InfoList,
    OrderPvCard,
    DetailOperate,
    ErrorCard,
    Relatedproducts,
    // GotoTalking,
    Shipping,
    SuiTextTrans,
    DetailToApp,
  },

  metaInfo() {
    const product = this.spuData;
    const siteName = "Sokogate";
    const pageUrl = `${window.location.origin}${this.$route.fullPath}`;
    const title = `${siteName}`;

    return {
      title: title,
      meta: [
        {
          name: "description",
          content: `${title} - ${siteName}` || "默认描述",
        },
        // Open Graph / Facebook
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: pageUrl,
        },
        { property: "og:title", content: title || "默认标题" },
        { property: "og:description", content: siteName || "默认描述" },
        {
          property: "og:image",
          content: (product.galleryList && product.galleryList[0])
            ? `${product.galleryList[0]}?x-oss-process=image/resize,w_1200,h_630`
            : "https://example.com/default.jpg",
        },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:url",
          content: pageUrl,
        },
        {
          name: "twitter:title",
          content: `${title} - ${siteName}` || "默认标题",
        },
        {
          name: "twitter:description",
          content: siteName || "默认描述",
        },
        {
          property: "twitter:image",
          content: (product.galleryList && product.galleryList[0])
            ? `${product.galleryList[0]}?x-oss-process=image/resize,w_1200,h_630`
            : "https://example.com/default.jpg",
        },
      ],
      link: [
        {
          vmid: "canonical",
          rel: "canonical",
          href: pageUrl,
        },
      ],
    };
  }, 

  data() {
    return {
      scrollTop: "",
      goShow: false,
      playing: false,
      error: false,
      spuData: {},
      color: {},
      detailActiveName: "attribute",
      selectObj: {
        pcsList: [],
      },
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
    cid() {
      return this.spuData.categoryIdList
        ? this.spuData.categoryIdList[this.spuData.categoryIdList.length - 1]
        : "";
    },
    ladderArray() {
      return (this.spuData.id ? this.spuData.skuLadderList : []).map((v) => {
        const { min, max, skuPriceAllTheSame } = v;
        return { min, max, skuPriceAllTheSame };
      });
    },
    validSkuLadder() {
      return this.spuData.skuList.filter((item) => {
        return item.avaliable == 1;
      });
    },
    skMap() {
      return (this.spuData.id ? this.validSkuLadder : []).reduce((a, sku) => {
        const {
          specIdList: [colorId, sizeId],
          skId,
          id,
          stock,
          infStock,
          price,
          skuLadder,
        } = sku;
        const specNames = `${colorId}-${sizeId}`;
        return {
          ...a,
          [specNames]: [
            ...(a[specNames] || []),
            {
              ...skuLadder,
              skId,
              skuId: id,
              stock,
              infStock,
              price,
            },
          ],
        };
      }, {});
    },
    // 汇率
    erMap() {
      return (
        this.spuData.exchangeRateList ? this.spuData.exchangeRateList : []
      ).reduce((a, v) => {
        return {
          ...a,
          [v.currencyFrom]: v.rate,
        };
      }, {});
    },
    colorImageArray() {
      if (this.color.img) {
        return [this.color.img];
      } else {
        return [];
      }
    },
    // 视频图片
  CoverUrl() {
    return (this.spuData.videoList ? this.spuData.videoList : []).map(v =>
      v.Snapshot && v.Snapshot.CoverUrl ? v.Snapshot.CoverUrl : ""
    );
  },
  // 视频
  FileUrl() {
    return (this.spuData.videoList ? this.spuData.videoList : []).map(v =>
      v.Transcode && v.Transcode.StreamInfos && v.Transcode.StreamInfos.length > 1
        ? v.Transcode.StreamInfos[1].FileUrl
        : ""
    );
  },
  },
  watch: {
    "$route.query.id"() {
      if (this.$route.query.id) {
        this.getDetail();
      }
    },
  },
  async created() {
    const token = localStorage.getItem("auth_token")
    if (this.$route.query.srcde && token) {
      AddShareLinks({
        shareUrl: `${location.pathname}${location.search}`,
      })
    }
    await this.getDetail();
    document.dispatchEvent(new Event("prerender-trigger"));
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {},
  methods: {
    gotoScroll() {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop =
          document.documentElement.scrollTop =
          top -=
            50;
        if (top <= 500) {
          clearInterval(timeTop);
        }
      }, 10);
    },
    handleScroll() {
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (this.scrollTop > 1300) {
        //设置页面滑动多少显示按钮
        this.goShow = true;
      } else {
        this.goShow = false;
      }
    },
    async getDetail() {
      console.log("this.$route.query.id:", this.$route.query.id);
      await GetSpu({ id: this.$route.query.id })
        .then((res) => {
          this.spuData = res.data;
          console.log("0000000:", this.spuData);
          this.error = false;
          this.$meta().refresh();
        })
        .catch((err) => {
          this.error = err;
        });
    },

    onColorChange(color) {
      this.color = color;
      this.$refs.coverbox.setCarouselIndex();
    },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;

.product-detail {
  padding-bottom: 20px;

  .el-result {
    padding: 10vh 0;
  }

  .scroll-box {
    padding: 0;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    top: 110px;
    background: #fff;
    z-index: 99;
    box-shadow: 0 8px 8px -4px #ddd;
    width: 100%;

    .button-box {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
    }

    @include mobile {
      display: none;
      // display: inline-flex;
      // justify-content: center;
      // align-items: center;
      // position: fixed;
      // top: 152px;
      // left: 0;
    }

    .opt-btn-addcart {
      width: 300px;

      @include mobile {
        width: 130px;
      }
    }

    .opt-btn-gobuy {
      width: 300px;

      @include mobile {
        width: 130px;
      }
    }
  }

  .opt-btn-addcart {
    cursor: pointer;
    display: inline-block;
    width: 600px;
    height: 50px;
    line-height: 50px;
    // border-radius: 8px;
    // background-color: #ffeeee;
    background-image: linear-gradient(to right, #ff9900, #ff6600);
    border: 0;
    font-size: 16px;
    // color: #ef2e22;
    color: #fff;
    text-align: center;
    transition: 0.5s;
    margin-left: 20px;

    &:hover {
      color: #fff;
      // background-color: #d80000;
      background-image: linear-gradient(to right, #ff6600, #ff6600);
    }
  }

  .opt-btn-gobuy {
    cursor: pointer;
    display: inline-block;
    width: 600px;
    height: 50px;
    line-height: 50px;
    // border-radius: 8px;
    // background-color: #ef2e22;
    background-image: linear-gradient(to right, #ff6600, #ef2e22);
    border: 0;
    font-size: 16px;
    color: #fff;
    text-align: center;
    transition: 0.5s;
    margin-left: 20px;

    &:hover {
      color: #fff;
      // background-color: #d80000;
      background-image: linear-gradient(to right, #ef2e22, #ef2e22);
    }
  }

  .sticky-tags {
    .el-tabs__header {
      position: sticky;
      top: 60px;
      padding-top: 20px;
      background-color: #fff;
      z-index: 10;
    }
  }
}
</style>