<template>
  <b-container class="consignee-address">
    <template>
      <h4>{{ $t("order.selectShippingAddress") }}</h4>
      <add-address name="order.shippingAddress" @onFinish="getList" ref="address" />
      <!-- <v-distpicker
      :province="role.province"
      @selected="selected"
      :city="role.city"
      :area="role.area"
    ></v-distpicker> -->
      <div class="address-list" v-if="list && list.length > 0">
        <template v-for="(item, index) in list">
          <b-card
            class="address-card"
            :class="{ selected: value && item.id === value }"
            @click="change(item)"
          >
            <b-card-title style="display: flex; alignItems: center; justifyContent: space-between;">
              <div style="display: flex; alignItems: center;">
                <b-icon
                class="icon-selected"
                icon="check-square"
                scale="1.2"
                variant="success"
              ></b-icon>
              <b-badge v-if="item.isDefault" style="marginRight: 10px" variant="secondary">
                {{ $t("common.default") }}
              </b-badge>
              <span class="text-ellipsis">{{ item.consignee }}</span>
              </div>
              <svg @click.stop="editChange(item)" class="icon icon-selected" viewBox="0 0 1024 1024" version="1,1" xmlns="http://www.w3,org/2000/svg" p-id="6074" height="18" width="18"><path d="M631.808 
              100.864H187,904c-69.12 0-126,464 54,784-126,464 122,88v611,328c0 68.096 56,832 122,88 126,976 122,88h632,832c70.144 0 126,976-54,784 126,976-122,88V409.088h-63,488v425,984c0 
              34,304-28.672 61,44-64 61,44H188.416c-35,328 0-64-27,648-64-61,44V223,744c0-33,792 28.672-61,44 62,976-61,44h443,904v-61,44zM459.264 507,392c-6,144 5,632-9.216 13,312-9.216 
              21.504s3,584 15,872 9.216 21.504c12,288 11,776 32,256 11,776 45.056 0L952,32 117,76c6,144-5,632 9.216-13,312 9.216-21.504s-3,584-15,872-9.216-21.504c-12,288-11,776-32,256-11,776-45.056 0L459.264 507,392z" p-id="6075">
              </path></svg>
              <svg @click.stop="delUserAddress(item)" style="marginRight: 0px" class="icon icon-selected" viewBox="0 0 1024 1024" version="1,1" xmlns="http://www.w3,org/2000/svg" p-id="2203" height="26" width="26">
              <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FFFFFF" p-id="2204"></path>
              <path d="M555,323077 512l200.861538-200.861538c11.815385-11.815385 11.815385-31.507692 0-43,323077s-31.507692-11.815385-43,323077 0L512 468.676923 
              311,138462 267,815385c-11.815385-11.815385-31.507692-11.815385-43,323077 0s-11.815385 31.507692 0 43,323077l200.861538 200.861538-200.861538 
              200.861538c-11.815385 11.815385-11.815385 31.507692 0 43,323077 3,938462 3,938462 11.815385 7,876923 19.692307 7,876923s15,753846-3,938462 
              19.692308-7,876923l200.861538-200.861538 200.861539 200.861538c3,938462 3,938462 11.815385 7,876923 19.692308 7,876923s15,753846-3,938462 
              19.692307-7,876923c11.815385-11.815385 11.815385-31.507692 0-43,323077L555,323077 512z" fill="#1A1311" p-id="2205"></path></svg>
            </b-card-title>
            <b-card-text>{{ item.phone }}</b-card-text>
            <b-card-text>
              {{
                `${item.country} ${item.province} ${item.city} ${item.district} ${item.detail}`
              }}
            </b-card-text>
          </b-card>
        </template>
      </div>
      <!-- <el-button type="text">
      {{ $t("order.manageShippingAddress") }}
    </el-button> -->
      <!-- <template v-else>
        <br />
        <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
      </template> -->
    </template>
  </b-container>
</template>

<script>
import { GetAddressList, DelAddress } from "@/utils/api";
// import VDistpicker from "v-distpicker";
import AddAddress from "@/components/AddAddress";
export default {
  props: {
    value: {
      type: Number,
    },
  },
  components: {
    // VDistpicker,
    AddAddress,
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      GetAddressList({})
        .then((res) => {
          // console.log("getAddressList-res:", res);
          this.list = res.data.rows;
          if (this.list.length) {
            this.$emit("input", this.list[0].id);
            this.$store.commit("setselectCountry", this.list[0].country);
          }
        })
        .catch((err) => {
          console.log("getAddressList-err:", err);
        });
    },
    change(item) {
      console.log("change",item);
      this.$emit("input", item.id);
      // 把改变的国家传给父组件
      this.$emit("change", item.country);
    },
    editChange(item) {
      // item.city = [item.city];
      this.$refs.address.formData.id = item.id;
      this.$refs.address.handleOpen(item.countryId);
      this.$nextTick(() => {
        this.$refs.address.$refs["form"].setForm(item);
      });
      // console.log(this.$refs.address.handleOpen(),item,'item');
    },
    delUserAddress(item) {
      // console.log(item, 'dasda');
      DelAddress({ id: item.id })
        .then(() => {
          // console.log("DelAddress-res:", res);
          this.$message({
          message: '删除success',
          type: 'success'
          });
          this.getList();
        })
        .catch((err) => {
          console.log("DelAddress-err:", err);
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.consignee {
  &-address {
    .address {
      &-list {
        overflow-x: scroll;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        max-height: 210px;
        margin-top: 15px;
        margin-bottom: 15px;
      }
      &-card {
        flex-shrink: 0;
        width: 300px;
        height: 200px;
        border: 3px dashed rgba(0, 0, 0, 0.125);
        margin-right: 10px;

        .icon-selected {
          display: none;
          margin-right: 10px;
        }

        &.selected {
          border: 3px dashed rgba(255, 10, 10, 0.5);

          .icon-selected {
            display: initial;
          }
        }

        .badge {
          color: #fff;
          background-color: rgba(0, 0, 0, 0.4);
        }

        .text-ellipsis {
          width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>