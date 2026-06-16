<template>
  <div class="phone-email-box">
    <el-row v-if="show">
      <el-col :span="11">
        <el-select v-model="phoneCode" filterable>
          <el-option
            v-for="item in phoneCodeJson"
            :key="item.id"
            :label="
              /*$t('categorys.' + item.nicename)很多国家名称没对称, 延后处理*/ item.nicename +
              ' +' +
              item.phonecode
            "
            :value="item.phonecode"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-input
          v-model="blurValue"
          autocomplete="autocomplete"
          @blur="handleChange"
          style="margin-left: 10px"
        ></el-input>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-input
        :placeholder="$t('common.mailorphone')"
        v-model="blurValue"
        @blur="handleChange"
      >
      </el-input>
    </el-row>
  </div>
</template>

<script>
import phoneCodeJson from "../../../../static/phonecode.json";
import { metadata, PhoneNumberUtil } from "google-libphonenumber";
const phoneUtil = PhoneNumberUtil.getInstance();
export default {
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      // phoneCode: "China" + "+" + "86",
      phoneCode: "86",
      show: false,
      phoneCodeJson: [],
      blurValue: null
    };
  },
  created() {
    this.phoneCodeJson = phoneCodeJson;
  },
  // watch: {
  //   phoneoremail: function (newVal, oldVal) {
  //     console.log(newVal, oldVal, "newVal,oldVal");
  //     if (newVal === 0) {
  //       this.$store.commit("setphoneoremail", 1);
  //       this.show = true;
  //     }
  //   },
  //   deep: true,
  //   immediate: true,
  // },
  computed: {
    // phoneoremail() {
    //   // if (this.value.length < 3) {
    //   if (/@+/gi.test(this.value)) {
    //     console.log(this.value.length, "email");
    //     this.$store.commit("setphoneoremail", 2);
    //     return 2;
    //   } else {
    //     if (/^[1][2,3,4,5,6,7,8,9][0-9]{8}$/gi.test(this.value)) {
    //       this.$store.commit("setphoneoremail", 1);
    //       return 1;
    //     }
    //     // if (this.PhoneNumberParser(this.value, this.phoneCode)) {
    //     //   console.log("111");
    //     // }
    //     this.$store.commit("setphoneoremail", 0);
    //     return 0;
    //   }
    //   // }
    //   // throw new Error();
    // },
  },
  methods: {
    PhoneNumberParser(tel, code) {
      const number = phoneUtil.parseAndKeepRawInput(
        tel,
        metadata.countryCodeToRegionCodeMap[code]
      );
      return phoneUtil.isValidNumber(number);
    },
    handleChange(e) {
      let value = e.target.value;
      console.log(e.target.value);
      // console.log("handleChange", e.target.value, this.phoneoremail, this.phoneVaild);
      // if (this.phoneoremail === 1) {
      //   // value为手机号码
      //   this.show = true;
      // } else {
      //   this.show = false;
      // }
      if (/@+/gi.test(value)) {
        // console.log("邮箱");
        this.show = false;
        this.$store.commit("setphoneoremail", 2);
      } else if (value === "") {
        this.show = false;
      } else if(/^[1][2,3,4,5,6,7,8,9][0-9]{2,13}$/gi.test(value)){
        console.log("手机号");
        this.show = true;
        this.$store.commit("setphoneoremail", 1);
      } else {
        this.show = false;
        this.$store.commit("setphoneoremail", 2);
      }
      this.$emit("input", value);
    },
  },
};
</script>

<style lang="scss">
.phone-email-box {
  .el-input-group__prepend {
    background-color: #fff;
    .phone-prepend {
      color: #ef2e22;
    }
  }
}
</style>
