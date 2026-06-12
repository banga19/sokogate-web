<template>
  <div class="starting-card-box">
    <el-skeleton :loading="loading" :count="count" class="skeleton-box">
      <template slot="template">
        <div class="skeleton-item-box">
          <el-skeleton-item variant="image" style="height: 240px" />
          <div style="padding: 14px">
            <el-skeleton-item variant="p" style="width: 50%" />
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
              "
            >
              <el-skeleton-item variant="text" style="width: 30%" />
              <el-skeleton-item variant="text" style="margin-left: 16px" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="list">
        <section class="card-col">
          <b-card
            class="card"
            @click="
              $router.push({
                name: 'Product details',
                query: { id: list.id },
              })
            "
          >
            <div class="card-cover">
              <div class="block" v-if="!list.img">
                <el-image></el-image>
              </div>
              <b-card-img
                v-else
                top
                :src="list.img + '?x-oss-process=style/w405h539'"
                alt="Image"
                class="starting-card-img"
              ></b-card-img>
            </div>
            <b-card-text class="starting-card-text">
              {{ list.spuName }}
            </b-card-text>
            <div class="starting-card-msg">
              <b-card-text class="starting-card-price">
                ${{ $utils.formatToDecimal(list.minPrice) }}
              </b-card-text>
              <b-card-text class="starting-card-rate">
                <el-rate disabled :value="list.orderView"></el-rate>
              </b-card-text>
            </div>
          </b-card>
        </section>
      </template>
    </el-skeleton>
  </div>
</template>



<script>
export default {
  props: {
    loading: {
      type: Boolean,
      value: true,
    },
    count: {
      type: Number,
      value: 1,
    },
    list: {
      type: Object,
      default() {
        return {};
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
.starting-card-box {
  // min-height: 700px;
  margin-bottom: 0 -10px;
  .skeleton-box {
    .el-skeleton {
      .skeleton-item-box {
        width: 100%;
        margin-bottom: 20px;
      }
    }
    .card-col {
      padding: 0 10px 16px;
      box-sizing: border-box;
      cursor: pointer;
      .card {
        margin-bottom: 5px;
        border: none;
        .card-body {
          padding: 0;
        }
        .card-cover {
          height: 0;
          cursor: pointer;
          padding-bottom: 133%;
          width: 100%;
          .starting-card-img {
            object-fit: contain;
            -webkit-user-drag: none;
            width: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
          }

          .block {
            text-align: center;
            padding-top: 65%;
          }
        }
      }
    }
  }
}

.starting-card-text {
  font-size: 12px;
  color: #303030;
  min-height: 22px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.starting-card-msg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  .starting-card-price {
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
    color: #303030;
    margin-bottom: 0;
  }
  .starting-card-rate {
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