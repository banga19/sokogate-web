<template>
  <div class="offline-payment">
    <h4>{{ $t("order.payInCashGuidelines") }}</h4>
    <el-timeline>
      <el-timeline-item
        :timestamp="$t('order.payInCashDesc.row1')"
        placement="top"
        :type="attach ? 'primary' : ''"
        :icon="attach ? 'el-icon-check' : ''"
      >
        <p>{{ $t("order.payInCashDesc.row2") }}</p>
        <b-card
          :title="`Sokogate${$t('layout.china-office')}${$t('layout.contact')}`"
        >
          <b-card-text>{{ $t("order.phone") }}: +86 020 33972585</b-card-text>
          <b-card-text>Whatsapp: +86 18813759438</b-card-text>
          <b-card-text>
            Address: Room 4822, No. 372, Huanshi East Road, Yuexiu District,
            Guangzhou
          </b-card-text>
          <b-card-text>
            address: 广东省广州市越秀区环市东路372号正佳东方国际广场4822房
          </b-card-text>
        </b-card>
      </el-timeline-item>
      <el-timeline-item
        :timestamp="$t('order.payInCashDesc.row3')"
        placement="top"
        :type="attach ? 'primary' : ''"
        :icon="attach ? 'el-icon-check' : ''"
      >
        <p>
          {{ $t("order.payInCashDesc.row4") }}
        </p>
        <el-result
          v-if="attach"
          icon="success"
          :title="$t('order.payInCashDesc.row6')"
          :subTitle="$t('order.payInCashDesc.row7')"
          style="width: 300px"
        >
          <template slot="icon">
            <i class="sokogate icon-shijian icon-waiting" />
          </template>
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
        :timestamp="$t('order.payInCashDesc.row5')"
        placement="top"
      >
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import SuiForm from "@/components/s-ui/form";
import { addOrderAttach } from "@/utils/api";
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    attach: {
      type: Object,
      default: null,
    },
  },
  components: { SuiForm },
  data() {
    return {
      formList: [
        {
          type: "input",
          name: "id",
          hidden: true,
        },
        {
          type: "textarea",
          name: "remark",
          label: "order.message",
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
      addOrderAttach({
        orderIdList: this.list.map((v) => Number(v)),
        type: 101,
        ...data,
        payMethod: 101,
      })
        .then((res) => {
          console.log("addOrderAttach-res:", res);
          this.$emit("onFinish");
        })
        .catch((err) => {
          console.log("addOrderAttach-err:", err);
        });
    },
  },
};
</script>

<style lang="scss">
.offline {
  &-payment {
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

    b {
      color: #ef2e22;
    }
  }
}
</style>