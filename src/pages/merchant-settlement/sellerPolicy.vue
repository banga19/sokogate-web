<template>
  <b-container class="merchant-settlement-page">
<div v-title :data-title="$t('menuitems.layout.sellerpolicy')">
    <Breadcrumb :items="items" />
     <b-row>
       <b-col cols="12">
         <div class="col">
           <h4>Seller Policy for Sokogate Marketplace</h4>
           <p><strong>1. Registration and Verification</strong><br/>Sellers must complete business registration, provide valid contact details, and pass identity verification before listing products on Sokogate.</p>
           <p><strong>2. Product Listings</strong><br/>All products must be accurately described with truthful images, specifications, origin, and pricing. Prohibited, counterfeit, or unsafe goods are not allowed.</p>
           <p><strong>3. Order Fulfillment</strong><br/>Sellers are responsible for processing confirmed orders promptly, ensuring proper packaging, and providing reliable tracking information.</p>
           <p><strong>4. Shipping and Delivery</strong><br/>Sellers must use reputable carriers and cover shipping risks according to the agreed Incoterm. Delivery timelines and customs clearance responsibilities should be clearly stated.</p>
           <p><strong>5. After-Sales Service</strong><br/>Sellers must respond to buyer inquiries within 48 hours and address returns, refunds, or quality issues in good faith.</p>
           <p><strong>6. Communications</strong><br/>All communication should be conducted through Sokogate channels. Harassment, fraud, or off-platform solicitations are prohibited.</p>
           <p><strong>7. Compliance</strong><br/>Sellers must comply with applicable export, customs, and product-safety regulations for shipments from China to African markets.</p>
           <p><strong>8. Account Termination</strong><br/>Sokogate reserves the right to suspend or terminate accounts that breach these policies without prior notice.</p>
         </div>
       </b-col>
     </b-row>
</div>
  </b-container>
</template>



<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  components: { Breadcrumb },
  data() {
    return {
      items: [
        {
          text: this.$t("menuitems.home"),
          to: { name: "merchant_settlement" },
        },
        {
          text: this.$t("menuitems.layout.sellerpolicy"),
          active: true,
        },
      ],
    };
  },
  computed: {
    locale: function () {
      return this.$i18n.locale;
    },
  },
};
</script>


<style lang="scss" scoped>
.merchant-settlement-page {
  h4 {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 36px;
    color: #000;
  }

  p {
    font-weight: normal;
    font-size: 13px;
    line-height: 26px;
    color: #000;
  }
}
</style>