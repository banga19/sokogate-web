<template>
  <div class="offline-payment">
    <h4>
      <i class="sokogate icon-a-6xianxiazhifu icon" />{{
        $t("offinepayment.title")
      }}
    </h4>
    <el-timeline>
      <el-timeline-item
        :timestamp="$t('offinepayment.step1,title1')"
        placement="top"
        :type="attach ? 'primary' : ''"
        :icon="attach ? 'el-icon-check' : ''"
      >
        <div>
          {{ $t("offinepayment.step1,content1") }}
        </div>
        <b-card :title="$t('offinepayment.step1,title2')">
          <b-card-text>{{ $t("offinepayment.step1,content2") }}</b-card-text>
          <b-card-text>{{ $t("offinepayment.step1,content3") }}</b-card-text>
          <b-card-text>{{ $t("offinepayment.step1,content4") }}</b-card-text>
          <b>{{ $t("offinepayment.step1,content5") }}</b>
        </b-card>
      </el-timeline-item>
      <el-timeline-item
        :timestamp="$t('offinepayment.step2,title1')"
        placement="top"
        :type="attach ? 'primary' : ''"
        :icon="attach ? 'el-icon-check' : ''"
      >
        <div>
          {{ $t("offinepayment.step2,content1") }}
        </div>
        <!-- <upload-image-list v-model="imgList" /> -->
        <el-result
          v-if="attach"
          icon="warning"
          :title="$t('order.Uploadingvouchersuccess')"
          :subTitle="$t('order.Uploadingvouchersuccess')"
          style="width: 300px"
        >
          <!-- <template slot="icon">
            <i class="sokogate icon-shijian icon-waiting" />
          </template> -->
        </el-result>
        <sui-form
          v-else
          ref="form"
          :list="formList"
          :defaultdata="formData"
          @submit="submit"
        />
      </el-timeline-item>
      <el-timeline-item
        :timestamp="$t('offinepayment.step3,title1')"
        placement="top"
      >
      </el-timeline-item>
      <el-timeline-item
        :timestamp="$t('offinepayment.step4,title1')"
        placement="top"
      >
      </el-timeline-item>
    </el-timeline>
    <!-- <b-sidebar
      id="sidebar-right"
      :visible="editing"
      :title="$t('order.offlinepayment')"
      width="800px"
      right
      backdrop
      @hidden="close"
    >
    </b-sidebar> -->
    <!-- <b-button class="btn" variant="outline-primary" @click="handleOpen">
      <i class="sokogate icon-a-6xianxiazhifu icon" />
      {{ $t("order.offlinepayment") }}
    </b-button> -->
  </div>
</template>

<script>
import SuiForm from "@/components/s-ui/form";
import { PrepaymentAttach } from "@/utils/api";
export default {
  components: { SuiForm },
  props: {
    orderIdList: {
      type: Array,
    },
    attach: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      formList: [
        {
          type: "input",
          name: "id",
          hidden: true,
        },
        {
          type: "uploadimage",
          name: "imgList",
          label: "order.voucher1",
          max: 10,
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          type: "uploadimage",
          name: "test",
          label: "order.voucher2",
          rules: [
            {
              required: true,
            },
          ],
        },
      ],
      formData: {},
    };
  },
  methods: {
    submit(data) {
      // console.log(data);
      PrepaymentAttach({
        ...data,
        orderIdList: this.orderIdList,
        remark: "",
        payMethod: 111,
      })
        .then((res) => {
          console.log(res, "PrepaymentAttach-res");
          this.$emit("onFinish");
        })
        .catch((err) => {
          console.log(err, "PrepaymentAttach-err");
        });
      // addAddress(data)
      //   .then((res) => {
      //     console.log("addAddress-res:", res);
      //     this.close();
      //     this.$emit("onFinish");
      //   })
      //   .catch((err) => {
      //     console.log("addAddress-err:", err);
      //   });
    },
  },
};
</script>

<style lang="scss">
.offline {
  &-payment {
    .tips {
      color: #ef2e22;
    }
    .btn-outline-primary.btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border-color: #ef2e22;
      color: #ef2e22;
      flex-direction: column;

      &::active {
        color: #fff;
        background-color: #ef2e22;
      }

      &:hover {
        color: #fff;
        background-color: #ef2e22;
      }
    }

    .icon {
      font-size: 48px;
      margin-right: 10px;
    }

    b {
      color: #ef2e22;
    }
  }
}
</style>