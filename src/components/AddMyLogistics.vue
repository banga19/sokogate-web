<template>
  <div>
    <b-sidebar
      id="sidebar-right"
      :visible="editing"
      :title="$t(name)"
      width="500px"
      right
      backdrop
      @hidden="close"
    >
      <template #header-close>
        <b-button variant="outline-danger">{{ $t("common.cancel") }}</b-button>
      </template>
      <div class="form-wrap" v-if="editing">
        <sui-form
          ref="form"
          :list="formList"
          :defaultdata="formData"
          @submit="submit"
        />
      </div>
    </b-sidebar>
    <el-button type="primary" icon="el-icon-plus" plain @click="handleOpen()">
      {{ $t("order.addMyLogistics") }}
    </el-button>
  </div>
</template>

<script>
import SuiForm from "@/components/s-ui/form";
import { AddMyLogistics } from "@/utils/api";
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
          name: "logisticsName",
          label: "order.logisticsName",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          name: "contactName",
          label: "order.contactName",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          name: "phone",
          label: "order.phone",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          type: "textarea",
          name: "address",
          label: "order.address",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          type: "textarea",
          name: "remark",
          label: "order.remark",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          type: "uploadimage",
          name: "cardImg",
          label: "order.cardImg",
        },
      ],
      formData: {},
    };
  },
  methods: {
    // 打开弹窗
    handleOpen() {
      this.editing = true;
    },
    submit(data) {
      // console.log(data);
      AddMyLogistics(data)
        .then((res) => {
          console.log("addUserLogistics-res:", res);
          this.close();
          this.$emit("onFinish");
        })
        .catch((err) => {
          console.log("addUserLogistics-err:", err);
        });
    },
    close() {
      this.editing = false;
      this.formData = {};
      this.$refs["form"].resetFields();
    },
    edit(rowData) {
      console.log("edit-rowData:", rowData);
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