<template>
  <b-container class="consignee-address">
    <template>
      <h4>
        {{ $t("order.selectlogisticsmode") }}&nbsp;&nbsp;<el-checkbox
          v-model="isOpen"
          @change="changeShow"
        >
          <span class="sliver-tips">{{ $t("order.deliver") }}</span>
        </el-checkbox>
      </h4>
      <div v-show="flag">
        <add-my-logistics name="order.addMyLogistics" @onFinish="getList" />
      </div>
      <!-- <v-distpicker
      :province="role.province"
      @selected="selected"
      :city="role.city"
      :area="role.area"
    ></v-distpicker> -->
      <div class="address-list" v-show="isShow" v-loading="loading">
        <div v-show="flag">
          <template v-for="(item, index) in list">
            <b-card
              :key="item.id + '-' + index"
              class="address-card"
              :class="{ selected: index === selectIndex }"
              @click="changeAddress(index)"
            >
              <b-card-title>
                <b-icon
                  class="icon-selected"
                  icon="check-square"
                  scale="1.2"
                  variant="success"
                ></b-icon>
                <b-badge v-if="item.logisticsName" variant="secondary">
                  My
                </b-badge>
                {{ item.store ? item.store.name : item.logisticsName }}
              </b-card-title>
              <b-card-text>
                {{ item.phone || item.contactInfo }}
                {{ item.contactName }}
              </b-card-text>

              <template v-if="item.store">
                <b-card-text>
                  {{ $t("pricing." + item.freightMode) }} ${{
                    `${item.price / 100}`
                  }}/CBM
                  <br />
                  {{ $t("categorys." + item.fromCountry) }}
                  <b-icon icon="arrow-right" />
                  <i
                    v-if="item.freightMode === 'sea'"
                    class="sokogate icon-haiyun"
                  />
                  <i
                    v-else-if="item.freightMode === 'air'"
                    class="sokogate icon-icon-aviation"
                  />
                  <b-icon icon="arrow-right" />
                  {{ $t("categorys." + item.toCountry) }}
                </b-card-text>
                <b-card-text>
                  {{
                    `${item.detailAddress} ${item.contactInfo} ${item.freightMode}`
                  }}
                </b-card-text>
              </template>
              <template v-else>
                <b-card-text>{{ item.address }}({{ item.remark }})</b-card-text>
              </template>
            </b-card>
          </template>
        </div>
        <logistics-list
          v-if="channelList && channelList.length > 0"
          :list="channelList"
          @changeCountry="changeCountry"
        ></logistics-list>
        <!-- <template v-if="channelList && channelList.length > 0">
          <el-row class="item-list">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="6"> {{ $t("shipping.transplan") }} </el-col>
            <el-col :span="4"> {{ $t("shipping.timelimit") }} </el-col>
            <el-col :span="4"> {{ $t("shipping.price") }} </el-col>
            <el-col :span="5"> {{ $t("shipping.totalprice") }}</el-col>
          </el-row>
          <el-row
            v-for="(item, index) in channelList"
            :key="`shipping-${index}`"
            class="item-list"
          >
            <el-col :span="7">
              <el-checkbox-group v-model="checkedGroup">
                <el-checkbox @change="changeCountry(index)" :label="index">{{
                  item.ChannelName
                }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="4">
              {{ item.Period }}{{ $t("shipping.day") }}
            </el-col>
            <el-col :span="4">
              <sui-product-price
                :value="item.Price * 100"
                form="CNY"
                color="#000"
              />/KG</el-col
            >
            <el-col :span="5">
              <sui-product-price
                :value="item.TotalPrice * 100"
                form="CNY"
                color="#000"
            /></el-col>
          </el-row>
        </template> -->
        <!-- <b-card
            class="address-card"
            :key="`channelList-${index}`"
            :class="{ selected: index === countryIndex }"
            @click="changeCountry(index)"
          >
            <b-card-title>
              <b-icon
                class="icon-selected"
                icon="check-square"
                scale="1.2"
                variant="success"
              ></b-icon>
              <b-badge v-if="item.ChannelName" variant="secondary">
                SG
              </b-badge>
              {{ item.ChannelName }}
            </b-card-title>
            <b-card-text class="logistic-text">
              {{ $t("shipping.timelimit") }}&nbsp;&nbsp;{{ item.Period
              }}{{ $t("shipping.day") }}
            </b-card-text>
            <b-card-text class="logistic-text">
              {{ $t("shipping.price") }}&nbsp;&nbsp;<sui-product-price
                :value="item.Price * 100"
                form="CNY"
                color="#000"
              />/KG
            </b-card-text>
            <b-card-text class="logistic-text">
              {{ $t("shipping.totalprice") }}&nbsp;&nbsp;<sui-product-price
                :value="item.TotalPrice * 100"
                form="CNY"
                color="#000"
              />
            </b-card-text>
          </b-card> -->

        <!-- <template v-for="(item, index) in channelList">
        <b-card
          class="address-card"
          :key="`channelList-${index}`"
          :class="{ selected: index + list.length === countryIndex }"
          @click="changeCountry(index + list.length)"
        >
          <b-card-title>
            <b-icon
              class="icon-selected"
              icon="check-square"
              scale="1.2"
              variant="success"
            ></b-icon>
            <b-badge v-if="item.ChannelName" variant="secondary"> SG </b-badge>
            {{ item.ChannelName }}
          </b-card-title>
          <b-card-text class="logistic-text">
            {{ $t("shipping.timelimit") }}&nbsp;&nbsp;{{ item.Period
            }}{{ $t("shipping.day") }}
          </b-card-text>
          <b-card-text class="logistic-text">
            {{ $t("shipping.price") }}&nbsp;&nbsp;<sui-product-price
              :value="item.Price"
              form="CNY"
              color="#000"
            />/KG
          </b-card-text>
          <b-card-text class="logistic-text">
            {{ $t("shipping.totalprice") }}&nbsp;&nbsp;<sui-product-price
              :value="item.TotalPrice"
              form="CNY"
              color="#000"
            />
          </b-card-text>
        </b-card>
      </template> -->
        <p v-else-if="currentCN" v-loading="loading" class="mail-free-msg">
          {{ $t("common.mailfree") }}
        </p>
        <!-- <template v-else>
          <br />
          <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
        </template> -->
      </div>
      <!-- <el-button type="text">
      {{ $t("order.manageShippingAddress") }}
    </el-button> -->
    </template>
  </b-container>
</template>

<script>
import {
  GetLogisticsPriceList,
  GetMyLogistics,
  GetLogisticChannelList,
} from "@/utils/api";
import AddMyLogistics from "@/components/AddMyLogistics";
// import SuiProductPrice from "@/components/product/Price";
import phoneCodeJson from "../../static/phonecode.json";
import LogisticsList from "@/components/LogisticsList";
export default {
  props: {
    value: {
      type: Number,
    },
    weight: {
      type: Number,
      default: 1,
    },
    isMail: {
      type: Boolean,
    },
  },
  components: {
    AddMyLogistics,
    // SuiProductPrice,
    LogisticsList,
  },
  data() {
    return {
      // checkedGroup: [0],
      currentCN: false,
      loading: true,
      flag: false,
      isShow: true,
      isOpen: false,
      list: [],
      selectIndex: 0,
      countryIndex: 0,
      channelList: [],
      // 默认参数
      formData: {
        startCityKey: "广州市", //起运城市 默认是广州市
        weight: 1, //重量
        volume: 0, //体积
        specialItems: "139", //货物种类 普货
        modeCode: "", //运输方式
        packgeType: 1, //包裹类型 1=WPX(包裹)，2=DOC(文件)
        countryKey: "",
      },
    };
  },
  created() {
    this.getList();

    this.getLogisticChannelList();
  },

  computed: {
    selectCountry() {
      return this.$store.state.selectCountry;
    },
    countryMap() {
      return phoneCodeJson.reduce(
        (a, v) => ({
          ...a,
          [v.nicename]: v.iso.toLowerCase(),
        }),
        {}
      );
    },
  },
  watch: {
    selectCountry: function (newVal, oldVal) {
      // console.log("selectCountry-new", newVal);
      // console.log("selectCountry-old", oldVal);
      if (newVal !== oldVal) {
        this.$nextTick(() => {
          this.getLogisticChannelList();
        });
      }
    },
    loading(val) {
      // console.log("val", val);
      this.$emit("setLoading", val);
    },
    // 立即处理 进入页面就触发
    immediate: true,
    // 深度监听 属性的变化
    deep: true,
  },

  methods: {
    changeShow(isOpen) {
      // console.log("changeShow", isOpen);
      if (isOpen === true) {
        this.isShow = false;
        this.$emit("input", 0);
        this.$emit("change", {
          logisticsPriceId: 0,
          logisticsType: 101,
        });
      } else {
        this.isShow = true;
        this.getLogisticChannelList();
      }
    },
    // 获取此物流的运费
    getLogisticChannelList() {
      this.loading = true;
      this.formData.countryKey = this.$store.state.countryName;
      if (this.selectCountry) {
        // console.log("countryMap", this.selectCountry);
        this.formData.countryKey = this.countryMap[this.selectCountry];
      }
      // console.log(this.formData, "formData");
      GetLogisticChannelList({ ...this.formData, weight: this.weight })
        .then((res) => {
          //   console.log("GetLogisticChannelList-res", res);
          if (
            this.formData.countryKey === "cn" ||
            this.isOpen === true ||
            this.isMail === true
          ) {
            this.currentCN = true;
            this.channelList = [];
            this.$emit("input", 0);
            this.$emit("change", {
              logisticsPriceId: this.list[0].id,
              logisticsType: 401,
            });
          } else {
            this.channelList = res.data.channelList;
            this.changeCountry(this.countryIndex);
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("GetLogisticChannelList-err", err);
        });
    },
    changeCountry(index) {
      // console.log("index", index);
      this.countryIndex = index;
      // this.checkedGroup = [];
      // this.checkedGroup.push(index);
      // console.log(
      //   "change",
      //   index,
      //   this.countryIndex,
      //   this.channelList[index].TotalPrice
      // );
      // console.log(
      //   "change",
      //   index,
      //   this.countryIndex,
      //   this.channelList[index - this.list.length].TotalPrice
      // );
      // if (index >= this.list.length) {
      //   this.selectIndex = -1;
      // }
      this.$emit(
        "input",
        !this.channelList[index]
          ? 0
          : this.channelList[index].TotalPrice
          ? this.channelList[index].TotalPrice
          : 0
      );
      this.$emit("select", {
        orderLogistics: this.channelList[index],
        logisticsType: this.channelList[index].TotalPrice ? 301 : 401,
      });
    },
    getList() {
      GetLogisticsPriceList({})
        .then((res) => {
          console.log("getLogisticsPriceList-res:", res);
          GetMyLogistics({})
            .then((res1) => {
              console.log("getMyLogistics-res1:", res1, [
                ...res1.data.rows,
                ...res.data.rows,
              ]);
              this.list = [...res1.data.rows, ...res.data.rows];
              this.$nextTick(() => {
                this.changeAddress(this.selectIndex);
              });
            })
            .catch((err) => {
              console.log("getMyLogistics-err:", err);
            });
        })
        .catch((err) => {
          console.log("getLogisticsPriceList-err:", err);
        });
    },
    changeAddress(index) {
      this.selectIndex = index;
      // console.log("change-", index);
      // console.log("this.list[index].price:", this.list[index].price);
      // if (index < this.list.length) {
      //   this.countryIndex = -1;
      // }
      console.log("this.list:", this.list, index);
      if (this.list.length) {
        if (this.list[index].price) {
          this.$emit("input", this.list[index].price);
          this.$emit("change", {
            logisticsPriceId: 0,
            logisticsType: 401,
          });
        } else if (this.list[index].id) {
          this.$emit("input", 0);
          this.$emit("change", {
            logisticsPriceId: this.list[index].id,
            logisticsType: 101,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.consignee {
  &-address {
    .sliver-tips {
      color: red;
    }
    .address {
      &-list {
        // overflow-x: scroll;
        // display: flex;
        // justify-content: flex-start;
        // flex-wrap: nowrap;
        // max-height: 210px;
        // margin-top: 15px;
        // margin-bottom: 15px;
        overflow: auto;
        background-color: #fff;
        font-size: 14px;
        .item-list {
          border-radius: 2px;
          box-shadow: 0 0 8px -5px;
          margin-bottom: 1%;
          padding: 1%;
          color: #333;
          .item-channel-name {
            font-weight: bold;
            font-size: 16px;
            color: #000;
          }
        }
      }
      &-card {
        flex-shrink: 0;
        width: 300px;
        height: 200px;
        border: 3px dashed rgba(0, 0, 0, 0.125);
        margin-right: 10px;

        .icon-selected {
          display: none;
          margin-right: 10px;
        }

        &.selected {
          border: 3px dashed #20c997;

          .icon-selected {
            display: initial;
          }
        }

        .badge {
          color: #fff;
          background-color: rgba(0, 0, 0, 0.4);
        }
        .logistic-text {
          margin-bottom: 2%;
        }
      }
    }
  }
}
.mail-free-msg {
  color: #ef2e22;
}
</style>