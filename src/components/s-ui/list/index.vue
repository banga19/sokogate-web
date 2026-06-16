<template>
  <div class="sui-list">
    <el-table
      :data="list.filter((v) => v.tType !== 201)"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="list"
      :max-height="maxHeight"
    >
      <el-table-column v-if="selection" type="selection" width="55">
      </el-table-column>
      <!-- 未sync -->
      <el-table-column
        label-class-name="hd-row"
        v-for="(item, index) in column"
        :key="`column-${index}`"
        :prop="item.name"
        :label="$t(item.label)"
        :width="item.width"
      >
        <template v-if="item.type === 'link'" v-slot:default="scope">
          <a
            :href="`${item.detail.link}${scope.row[item.detail.key]}`"
            target="_blank"
            >{{ scope.row[item.name] }}
          </a>
        </template>
        <template v-else-if="item.type === 'image'" v-slot:default="scope">
          <el-image
            :src="`${getCoverImage(
              scope.row[item.name]
            )}?x-oss-process=style/w128`"
            :preview-src-list="[getCoverImage(scope.row[item.name])]"
            class="imgbg"
            fit="contain"
          >
            <!-- 未sync -->
            <div slot="error" class="image-slot">
              <i class="image-slot-icon el-icon-picture-outline"></i></div
          ></el-image>
        </template>
        <template v-else-if="item.type === 'price'" v-slot:default="scope">
          <sui-product-price v-model="scope.row[item.name]" />
        </template>
        <template
          v-else-if="item.type === 'price-fixed'"
          v-slot:default="scope"
        >
          <!-- 这里与 app 端保持一致, 显示当前设置的货币 -->
          <sui-product-price
            v-model="scope.row[item.name]"
            :form="scope.row.currencyFrom"
          />
        </template>
        <template v-else-if="item.type === 'switch'" v-slot:default="scope">
          <el-switch
            v-model="scope.row[item.name]"
            :active-value="1"
            :inactive-value="0"
            active-color="#ffafaf"
            inactive-color="#13ce66"
            :active-text="
              $t(scope.row[item.name] === 1 ? 'common.hidden' : 'common.shown')
            "
            @change="switchChange($event, scope.row, scope.$index)"
          >
          </el-switch>
        </template>
        <template v-else-if="item.range" v-slot:default="scope">
          {{ $t(item.range[scope.row[item.name]]) }}
        </template>
        <!-- 未sync -->
        <template v-else-if="item.formatFn" v-slot:default="scope">
          {{ item.formatFn(scope.row[item.name]) }}
        </template>
        <template v-else-if="item.status" v-slot:default="scope">
          {{ item.status[scope.row[item.name]] }}
        </template>
        <template v-else-if="item.payMethod" v-slot:default="scope">
          {{ item.payMethod[scope.row[item.name]] }}
        </template>
        <template v-else-if="item.payStatus" v-slot:default="scope">
          {{ item.payStatus[scope.row[item.name]] }}
        </template>
        <!-- 未sync -->
      </el-table-column>
      <el-table-column
        v-if="showOpt"
        label-class-name="hd-row"
        fixed="right"
        :label="$t('common.operation')"
        width="150"
      >
        <template v-slot:default="scope">
          <el-button
            v-if="showDetail"
            @click="detail(scope.row)"
            type="text"
            size="small"
          >
            {{ $t("common.detail") }}
          </el-button>
          <el-button
            v-if="showPay && scope.row.status != 1301"
            @click="pay(scope.row)"
            type="text"
            size="small"
          >
            {{ $t("common.pay") }}
          </el-button>
          <el-button
            v-if="showEdit"
            @click="edit(scope.row)"
            type="text"
            size="small"
          >
            {{ $t("common.edit") }}
          </el-button>
          <el-button
            v-if="showMoveUp"
            :disabled="scope.$index === 0"
            @click="moveup(scope.row)"
            type="text"
            size="small"
          >
            {{ $t("common.moveup") }}
          </el-button>
          <el-button
            v-if="showMoveDown"
            :disabled="scope.$index === list.length - 1"
            @click="movedown(scope.row)"
            type="text"
            size="small"
          >
            {{ $t("common.movedown") }}
          </el-button>
          <el-popconfirm
            v-if="showDel"
            :title="$t('common.confirmDelete')"
            style="margin-left: 10px"
            @confirm="del(scope.row)"
          >
            <template v-slot:reference>
              <el-button type="text" size="small">{{
                $t("common.delete")
              }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="req">
      <el-pagination
        background
        class="list-pagination"
        layout="prev, pager, next,jumper"
        :hide-on-single-page="true"
        :page-size="req.pageSize"
        :total="total"
        :current-page.sync="page"
        @current-change="currentChange"
      >
      </el-pagination>
    </template>
  </div>
</template>
<script>
import SuiProductPrice from "@/components/product/Price";
export default {
  components: {
    SuiProductPrice,
  },
  props: {
    column: {
      type: Array,
      default() {
        return [];
      },
    },
    fun: {
      type: Function,
    },
    refactor: {
      type: Function,
    },
    req: {
      type: Object,
      value: {},
    },
    selection: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Array,
      default() {
        return [];
      },
    },
    maxHeight: String,
  },
  data() {
    return {
      list: [],
      count: 0,
      page: 1,
      desc: 0,
      options: {},
      abc: false,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    total() {
      return this.count; // Math.ceil(this.count / this.req.pageSize);
    },
    showOpt() {
      const showOpt = this.showDetail || this.showEdit || this.showDel;
      return !!showOpt;
    },
    showDetail() {
      return !!this.$listeners["detail"];
    },
    showPay() {
      return !!this.$listeners["pay"];
    },
    showEdit() {
      return !!this.$listeners["edit"];
    },
    showDel() {
      return !!this.$listeners["del"];
    },
    showMoveUp() {
      return !!this.$listeners["moveup"];
    },
    showMoveDown() {
      return !!this.$listeners["movedown"];
    },
  },
  methods: {
    setList(list) {
      this.list = list;
    },
    getList(page, desc, options) {
      // console.log("getlist:", this.defaultData);
      if (this.defaultData.length) {
        this.list = this.defaultData;
      } else {
        if (options) {
          this.options = options;
        }
        if (!page && this.$route.query.page) {
          this.page = Number(this.$route.query.page);
        }
        this.fun &&
          this.fun({
            page: page || this.page,
            desc: desc || this.desc,
            orderKey: "order_view",
            ...(options || this.options),
            ...this.req,
          })
            .then((res) => {
              // console.log("tableFun-res:", res);
              this.list = this.refactor
                ? this.refactor(res.data.rows)
                : res.data.rows;
              this.count = res.data.count;
              this.$emit("backflow", res.data.count || 0);
            })
            .catch((err) => {
              console.log("tableFun-err:", err);
            });
      }
    },
    getCoverImage(image) {
      // console.log('getCoverImage:', image);
      if (typeof image === "string") {
        return image;
      } else if (image instanceof Array) {
        if (typeof image[0] === "string") {
          return image[0];
        } else if (image[0] instanceof Object) {
          return image[0].img || "";
        }
      }
    },
    detail(row) {
      this.$emit("detail", row);
    },
    pay(row) {
      this.$emit("pay", row);
    },
    edit(row) {
      this.$emit("edit", row);
    },
    moveup(row) {
      this.$emit("moveup", row);
    },
    movedown(row) {
      this.$emit("movedown", row);
    },
    del(row) {
      this.$emit("del", row);
    },
    switchChange(e, row, index) {
      this.$emit("hidden", e, row, index);
    },
    currentChange(page) {
      // console.log("currentChange-page:", page);
      this.$router.push({
        path: "",
        query: { page },
      });
      this.page = page;
      this.getList(page);
    },
    handleSelectionChange(val) {
      // console.log("handleSelectionChange-val:", val);
      this.$emit("select", val);
    },
    clearSelection() {
      this.$refs["list"].clearSelection();
    },
  },
};
</script>

<style lang="scss">
.sui-list {
  .imgbg {
    width: 100px;
    height: 100px;
  }
  .list-pagination {
    margin-top: 10px;
    text-align: right;
  }
  .image-slot {
    width: 100%;
    height: 100%;
    background-color: #f5f7fa;
    display: flex;
    justify-content: center;
    align-items: center;

    &-icon {
      font-size: 30px;
    }
  }
}
</style>