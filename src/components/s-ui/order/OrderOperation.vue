<template>
  <div>
    <el-button :icon="icon" :type="type" @click="open">{{ $t(name) }}</el-button>
    <el-drawer
      :title="$t('order.orderOperation')"
      :visible="editing"
      size="500px"
      close-on-press-escape
      @close="close"
    >
      <div class="drawer-form">
        <sui-form
          ref="form"
          :list="formList"
          :defaultdata="formData"
          @submit="submit"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import SuiForm from "@/components/s-ui/form";
export default {
  components: {
    SuiForm,
  },
  props: {
    name: {
      type: String,
    },
    icon: {
      type: String,
    },
    type: {
      type: String,
      default: 'primary',
    },
    fun: {
      type: Function,
    },
    ids: {
      type: Array,
    },
    callback: {
      type: Function
    }
  },
  data() {
    return {
      editing: false,
      formList: [
        {
          type: "uploadimage",
          name: "imgList",
          label: "order.attachment",
          max: 10,
        },
        {
          type: "input",
          name: "remark",
          label: "order.remark",
        },
      ],
      formData: {},
    };
  },
  methods: {
    open() {
      this.editing = true;
      this.$nextTick(() => {
        this.formData = {};
      });
    },
    close() {
      this.editing = false;
      this.formData = {};
      this.$refs["form"].resetFields();
    },
    submit(data) {
      // console.log("submit:", data);
      const fun = this.fun;
      fun({ ...data, orderIdList: this.ids })
        .then((res) => {
          console.log("fun-res:", res);
          this.$message({
            type: "success",
            message: this.$t("common.optSuccess"),
          });
          this.editing = false;
          this.callback();
        })
        .catch((err) => {
          console.log("fun-err:", err);
        });
    },
  },
};
</script>

<style>
.drawer-form {
  padding: 0 30px;
}
</style>