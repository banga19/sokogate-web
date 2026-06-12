<template>
  <div>
    <!-- <el-dialog
      :title="`${$t(formData.id ? 'common.edit' : 'common.add')} ${$t(name)}`"
      :visible="editing"
      width="500px"
      close-on-click-modal
      close-on-press-escape
      @close="close"
    > -->
    <b-sidebar
      id="sidebar-right"
      :visible="editing"
      :title="`${$t(formData.id ? 'common.edit' : 'common.add')} ${$t(name)}`"
      width="500px"
      right
      backdrop
      @hidden="close"
    >
      <template #header-close>
        <b-button variant="outline-danger">{{ $t("common.cancel") }}</b-button>
      </template>
      <div class="form-wrap">
        <sui-form
          ref="form"
          :list="formList"
          :defaultdata="formData"
          @submit="submit"
        />
      </div>
    </b-sidebar>
    <!-- </el-dialog> -->
    <el-button type="primary" icon="el-icon-plus" plain @click="handleOpen()">
      {{ $t("order.addShippingAddress") }}
    </el-button>
  </div>
</template>

<script>
import SuiForm from "@/components/s-ui/form";
import { AddAddress, EditAddress } from "@/utils/api";
export default {
  components: { SuiForm },
  props: {
    name: {
      type: String,
      value: "",
    },
  },
  data() {
    return {
      editing: false,
      formList: [
        {
          type: "input",
          name: "id",
          hidden: true,
        },
        {
          name: "consignee",
          label: "order.consigneeName",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          type: "mobile",
          name: "phone",
          label: "common.mobile",
          rules: [
            {
              required: true,
              message: "common.mobilerequired",
              trigger: "blur",
            },
            {
              eval: "validateGlobalMobile",
              message: "common.mobileMatch",
              trigger: "blur",
            },
          ],
        },
        // {
        //   type: "country",
        //   name: "country",
        //   label: "order.country",
        //   rules: [
        //     {
        //       required: true,
        //     },
        //   ],
        // },
        {
          type: "countrylist",
          name: "countryId",
          label: "order.country",
          rules: [
            {
              required: true,
            },
          ],
        },
        // {
        //   type: "city",
        //   name: "city",
        //   label: "order.citycascader",
        //   rules: [
        //     {
        //       required: true,
        //     },
        //   ],
        // },
        {
          type: "citylist",
          name: "city",
          label: "order.citycascader",
          // rules: [
          //   {
          //     required: true,
          //   },
          // ],
        },
        // {
        //   name: "province",
        //   label: "order.province",
        //   rules: [
        //     {
        //       required: true,
        //     },
        //   ],
        // },
        // {
        //   name: "city",
        //   label: "order.city",
        //   rules: [
        //     {
        //       required: true,
        //     },
        //   ],
        // },
        // {
        //   name: "district",
        //   label: "order.district",
        //   rules: [
        //     {
        //       required: true,
        //     },
        //   ],
        // },
        {
          name: "postCode",
          label: "order.postalcode",
        },
        {
          type: "textarea",
          name: "detail",
          label: "order.detail",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          type: "radio",
          name: "isDefault",
          label: "common.default",
          rules: [{ required: true }],
          range: [
            {
              label: "common.yes",
              value: 1,
            },
            {
              label: "common.no",
              value: 0,
            },
          ],
        },
        {
          type: "input",
          name: "email",
          label: "common.email",
          rules: [
            {
              message: "common.emailFormatError",
              type: "email",
            },
          ],
        },
      ],
      formData: {},
    };
  },
  methods: {
    // 打开弹窗
    handleOpen(e) {
      this.editing = true;
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (e) {
          let dataList = {};
          dataList.email = currentUser.email;
          dataList.countryId = e;
          this.$store.commit("setcurrentCountry", e);
          this.$nextTick(() => {
          this.$refs["form"].setForm(dataList);
          });
      } else {
          let countryIpList = JSON.parse(localStorage.getItem("countryIpList"));
          let dataList = {};
          dataList.email = currentUser.email;
          dataList.countryId = countryIpList[0].id;
          this.$store.commit("setcurrentCountry", dataList.countryId);
          this.$nextTick(() => {
          this.$refs["form"].setForm(dataList);
          });
        }
    },
    submit(data) {
      console.log(data, 'datadatadata');
      data.province ? (data.province = data.city[0]) : "";
      if (Array.isArray(data.city)) {
        data.city ? (data.city = data.city[1]) : "";
      }
      if (data.id) {
        EditAddress(data)
        .then((res) => {
          console.log("EditAddress-res:", res);
          this.$emit("onFinish");
          this.close();
        })
        .catch((err) => {
          console.log("EditAddress-err:", err);
        });
      } else {
        AddAddress(data)
        .then((res) => {
          console.log("addAddress-res:", res);
          this.close();
          this.$emit("onFinish");
        })
        .catch((err) => {
          console.log("addAddress-err:", err);
        });
      }
    },
    close() {
      this.editing = false;
      this.formData = {};
      this.$refs["form"].resetFields();
    },
    edit(rowData) {
      // console.log("edit-rowData:", rowData);
      // this.formData = rowData;
      this.editing = true;
      this.$nextTick(() => {
        this.$refs["form"].setForm(rowData);
      });
    },
  },
};
</script>

<style>
.form-wrap {
  padding: 30px;
}
.b-sidebar.b-sidebar-right > .b-sidebar-header .close {
  border: 0;
  background: transparent;
}
</style>