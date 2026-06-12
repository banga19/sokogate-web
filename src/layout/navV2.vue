<template>
  <b-list-group class="list">
    <template v-for="(item, index) in filterList">
      <b-list-group-item href="#" class="list-cel d-flex justify-content-between align-items-center">
        <i class="sokogate category-list" :class="iconMap[item.categoryName]" />
        <div class="list-cel-title" @click="navtoProductlist(item.id)" :title="categoryLabel(item.categoryName)">
          {{ categoryLabel(item.categoryName) }}
        </div>
        <div class="pad" :key="`pad-${index}`">
          <template v-for="(subItem, subIndex) in item.children">
            <b-navbar-nav class="list-cel-nav" small>
              <b-nav-item class="subCategory">
                <i class="sokogate" :class="iconMap[subItem.categoryName]" />
                  <b-button class="list-cel-nav-item text-decoration-none" variant="link"
                    @click="navtoProductlist(subItem.id)">
                  {{ categoryLabel(subItem.categoryName) }}
                  <i class="sokogate icon-a-Path171" />
                </b-button>
              </b-nav-item>
              <b-nav-item>
                <b-button-group class="list-cel-nav-sub">
                  <template v-for="(ssItem, ssIndex) in subItem.children">
                      <b-button class="list-cel-nav-sub-item text-decoration-none" variant="link"
                        @click="navtoProductlist(ssItem.id)">
                        <i class="sokogate" :class="iconMap[ssItem.categoryName]" style="padding-right: 5px" />
                        {{ categoryLabel(ssItem.categoryName) }}</b-button>
                  </template>
                </b-button-group>
              </b-nav-item>
            </b-navbar-nav>
          </template>
        </div>
        <!-- 右箭头 -->
        <!-- <i class="sokogate icon-a-Path171" /> -->
      </b-list-group-item>
    </template>
    <b-list-group-item href="#" class="list-cel d-flex justify-content-between align-items-center">
      <i class="sokogate category-list icon-more" />
      <div class="list-cel-title" @click="navtoProductlist()">
        {{ $t(`category.more`) }}
      </div>
    </b-list-group-item>
  </b-list-group>
</template>
<script>
import useNav from './useNav';

export default {
  name: 'NavV2',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    iconMap() {
      return useNav(this).iconMap
    },
    filterList() {
      return useNav(this).filterList
    }
  },
  methods: {
    categoryLabel(name) {
      if (!name) return ''
      const translated = this.$t(`category.${name}`)
      return translated === `category.${name}` ? name : translated
    },
    navtoProductlist(id) {
      return useNav(this).navtoProductlist(id)
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
$mainColor: #EF2E22;

.list {
  width: 200px;
  display: block;
  padding-bottom: 10px;
  position: relative;
  z-index: 100;
  color: #000;

  &-cel {
    font-size: 14px;
    transition: 0.3s;
    height: 30px;
    position: initial;
    border: unset;
    padding: 0 1.25rem;


    .category-list {
      padding-right: 10px;
    }

    &-title {
      flex-grow: 1;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pad {
      top: 0;
      left: 200px;
      width: 920px;
      min-height: 330px;
      position: absolute;
      background-color: #fff;
      box-shadow: 2px 3px 5px #efefef;
      display: none;
      transition-duration: .25s;
      transition-behavior: allow-discrete;
      opacity: 0;

      .navbar-nav {
        display: flex;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
        flex-direction: row;

        .subCategory {
          min-width: 120px;
          flex: none;
        }
      }
    }

    &:hover {
      color: $mainColor;
      background-color: #fff;

      .pad {
        display: block;
        opacity: 1;
      }
    }

    &-nav {
      min-height: 42px;
      margin-left: 20px;
      border-bottom: 1px dashed #bcbcbc;

      &-item {
        color: #333;
        font-weight: bold;
        font-size: 12px;

        &:hover {
          color: $mainColor;
        }

        .sokogate {
          margin-left: 5px;
          font-size: 12px;
          transform: scale(0.75);
          display: inline-block;
        }
      }

      &-sub {
        justify-content: flex-start;
        flex-wrap: wrap;

        &-item {
          flex: none;
          color: #888;
          font-size: 12px;

          &:hover {
            color: $mainColor;
          }
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>