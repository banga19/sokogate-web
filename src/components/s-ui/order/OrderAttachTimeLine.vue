<template>
  <el-card class="order-attach">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in list"
        :key="index"
        size="large"
        icon="el-icon-check"
        :type="`primary`"
        :timestamp="`${$utils.formatDataTime(activity.createAt)}`"
        placement="top"
      >
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <p>
                <i class="el-icon-s-flag icon" />
                <span class="status">{{ statusText[activity.type] }}</span>
              </p>
            </template>
            <div class="attach-image-list">
              <el-image
                v-for="(url, index) in activity.imgList"
                class="imgbg"
                style="width: 100px; height: 100px"
                fit="contain"
                :src="url"
                :preview-src-list="activity.imgList"
                :key="`activity_${activity.id}_${index}`"
              >
              </el-image>
            </div>

            <p>
              <i class="el-icon-s-comment icon" />
              <span>{{ activity.remark }}</span>
            </p>
            <p v-if="activity.type">
              <span>
                <i class="icon" :class="cosplay(activity.type).icon" />
                {{ cosplay(activity.type).name }}
              </span>
            </p>
          </el-collapse-item>
        </el-collapse>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    statusText: function () {
      return this.$t("order.statusText");
    },
  },
  methods: {
    cosplay(type) {
      switch (type) {
        case 201:
        case 501:
          return { icon: "el-icon-s-custom", name: "Buyer" };
        case 301:
        case 601:
          return { icon: "el-icon-user-solid", name: "Admin" };
        case 401:
        case 701:
        case 1301:
          return { icon: "el-icon-s-shop", name: "Saler" };
        default:
          return {};
      }
    },
  },
};
</script>

<style lang="scss">
.order-attach {
  .icon {
    // color: #ef2e22;
    color: #409eff;
    padding-right: 3px;
  }
  .status {
    color: #666;
  }
  .attach-image-list {
    display: flex;
    & > * {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
}

.el-collapse,
.el-collapse-item__header,
.el-collapse-item__wrap {
  border: 0;
}

.el-collapse-item__content {
  padding-bottom: 0;
}
</style>