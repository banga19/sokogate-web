<template>
  <div
    class="size-helper-box"
    v-show="
      this.value === '61b017cca00181bf8190e8a1' ||
      this.value === '61b017cca00181bf8190e8a5' ||
      this.value === '61b017cca00181bf8190e86b' ||
      this.value === '61b017cca00181bf8190e86c'
    "
  >
    <!-- {{ value }}
    男鞋：61b017cca00181bf8190e8a1 女鞋：61b017cca00181bf8190e8a5
    裙子：61b017cca00181bf8190e86b 男装：61b017cca00181bf8190e86c -->

    <div class="size-label" @click="localeCurrency">
      {{ $t("common.sizehelper") }}
    </div>
    <!-- 男鞋 -->
    <el-dialog
      v-if="this.value === '61b017cca00181bf8190e8a1'"
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('common.sizehelper')"
      :visible.sync="dialogTableVisible"
      class="size-list"
    >
      {{ $t("common.sizechart") }}:
      <el-table :data="menshoesData" style="width: 100%">
        <el-table-column prop="size" label="尺码" width="180">
        </el-table-column>
        <el-table-column prop="europeansize" label="欧洲码" width="180">
        </el-table-column>
        <el-table-column prop="footlength" label="脚长(mm)" width="180">
        </el-table-column>
        <el-table-column prop="ussize" label="美国码"> </el-table-column>
      </el-table>
      <div class="tips-box">
        <p class="tips-msg">
          <span class="tips-title"> 温馨提示： </span>
          <span> 建议先测量脚长后根据尺码表[脚长(mm)]进行选购。 </span>
        </p>
        <img src="https://oss.sokogate.com/static/shoessize.jpg" alt="" />
      </div>
    </el-dialog>
    <!-- 女鞋 -->
    <el-dialog
      v-if="this.value === '61b017cca00181bf8190e8a5'"
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('common.sizehelper')"
      :visible.sync="dialogTableVisible"
      class="size-list"
    >
      {{ $t("common.sizechart") }}:
      <el-table :data="shoesData" style="width: 100%">
        <el-table-column prop="size" label="尺码" width="180">
        </el-table-column>
        <el-table-column prop="europeansize" label="欧洲码" width="180">
        </el-table-column>
        <el-table-column prop="footlength" label="脚长(mm)" width="180">
        </el-table-column>
        <el-table-column prop="ussize" label="美国码"> </el-table-column>
      </el-table>
      <div class="tips-box">
        <p class="tips-msg">
          <span class="tips-title"> 温馨提示： </span>
          <span> 建议先测量脚长后根据尺码表[脚长(mm)]进行选购。 </span>
        </p>
        <img src="https://oss.sokogate.com/static/shoessize.jpg" alt="" />
      </div>
    </el-dialog>
    <!-- 女装裙子 -->
    <el-dialog
      v-if="this.value === '61b017cca00181bf8190e86b'"
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('common.sizehelper')"
      :visible.sync="dialogTableVisible"
      class="size-list"
    >
      {{ $t("common.sizechart") }}:
      <el-table :data="dressclothesData" style="width: 100%">
        <el-table-column prop="size" label="尺码" width="180">
        </el-table-column>
        <el-table-column prop="sizepattern" label="号型" width="180">
        </el-table-column>
        <el-table-column prop="shoulderwidth" label="肩宽(cm)" width="180">
        </el-table-column>
        <el-table-column prop="bust" label="胸围(cm)" width="180">
        </el-table-column>
        <el-table-column prop="length" label="衣长(cm)" width="180">
        </el-table-column>
        <el-table-column prop="sleevelength" label="袖长(cm)" width="180">
        </el-table-column>
        <el-table-column prop="hemcircumference" label="下摆围(cm)">
        </el-table-column>
      </el-table>
      <div class="tips-box">
        <p class="tips-msg">
          <span class="tips-title"> 温馨提示： </span>
          <span>
            以上数据仅供参考，由于尺码是手工测量，所以难免存在1cm-2cm的误差
          </span>
        </p>
        <img src="https://oss.sokogate.com/static/clothessize.jpg" alt="" />
      </div>
    </el-dialog>
    <!-- 衬衫 -->
    <el-dialog
      v-if="this.value === '61b017cca00181bf8190e86c'"
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('common.sizehelper')"
      :visible.sync="dialogTableVisible"
      class="size-list"
    >
      {{ $t("common.sizechart") }}:
      <el-table :data="clothesData" style="width: 100%">
        <el-table-column prop="size" label="尺码" width="180">
        </el-table-column>
        <el-table-column prop="sizepattern" label="号型" width="180">
        </el-table-column>
        <el-table-column prop="shoulderwidth" label="肩宽(cm)" width="180">
        </el-table-column>
        <el-table-column prop="bust" label="胸围(cm)" width="180">
        </el-table-column>
        <el-table-column prop="length" label="衣长(cm)" width="180">
        </el-table-column>
        <el-table-column prop="sleevelength" label="袖长(cm)" width="180">
        </el-table-column>
        <el-table-column prop="hemcircumference" label="下摆围(cm)">
        </el-table-column>
      </el-table>
      <div class="tips-box">
        <p class="tips-msg">
          <span class="tips-title"> 温馨提示： </span>
          <span>
            以上数据仅供参考，由于尺码是手工测量，所以难免存在1cm-2cm的误差
          </span>
        </p>
        <img src="https://oss.sokogate.com/static/clothessize.jpg" alt="" />
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  props: {
    value: {
      trpe: String,
      default: "",
    },
  },
  data() {
    return {
      dialogTableVisible: false,
      shoesData: [
        {
          size: "35",
          europeansize: "35",
          footlength: "220",
          ussize: "5",
        },
        {
          size: "35.5",
          europeansize: "35.5",
          footlength: "225",
          ussize: "5.5",
        },
        {
          size: "36",
          europeansize: "36",
          footlength: "230",
          ussize: "6",
        },
        {
          size: "36.5",
          europeansize: "36.5",
          footlength: "235",
          ussize: "6.5",
        },
        {
          size: "37",
          europeansize: "37",
          footlength: "240",
          ussize: "7",
        },
        {
          size: "37.5",
          europeansize: "37.5",
          footlength: "245",
          ussize: "7.5",
        },
        {
          size: "38",
          europeansize: "38",
          footlength: "250",
          ussize: "8",
        },
        {
          size: "38.5",
          europeansize: "38.5",
          footlength: "255",
          ussize: "8.5",
        },
        {
          size: "39",
          europeansize: "39",
          footlength: "245",
          ussize: "9",
        },
        {
          size: "39.5",
          europeansize: "39.5",
          footlength: "265",
          ussize: "9.5",
        },
        {
          size: "40",
          europeansize: "40",
          footlength: "270",
          ussize: "10",
        },
        {
          size: "40.5",
          europeansize: "40.5",
          footlength: "275",
          ussize: "10.5",
        },
        {
          size: "41",
          europeansize: "41",
          footlength: "280",
          ussize: "11",
        },
        {
          size: "41.5",
          europeansize: "41.5",
          footlength: "285",
          ussize: "11.5",
        },
        {
          size: "42",
          europeansize: "42",
          footlength: "290",
          ussize: "12",
        },
        {
          size: "42.5",
          europeansize: "42.5",
          footlength: "295",
          ussize: "12.5",
        },
        {
          size: "43",
          europeansize: "43",
          footlength: "300",
          ussize: "13",
        },
      ],
      menshoesData: [
        {
          size: "39",
          europeansize: "39",
          footlength: "245",
          ussize: "6.5",
        },
        {
          size: "39.5",
          europeansize: "39.5",
          footlength: "250",
          ussize: "7",
        },
        {
          size: "40",
          europeansize: "40",
          footlength: "255",
          ussize: "7.5",
        },
        {
          size: "40.5",
          europeansize: "40.5",
          footlength: "260",
          ussize: "8",
        },
        {
          size: "41",
          europeansize: "41",
          footlength: "265",
          ussize: "8.5",
        },
        {
          size: "41.5",
          europeansize: "41.5",
          footlength: "270",
          ussize: "9",
        },
        {
          size: "42",
          europeansize: "42",
          footlength: "275",
          ussize: "9.5",
        },
        {
          size: "42.5",
          europeansize: "42.5",
          footlength: "280",
          ussize: "10",
        },
        {
          size: "43",
          europeansize: "43",
          footlength: "285",
          ussize: "10.5",
        },
        {
          size: "43.5",
          europeansize: "43.5",
          footlength: "290",
          ussize: "11",
        },
        {
          size: "44",
          europeansize: "44",
          footlength: "295",
          ussize: "11.5",
        },
        {
          size: "44.5",
          europeansize: "44.5",
          footlength: "300",
          ussize: "12",
        },
        {
          size: "45",
          europeansize: "45",
          footlength: "305",
          ussize: "12.5",
        },
        {
          size: "45.5",
          europeansize: "45.5",
          footlength: "310",
          ussize: "13",
        },
      ],
      clothesData: [
        {
          size: "XS",
          sizepattern: "150/76A",
          shoulderwidth: "32",
          bust: "73",
          length: "44",
          sleevelength: "59",
          hemcircumference: "60",
        },
        {
          size: "S",
          sizepattern: "155/80A",
          shoulderwidth: "35",
          bust: "76",
          length: "45.5",
          sleevelength: "60",
          hemcircumference: "63",
        },
        {
          size: "M",
          sizepattern: "160/84A",
          shoulderwidth: "38",
          bust: "79",
          length: "46",
          sleevelength: "61",
          hemcircumference: "66",
        },
        {
          size: "L",
          sizepattern: "165/88A",
          shoulderwidth: "41",
          bust: "81",
          length: "46.5",
          sleevelength: "62",
          hemcircumference: "69",
        },
      ],
      dressclothesData: [
        {
          size: "S",
          sizepattern: "36",
          shoulderwidth: "36.7",
          bust: "36.7",
          length: "23.7",
          sleevelength: "71",
          hemcircumference: "87",
        },
        {
          size: "M",
          sizepattern: "38",
          shoulderwidth: "37.5",
          bust: "37.5",
          length: "24",
          sleevelength: "74.5",
          hemcircumference: "87",
        },
        {
          size: "L",
          sizepattern: "40",
          shoulderwidth: "38.7",
          bust: "38.7",
          length: "24.5",
          sleevelength: "80.5",
          hemcircumference: "88.3",
        },
        {
          size: "XL",
          sizepattern: "42",
          shoulderwidth: "39.9",
          bust: "39.9",
          length: "25",
          sleevelength: "86.5",
          hemcircumference: "89.6",
        },
        {
          size: "XXL",
          sizepattern: "44",
          shoulderwidth: "41.1",
          bust: "41.1",
          length: "25",
          sleevelength: "92.5",
          hemcircumference: "90.9",
        },
      ],
    };
  },
  methods: {
    localeCurrency() {
      this.dialogTableVisible = true;
    },
  },
};
</script>


<style lang="scss">
.size-helper-box {
  padding: 8px 20px;
  border-bottom: 1px solid #eee;
  .size-label {
    cursor: pointer;
    padding-left: 16px;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
}
.size-list {
  .el-dialog {
    .tips-box {
      .tips-msg {
        border-bottom: 1px solid #e1e1e1;
        padding: 2%;
        .tips-title {
          color: red;
        }
      }
    }
  }
}
</style>