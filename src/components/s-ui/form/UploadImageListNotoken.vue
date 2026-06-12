<template>
  <div class="upload-image-list">
    <template v-if="value">
      <el-dropdown
        class="upload-image-list-item"
        v-for="(img, imgIndex) in item.max ? value : [value]"
        :key="`upload-image-${imgIndex}`"
        placement="right"
        @command="tapUploadDelete(item.name, item, imgIndex)"
      >
        <el-image
          :src="`${img}?x-oss-process=style/w256`"
          :preview-src-list="item.max ? value : [value]"
          class="imgbg"
          fit="contain"
        ></el-image>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-delete">{{
            $t("common.delete")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-if="(item.max && value && item.max > value.length) || !!!value">
      <material-selector
        v-if="item.mode === 'material'"
        :count="1"
        type="image"
        @receiver="onUploadSuccess($event, item)"
      >
        <template v-slot:custom-open-button>
          <div class="el-upload el-upload--picture-card" style="height: 120px">
            <i class="el-icon-plus"></i>
            <i class="el-icon-picture-outline"></i>
          </div>
        </template>
      </material-selector>
      <upload-image-notoken v-else @onsuccess="onUploadSuccess($event, item)" />
    </template>
  </div>
</template>

<script>
// import MaterialSelector from "@/components/MaterialSelector";
import UploadImageNotoken from "@/components/UploadImageNotoken";

export default {
  props: {
    value: {
      type: [Array, String],
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    //   MaterialSelector,
    UploadImageNotoken,
  },
  methods: {
    onUploadSuccess(value, item) {
      // console.log("onUploadSuccess:", item, value);
      if (item.max) {
        const newValue = [...(this.value || []), value.filename];
        // console.log("newValue:", newValue);
        this.$emit("input", newValue);
      } else {
        this.$emit("input", value.filename);
      }
    },

    tapUploadDelete(name, item, index) {
      if (item.max) {
        const newValue = this.value;
        newValue.splice(index, 1);
        // console.log("newValue:", newValue);
        this.$emit("input", newValue);
      } else {
        this.$emit("input", "");
      }
    },
  },
};
</script>

<style lang="scss">
.upload-image-list {
  display: flex;
  flex-wrap: wrap;

  &-item {
    margin: 0 10px 10px 0;
  }

  .el-image {
    width: 360px;
    height: 180px;
  }
}
</style>