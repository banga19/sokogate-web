<template>
  <b-row class="order-pv-card" :class="{ expand: skuList.length > 0 }">
    <!-- <p>{{ spu.skuList }}</p> -->
    <b-col :cols="12" :md="6">
      <p>
        {{ piecesSum }} <span class="label">{{ $t("detail.Pieces") }}</span>
      </p>
      <p>
        {{ $t("detail.Takes") }} {{ leapArrayString }}
        {{ $t("detail.days to prepare") }}
      </p>
      <p class="flex-box">
        {{ priceSum }}
        <span class="label">{{ $t("detail.Total Amount") }}</span>
        <sui-product-price
          :value="priceSum"
          size="m"
          :erMap="erMap"
          :form="spu.currency"
        />
      </p>
    </b-col>
    <b-col :cols="12" :md="6">
      <p>
        <span class="label">{{ $t("detail.Total Capacity") }}:</span>
        {{ capacitySum }} CBM
      </p>
      <p>
        <span class="label">{{ $t("detail.Total Weight") }}:</span
        >{{ weightSum }} KG
      </p>
      <p>
        <span class="label">{{ $t("detail.Shipping") }}:</span>
        {{ $t("detail.In placing order") }}
      </p>
    </b-col>
  </b-row>
</template>

<script>
import SuiProductPrice from "@/components/product/Price";
export default {
  components: {
    SuiProductPrice,
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
    skuList() {
      return this.spu.skuList
        .map((sku) => {
          const {
            specIdList: [colorId, sizeId],
            skuLadder: { max, min, leap, freeShipping },
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
              color,
              min,
              max,
              size,
              leap,
              freeShipping,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
    },
    piecesSum() {
      return this.skuList.reduce((a, v) => a + v.pcs, 0);
    },
    priceSum() {
      if (this.filLadderSkuPriceAllTheSame) {
        // 当阶梯全部sku价格一致时，各sku数量合并计算 匹配阶梯
        const result = this.spu.skuList.find((sku) => {
          const {
            skuLadder: { max, min },
          } = sku;
          return (
            (min <= this.piecesSum && this.piecesSum <= max) ||
            (this.piecesSum > max && max === this.maxNum)
          );
        });
        return result.price * this.piecesSum;
      } else {
        return this.skuList.reduce((a, v) => a + v.pcs * v.price, 0);
      }
    },
    capacitySum() {
      return this.$utils.keepTwoDecimal(
        this.$utils.recoverCmbNum(this.spu.volume, this.piecesSum)
      );
    },
    weightSum() {
      return this.$utils.keepTwoDecimal(this.spu.weight * this.piecesSum);
    },
    leapArrayString() {
      return Array.from(new Set(this.skuList.map((v) => v.leap)))
        .sort((a, b) => a - b)
        .toString();
    },
  },
};
</script>

<style lang="scss">
.order-pv-card {
  max-height: 0;
  overflow: hidden;

  &.expand {
    max-height: 200px;
    transition: max-height 0.5s ease-in;
    margin-bottom: 10px;
    border: 1px solid #e6e7eb;
    padding: 10px;
    border-radius: 8px;
  }

  & > * {
    border-right: 1px dotted #979797;

    &:last-child {
      border: 0;
    }
  }

  p {
    border-bottom: 1px dotted #979797;

    &:last-child {
      border: 0;
      margin-bottom: 0;
    }

    .label {
      color: #666;
      padding-right: 6px;
    }
  }
}
</style>