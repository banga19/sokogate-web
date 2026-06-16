<template>
  <div class="startend-card-box">
    <section v-for="(item, index) in list" :key="index" class="card-col">
      <b-card
        @click="
          $router.push({
            name: 'Product details',
            query: { id: item.productId },
          })
        "
      >
        <div class="card-cover">
          <sui-image
            :src="item.gallery[0].img"
            cut="405h539"
            :lazy="true"
            fit="contain"
          />
        </div>
        <b-card-text class="startend-card-text">
          {{ item.name }}
        </b-card-text>
        <div class="startend-card-msg">
          <b-card-text class="startend-card-price">
           ${{ $utils.formatToDecimal(item.price) }}
          </b-card-text>
          <b-card-text class="startend-card-rate">
            <el-rate
              disabled
              disabled-void-color="#e2e2e2"
              v-model="item.value"
            ></el-rate>
          </b-card-text>
        </div>
      </b-card>
    </section>
  </div>
</template>



<script>
import SuiImage from "@/components/s-ui/media/Image";
export default {
  components: { SuiImage },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
};
</script>



<style lang="scss">
@use "@/style/_responsive.scss" as *;
.startend-card-box {
  margin-bottom: 0 -10px;
  display: flex;
  flex-wrap: wrap;
  .card-col {
    width: 25%;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 1%;
    cursor: pointer;
    .card {
      margin-bottom: 10px;
      border: none;
      .card-body {
        padding: 0;
      }
      .card-cover {
        height: 0;
        padding-bottom: 133%;
        .card-img-top {
          object-fit: contain;
          -webkit-user-drag: none;
        }
      }
    }
    @include mobile {
      width: 48%;
    }
    @include tabletLand {
      width: 33,33%;
    }
    @include tabletPro {
      width: 33,33%;
    }
    @include tablet {
      width: 25%;
    }
    @include laptop {
      width: 25%;
    }
    @include desktop {
      width: 20%;
    }
    @include largeScrenn {
      width: 16,66%;
    }
  }
}

.startend-card-text {
  margin-top: 1%;
  min-height: 21px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: 12px;
  color: #303030;
  margin-bottom: 0;
}

.startend-card-msg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .startend-card-price {
    flex-grow: 1;
    color: #000;
    font-weight: 900;
    margin-bottom: 0;
  }
  .startend-card-rate {
    flex-shrink: 0;

    .el-rate__icon {
      margin-right: 0;
      @include mobile {
        margin-right: -4px;
      }
    }
  }
}
</style>