<template>
  <b-container class="footer">
    <b-row
      align-v="start"
      class
      cols="1"
      cols-sm="2"
      cols-md="3"
      cols-lg="5"
      style="position: relative"
    >
<b-col md="3" lg="3" sm="6" class="link-p">
        <h4>{{ $t("layout.our-markets") }}</h4>
        <p @click="$router.push({ name: 'guinea' })">{{ $t("layout.markets.GN.name") }} ({{ $t("layout.markets.GN.langLabel") }})</p>
        <p @click="$router.push({ name: 'senegal' })">{{ $t("layout.markets.SN.name") }} ({{ $t("layout.markets.SN.langLabel") }})</p>
        <p @click="$router.push({ name: 'ghana' })">{{ $t("layout.markets.GH.name") }} ({{ $t("layout.markets.GH.langLabel") }})</p>
        <p @click="$router.push({ name: 'cote-divoire' })">{{ $t("layout.markets.CI.name") }} ({{ $t("layout.markets.CI.langLabel") }})</p>
        <p @click="$router.push({ name: 'cameroon' })">{{ $t("layout.markets.CM.name") }} ({{ $t("layout.markets.CM.langLabel") }})</p>
        <p @click="$router.push({ name: 'sierra-leone' })">{{ $t("layout.markets.SL.name") }} ({{ $t("layout.markets.SL.langLabel") }})</p>
        <p @click="$router.push({ name: 'kenya' })">{{ $t("layout.markets.KE.name") }} ({{ $t("layout.markets.KE.langLabel") }})</p>
        <p @click="$router.push({ name: 'zimbabwe' })">{{ $t("layout.markets.ZW.name") }} ({{ $t("layout.markets.ZW.langLabel") }})</p>
      </b-col>
      <b-col md="3" lg="3" sm="6" class="link-p">
        <h4>{{ $t("layout.policies-info") }}</h4>
        <!-- terms Conditions -->
        <p @click="$router.push({ name: 'terms Conditions' })">
          {{ $t("layout.terms-conditions") }}
        </p>
        <!-- seller Policy -->
        <p @click="$router.push({ name: 'seller Policy' })">
          {{ $t("layout.policy-for-sellers") }}
        </p>
        <!-- buyer-policy -->
        <p @click="$router.push({ name: 'buyer Policy' })">
          {{ $t("layout.policy-for-buyers") }}
        </p>
        <!-- shipping-refund -->
        <p @click="$router.push({ name: 'shipping & Refund' })">
          {{ $t("layout.shipping-refund") }}
        </p>
        <!-- wholesale-policy -->
        <p @click="$router.push({ name: 'wholesale Policy' })">
          {{ $t("layout.wholesale-policy") }}
        </p>
        <!-- @click="$utils.jumpto('privacy-policy')" -->
        <!-- privacy-policy -->
        <p @click="$router.push({ name: 'privacy Policy' })">
          {{ $t("layout.privacy-policy") }}
        </p>
        <p @click="$router.push({ name: 'About Sokogate' })">
          {{ $t("common.aboutus") }}
        </p>
      </b-col >
      <b-col md="3" lg="3" sm="6" class="link-p">
        <h4>{{ $t("layout.quick-links") }}</h4>
        <p @click="$utils.jumpto('https://vendor.sokogate.com/v2/login')">
          {{ $t("layout.seller-login") }}
        </p>
        <p @click="$utils.jumpto('https://vendor.sokogate.com/v2/login')">
          {{ $t("layout.seller") }} sokogate.com
        </p>
        <p @click="$utils.jumpto('https://beian.miit.gov.cn/')">
          粤ICP备2022014110号-1
        </p>
        <h4>{{ $t("layout.sellon-sokogate") }}</h4>
        <p @click="$utils.jumpto('https://vendor.sokogate.com/v2/register')">
          {{ $t("layout.become-supplier") }}
        </p>
      </b-col >
      <b-col md="3" lg="3" sm="6">
        <h4>{{ $t("layout.contact-us") }} - Senegal</h4>
        <p>ADRESSE A DAKAR : keur massar Rond Point Gouy Gui</p>
        <p>Téléphone : + 221 76 780 23 89</p>
        <h4>{{ $t("layout.contact-us") }} - China</h4>
        <p>Info@sokogate.com</p>
        <p>{{ $t("layout.china-office") }}</p>
        <p>{{ $t("layout.contact") }}: +86 020 33972585</p>
        <p>Whatsapp: +86 18813759438</p>
        <p>
          Address: Room 5001, No. 372, Huanshi East Road, Yuexiu District,
          Guangzhou
        </p>
        <p>地址: 广东省广州市越秀区环市东路372号正佳东方国际广场5001房</p>
        <p>© 2020-2026 ultimo trading co limited or its affiliates.</p>
        <a href="https://ultimotradingltd.co.ke/" style="color: white;font-size: 16px;">https://ultimotradingltd.co.ke/</a>
      </b-col>

      <!-- <b-col>
        <h4>{{ $t("layout.contact-us") }} - Senegal</h4>
        <p>
          {{ $t("common.Africaoffice") }}
        </p>
        <p>{{ $t("layout.contact") }}: sokogatesenegal@sokogate.com</p>
        <p>
          {{ $t("common.Africaoaddress") }}
        </p>
        <p>{{ $t("common.phonenumber") }}:00221 775186237</p>
      </b-col> -->
      <!-- <b-col>
      </b-col> -->

      <!-- <b-col style="position: absolute; top: 0; right: 0"> -->
      <b-col md="3" lg="3" sm="6">
        <h4>{{ $t("layout.we-accept") }}</h4>
        <b-row
          cols="6"
          cols-sm="4"
          cols-md="4"
          cols-lg="4"
          style="margin-bottom: 30px"
        >
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/discover.png" width="40" height="25" alt="discover card" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/maestro.png" width="40" height="25" alt="maestro" loading="lazy" />
          </b-col>
          <!-- <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/paypal.png" loading="lazy" />
          </b-col> -->
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/visa.png" width="40" height="25" alt="visa" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/mastercard.jpg" width="43" height="42" alt="mastercard" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/momo(mtn).png" width="43" height="42" alt="momo(mtn)" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/orangemoney.jpg" width="43" height="50" alt="orangemoney" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/wave.jpg" width="43" height="42" alt="wave" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/eumobile.jpg" width="43" height="26" alt="eumobile" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/mobicash.jpg" width="43" height="13" alt="mobicash" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/airtel.jpg" width="43" height="41" alt="airtel" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/vodafone.jpg" width="43" height="42.95" alt="vodafone" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/wizall.jpg" width="43" height="43" alt="wizall" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/e-money.png" width="43" height="22" alt="e-money" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/freemoney.png" width="43" height="18" alt="freemoney" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/moovmoney.png" width="43" height="38" alt="moovmoney" loading="lazy" />
          </b-col>
          <b-col class="img-box">
            <img src="https://oss.sokogate.com/static/tmoney.jpg" width="43" height="15" alt="tmoney" loading="lazy" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.footer {
  color: #fff;
  padding: 60px 0;
  @include mobile {
    padding: 20px 0;
  }

  h4 {
    font-size: 16px;
    font-weight: bold;
  }
  .col{
    flex: 0 0 25%;
    max-width: 25%;
  }
  .img-box {
    margin-bottom: 10px;
  }

  p {
    opacity: 0.8;
    letter-spacing: 0px;
    font-size: 12px;
    line-height: 25px;
    margin-bottom: 0;
    font-weight: 600;
    // cursor: pointer;

    &:last-child {
      margin-bottom: 30px;
    }
  }
  .link-p {
    p {
      cursor: pointer;
    }
  }
}
</style>