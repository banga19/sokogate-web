<template>
  <div>
    <div class="shipping-list" v-if="list && list.length">
      <!-- {{ list }} -->
      <el-row class="item-list">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="6"> {{ $t("shipping.transplan") }} </el-col>
        <el-col :span="4"> {{ $t("shipping.timelimit") }} </el-col>
        <el-col :span="4"> {{ $t("shipping.price") }} </el-col>
        <el-col :span="5"> {{ $t("shipping.totalprice") }}</el-col>
      </el-row>
      <el-row
        v-for="(item, index) in list"
        :key="`shipping-${index}`"
        class="item-list"
      >
        <el-col :span="7">
          <el-checkbox-group v-model="checkedGroup">
            <el-checkbox @change="changeCountry(index)" :label="index">
              <!-- {{
              item.ChannelName
            }} -->
              <sui-text-trans
                :text="item.ChannelName"
                :trans-map="item.translateMap"
              />
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="4"> {{ item.Period }}{{ $t("shipping.day") }} </el-col>
        <el-col :span="4">
          <sui-product-price
            :value="item.Price * 100"
            :form="
              item.ChannelType === 0 ? 'CNY' : item.store === 1 ? 'USD' : 'CNY'
            "
            color="#000"
          />/KG</el-col
        >
        <el-col :span="5">
          <sui-product-price
            :value="item.TotalPrice * 100"
            :form="
              item.ChannelType === 0 ? 'CNY' : item.store === 1 ? 'USD' : 'CNY'
            "
            color="#000"
        /></el-col>
      </el-row>

      <!-- <div class="address-list">
        <template v-for="item in list">
          <b-card :key="item.id" class="address-card selected">
            <b-card-text>
              {{ $t("shipping.transplan") }}&nbsp;&nbsp;{{ item.ChannelName }}
              {{ $t("shipping.channelname") }}:{{ item.ModeCode }}
              {{ $t("shipping.startcityName") }}:{{ item.StartCityName }}
            </b-card-text>
            <b-card-text
              >{{ $t("shipping.timelimit") }}&nbsp;&nbsp;{{ item.Period
              }}{{ $t("shipping.day") }}</b-card-text
            >
            <b-card-text>
              {{ $t("shipping.trialprice") }}&nbsp;&nbsp;{{
                $t("shipping.price")
              }}:￥{{ item.Price }}/KG {{ $t("shipping.totalprice") }}:￥{{
                item.TotalPrice
              }}
            </b-card-text>
          </b-card>
        </template>
      </div> -->
    </div>
  </div>
</template>

<script>
import SuiProductPrice from "@/components/product/Price";
import SuiTextTrans from "@/components/s-ui/info/text_trans";

export default {
  components: { SuiProductPrice, SuiTextTrans },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      current: 0,
      checkedGroup: [0],
    };
  },
  methods: {
    changeCountry(index) {
      //   console.log("changeCountry-index", index);
      this.checkedGroup = [];
      this.checkedGroup.push(index);
      this.$emit("changeCountry", index);
    },
  },
};
</script>

<style lang="scss">
.shipping-list {
  overflow: auto;
  background-color: #fff;
  font-size: 14px;
  .item-list {
    border-radius: 2px;
    box-shadow: 0 5px 0px -4px rgba(0, 0, 0, 0.125);
    margin-bottom: 1%;
    padding: 1%;
    color: #333;
    .item-channel-name {
      font-weight: bold;
      font-size: 16px;
      color: #000;
    }
  }
  .address {
    &-list {
      // overflow-x: scroll;
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      max-height: 210px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    &-card {
      flex-shrink: 0;
      width: 300px;
      height: 200px;
      // border: 3px dashed rgba(0, 0, 0, 0.125);
      margin-right: 10px;

      .icon-selected {
        display: none;
        margin-right: 10px;
      }

      &.selected {
        // border: 3px dashed rgba(255, 10, 10, 0.5);
        background: #e1e1e1;

        .icon-selected {
          display: initial;
        }
      }

      .badge {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
  }
}
</style>