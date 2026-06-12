<template>
  <div v-if="spu.specParam" class="color-size-select">
    <!-- <p>{{ erMap }}</p> -->
    <!-- <p>{{ piecesSum }}</p>
    <p>{{ filLadderSkuPriceAllTheSame }}</p> -->
    <ul class="color-list" v-if="spu.specParam.color">
      <li
        v-for="(color, index) in spu.specParam.color"
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
            :lazy="true"
          />
        </div>
        <div>
          <!-- <div class="color-name max-one-line">{{ color.specName }}</div> -->
          <div class="color-name max-one-line">
            <sui-text-trans
              :text="color.specName"
              :trans-map="color.translationMap"
            />
          </div>
          <!-- <div class="color-desc max-one-line">{{ color.remark }}</div> -->
          <div class="color-desc max-one-line">
            <sui-text-trans :text="color.remark" />
          </div>
        </div>
      </li>
    </ul>
    <ul v-if="spu.specParam.size" class="size-list">
      <li
        v-for="(size, index) in spu.specParam.size"
        :key="`size-${size.id}-${index}`"
        class="size-li"
      >
        <el-tooltip effect="dark" placement="left">
          <div slot="content">
            <template
              v-for="(ladder, ladderIndex) in skMap[
                `${realColorId}-${size.id}`
              ]"
            >
              <p :key="`${ladder.min}-${ladder.max} Pieces ${ladderIndex}`">
                {{ `${ladder.min}-${ladder.max}` }}
                {{ $t("detail.left") }}
                {{ ladder.stock }}
              </p>
            </template>
          </div>
          <div class="size-item">
            <div class="size-name">
              <sui-text-trans :text="size.specName" />
              <!-- :trans-map="size.translationMap" -->

              <!-- {{ size.specName }} -->
            </div>
            <div class="size-price">
              <sui-product-price
                v-if="
                  filLadderSkuPriceAllTheSame &&
                  select.pcsList[realColorId][size.id].pcs > 0
                "
                :value="select.pcsList[realColorId][size.id].price(piecesSum)"
                :erMap="erMap"
                :form="spu.currency"
                color="#000"
              />
              <sui-product-price
                v-else
                :value="
                  select.pcsList[realColorId][size.id].price(
                    select.pcsList[realColorId][size.id].pcs
                  )
                "
                :erMap="erMap"
                :form="spu.currency"
                color="#000"
              />
              <!-- <span>
              ( {{ $t("detail.left") }}
              {{
                select.pcsList[realColorId][size.id].stock(
                  select.pcsList[realColorId][size.id].pcs
                )
              }}
              )
            </span> -->
            </div>
            <div class="size-num">
              <sui-number-input
                v-model="select.pcsList[realColorId][size.id].pcs"
                :step="incMinimun"
              />
              <!-- <div
                v-if="
                  select.pcsList[realColorId][size.id].pcs >
                  select.pcsList[realColorId][size.id].stock(
                    select.pcsList[realColorId][size.id].pcs
                  )
                "
                style="color: red"
              >
                {{ $t("detail.Insufficient stock") }}
              </div> 暂不显示数量超出库存-->
            </div>
          </div>
          <!-- :max="
            select.pcsList[realColorId][size.id].stock(
              select.pcsList[realColorId][size.id].pcs
            )
          " -->
          <!-- :max="maxNum || Infinity" -->
        </el-tooltip>
      </li>
    </ul>
    <!-- {{ skuList }} -->
  </div>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image";
import SuiNumberInput from "@/components/s-ui/form/NumberInput";
import SuiTextTrans from "@/components/s-ui/info/text_trans";
import SuiProductPrice from "./Price";
export default {
  components: {
    SuiImage,
    SuiNumberInput,
    SuiProductPrice,
    SuiTextTrans,
  },
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
  data() {
    return {
      colorId: 0,
      // pcsList: [],
    };
  },
  created() {
    this.init();
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
    piecesSum() {
      return Object.values(this.select).map((v) =>
        Object.values(v)
          .map((v) => Object.values(v).reduce((a, v) => a + v.pcs, 0))
          .reduce((p, n) => p + n, 0)
      )[0];
    },
    // maxNum() {
    //   const LadderList = this.spu.skuLadderList;
    //   const maxLadderList = LadderList[LadderList.length - 1];
    //   return maxLadderList.max;
    // },
    realColorId() {
      return this.colorId || this.spu.specParam.color[0].id;
    },
    incMinimun() {
      return this.spu.incMinimun;
    },
  },
  methods: {
    init() {
      // 价格阶梯: 如果somePrice不全部都是1再加数量价格都是一样
      // console.log("init:", this.spu);
      this.select.pcsList = this.spu.specParam.color.reduce(
        (colorMap, color) => {
          return {
            ...colorMap,
            [color.id]: this.spu.specParam.size.reduce((sizeMap, size) => {
              const skName = `${color.id}-${size.id}`;
              // console.log("skName:", skName);
              const skArray = this.skMap[skName];
              // console.log("skArray:", skArray);
              const maxStock = Math.max(...skArray.map((v) => v.stock));
              const hasInfinityStock = skArray.some((v) => v.infStock);
              // console.log("maxStock:", maxStock);
              return {
                ...sizeMap,
                [size.id]: {
                  pcs: 0,
                  maxStock,
                  price: (pcs) => {
                    // console.log(pcs, "pcs");
                    if (pcs) {
                      const skItem = skArray.find(
                        (v) => v.min <= pcs && pcs <= v.max
                      );
                      if (skItem) {
                        return skItem.price;
                      } else {
                        return skArray[skArray.length - 1].price;
                      }
                    } else {
                      return this.spu.minPrice;
                    }
                  },
                  stock: (pcs) => {
                    // console.log("stock-pcs:", pcs);
                    if (pcs) {
                      // console.log("stock-skArray:", skArray);
                      const skItem = skArray.find(
                        (v) => v.min <= pcs && pcs <= v.max
                      );
                      // console.log("stock-skItem:", skItem);
                      const curSkItem = skItem || skArray[skArray.length - 1];
                      return curSkItem.infStock ? Infinity : curSkItem.stock;
                    } else {
                      return hasInfinityStock ? Infinity : maxStock;
                    }
                  },
                },
              };
            }, {}),
          };
        },
        {}
      );
    },
    setColor(e, color) {
      this.colorId = color.id;
      this.$emit("change", color);
    },
  },
};
</script>

<style lang="scss">
.color-size-select {
  padding: 0 20px 20px;
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

  .size-list {
    margin-top: 8px;

    .size-li {
      cursor: pointer;
      display: block;
    }

    .size-item {
      min-height: 42px;
      display: flex;
      padding: 3px 6px;
      background-color: #fff;
      justify-content: space-between;
      align-items: center;

      .size-name {
        font-size: 14px;
        flex-grow: 1;
        width: 12%;
        word-break: break-word;
      }

      .size-price {
        flex-grow: 1;

        & > * {
          display: inline-block;
        }
      }

      .size-num {
        flex-shrink: 0;
      }

      &:hover {
        background-color: #f8f8f8;
      }
    }
  }
}
</style>