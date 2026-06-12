<template>
  <b-container class="account-page">
    <div v-title :data-title="$t('menuitems.account.settings')">
      <Breadcrumb :items="items" />

      <b-row>
        <b-col cols="12" md="4">
          <Card />
        </b-col>

        <b-col cols="12" md="8">
          <!-- account开始 -->
          <b-row>
            <b-col cols="12">
              <div class="bd-col">
                <Icon iconClass="Frame21"></Icon>
                <card-group :header="$t('account.SETTINGS')">
                  <!-- <i class="sokogate icon-Frame21 iconimg"></i> -->

                  <b-card no-body>
                    <b-tabs v-model="tabIndex" card>
                      <b-tab :title="$t('settings.personal')">
                        <add-userinfo></add-userinfo>
                      </b-tab>
                      <b-tab :title="$t('settings.security')">
                        <div class="info-box">
                          <b-nav vertical class="info-nav">
                            <b-nav-item class="info-item"
                              >{{ $t("settings.mailbox") }}:
                              {{ currentUser.email }}
                            </b-nav-item>
                            <b-nav-item class="info-item" style="height: 30px"
                              >{{ $t("settings.loginPass") }}:
                              {{ currentUser.password || "******" }}
                              <div class="modify" @click="changePassword">
                                <h5 class="modify-box">
                                  {{ $t("settings.modify") }}
                                </h5>
                              </div>
                            </b-nav-item>
                            <b-nav-item
                              v-show="!show"
                              class="info-item"
                              style="height: 30px"
                              >{{ $t("settings.newpassword") }}:
                              <input type="text" name="" id="" />
                              <div class="modify" @click="confirmPassword">
                                <h5 class="modify-box">
                                  {{ $t("settings.confirmPassword") }}
                                </h5>
                              </div>
                            </b-nav-item>

                            <b-nav-item class="info-item"
                              >{{ $t("settings.phone") }}:
                              {{ currentUser.mobile }}
                            </b-nav-item>
                          </b-nav>
                        </div>
                      </b-tab>
                    </b-tabs>
                  </b-card>
                </card-group>
              </div>
            </b-col>
          </b-row>
          <!-- account结束 -->
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>



<script>
import AddUserinfo from "@/components/AddUserinfo.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Card from "@/components/Card.vue";
import CardGroup from "@/components/CardGroup.vue";
import Icon from "@/components/Icon";
export default {
  components: { Breadcrumb, Card, CardGroup, AddUserinfo, Icon },
  data() {
    return {
      show: true,
      items: [
        {
          text: this.$t("index.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.account.center"),
          to: { name: "Personal Center" },
        },
        {
          text: this.$t("menuitems.account.settings"),
          active: true,
        },
      ],
      infoList: [],
      selected: [],
      tabIndex: 0,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  methods: {
    changePassword() {
      this.show = !this.show;
    },
    confirmPassword() {
      console.log("确认修改密码");
    },
  },
  mounted() {},
};
</script>


<style lang="scss">
.account-page {
  position: relative;
  .row {
    margin-bottom: 30px;
    .bd-col {
      margin-top: 0;

      .tabs {
        .card-header {
          .nav {
            .nav-item {
              .nav-link {
                background-color: transparent;
                color: #b2b2b2;
              }
              .active {
                border-color: #fff #fff #000 #fff;
                color: #000;
              }
            }
          }
        }
      }

      .info-box {
        .info-nav {
          .info-item {
            font-size: 13px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            line-height: 15px;

            .modify {
              .modify-box {
                font-size: 13px;
                font-family: Roboto-Regular, Roboto;
                font-weight: 400;
                color: #ef2e22;
                margin: -3% 0 0 50%;
              }
            }
            .info-phone {
              display: flex;
              flex-direction: column;
              margin: -2% 0 0 21%;
            }
            .nav-link {
              color: #000000;
            }
          }
        }
      }

      .settings-conent {
        .my-row {
          .preservationBtn {
            background: #ef2e22;
            font-size: 15px;
            font-weight: 500;
            color: #ffffff;
          }

          .changeAvatar {
            .avatarinfo {
              font-size: 10px;
              font-weight: 400;
              color: #ef2e22;
              line-height: 70px;
            }
          }
          .inputname {
            line-height: 38px;
            font-size: 13px;
            font-weight: 400;
            color: #000000;
            line-height: 15px;
          }

          .avatar-box {
            width: 70px;
            height: 70px;
            border-radius: 0px 0px 0px 0px;
            opacity: 1;
            .avatar-img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>