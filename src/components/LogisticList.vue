<template>
  <div class="logistics-page">
    <sui-list
      ref="list"
      :fun="tableFun"
      :req="tableFunReq"
      @edit="edit"
      maxHeight="500"
    />
  </div>
</template>


<script>
import SuiList from "@/components/s-ui/list";

export default {
  components: { SuiList },
  props: {
    status: {
      type: Number,
      default: 0,
    },
    name: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tableFunReq: {
        status: this.status,
        type: this.type,
        pageSize: this.max || 10,
      },
    };
  },
  methods: {
    edit() {
      // console.log("edit");
    },
  },
};
</script>