<template>
  <b-container class>
    <b-row
      align-v="start"
      align-h="start"
      align-content="center"
      class="text-center"
      cols-md="6"
    >
      <b-col>
        <comingsoon-payment :mode="1" />
      </b-col>
      <b-col>
        <comingsoon-payment :mode="2" />
      </b-col>
      <!-- <b-col>
        <comingsoon-payment :mode="3" />
      </b-col> -->
      <!-- <b-col>
        <comingsoon-payment :mode="4" />
      </b-col> -->
    </b-row>
  </b-container>
</template>

<script>
import ComingsoonPayment from "@/components/ComingsoonPayment";

export default {
  components: {
    ComingsoonPayment,
  },
  props: {
    orderIdList: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped>
.klashaPayButtonStyle {
  background-color: #4caf50;
  border-radius: 20px;
  height: 40px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border: none;
  padding: 0 15px;
  margin: 15px 0;
}
.paypal-button {
  margin: 10px 0;
}
</style>
