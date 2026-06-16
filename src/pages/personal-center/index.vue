<template>

  <b-container class="account-page">
<div v-title :data-title="$t('menuitems.account.center')">
    <Breadcrumb :items="items" />

    <b-row>
      <b-col cols="12" md="4">
        <Card />
      </b-col>

      <b-col cols="12" md="8">
        <!-- information开始 -->
        <b-row v-if="currentUser">
          <b-col cols="12">
            <div class="bd-col">
              <card-text class="card-Item">
                <div class="hd-box">
                  <div class="bd-head">
                    <div class="head-user">
                      <div class="user-img" v-if="currentUser.img">
                        <el-avatar
                          src="HTTPS://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                        ></el-avatar>
                      </div>
                      <div class="user-img" v-else>
                        <img class="user-pic" :src="currentUser.img" alt="" />
                      </div>
                      <div class="user-name">{{ currentUser.email }}</div>
                    </div>
                    <div class="head-mess">
                      <h5 class="info">
                        <i class="sokogate icon-Frame1"></i
                        >{{ $t("account.information") }}
                      </h5>
                    </div>
                    <div class="head-bg"></div>
                  </div>
                  <div class="box-ft">
                    <div
                      class="item"
                      v-for="(item, index) in accountList"
                      :key="index"
                      :class="{ line: (index + 1) % 4 != 0 }"
                    >
                      <h5 class="pay-box">
                        {{ $t(item.name)
                        }}<span class="pay-count">({{ item.count }})</span>
                      </h5>
                    </div>
                  </div>
                </div>
              </card-text>
            </div>
          </b-col>
        </b-row>
        <!-- information结束 -->
        <!-- logistics开始 -->
        <b-row>
          <b-col cols="12">
            <div class="bd-col">
              <Icon iconClass="Vector5"></Icon>
              <card-group :header="$t('menuitems.account.center')" iconClass="Vector5">
                <order-list />

                <div class="bd-footbox">
                  <!-- <logistics-information></logistics-information> -->
                </div>
              </card-group>
            </div>
          </b-col>
        </b-row>
        <!-- logistics结束 -->
      </b-col>
    </b-row>
</div>
  </b-container>
</template>



<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Card from "@/components/Card.vue";
import CardText from "@/components/CardText.vue";
import CardGroup from "@/components/CardGroup.vue";
import OrderList from "@/components/s-ui/order/OrderList.vue";
import Icon from "@/components/Icon";
// import LogisticsInformation from "@/components/LogisticsInformation";
export default {
  components: {
    Breadcrumb,
    Card,
    CardText,
    CardGroup,
    OrderList,
    Icon,
    // LogisticsInformation,
  },
  data() {
    return {
      items: [
        {
          text: this.$t("index.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.account.center"),
          active: true,
        },
      ],
      accountList: [
        {
          name: "account.Payment",
          path: "",
          count: 0,
        },
        {
          name: "account.Shipment",
          path: "",
          count: 0,
        },
        {
          name: "account.Received",
          path: "",
          count: 0,
        },
        {
          name: "account.Refund",
          path: "",
          count: 0,
        },
      ],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  created() {},
};
</script>


<style lang="scss">
.account-page {
  .row {
    margin-bottom: 30px;
    .bd-col {
      margin-top: 0;
      .card-Item {
        padding: 0;
        .card-body {
          padding: 0;
          .hd-box {
            width: 100%;
            height: 181px;
            display: flex;
            flex-direction: column;
            // information开始
            .bd-head {
              background: #faf5f5;
              width: 100%;
              min-height: 104px;
              display: flex;
              justify-content: space-between;
              .head-user {
                flex: 1;
                height: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                .user-img {
                  flex-grow: 0;
                  width: 50px;
                  height: 50px;
                  // border: 1px solid #333;
                  // border-radius: 50%;
                  margin: 0 10%;
                  overflow: hidden;
                  .el-avatar {
                    display: block;
                    margin: auto;
                  }
                  .user-pic {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
                }
              }

              .head-mess {
                flex: 2;

                .info {
                  color: red;
                  font-size: 16px;
                  line-height: 113px;
                  text-align: center;
                  margin-bottom: 0;
                  cursor: pointer;
                }
              }

              .head-bg {
                flex: 1;
                background: url("HTTPS://oss.sokogate.com/image/aa38d9c118651204943f8cd06d6c9047,png");
                background-size: 80% 80%;
                background-repeat: no-repeat;
                background-position: 100% 0;
              }
            }

            .box-ft {
              background: #fff;
              flex-grow: 1;
              display: flex;
              justify-content: space-between;
              .line {
                border-right: 1px solid #ccc;
              }
              .item {
                flex: 1;
                margin: auto;

                .pay-box {
                  font-size: 14px;
                  text-align: center;
                  margin-bottom: 0 !important;
                  .pay-count {
                    color: red;
                    margin-left: 5px;
                  }
                }
              }
            }
          }
        }
      }
      // logistics开始
      .bd-footbox {
        border-top: 1px solid #000;
      }
    }
  }
}
</style>