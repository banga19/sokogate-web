<template>
  <div class="center-nav">
    <b-card :title="$t('menuitems.account.All functions')" tag="article">
      <b-nav vertical>
        <b-nav-item v-for="(item, index) in list" :key="`nav-${index}`">
          <i
            class="sokogate hd-icon"
            :class="item.icon"
            :style="{ color: item.color }"
          />
          <div class="bd-name" @click="$router.push({ path: `${item.path}` })">
            <span class="ft-name">{{ $t(item.name) }}</span>
            <i class="sokogate icon-a-Path172 ft-icon"></i>
          </div>
        </b-nav-item>
      </b-nav>
    </b-card>
  </div>
</template>


<script>
// 个人中心的卡片
export default {
  data() {
    return {
      list: [
        {
          name: "account.Address",
          icon: "icon-Frame-8",
          color: "red",
          path: "/v2/personal-center/address-management",
        },
        {
          name: "account.Logistics",
          icon: "icon-Frame-8",
          color: "red",
          path: "/v2/personal-center/logistics-management",
        },
        {
          name: "account.SHOPPING",
          icon: "icon-Frame",
          color: "#44D7C8",
          path: "/v2/shopping-cart",
        },
        {
          name: "account.COLLECTION",
          icon: "icon-Vector-11",
          color: "#EB665D",
          path: "/v2/collection/collection",
        },
        {
          name: "account.COUPON",
          icon: "icon-Vector-21",
          color: "#F2A235",
          path: "/v2/personal-center/coupon",
        },
        {
          name: "account.EVALUATION",
          icon: "icon-Vector-31",
          color: "#44D7C8",
          path: "/v2/personal-center/evaluation",
        },
        {
          name: "account.Inquiry",
          icon: "icon-Vector-41",
          color: "#EB665D",
          path: "/v2/personal-center/inquiry",
        },
        {
          name: "account.REFUND",
          icon: "icon-Vector-3",
          color: "#5CABE5",
          path: "/v2/personal-center/refund",
        },
        {
          name: "account.SETTINGS",
          icon: "icon-Vector-4",
          color: "#F2A235",
          path: "/v2/personal-center/account",
        },
      ],
    };
  },
  mounted() {
    // console.log(this.list);
  },
};
</script>



<style lang="scss">
.center-nav {
  margin-bottom: 30px;
  .card-body {
    border-radius: 30px;
    .card-title {
      font-size: 18px;
      line-height: 36px;
      border-bottom: 1px solid #f2f2f2;
    }
    .nav {
      .nav-item {
        cursor: pointer;
        .nav-link {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          margin: 0;
          line-height: 18px;
          color: #333;

          .bd-name {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            .ft-name {
              color: #333;
              font-size: 12px;
              text-transform: uppercase;

              &:visited {
                color: red;
              }
              &:hover {
                color: red;
              }
            }
            .ft-icon {
              font-size: 12px;
              flex-shrink: 0;
              &:hover {
                font-size: 20px;
              }
            }
          }

          .hd-icon {
            height: 15px;
            width: 15px;
            flex-shrink: 0;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>