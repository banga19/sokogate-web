<template>
  <div class="recomm-list-limit-by-newproduct">
    <br />
    <div class="title">{{ title }}</div>
    <div class="mouse-wheel-horizontal-scroll">
      <!-- 导航按钮 -->
      <button class="nav-btn prev-btn" @click="scrollPrev">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button class="nav-btn next-btn" @click="scrollNext">
        <i class="el-icon-arrow-right"></i>
      </button>
      <div class="mouse-wheel-wrapper" ref="scroll">
        <div class="mouse-wheel-content">
          <div class="mouse-wheel-item" v-for="(item, n) in getProductList" :key="item.id">
            <div v-if="item.loading">
              <el-skeleton :loading="AILoading" animated>
                <template slot="template">
                  <div class="item">
                    <div class="imgBox">
                      <el-skeleton-item variant="image" class="img" />
                    </div>
                    <div class="name"><el-skeleton-item variant="text" /></div>
                    <div class="price"><el-skeleton-item variant="text" style="width: 50%;" /></div>
                    <div class="origin"><el-skeleton-item variant="text" style="width: 30%;" /></div>
                  </div>
                </template>
              </el-skeleton>
            </div>
            <card-large-fit v-else :item="item" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="getProductList.length">
    </div>


    <el-skeleton v-else slot="placeholder" style="width: 100%; height: 26,6vw" :loading="true" animated>
      <template slot="template">
        <el-skeleton-item variant="image" style="width: 100%; height: 26,6vw" />
        <br />
        <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
        <br />
        <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import {
  GetSpuList,
  GetIntelligentRecommend,
  GetSpuListByIds,
} from '@/utils/api'
import CardLargeFit from './CardLargeFit'
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import { get, last, uniqBy } from 'lodash'

BScroll.use(MouseWheel)

export default {
  components: { CardLargeFit },
  props: {
    title: {
      type: String,
      default: '',
    },
    productId: {
      type: String,
      default: '',
    },
    productName: {
      type: String,
      default: '',
    },
    categoryIdList: {
      type: [Array, undefined],
      default: () => [],
    },
  },
  data() {
    return {
      req: {
        categoryId: '',
        desc: 1, // 排序
        page: 1,
        orderKey: '', //按create时间来排序
        pageSize: 30,
        search: '',
      },
      productList: [],
      AIProductList: [],
      AILoading: true,
    }
  },
  computed: {
    // 汇率
    erMap() {
      return (
        this.productList[0].exchangeRateList
          ? this.productList[0].exchangeRateList
          : []
      ).reduce((a, v) => {
        return {
          ...a,
          [v.currencyFrom]: v.rate,
        }
      }, {})
    },
    getProductList() {
      const result = []
      if (this.AIProductList && this.AIProductList.length) {
        result.push(...this.AIProductList)
      } else if (this.AILoading) {
        result.push(...[
          { id: '_1', loading: true },
          { id: '_2', loading: true },
          { id: '_3', loading: true },
        ])
      }
      return uniqBy(result.concat(
        this.productList.slice(
          0,
          this.productList.length - result.length
        )
      ).filter(i => i.id !== this.productId), 'id')
    },
  },
  watch: {
    productName: {
      handler(val, oVal) {
        if (!oVal && val) {
          this.getAIRecommend(val)
        }
      },
      immediate: true,
    },
    categoryIdList: {
      handler(val, oVal) {
        if (val.length) {
          this.req.categoryId = last(val)
          this.getRecommListbyTypes()
        }
      },
      immediate: true,
    },
  },
  created() {
    this.req.categoryId = this.$route.query.cid
    this.getRecommListbyTypes()
  },
  beforeDestroy() {
    if (this.bs) {
      this.bs.destroy()
    }
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
      })
    },
    async getAIRecommend(text) {
      if (!this.$store.getters.authTokenIsValid) {
        this.AILoading = false
        return false
      }
      try {
        this.AILoading = true
        const res = await GetIntelligentRecommend(text)
        let idObjectList = get(res, 'data.output.text')
        idObjectList = JSON.parse(idObjectList)
        if (Array.isArray(idObjectList)) {
          const productRes = await GetSpuListByIds({
            idList: idObjectList.map(i => i.id),
          })
          this.AIProductList = get(productRes, 'data.rows')
        }
        if (!this.AIProductList.length) {
          throw new Error('获取 AI 推荐failed')
        }
      } catch (error) {
      }
      this.AILoading = false
    },
    getRecommListbyTypes() {
      if (!this.req.categoryId) {
        return
      }
      GetSpuList(this.req).then(res => {
        this.productList = res.data.rows
        this.$nextTick(() => {
          this.init()
        })
      })
    },
    scrollPrev() {
      if (!this.bs) return

      const currentX = this.bs.x
      const itemWidth = 220 + 16 // 项目宽度 + 间距
      const newX = currentX + itemWidth * 3 // 每次滚动3个项目

      this.bs.scrollTo(newX, 0, 500)
    },

    scrollNext() {
      if (!this.bs) return

      const currentX = this.bs.x
      const itemWidth = 220 + 16 // 项目宽度 + 间距
      const newX = currentX - itemWidth * 3 // 每次滚动3个项目

      // 限制不能滚动超过内容边界
      const maxScrollX = this.bs.maxScrollX
      const targetX = Math.max(newX, maxScrollX)

      this.bs.scrollTo(targetX, 0, 500)
    },

  },
}
</script>

<style lang="scss" scoped>
@use '@/style/_responsive.scss' as *;

.recomm-list-limit-by-newproduct {
  padding-top: 30px;

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color: #000;
    margin-bottom: 30px;
  }

}


.mouse-wheel-horizontal-scroll {
  position: relative;

  .mouse-wheel-wrapper {
    width: 100%;
    margin: 0 auto;
    white-space: nowrap;
    overflow: hidden;

    .mouse-wheel-content {
      display: flex;
      flex-wrap: nowrap;
      width: max-content; // 让内容宽度基于子元素总宽度
      min-width: 100%; // 确保内容至少和容器一样宽

      .mouse-wheel-item {
        width: 220px;
        flex: 0 0 auto; // 不拉伸, 不收缩

        &+.mouse-wheel-item {
          margin-left: 16px;
        }
      }
    }
  }
}



.item {
  cursor: pointer;

  .imgBox {
    border-radius: .417vw;
    overflow: hidden;
    width: 100%;
    height: 292px;
    margin: 0 auto;

    .img {
      width: 100%;
      height: 100%;
      background-color: #cfcfcf;
      overflow: hidden;
    }

  }
}

// 导航按钮样式
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #333;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: #f5f5f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.prev-btn {
    left: -20px;
  }

  &.next-btn {
    right: -20px;
  }

  // 在移动端隐藏按钮
  @media (max-width: 768px) {
    display: none;
  }
}
</style>
