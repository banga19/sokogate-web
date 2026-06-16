<template>
  <div class="info-box">
    <b-row class="line-bottom">
      <!-- {{erMap}} -->
      <b-col cols="12">
        <div class="title">
          <sui-text-trans :text="spu.spuName" :trans-map="spu.translationMap" />
        </div>
        <div class="flex-box">
          <star />
          <div class="info-text">297 {{ $t("productDetail.Reviews") }}</div>
          <div class="info-text">673 {{ $t("productDetail.Buyers") }}</div>
          <div class="info-text">{{ spu.pv }} {{ $t("productDetail.PV") }}</div>
        </div>
      </b-col>
    </b-row>
    <b-row class="line-bottom">
      <b-col cols="12">
        <div class="flex-box">
          <span class="info-text-label"> {{ $t("common.shareto") }}:</span>
          <div class="info-text">
            <qcode-dropdown></qcode-dropdown>
          </div>
          <!-- <div class="info-text">
            <i class="sokogate icon-wechat share share-wechat"></i>
          </div> -->
          <div class="info-text">
            <i
              class="sokogate icon-facebook3 share share-facebook"
              @click="share_facebook"
            ></i>
          </div>
          <div class="info-text">
            <i class="sokogate icon-instagram share share-instagram"></i>
          </div>
          <div class="info-text">
            <i
              class="sokogate icon-Youtube share share-youtube"
              @click="share_Youtube"
            ></i>
          </div>
          <div class="info-text">
            <i
              class="sokogate icon-whatsapp share share-whatsapp"
              @click="share_whatsapp"
            ></i>
          </div>
          <!-- <div class="info-text">
            <i class="sokogate icon-tiktok share share-tiktok"></i>
          </div> -->
          <div class="info-text">
            <i
              class="sokogate icon-telegram share share-telegram"
              @click="share_telegram"
            ></i>
          </div>
          <div class="info-text">
            <i
              class="sokogate icon-messenger share share-messenger"
              @click="share_messenger"
            ></i>
          </div>
          <div class="flex-item-space share"></div>
        </div>
      </b-col>
    </b-row>
    <b-row class="line-bottom">
      <b-col cols="12">
        <ladder :list="LadderDefault" :spu="spu" :erMap="erMap" />
      </b-col>
    </b-row>
    <b-row class="line-bottom">
      <b-col cols="12">
        <div class="flex-box">
          <div class="info-text">
            <span class="info-text-label">
              {{ $t("productDetail.Origin") }}:
            </span>
            <sui-flag :name="spu.oringin" /> {{ spu.oringin }}
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row class="line-bottom">
      <b-col cols="12">
        <div class="flex-box">
          <div class="info-text">
            {{ $t("productDetail.minorder") }}
            {{ minimun }}
            {{ $t("productDetail.pieces") }}
          </div>
          <div class="info-text">
            {{ $t("productDetail.boxofquantity") }}
            {{ spu.incMinimun }}
            {{ $t("productDetail.pieces") }}
          </div>
          <div class="info-text">
            {{ $t("productDetail.CMB") }}
            {{ capacitySum }}&nbsp;CBM
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row class="line-bottom">
      <b-col cols="12">
        <div class="flex-box">
          <div class="info-text">
            <span class="info-text-label"
              >{{ $t("productDetail.Weight") }}:</span
            >
            <div class="info-item">
              <weight-dropdown :value="spu.weight"></weight-dropdown>
            </div>
          </div>
          <div class="info-text">
            <span class="info-text-label"
              >{{ $t("productDetail.Volume") }}:</span
            >
            <div class="info-item">
              <volumn-dropdown :value="spu.volume"></volumn-dropdown>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <!-- <b-row class="line-bottom">
      <b-col cols="12">
        <div class="flex-box">
          <div class="info-text"> -->
    <size-helper :value="spu.categoryIdList[2]"></size-helper>
    <!-- </div>
        </div>
      </b-col>
    </b-row> -->
    <b-row class="line-bottom">
      <b-col cols="12">
        <div class="flex-box">
          <div class="info-text">
            <tellme-size></tellme-size>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row class="line-bottom">
      <b-col cols="12">
        <div class="flex-box">
          <div class="info-text">
            <span class="info-text-label"
              >{{ $t("productDetail.Please choose Color & Size") }}:</span
            >
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Star from "./Star";
import Ladder from "./Ladder";
import SuiFlag from "./Flag";
import WeightDropdown from "./WeightDropdown";
import VolumnDropdown from "./VolumnDropdown";
import SuiTextTrans from "@/components/s-ui/info/text_trans";
import QcodeDropdown from "./QcodeDropdown.vue";
import SizeHelper from "./Sizehelper.vue";
import TellmeSize from "./TellmeSize.vue";
import { GetShareCode } from '@/utils/api';

export default {
  components: {
    Star,
    Ladder,
    SuiFlag,
    WeightDropdown,
    VolumnDropdown,
    SuiTextTrans,
    QcodeDropdown,
    SizeHelper,
    TellmeSize,
  },
  props: {
    spu: {
      type: Object,
    },
    skMap: {
      type: Object,
    },
    erMap: {
      type: Object,
    },
    erName: {
      type: Object,
    },
  },
  data() {
    return {
      srcde: '',
    }
  },
  created() {
    const token = localStorage.getItem("auth_token")
    if (token) {
      GetShareCode().then((res) => {
        this.srcde = res.data.shareCode
      })
    }
  },
  computed: {
    minimun() {
      return this.spu.minimun < 1 ? 1 : this.spu.minimun;
    },
    capacitySum() {
      return this.$utils.keepTwoDecimal(
        this.$utils.recoverCmbNum(this.spu.volume, this.spu.incMinimun)
      );
    },
    LadderDefault() {
        // console.log(this.skMap[Object.keys(this.skMap)[0]]);
      return this.skMap[Object.keys(this.skMap)[0]];
    },
    titleCon() {
      return this.spu.spuName;
    },
    url() {
      return (
        "HTTPS://sokogate.com/v2/product/detail?id=" +
        this.spu.id +
        "&srcde=" +
        this.srcde
      );
    },
  },
  methods: {
    // 分享到facebook
    share_facebook(event) {
      event.preventDefault();
      // shareUrl是facebook的分享address,  (有资料说需要真实的appkey, 必选参数, 这里我没用appkey也可以正常分享) 
      //custom内容
      const url = encodeURIComponent(this.url); //参数url设置分享的内容链接
      var _shareUrl = `HTTPS://www.facebook.com/sharer/sharer.php?u=${url}`;
      // 保留当前页面,打开一个非tab页面 (按需求来, 可以新开标签页, 也可以在当前页新开页面) 
      window.open(
        _shareUrl,
        "_blank",
        "height=200, width=400",
        "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
      );
    },
    // 分享到telegram
    share_telegram(event) {
      event.preventDefault();
      const url = encodeURIComponent(this.url); //参数url设置分享的内容链接
      var _shareUrl = `HTTPS://t.me/share/url?url=${url}`;
      // 保留当前页面,打开一个非tab页面 (按需求来, 可以新开标签页, 也可以在当前页新开页面) 
      window.open(
        _shareUrl,
        "_blank",
        "height=200, width=400",
        "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
      );
    },
    // 分享到whatsapp
    share_whatsapp(event) {
      event.preventDefault();
      const url = encodeURIComponent(this.url); //参数url设置分享的内容链接
      var _shareUrl = `HTTPS://api.whatsapp.com/send?text=${url}`;
      // 保留当前页面,打开一个非tab页面 (按需求来, 可以新开标签页, 也可以在当前页新开页面) 
      window.open(
        _shareUrl,
        "_blank",
        "height=200, width=400",
        "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
      );
    },
    // 分享到messenger
    share_messenger(event) {
      event.preventDefault();
      const url = encodeURIComponent(this.url); //参数url设置分享的内容链接
      var _shareUrl = `http://settings.messenger.live.com/Conversation/IMMe.aspx?invitee=${url}`;
      // 保留当前页面,打开一个非tab页面 (按需求来, 可以新开标签页, 也可以在当前页新开页面) 
      window.open(
        _shareUrl,
        "_blank",
        "height=200, width=400",
        "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
      );
    },
    // 分享到Youtube(video)
    share_Youtube(event) {
      event.preventDefault();
      const url = encodeURIComponent(this.url); //参数url设置分享的内容链接
      var _shareUrl = `HTTPS://www.youtube.com/embed/${url}`;
      // 保留当前页面,打开一个非tab页面 (按需求来, 可以新开标签页, 也可以在当前页新开页面) 
      window.open(
        _shareUrl,
        "_blank",
        "height=200, width=400",
        "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
      );
    },
  },
};
</script>

<style lang="scss">
.info-box {
 // font-family: Roboto;
  color: #000;
  font-size: 14px;

  .row {
    margin-left: 0;
    margin-right: 0;
  }

  .title {
    color: #000;
    font-size: 18px;
    font-weight: bold;
    line-height: 28px;
    padding-bottom: 8px;
  }

  .line-bottom {
    padding: 8px 20px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: 0;
    }
  }

  .info-text {
    padding-left: 16px;
    display: flex;
    align-items: center;
    font-weight: bold;
    .share {
      cursor: pointer;
      font-size: 20px;
    }
    .share-wechat {
      color: #7bb32e;
    }
    .share-facebook {
      color: #1877f2;
    }
    .share-instagram {
      background-image: linear-gradient(#e66465, #9198e5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .share-youtube {
      color: #ff0000;
    }
    .share-whatsapp {
      color: #25d366;
    }
    .share-tiktok {
      color: #111111;

      filter: drop-shadow(2px 0px 0px #fd3e3e)
        drop-shadow(-2px -2px 0px #4de8f4);
    }
    .share-telegram {
      color: #0088cc;
    }
    .share-messenger {
      background-image: linear-gradient(#e66465, #9198e5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .info-item {
      display: inline-block;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    &-label {
      color: #333;
      padding-right: 6px;
      font-weight: normal;
    }
    &:first-child {
      // display: flex;
      padding-left: 0;
    }
  }
}
</style>