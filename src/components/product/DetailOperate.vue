<template>
  <div class="flex-box">
    <!-- <p>{{ skuList }}</p> -->
    <!-- <p>{{ spu.isCollection }}</p> -->
    <!-- <p>{{ filLadderSkuPriceAllTheSame }}</p> -->
    <div class="opt-btn-likes" :class="{ active: spu.isCollection === 1 }">
      <i class="sokogate icon-a-Group200" @click="handleAddMyCollection"></i>
    </div>
    <div class="opt-btn-addcart" @click="handleAddToCart">
      {{ $t("productDetail.addtocart") }}
    </div>
    <div class="opt-btn-gobuy" @click="handleBuyNow">
      {{ $t("productDetail.buynow") }}
    </div>
    <!-- {{ newOrder }} -->
  </div>
</template>

<script>
import { AddCart, AddSpuCollection, DelSpuCollection } from "@/utils/api";
export default {
  props: {
    spu: {
      type: Object,
    },
    skMap: {
      type: Object,
    },
    select: {
      type: Object,
    },
    erMap: {
      type: Object,
    },
    ladder: {
      type: Array,
    },
  },
  computed: {
    filLadderSkuPriceAllTheSame() {
      if (this.piecesSum > 0) {
        const result = this.ladder.find(
          (v) => v.min <= this.piecesSum && this.piecesSum <= v.max
        );
        if (result) {
          return result.skuPriceAllTheSame;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
    maxNum() {
      const LadderList = this.spu.skuLadderList;
      const maxLadderList = LadderList[LadderList.length - 1];
      return maxLadderList.max;
    },
    piecesSum() {
      return Object.values(this.select).map((v) =>
        Object.values(v)
          .map((v) => Object.values(v).reduce((a, v) => a + v.pcs, 0))
          .reduce((p, n) => p + n, 0)
      )[0];
    },
    skuList() {
      return this.spu.skuList
        .map((sku) => {
          if (sku.avaliable == 1) {
            const {
              specIdList: [colorId, sizeId],
              skuLadder: { max, min },
              skId,
              id,
              stock,
              price,
              spuSpecSku: {
                specParam: { color, size },
              },
            } = sku;
            const pcsItem = this.select.pcsList[colorId][sizeId];
            // console.log(sku.skId, max, min, pcsItem.pcs);
            if (
              pcsItem &&
              pcsItem.pcs > 0 &&
              ((min <= pcsItem.pcs && pcsItem.pcs <= max) ||
                (pcsItem.pcs > max && max === this.maxNum))
            ) {
              return {
                skuId: id,
                skId,
                pcs: pcsItem.pcs,
                stock,
                price,
                color: {
                  ...color,
                  skId,
                },
                size: {
                  ...size,
                  skId,
                },
              };
            } else {
              return null;
            }
          }
        })
        .filter(Boolean);
    },
    newOrder() {
      const {
        spu: {
          id,
          currency,
          spuName,
          galleryList,
          volume,
          weight,
          store,
          exchangeRateList,
          translationMap,
          categoryIdList,
        },
      } = this;
      const result = this.spu.skuList.find((sku) => {
        const {
          skuLadder: { max, min },
        } = sku;
        return (
          (min <= this.piecesSum && this.piecesSum <= max) ||
          (this.piecesSum > max && max === this.maxNum)
        );
      });
      return [
        {
          product: [
            {
              id,
              name: spuName,
              currency,
              exchangeRateList,
              translationMap,
              img: galleryList[0],
              categoryIdList,
              volume: {
                size: volume,
                unit: "M",
              },
              weight: {
                size: weight,
                unit: "KG",
              },
              list: Object.values(
                this.skuList.reduce((a, v) => {
                  console.log("v:", v);
                  return {
                    ...a,
                    [v.color.id]: {
                      id: v.color.id,
                      name: v.color.specName,
                      specs: this.skuList
                        .filter((sku) => sku.color.id === v.color.id)
                        .map((sku) => {
                          // console.log("v.skId:", v.skId, "sku.size.id:", sku.size.id,);
                          return {
                            id: sku.size.id,
                            name: sku.size.specName,
                            price: this.filLadderSkuPriceAllTheSame
                              ? result.price
                              : sku.price,
                            num: sku.pcs,
                            skId: sku.skId,
                          };
                        }),
                    },
                  };
                }, {})
              ),
            },
          ],
          store: {
            ...store,
            name: store.storeName,
          },
          skuLadderList: {
            ...this.spu.skuLadderList,
          },
        },
      ];
    },
  },
  created() {
    // this.getSpuCollection();
  },
  methods: {
    // 点击收藏
    handleAddMyCollection() {
      // console.log("this.spu.isCollection:", this.spu.isCollection);
      if (this.spu.isCollection === 1) {
        DelSpuCollection({ spuId: this.spu.id }).then((res) => {
          console.log("DelSpuCollection", res);
          this.spu.isCollection = 0;
          this.$message({
            type: "success",
            message: this.$t("common.cancelCollection"),
          });
        });
      } else {
        AddSpuCollection({ spuId: this.spu.id }).then((res) => {
          console.log("AddSpuCollection", res);
          this.spu.isCollection = 1;
          this.$message({
            type: "success",
            message: this.$t("common.successCollection"),
          });
        });
      }
    },
    handleAddToCart() {
      console.log("this.skuList", this.skuList);
      AddCart(this.skuList)
        .then((res) => {
          // console.log("AddCart-res:", res);
          this.$store.commit("cartCountSet", res.data.rows.length);
          this.$message({
            type: "success",
            message: this.$t("productDetail.addtocart"),
          });
          // this.$utils
          //   .confirm({
          //     content: this.$t("common.addSuccess"),
          //     okText: this.$t("productDetail.gotocart"),
          //   })
          //   .then((confirm) => {
          //     if (confirm) {
          // this.$utils.navto("/v2/shopping-cart");
          // }
          // });
        })
        .catch((err) => {
          console.log("AddCart-err:", err);
          this.$message({
            showClose: false,
            message: this.$t("detail.Insufficient stock"),
            type: "error",
          });
        });
    },
    handleBuyNow() {
      // console.log(this.ladder, "ladderladder");
      let min = this.ladder[0].min;
      if (this.piecesSum < min) {
        this.$message({
          message: this.$t("productDetail.Minimum quantity") + min,
          type: "warning",
        });
      }
      if (this.skuList.length) {
        this.$utils.navWithParams("checkoutCounterPlus", {
          newOrder: this.newOrder,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.opt-btn-likes {
  cursor: pointer;
  width: 50px;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba($color: #000, $alpha: 0.15);
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  margin-right: 20px;
  flex-shrink: 0;

  .sokogate {
    font-size: 24px;
    padding: 7px;
  }

  &:hover {
    color: #fff;
    background-color: #f84949;
  }

  &.active {
    color: #fff;
    background-color: #f84949;
  }
}
</style>