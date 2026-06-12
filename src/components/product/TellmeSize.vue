<template>
  <div class="tellme-size-box">
    <p class="tellme-title">
      {{ $t("common.notsize") }}
      <span class="tellme-msg" @click="showSize">
        {{ $t("common.sizeTitle") }}
      </span>
    </p>
    <el-dialog
      center
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('common.sizeTitle')"
      :visible.sync="sizeVisible"
    >
      <el-row v-if="show">
        <el-col class="tellme-col">
          {{ $t("common.feedback") }}
        </el-col>
        <el-col class="local-bar">
          <div>
            {{ $t("common.size") }}
            <span>({{ list }})</span>
          </div>
          <div class="country-select_box">
            <el-select
              v-model="value"
              :placeholder="$t('common.selectPlaceholder')"
              @change="changeSize"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col class="size-box">
          <template v-for="(item, index) in List[list]">
            <el-button
              :key="`size_${index}`"
              class="size-btn"
              @click="chooseSize(item.size)"
            >
              {{ item.size }}
            </el-button>
          </template>
        </el-col>
        <el-col class="size-feedback_footer">
          <el-button
            type="primary"
            :loading="loading"
            @click="submit"
            class="submit-btn"
            >{{ $t("common.submit") }}</el-button
          >
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col>
          <el-result
            icon="success"
            title="Submit successful!"
            :subTitle="subTitle"
          >
          </el-result>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { UpdateUserClothSize } from "@/utils/api";
export default {
  data() {
    return {
      show: true,
      loading: false,
      sizeVisible: false,
      subTitle: this.$t("common.similaritems"),
      options: [
        {
          value: "BR",
          label: "BR",
        },
        {
          value: "EU",
          label: "EU",
        },
        {
          value: "DE",
          label: "DE",
        },
        {
          value: "AU",
          label: "AU",
        },
        {
          value: "ASIA",
          label: "ASIA",
        },
        {
          value: "UK",
          label: "UK",
        },
        {
          value: "IT",
          label: "IT",
        },
        {
          value: "FR",
          label: "FR",
        },
        {
          value: "US",
          label: "US",
        },
        {
          value: "ES",
          label: "ES",
        },
      ],
      List: {
        US: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(00)",
          },
          {
            size: "XXL(8/10)",
          },
          {
            size: "XXXL(12)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        BR: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(XXPP)",
          },
          {
            size: "XXL(G)",
          },
          {
            size: "XXXL",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        EU: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(30)",
          },
          {
            size: "XXL(40/42)",
          },
          {
            size: "XXXL(44)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        DE: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(30)",
          },
          {
            size: "XXL(40/42)",
          },
          {
            size: "XXXL(44)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        AU: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(2)",
          },
          {
            size: "XXL(12/14)",
          },
          {
            size: "XXXL(16)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        ASIA: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(00)",
          },
          {
            size: "XXL(8/10)",
          },
          {
            size: "XXXL(12)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        UK: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(2)",
          },
          {
            size: "XXL(12/14)",
          },
          {
            size: "XXXL(16)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        IT: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(34)",
          },
          {
            size: "XXL(44/46)",
          },
          {
            size: "XXXL(48)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        FR: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(30)",
          },
          {
            size: "XXL(40/42)",
          },
          {
            size: "XXXL(44)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
        ES: [
          {
            size: "Smaller than XXS",
          },
          {
            size: "XXS",
          },
          {
            size: "XS(30)",
          },
          {
            size: "XXL(40/42)",
          },
          {
            size: "XXXL(44)",
          },
          {
            size: "XXXXL",
          },
          {
            size: "0XL",
          },
          {
            size: "1XL",
          },
          {
            size: "2XL",
          },
          {
            size: "3XL",
          },
          {
            size: "4XL",
          },
          {
            size: "5XL",
          },
          {
            size: "6XL",
          },
          {
            size: "7XL",
          },
          {
            size: "Larger than 7XL",
          },
        ],
      },
      list: "US",
      value: "US",
      item: "",
    };
  },
  methods: {
    chooseSize(item) {
      //   console.log("chooseSize", item);
      this.item = item;
    },
    changeSize(e) {
      // console.log("changeSize", e, this.List);
      this.list = e;
    },
    showSize() {
      this.sizeVisible = true;
    },
    submit() {
      this.loading = true;
      if (this.item) {
        UpdateUserClothSize({ clothSize: this.item })
          .then((res) => {
            // console.log("UpdateUserClothSize-res", res);
            if (res.errcode === 0) {
              this.loading = false;
              this.show = false;
              this.title = "";
              this.subTitle = this.subTitle + " " + this.item;
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log("UpdateUserClothSize-err", err);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tellme-size-box {
  .tellme-title {
    .tellme-msg {
      cursor: pointer;
      color: #ef2e22;
    }
  }
}
.tellme-col {
  padding: 12px 48px;
  text-align: center;
  background-color: #f6f6f6;
  margin-bottom: 32px;
}
.local-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.size-box {
  margin-top: 5%;
  .size-btn {
    margin-bottom: 10px;
    border-radius: 16px;
  }
}
.size-feedback_footer {
  margin-top: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  .submit-btn {
    width: 240px;
    height: 44px;
    font-size: 16px;
  }
}
</style>