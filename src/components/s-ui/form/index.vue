<template>
  <el-form
    :inline="inline"
    :model="data"
    status-icon
    :rules="rules"
    label-position="top"
    :validate-on-rule-change="false"
    ref="ruleForm"
    v-loading="loading"
  >
    <template v-for="(item, index) in list">
      <el-divider
        v-if="item.type === 'title'"
        content-position="left"
        :key="`key_${index}`"
        >{{ $t(item.label) }}</el-divider
      >
      <el-form-item
        v-else
        v-show="!hiddenNameList.includes(item.name)"
        :prop="item.name"
        :label="$t(item.label)"
        :key="`key_${index}`"
      >
        <template v-if="item.type === 'mobile'">
          <el-col :span="9">
            <el-select v-model="data.phoneCode" filterable>
              <el-option
                v-for="item in phoneCodeJson"
                :key="item.id"
                :label="
                  /*$t('categorys.' + item.nicename)很多国家名称没对称，延后处理*/ item.nicename +
                  ' +' +
                  item.phonecode
                "
                :value="item.phonecode"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="14">
            <el-input
              v-model.trim="data[item.name]"
              autocomplete="autocomplete"
              style="margin-left: 10px"
            ></el-input>
          </el-col>
        </template>
        <template v-else-if="item.type === 'uploadimage'">
          <upload-image-list v-model="data[item.name]" :item="item" />
        </template>
        <template v-else-if="item.type === 'uploadimagenotoken'">
          <upload-image-list-notoken v-model="data[item.name]" :item="item" />
        </template>
        <template v-else-if="item.type === 'radio'">
          <el-radio-group
            v-model="data[item.name]"
            @change="onChange($event, item.setHidden)"
          >
            <el-radio
              v-for="(rangeItem, rangeIndex) in item.range"
              :key="`rangeIndex-${rangeIndex}`"
              :label="rangeItem.value"
            >
              <i
                v-if="rangeItem.icon"
                class="sokogate"
                :class="rangeItem.icon"
              />
              {{ $t(rangeItem.label) }}
            </el-radio>
          </el-radio-group>
        </template>
        <template v-else-if="item.type === 'select'">
          <el-col>
            <el-select
              v-model="data[item.name]"
              :placeholder="$t('common.selectPlaceholder')"
              autocomplete="autocomplete"
            >
              <el-option
                v-for="rangeItem in item.range"
                :key="rangeItem.value"
                :label="$t(rangeItem.label)"
                :value="rangeItem.value"
                >{{ $t(rangeItem.label) }}</el-option
              >
            </el-select>
          </el-col>
        </template>
        <template v-else-if="!!components[item.type]">
          <component
            v-bind:is="components[item.type]"
            v-model="data[item.name]"
            :formData="data"
          ></component>
        </template>
        <el-col v-else>
          <el-input
            v-if="item.type === 'password'"
            :type="item.type"
            :placeholder="$t(item.label)"
            v-model.trim="data[item.name]"
            autocomplete="autocomplete"
            :show-password="true"
          ></el-input>
          <el-input
            v-else-if="item.type === 'mail'"
            :type="item.type"
            :placeholder="$t(item.label)"
            v-model.trim="data[item.name]"
            autocomplete="autocomplete"
          ></el-input>
          <el-input
            v-else-if="item.type === 'number'"
            :type="item.type"
            :placeholder="$t(item.label)"
            v-model.number="data[item.name]"
            autocomplete="autocomplete"
          ></el-input>
          <el-input
            v-else
            :type="item.type"
            :placeholder="$t(item.label)"
            v-model="data[item.name]"
            autocomplete="autocomplete"
          ></el-input>
        </el-col>
      </el-form-item>
    </template>
    <el-form-item class="form-item-flex">
      <el-button type="primary" @click="submitForm('ruleForm')">
        {{ $t(submitTitle) }}
      </el-button>
      <el-button v-if="showReset" @click="resetAndSubmit('ruleForm')">
        {{ $t("common.reset") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import phoneCodeJson from "../../../../static/phonecode.json";
import { metadata, PhoneNumberUtil } from "google-libphonenumber";
const phoneUtil = PhoneNumberUtil.getInstance();
import CountrySelect from "@/components/s-ui/form/CountrySelect";
import UploadImageList from "@/components/s-ui/form/UploadImageList";
// import CategoryCascader from "@/components/s-ui/form/CategoryCascader";
// import StoreSelect from "@/components/s-ui/form/StoreSelect";
import EmailVerifyCodeInput from "@/components/s-ui/form/EmailVerifyCodeInput";
import UploadImageListNotoken from "@/components/s-ui/form/UploadImageListNotoken";
import ModileVerifyCodeInput from "@/components/s-ui/form/ModileVerifyCodeInput";
// import CitySelect from "@/components/s-ui/form/CitySelect";
import CityCascader from "@/components/s-ui/form/CityCascader";
import BindModileVerifyCodeInput from "@/components/s-ui/form/BindModileVerifyCodeInput";
import BindEmailVerifyCodeInput from "@/components/s-ui/form/BindEmailVerifyCodeInput";
import CountryListSelect from "@/components/s-ui/form/CountryListSelect";
import CityListCascader from "@/components/s-ui/form/CityListCascader";
import PhoneorEmailInput from "@/components/s-ui/form/PhoneorEmailInput";
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultdata: {
      type: Object,
      default() {
        return {};
      },
    },
    submitTitle: {
      type: String,
      default: "common.submit",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CountrySelect,
    UploadImageList,
    //   CategoryCascader,
    //   StoreSelect,
    EmailVerifyCodeInput,
    UploadImageListNotoken,
    ModileVerifyCodeInput,
    // CitySelect,
    CityCascader,
    BindModileVerifyCodeInput,
    BindEmailVerifyCodeInput,
    CountryListSelect,
    CityListCascader,
    PhoneorEmailInput,
  },
  data() {
    return {
      phoneCodeJson: [],
      category: [],
      components: {
        country: CountrySelect,
        //   category: CategoryCascader,
        //   store: StoreSelect,
        code: EmailVerifyCodeInput,
        modilecode: ModileVerifyCodeInput,
        // city: CitySelect,
        city: CityCascader,
        bindmodile: BindModileVerifyCodeInput,
        bindemail: BindEmailVerifyCodeInput,
        countrylist: CountryListSelect,
        citylist: CityListCascader,
        phoneoremail: PhoneorEmailInput,
      },
      data: this.defaultdata,
      customHiddenNameList: [],
    };
  },
  created() {
    this.phoneCodeJson = phoneCodeJson;
    document.onkeydown = (e) => {
      e = window.event || e;
      if (e.code == "Enter" || e.code == "enter") {
        this.submitForm();
      }
    };
    this.initSetHidden();
  },
  computed: {
    hiddenNameList() {
      const propsHiddenNameList = this.list
        .filter((v) => v.hidden)
        .map((v) => v.name);
      // console.log("propsHiddenNameList:", propsHiddenNameList);
      return [...propsHiddenNameList, ...this.customHiddenNameList];
    },
    rules() {
      // 验证身份证号正则
      // ('xxx' is assigned a value but never used 解决eslint的验证语法)
      // eslint-disable-next-line no-unused-vars
      var validateidCard = (rule, value, callback) => {
        if (value === "") {
          callback(new Error());
        } else {
          // 18位的身份证
          let _IDRe18 =
            /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

          if (_IDRe18.test(value)) {
            callback();
          } else {
            callback(new Error());
          }
        }
      };
      // 验证手机正则
      // eslint-disable-next-line no-unused-vars
      var validateGlobalMobile = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error());
        }
        const number = phoneUtil.parseAndKeepRawInput(
          value,
          metadata.countryCodeToRegionCodeMap[this.data.phoneCode][0]
        );
        const isValite = phoneUtil.isValidNumber(number);
        if (isValite) {
          callback();
        } else {
          callback(new Error());
        }
      };
      // 输入密码验证
      // eslint-disable-next-line no-unused-vars
      var validatePass = (rule, value, callback) => {
        if (this.data.confirmpassword !== "") {
          this.$refs.ruleForm.validateField("confirmpassword");
        }
        callback();
      };
      // 两次输入密码验证
      // eslint-disable-next-line no-unused-vars
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error());
        } else if (value !== this.data.password) {
          callback(new Error());
        } else {
          callback();
        }
      };
      return this.list
        .filter((v) => v.rules && !this.hiddenNameList.includes(v.name))
        .reduce(
          (a, v) => ({
            ...a,
            [v.name]: v.rules.map((r) => {
              const validator = r.eval && eval(r.eval);
              return {
                ...r,
                validator,
                message: r.message
                  ? this.$t(r.message)
                  : `${this.$t(v.label)}${this.$t("common.isreq")}`,
                trigger: Object.prototype.hasOwnProperty.call(r, "trigger")
                  ? r.trigger
                  : "blur",
              };
            }),
          }),
          {}
        );
    },
    showReset() {
      return !!this.$listeners["reset"];
    },
  },
  methods: {
    initSetHidden() {
      this.list.forEach((item) => {
        if (item.setHidden && this.data[item.name]) {
          this.onChange(this.data[item.name], item.setHidden);
        }
      });
    },

    onChange(value, m) {
      if (!this.$utils.isEmpty(value) && m) {
        const [name, targetValue, action] = m;
        let selectArray = [];
        // 判断是否是数组 是数组就放入新数组中并对list隐藏
        const setShow = targetValue !== value && !action; // 所选值不等于目标值，设置为显示
        if (name instanceof Array) {
          selectArray = name;
        } else {
          selectArray = [name];
        }

        if (setShow) {
          // 显示，就把所有name从隐藏列表中去掉
          this.customHiddenNameList = this.customHiddenNameList.filter(
            (val) => selectArray.indexOf(val) === -1 // 返回不在列表中的name
          );
        } else {
          // 隐藏，就把所有name加入到隐藏列表中
          this.customHiddenNameList = Array.from(
            new Set([...this.customHiddenNameList, ...selectArray])
          );
        }
        // console.log(
        //   "name:",
        //   name,
        //   "targetValue:",
        //   targetValue,
        //   "value:",
        //   value,
        //   "action:",
        //   action,
        //   this.customHiddenNameList
        // );
        //     const [name, targetValue, action] = m;
        //     const nameItem = this.list.find((v) => v.name === name);
        //     // console.log("nameItem:", nameItem);
        //     const nameItemIndex = this.list.indexOf(nameItem);
        //     // console.log("nameItemIndex:", nameItemIndex);
        //     this.$set(this.list, nameItemIndex, {
        //       ...this.list[nameItemIndex],
        //       hidden: targetValue === value ? !!action : !action,
        //     });
      }
    },

    submitForm() {
      // console.log(this.data);
      this.$refs["ruleForm"].validate((valid, Object) => {
        console.log("Object:", Object);
        if (valid) {
          this.$emit("submit", this.data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    setForm(data) {
      // console.log("setForm:", data);
      var newData = JSON.parse(JSON.stringify(data));
      for (const key in newData) {
        if (!Object.hasOwn(newData, key)) continue;
        this.$set(this.data, key, newData[key])
      }
    },

    resetFields() {
      this.$refs.ruleForm.resetFields();
    },

    resetAndSubmit(formName) {
      this.$refs[formName].resetFields();
      this.$emit("submit", this.data);
    },
  },
};
</script>

<style lang="scss">
.el-form--label-top .el-form-item__label {
  padding: 0;
  margin: 0;
}
.el-select {
  display: block;
}
.form-item-flex {
  display: block;

  .el-form-item__content {
    display: flex;

    .el-button {
      flex-grow: 1;
    }
  }
}
</style>
