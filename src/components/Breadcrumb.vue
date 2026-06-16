<script>
export default {
  components: {},
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<template>
  <!-- Breadcrumb start -->
  <div class="row">
    <div class="col-12">
      <div class="breadcrumb">
        <b-breadcrumb :items="items" class="m-0"></b-breadcrumb>
      </div>
    </div>
  </div>
  <!-- Breadcrumb end -->
</template>


<style lang="scss">
.row {
  margin: 0;
  padding: 0;
  .breadcrumb {
    padding-top: 12px;
    background: #fff;
    .breadcrumb-item {
      a {
        text-decoration: none;
        color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
      }
      + .breadcrumb-item {
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: relative;
          right: 8px;
          bottom: -12px;
          border-left: 2px solid #999;
          border-bottom: 2px solid #999;
          transform: translate(0, -50%) rotate(-135deg);
        }
      }
    }
    .active {
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: relative;
        right: 8px;
        bottom: -12px;
        border-left: 2px solid #999;
        border-bottom: 2px solid #999;
        transform: translate(0, -50%) rotate(-135deg);
      }
      span {
        text-transform: capitalize;
        color: #000;
        font-size: 12px;
      }
    }
  }
}
</style>