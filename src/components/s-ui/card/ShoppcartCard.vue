<template>
  <div class="shopping-cart-box">

        <b-card
        v-for="(item, index) in list"
        :key="index"
          class="smallpic-img"
          :img-src="item.img"
          img-alt="Card image"
          img-left
        >
          <div class="bd-shopping">
            <div class="shopping-cart-boxOne">
              <b-card-text class="shopping-cart-text">
                {{ item.text }}
              </b-card-text>
              <b-card-text class="shopping-cart-status">
                Package type:{{ item.packageType }}
              </b-card-text>
            </div>
            <div class="shopping-cart-boxTwo">
              <b-card-text class="shopping-cart-price">
                {{ $utils.formatToDecimal(item.price) }}
              </b-card-text>
            </div>
            <div class="shopping-cart-boxThree">
              <b-card-text class="shopping-cart-num">
                {{ item.num }}
              </b-card-text>
            </div>
            <div class="shopping-cart-boxFour">
              <b-card-text class="shopping-cart-refund">
                {{ item.refund }}
              </b-card-text>
            </div>
          </div>
        </b-card>
  </div>
</template>



<script>
export default {
  data() {
    return {
      list: [
        {
          img: "https://placekitten.com/300/300",
          text: "Some quick example text to build on the card and make up the bulk of the card's content.",
          packageType: "Four pairs of yellow",
          price: "12345",
          num: "1",
          refund: "-",
        }
      ],
    };
  },
};
</script>



<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.shopping-cart-box {
    margin-bottom: 15px;
    display: flex;
    flex-grow: 1;
    @include mobile {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      max-width: 98%;
      padding: 0 10px 0 27px;
    }
    .card {
      width: 570px;
      @include mobile {
        width: 98%;
      }
    }

    .smallpic-img {
      padding-left: 10px;
      img {
        margin: auto;
        width: 80px;
        height: 80px;
        object-fit: cover;
      }
    }
    .bd-shopping {
      display: flex;
      justify-content: space-around;
      align-items: center;
      @include mobile {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .shopping-cart-boxOne {
        .shopping-cart-text {
          width: 158px;
          font-size: 16px;
          font-weight: bold;
          color: #000;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
           @include mobile{
             width: auto;
           }
        }
        .shopping-cart-status {
          color: #000000;
          font-size: 12px;
        }
      }
      .shopping-cart-boxTwo {
        flex-grow: 1;
        .shopping-cart-price {
          color: #000000;
          font-size: 16px;
        }
      }
      .shopping-cart-boxThree {
        flex-grow: 1;
        .shopping-cart-num {
          color: #000000;
          font-size: 16px;
        }
      }
      .shopping-cart-boxFour {
        .shopping-cart-refund {
          width: 130px;
          color: #000000;
          font-size: 16px;
        }
      }
    }
}
</style>