<template>
  <b-row class="product-box">
    <!-- {{ skuChecked }} -->
    <!-- {{ erMap }} -->
    <!-- {{ item.list }} -->
    <br />
    <b-col cols="12" md="4">
      <b-media class="displays">
        <template #aside>
      <b-img
        class="cover"
        :src="imgUrl"
        width="64"
            alt="placeholder"
            @click="gotoDetail(item)"
          ></b-img>
        </template>

        <!-- <h5 class="mt-0">{{item.name}}</h5> -->
        <p>
          <span @click="gotoDetail(item)">
            <sui-text-trans
              :text="item.name"
              :trans-map="item.translationMap"
              class="product-name"
            />
          </span>
          <br />
          <span @click="DialogVisible = true" class="product-box-refund">
            {{ $t("common.refundpolicy") }}
          </span>
        </p>
      </b-media>
    </b-col>
    <b-col cols="2">
      <div class="product-box-column">
        <span v-for="(color, index) in item.list" :key="`clist_${index}`">
          {{ color.name }}
        </span>
      </div>
    </b-col>
    <b-col
      v-for="(specName, specIndex) in specFields"
      :key="specName"
      :cols="specCols[specIndex]"
      md="2"
    >
      <div class="product-box-column max-one-line">
        <span v-for="(spec, index) in specList" :key="`speclist_${index}`">
          <span v-if="specName === 'price'" class="price">
            <sui-product-price
              class="price"
              :value="spec[specName]"
              size="m"
              :erMap="erMap"
              :form="item.currency"
            />
            <!-- {{item.currency}} -->
          </span>
          <span v-else-if="specName === 'name'">
            <el-checkbox
              v-if="edit && checked[item.store.id]"
              class="select-store"
              v-model="checked[item.store.id][spec.skuId]"
            ></el-checkbox>
            {{ spec[specName] }}
            <el-popover
              v-if="edit && checked[item.store.id]"
              placement="bottom"
              width="400"
              trigger="click"
              :ref="refNamePopover + spec.cartId"
            >
              <p>{{ $t("order.color") }}</p>
              <template>
                <ul class="color-list" v-if="item.specParam.color">
                  <li
                    v-for="(color, index) in item.specParam.color"
                    :key="`color-${color.id}-${index}`"
                    class="color-item"
                    :class="{
                      selected: color.id === realColorId,
                    }"
                    @click="setColor($event, color)"
                  >
                    <div v-if="color.img" class="color-cover">
                      <sui-image
                        :src="color.img"
                        width="60px"
                        height="60px"
                        cut="64"
                      />
                    </div>
                    <div>
                      <div class="color-name max-one-line">
                        {{ color.specName }}
                      </div>
                      <div class="color-desc max-one-line">
                        {{ color.remark }}
                      </div>
                    </div>
                  </li>
                </ul>
              </template>
              <p>{{ $t("order.size") }}</p>
              <template v-for="(size, index) in item.specParam.size">
                <el-button
                  :key="`size-${index}`"
                  class="size-btn"
                  :class="{
                    selected: size.id === realSizeId,
                  }"
                  @click="setSize($event, size)"
                >
                  {{ size.specName }}
                </el-button>
              </template>

              <div style="text-align: right; margin: 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="Changespec(spec.cartId)"
                  >{{ $t("common.ok") }}</el-button
                >
              </div>
              <el-button type="text" size="small" slot="reference">
                {{ $t("settings.modify") }}
              </el-button>
            </el-popover>
            <el-popconfirm
             v-if="edit && checked[item.store.id]"
              :title="$t('common.confirmDelete')"
              style="margin-left: 10px"
              @confirm="del(item)"
            >
              <template v-slot:reference>
                <el-button type="text" size="small">{{
                  $t("common.delete")
                }}</el-button>
              </template>
            </el-popconfirm>
          </span>
          <span v-else>
            <template v-if="edit">
              <sui-number-input
                :value="spec[specName]"
                :min="1"
                @input="onChange($event, spec.skId)"
              />
            </template>
            <template v-else>
              {{ spec[specName] }}
            </template>
          </span>
        </span>
      </div>

      <el-dialog
        :visible.sync="DialogVisible"
        width="50%"
        center
        class="product-box-msg"
      >
        <h2>SokoGate Refund Policy</h2>
        <h3>
          How long do I have to return items I have purchased and do I have to
          pay for return shipping?
        </h3>
        <p>
          1,You have 60 days from the date of your purchase to return items you
          have purchased. Return packages must be postmarked within 60 days from
          the date of purchase. Returns made after 60 days from the date of
          purchase will not be accepted and refunds will not be provided.
        </p>
        <p>2, Return Shipping is free is possible.</p>
        <p>
          3, If you have already returned items from an order, but would like to
          return additional items from that order, you must do so within 60days
          of the purchase date and pay for the return shipping. the return
          shipping fees will be deducted from the refund.
        </p>
        <p>
          To use the right of refund, the refunded products, goods, or/and items
          must have a manufacturing defect, damage, broken, wrong,
          fake/unauthentic, or doesn’t fit the prerequisite basics
        </p>
        <br />
        <h3>Easy Refunds</h3>
        <p>
          You can easily notify SokoGate by email (<span style="color: red">info@sokogate.com</span>) about your
          refunded products, goods, and/or items, and we will keep you updated
          about the status of your refunds.
        </p>
        <br />
        <h3>Authenticity Guarantee</h3>
        <p>
          You have to ensure all seals, tags, and accessories are left intact
          and the item is in its original packaging.
        </p>
        <p>
          As a professional B2B and e-commerce business, SokoGate will send
          samples of the goods, products, or/and items with assurance before
          shipping, so the shipping charges of the refunded products, items,
          or/and goods will be under the buyer’s responsibility.
        </p>
        <br />
        <h3>How Do I Refund an Order?</h3>
        <p>
          You can contact us via email or refund your order online by the
          following steps:
        </p>
        <p>1,Sign in to your account and select my order.</p>
        <p>2,Select the order that you would like to refund.</p>
        <p>
          3,Select the return reason, please make sure that you choose the right
          reason.
        </p>
        <p>
          4,Select the refund method and cargo whether DHL, UPS, or the country
          you purchased local Freight.
        </p>
        <p>5,Review the refund details and submit.</p>
        <p>
          6,Make sure to refund before the goods leave the country of purchase.
        </p>
      </el-dialog>
    </b-col>
  </b-row>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image";
import SuiProductPrice from "@/components/product/Price";
import SuiNumberInput from "@/components/s-ui/form/NumberInput";
import SuiTextTrans from "@/components/s-ui/info/text_trans";
import { DelCart } from "@/utils/api";
export default {
  components: {
    SuiProductPrice,
    SuiNumberInput,
    SuiTextTrans,
    SuiImage,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    edit: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Object,
      default() {
        return {};
      },
    },
    erMap: {
      default: Object,
    },
  },
  data() {
    return {
      specFields: ["name", "price", "num"],
      specCols: [2, 3, 5],
      DialogVisible: false,
      dialogTableVisible: false,
      colorId: 0,
      sizeId: 0,
      refNamePopover: "popover-", // popover ref名称前缀
      // skuChecked: {},
    };
  },
  computed: {
    imgUrl() {
      try {
        const src = this.item.img || (this.item.galleryList && this.item.galleryList[0]) || (Array.isArray(this.item.images) ? this.item.images[0] : '') || ''
        return src ? (src + '?x-oss-process=style/w64') : ''
      } catch (e) { return '' }
    },
    realColorId() {
      return this.colorId || this.item.list.map((v) => v.id)[0];
    },
    realSizeId() {
      return this.sizeId || this.specList.map((v) => v.id)[0];
    },
    specList: function () {
      return this.item.list
        .map((c) => {
          return c.specs;
        })
        .reduce((a, v) => a.concat(v), []);
    },
    skMap() {
      return (this.item.id ? this.item.skuList : []).reduce((a, sku) => {
        const {
          specIdList: [colorId, sizeId],
          skId,
          id,
          stock,
          infStock,
          price,
          skuLadder, //: { max, min },
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
  },
  methods: {
    Changespec(skId) {
      let refName = this.refNamePopover + skId;
      this.$refs[refName][0].doClose();
      // console.log(
      //   skId,
      //   this.realColorId,
      //   this.realSizeId,
      //   this.skMap[`${this.realColorId}-${this.realSizeId}`].map(
      //     (v) => v.skId
      //   )[0],
      //   this.specList.map((v) => v.num)[0]
      // );
      this.$emit("select", {
        id: skId,
        pcs: this.specList.map((v) => v.num)[0],
        skId: this.skMap[`${this.realColorId}-${this.realSizeId}`].map(
          (v) => v.skId
        )[0],
      });
    },
    setColor(e, color) {
      // console.log("setColor", color);
      this.colorId = color.id;
    },
    setSize(e, size) {
      // console.log("setColor", size);
      this.sizeId = size.id;
    },
    // 进入商品详情页
    gotoDetail(item) {
      // console.log("item", item);
      window.open("/v2/product/detail?id=" + item.id);
    },
    // Delete cart item
    del(item) {
      // console.log("del-item", item, item.list[0].specs[0].cartId);
      DelCart({ id: item.list[0].specs[0].cartId })
        .then((res) => {
          console.log("DelCart-res", res);
          this.$emit("change", item.list[0].specs[0].cartId);
        })
        .catch((err) => {
          console.log("DelCart-err", err);
        });
    },
    // Update数量
    onChange(pcs, skId) {
      // console.log("onChange-e:", pcs, skId);
      this.$emit("set", [
        {
          pcs,
          skId,
        },
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.product {
  &-box {
    padding: 15px;

    &.row > * {
      padding: 0;
    }

    &:after {
      content: "";
      border-bottom: 1px solid #dee2e6;
      display: block;
      margin-left: auto;
      width: 65%;
    }

    &:last-child {
      &:after {
        border-bottom: 0;
      }
    }
    &-refund {
      color: #ef2e22;
      font-size: 12px;
      cursor: pointer;
    }
    &-msg {
      h2 {
        text-align: center;
        color: #000;
      }
      h3 {
        color: #000;
        font-size: 16px;
        font-weight: bold;
      }
    }
    &-column {
      min-height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: left;

      & > * {
        flex-grow: 1;
        min-height: 50px;
      }

      .price {
        color: #ef2e22;
      }
    }
    .product-name {
      cursor: pointer;
    }
    .displays {
      display: flex;
      align-items: flex-start;

      // @include mobile {
      //   flex-direction: column;
      // }
      .cover {
        cursor: pointer;
      }

      .media-aside {
        flex-shrink: 0;
      }
    }
  }
}
ul,
li {
  margin: 0;
  padding: 0;
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
  max-height: 300px;
  overflow: scroll;

  &::-webkit-scrollbar {
    width: 0px;
  }

  .color-item {
    height: 44px;
    cursor: pointer;
    border: 1px solid #eee;
    background-color: #fff;
    border-radius: 4px;
    color: #333;
    font-size: 16px;
    padding: 3px 8px 3px 3px;
    display: inline-flex;
    margin: 0 8px 8px 0;
    transition: 0.5s;

    .color-name {
      font-size: 14px;
      max-width: 300px;
    }

    .color-desc {
      font-size: 12px;
      max-width: 300px;
    }

    &:hover {
      background-color: #f8f8f8;
    }

    &.selected {
      color: #fff;
      font-weight: bold;
      border: 1px solid #ef2e22;
      background-color: #ef2e22;
    }
  }

  .color-cover {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 2px;
    overflow: hidden;
    margin-right: 6px;
  }
}
.size-btn {
  &.selected {
    color: #fff;
    font-weight: bold;
    border: 1px solid #ef2e22;
    background-color: #ef2e22;
  }
}
</style>