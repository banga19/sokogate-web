<template>
    <el-row class="shipping-box">
      <el-collapse accordion v-model="activeName">
        <el-collapse-item name="1">
          <template slot="title">
            <div v-if="isMail === true"></div>
            <shipping-country v-else></shipping-country>
          </template>
          <shipping-list
            v-loading="loading"
            v-if="channelList && channelList.length > 0"
            :list="channelList"
          ></shipping-list>
          <p v-else-if="currentCN" v-loading="loading" class="mail-free-msg">
            {{ $t("common.mailfree") }}
          </p>
          <el-empty :image-size="200" v-else></el-empty>
        </el-collapse-item>
      </el-collapse>
    </el-row>
  </template>
  
  
  <script>
  import ShippingList from "@/components/product/ShippingList";
  import ShippingCountry from "@/components/product/ShippingCountry";
  import { GetLogisticChannelList } from "@/utils/api";
  export default {
    components: { ShippingList, ShippingCountry },
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
    },
    data() {
      return {
        currentCN: false,
        activeName: "1",
        channelList: [],
        loading: false,
        // 默认参数
        formData: {
          startCityKey: "广州市", //起运城市 默认是广州市
          weight: Number(this.weightSum) ? Number(this.weightSum) : 1, //重量
          volume: Number(this.capacitySum), //体积
          specialItems: "139", //货物种类 普货
          modeCode: "", //运输方式
          packgeType: 1, //包裹类型 1=WPX(包裹)，2=DOC(文件)
          countryKey: "US",
        },
        timer: null,
        skuLadderList: [],
      };
    },
    watch: {
      // 总重量
      weightSum(newVal, oldVal) {
        console.log("weightSum-oldVal:", oldVal);
        // console.log("weightSum-newVal:", newVal);
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.activeName = "1";
        this.timer = setTimeout(() => {
          if (newVal >= 1 && this.fromcountry !== "CN") {
            // console.log("测试");
            this.getLogisticChannelList();
          }
        }, 500);
      },
      // 国家
      fromcountry(newVal, oldVal) {
        // console.log("countryKey-oldVal:", oldVal);
        // console.log("countryKey-newVal:", newVal);
        if (newVal !== oldVal) {
          // console.log("new-country", newVal);
          this.$nextTick(() => {
            this.activeName = "1";
            this.getLogisticChannelList();
          });
        } else if (newVal === "CN" || oldVal === "CN" || this.isMail === true) {
          this.$nextTick(() => {
            this.currentCN = true;
          });
        }
      },
      // 立即处理 进入页面就触发
      immediate: true,
      // 深度监听 属性的变化
      deep: true,
    },
    computed: {
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
        return this.skuList.reduce((a, v) => a + v.pcs * v.price, 0);
      },
      capacitySum() {
        return this.$utils.keepTwoDecimal(
          this.$utils.recoverCmbNum(this.spu.volume, this.piecesSum)
        );
      },
      weightSum() {
        return this.$utils.keepTwoDecimal(this.spu.weight * this.piecesSum);
      },
      // 国家
      fromcountry() {
        return this.$store.state.countryName;
      },
      isMail() {
        return (this.skuLadderList[0].freeShipping === 1);
      },
    },
    created() {
      this.getLogisticChannelList();
      // console.log(this.spu.skuLadderList, 'spuspuspu') 新增免邮判断
      this.skuLadderList = this.spu.skuLadderList;
    },
    methods: {
      // 查价
      getLogisticChannelList() {
        this.loading = true;
        // console.log(this.formData, "formData");
        if (this.capacitySum || this.weightSum || this.fromcountry) {
          this.formData.weight = Number(this.weightSum)
            ? Number(this.weightSum)
            : 1;
          this.formData.volume = Number(this.capacitySum);
          this.formData.countryKey = this.fromcountry;
        }
        GetLogisticChannelList(this.formData)
          .then((res) => {
            this.$nextTick(() => {
              console.log("GetLogisticChannelList-res",this.formData,res);
              if (this.formData.countryKey === "CN" || this.isMail === true) {
                this.currentCN = true;
                this.channelList = [];
              } else {
                this.channelList = res.data.channelList;
                this.currentCN = false;
              }
            });
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            if (err && err.data == null) {
              this.channelList = [];
            }
            console.log("GetLogisticChannelList-err", err);
          });
      },
    },
  };
  </script>
  
  <style lang="scss">
  @use "@/style/_responsive.scss" as *;
  .shipping-box {
    margin-top: 1%;
    @include mobile {
      margin-top: 15%;
    }
    .el-collapse {
      border-top: 1px solid #fff;
    }
    .el-collapse-item__header {
      font-size: 16px;
      color: #000;
    }
  }
  .mail-free-msg {
    color: #ef2e22;
  }
  </style>