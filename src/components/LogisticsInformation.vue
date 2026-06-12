<template>
  <div class="my-logistics-information">
    <b-list-group class="bd-list">
      <b-list-group-item
        class="bdlist-item"
        v-for="(item, index) in loginArea"
        :key="`loginArea-${index}`"
      >
        <div class="bditem-list">
          <div class="db-left">
            <div class="left-Area">
              <div class="left-start">
                <div class="start-box">
                  <div class="start-area">
                    {{ item.startArea }}
                  </div>
                  <div class="start-city">
                    {{ item.startCity }}
                  </div>
                </div>
              </div>
              <i class="sokogate icon-a-Group456 iconpng"></i>
              <div class="left-end">
                <div class="start-box">
                  <div class="start-area">{{ item.endArea }}</div>
                  <div class="start-city">{{ item.endCity }}</div>
                </div>
              </div>
            </div>
            <div class="left-time">
              <div class="time-min">{{ item.min }}</div>
              <div class="time-year">{{ item.year }}</div>
            </div>
            <div class="left-mess">{{ item.msg }}</div>
          </div>
          <div class="bd-right">
            <div class="btn-box">
              <b-button pill size="lg" squared variant="danger" class="btn-box2"
                >{{ $t(item.btn2) }}
              </b-button>
            </div>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>



<script>
export default {
  data() {
    return {
      loginArea: [
        {
          startArea: "Bieber",
          endArea: "Bieber",
          startCity: "Guangzhou City",
          endCity: "Guangzhou City",
          min: "11:48",
          year: "2022-03-28",
          msg: "You have a courier to sign off on",
          btn1: "account.viewLogistics",
          btn2: "account.view",
        },
        {
          startArea: "Bieber",
          endArea: "Bieber",
          startCity: "Guangzhou City",
          endCity: "Guangzhou City",
          min: "11:48",
          year: "2022-03-28",
          msg: "You have a courier to sign off on",
          btn1: "account.viewLogistics",
          btn2: "account.view",
        },
      ],
    };
  },
};
</script>


<style lang="scss" scoped>
.my-logistics-information {
  .bd-list {
    .bdlist-item {
      .bditem-list {
        display: flex;
        justify-content: space-around;
        height: 100px;
        .db-left {
          flex-grow: 2;
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          align-items: center;
          .left-img {
            width: 60px;
            height: 60px;
            border: 1px solid #333;
            margin-right: 10px;
            .shop-img {
              width: 100%;
              height: 100%;
            }
          }
          .left-time {
            display: flex;
            flex-direction: column;
            margin-right: 10px;
            .time-min {
              color: #ef2e22;
            }

            .time-year {
              font-size: 12px;
              color: #a6a6a6;
            }
          }
          .left-mess {
            color: #000;
            font-size: 14px;
          }
        }
        .bd-right {
          flex-grow: 1;

          .btn-box {
            display: flex;
            margin-top: 35px;
            justify-content: flex-end;
            .btn-box1 {
              font-size: 14px;
              background: #f2f2f2;
              border: 0;
              margin-right: 10px;
              color: #a6a6a6;
            }

            .btn-box2 {
              font-size: 14px;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .left-Area {
    display: flex;
    justify-content: space-around;
    margin-right: 10px;

    .iconpng {
      font-size: 14px;
      color: #ef2e22;
    }
    .left-start {
      .start-box {
        display: flex;
        flex-direction: column;
        flex-grow: 2;

        .start-area {
          font-size: 16px;
          color: #000;
          text-align: center;
        }
        .start-city {
          font-size: 12px;
          color: #b2b2b2;
        }
      }
    }
    .left-end {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .start-area {
        font-size: 16px;
        color: #000;
        text-align: center;
      }
      .start-city {
        font-size: 12px;
        color: #b2b2b2;
      }
    }
  }
}
</style>