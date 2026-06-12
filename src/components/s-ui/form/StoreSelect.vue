<template>
  <el-select
    :value="value"
    :placeholder="$t('common.selectPlaceholder')"
    autocomplete="autocomplete"
    filterable
    clearable
    @change="handleChange"
  >
    <el-option
      v-for="item in list"
      :key="item.label + item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
import { getStoreList } from "@/helper/api.js";

export default {
  props: {
    value: {
      default: "",
    },
  },

  data() {
    return {
      list: [],
    };
  },

  created() {
    this.getList();
  },

  methods: {
    getList() {
      getStoreList().then((res) => {
        // console.log("getStoreList-res:", res);
        this.list = res.data.rows.map((v) => {
          return {
            label: v.name,
            value: v._id,
          };
        });
      });
    },

    handleChange(e) {
      console.log('handleChange:', e);
      this.$emit("input", e);
    },
  },
};
</script>