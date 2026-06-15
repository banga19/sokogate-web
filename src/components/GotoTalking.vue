<template>
  <div class="go-to-talking-box" @click="gotodemo">
    <div class="customer-service">
      <i class="sokogate icon-kefu" />
      <span class="talking"> {{ $t("common.customerservice") }} </span>
    </div>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        :modal-append-to-body="true"
        :append-to-body="true"
        :visible.sync="dialogTableVisible"
        :show-close="false"
        :lock-scroll="false"
        center
        @close="goback"
        class="talking-room"
      >
        <div class="room-hd" slot="title">
          <div class="hd-back" @click="goback">
            <i class="el-icon-arrow-left"></i>
          </div>
          <img
            v-if="store.logo_url"
            :src="store.logo_url + '?x-oss-process=style/w64'"
            class="hd-logo"
            alt=""
          />
          <div class="hd-name">{{ storeName }}</div>
        </div>
        <div class="room-bd">
          <div id="msgBody">
            <div v-for="(item, index) in messageList" :key="index">
              <div v-if="item.toType == 101 ? true : false">
                <div style="text-align: center">
                  {{ $utils.formatDataTime(item.createAt) }}
                </div>
                <div style="float: right">
                  <p class="bd-msg">
                    <span class="bd-info">{{ item.content }}</span
                    ><el-avatar shape="square"> user </el-avatar>
                  </p>
                </div>
                <br style="clear: both" />
              </div>
              <div v-else>
                <div style="text-align: center">
                  {{ $utils.formatDataTime(item.createAt) }}
                </div>
                <div>
                  <p class="bd-msg">
                    <el-avatar shape="square" style="width: 50px">
                      vendor </el-avatar
                    ><span class="bd-infos">{{ item.content }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div id="msgFooter">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 3 }"
              v-model="inputMessage"
              @keyup.enter.native="sendMessage()"
              style="outline: none"
            ></el-input>
            <div>
              <el-button
                class="sendBnt"
                type="primary"
                @click="sendMessage()"
                round
                >发送</el-button
              >
            </div>
            <div v-show="false">
              <el-button
                class="sendBnt"
                type="primary"
                @click="getMessageList"
                round
                >获取消息纪录</el-button
              >
              <el-dialog
                :modal-append-to-body="true"
                :append-to-body="true"
                :visible.sync="innerVisible"
                :show-close="false"
                class="talking-room"
              >
                <div class="room-hd">
                  <div class="hd-back" @click="gobackinner">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <img
                    v-if="store.logo_url"
                    :src="store.logo_url + '?x-oss-process=style/w64'"
                    class="hd-logo"
                    alt=""
                  />
                  <div class="hd-name">{{ storeName }}</div>
                </div>
                <div class="room-bd">
                  <div id="msgBody">
                    <div v-for="(item, index) in messageList" :key="index">
                      <div v-if="item.toType == 101 ? true : false">
                        <div style="float: right">
                          <p class="bd-msg">
                            <span class="bd-info">{{ item.content }}</span
                            ><el-avatar shape="square"> user </el-avatar>
                          </p>
                        </div>
                        <br style="clear: both" />
                      </div>
                      <div v-else>
                        <div>
                          <p class="bd-msg">
                            <el-avatar shape="square" style="width: 50px">
                              vendor </el-avatar
                            ><span class="bd-infos">{{ item.content }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-dialog>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  RegisterEasemodUser,
  GetUserListbyStoreId,
  AddMyImChat,
  GetMyImChatList,
} from "@/utils/api";
import { conn } from "@/utils/WebIM.js";
//格式化时间
import { formatDate } from "@/utils";
var WebIM = window.WebIM;
export default {
  props: {
    store: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      dialogTableVisible: false,
      innerVisible: false,
      user: "", //自己应用下的用户id
      pwd: "123", //用户密码
      inputMessage: "",
      customerService: "",
      messageList: [], //消息
      bySelf: true,
    };
  },
  created() {
    if (localStorage.getItem("currentUser")) {
      this.user = JSON.parse(localStorage.getItem("currentUser")).userId;
    }
    document.onkeydown = (e) => {
      e = window.event || e;
      if (e.code == "Enter" || e.code == "enter") {
        this.sendMessage();
      }
    };
  },
  computed: {
    storeName() {
      return this.$props.store.storeName;
    },
  },
  methods: {
    //登陆
    loginIM() {
      var options = {
        user: this.user,
        pwd: this.pwd,
        appKey: WebIM.config.appkey,
        success: function (res) {
          console.log(res);
          // console.log("成功");
        },
        error: function (err) {
          console.log(err);
        },
      };
      conn.open(options);
      this.getMessage();
    },
    // 开启客服聊天
    gotodemo() {
      if (localStorage.getItem("currentUser")) {
        this.dialogTableVisible = true;
        // let userId = JSON.parse(localStorage.getItem("currentUser")).userId;
        RegisterEasemodUser().then((res) => {
          console.log("RegisterEasemodUser-res", res);
        });
        this.loginIM();
        this.getMyImChatList();
        this.getUserListbyStoreId();
      } else {
        this.dialogTableVisible = false;
        WebIM.conn.close();
        this.$router.push("/v2/login");
      }
    },
    // 得到客服id
    getUserListbyStoreId() {
      GetUserListbyStoreId({ storeId: this.$props.store.id }).then((res) => {
        this.customerService = res.data.rows[0].userId;
      });
    },
    //发送消息
    sendMessage() {
      if (!this.inputMessage || !this.inputMessage.replace(/&nbsp;|\s/g, "")) {
        this.$message.info(this.$t("common.Sendcontentcannotbeempty"));
        return;
      }
      let that = this;
      let contentMsg = that.inputMessage;
      let toID = this.customerService; //收信息用户id
      let id = conn.getUniqueId(); // 生成本地消息id
      let msg = new WebIM.message("txt", id); // 创建文本消息
      msg.set({
        msg: contentMsg, // 消息内容
        to: toID, // 接收消息对象（用户id）
        chatType: "singleChat", // 设置为单聊
        success: function (id, serverMsgId) {
          // console.log("成功发送消息");
          that.sendMessageSuccessful(contentMsg, toID, "txt", id, serverMsgId);
        },
        fail: function (e) {
          console.log("发送消息失败", e);
        },
      });
      conn.send(msg.body);
      // console.log(msg.body, "发送成功");
      that.inputMessage = null;
    },
    //成功发送消息，进行消息加入到聊天信息数组中
    sendMessageSuccessful(data, toID, type) {
      console.log("存储信息中》》》》》");
      let userMsg = {};
      userMsg.to = toID;
      userMsg.from = this.user;
      userMsg.content = data;
      userMsg.time = formatDate(
        new Date(new Date().getTime()),
        "yyyy-MM-dd hh:mm"
      );
      userMsg.msgType = type;
      // console.log(userMsg, "发消息啦");
      //存储信息
      this.messageList.push(userMsg);
      // console.log(this.messageList, "message", this.messageList[0].content);
      // 保存聊天记录
      AddMyImChat({
        storeId: this.$props.store.id,
        kefuId: this.$props.store.id, //客服
        content: this.messageList[this.messageList.length - 1].content,
        msgType: this.messageList[this.messageList.length - 1].msgType,
      }).then((res) => {
        console.log(res, "AddMyImChat");
        // 获取聊天记录
        this.getMyImChatList();
        // 自动滚动到最新消息那里
        this.getNewmsg();
      });
    },
    // 点击获取消息记录
    getMessageList() {
      this.innerVisible = true;
      this.getMyImChatList();
    },
    // 获取消息记录
    getMyImChatList() {
      GetMyImChatList({
        storeId: this.$props.store.id,
        page: 1,
        pageSize: 20,
      }).then((res) => {
        this.messageList =
          res.data.rows === null ? [] : res.data.rows.reverse();
        // console.log(this.messageList, "GetMyImChatList-res");
      });
    },
    // 集成收到文本信息方法
    getMessage() {
      let that = this;
      conn.listen({
        onOpened: function (message) {
          console.log("用户已上线", message); // 连接成功
        },
        onTextMessage: function (message) {
          // console.log("收到文本信息", message);
          let date = formatDate(
            new Date(new Date().getTime()),
            "yyyy-MM-dd hh:mm"
          );
          let value = {};
          // 普通文本信息
          value = {
            msgType: "text",
            content: message.data,
            to: message.to,
            from: message.from,
            time: date,
          };
          that.messageList.push(value); // 添加到聊天信息数组中
          // console.log("value", value);
        },
      });
    },
    // 退出客服聊天
    goback() {
      WebIM.conn.close();
      this.dialogTableVisible = false;
    },
    // 关闭聊天记录
    gobackinner() {
      this.innerVisible = false;
    },
    // 回到最新消息
    getNewmsg() {
      let msgBody = document.getElementById("msgBody");
      console.log(msgBody, msgBody.scrollTop, msgBody.scrollHeight, "msgBody");
      this.$nextTick(() => {
        msgBody.scrollTop = msgBody.scrollHeight;
      });
    },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;
.go-to-talking-box {
  position: fixed;
  right: 10px;
  bottom: 10%;
  width: 155px;
  height: 100px;
  border: 3px solid #ffeeee;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 999;
  .customer-service {
    display: flex;
    flex-direction: column;
    align-items: center;
    .sokogate {
      margin-bottom: 5%;
      font-size: 20px;
    }
    .talking {
      text-align: center;
      font-size: 16px;
    }
  }
}
.talking-room {
  .el-dialog {
    width: 20%;
    position: fixed;
    right: 5%;
    bottom: 0%;
    .el-dialog__header {
      padding-top: 0;
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding-top: 0;
    }
    .room-hd {
      height: 60px;
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .hd-back {
        font-size: 16px;
        color: #333;
        cursor: pointer;
      }
      .hd-logo {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        margin-left: 8px;
      }

      .hd-name {
        font-size: 16px;
        font-weight: normal;
        color: #333;
        text-align: center;
        margin: auto;
        margin-left: 8px;
      }
    }
    .room-bd {
      #msgBody {
        width: 100%;
        height: 500px;
        background: #f1f1f1;
        overflow: auto;
        .bd-msg {
          margin-top: 10px;
          padding: 0 10px 0 10px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .bd-info {
            max-width: 170px;
            border-radius: 4px;
            background: #ff6e6e;
            color: #f6f6f6;
            padding: 8px;
            display: inline-block;
            margin-right: 15px;
            position: relative;
            &::after {
              content: "";
              position: absolute;
              top: 50%;
              left: 100%;
              margin-top: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: transparent transparent transparent #ff6e6e;
            }
          }
          .bd-infos {
            max-width: 170px;
            border-radius: 4px;
            background: #ffffff;
            color: #000000;
            padding: 8px;
            display: inline-block;
            margin-left: 15px;
            position: relative;
            &::after {
              content: "";
              position: absolute;
              top: 50%;
              right: 100%;
              margin-top: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: transparent #ffffff transparent transparent;
            }
          }
        }
      }
      #msgFooter {
        margin-top: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .sendBnt {
          margin-left: 10px;
        }
      }
    }
    @include mobile {
      width: 75%;
    }
    @include tabletLand {
      width: 38%;
    }
    @include tabletPro {
      width: 42%;
    }
    @include tablet {
      width: 42%;
    }
    @include laptop {
      width: 30%;
    }
    @include desktop {
      width: 22%;
    }
    @include largeScrenn {
      width: 20%;
    }
  }
}
</style>