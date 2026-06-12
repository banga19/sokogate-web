<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <el-backtop target="#app" :bottom="100"></el-backtop>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    key() {
      // console.log(this.$route);
      // return this.$route.fullPath;
      return this.$route.path;
    },
  },
  created() {
    this.autoChange();
  },
  methods: {
    autoChange() {
      // console.log(
      //   "navigator.language:",
      //   navigator.language,
      //   navigator.languages
      // );

      var setlanguage = localStorage.getItem("language");
      if (
        setlanguage == "en" ||
        setlanguage == "zh" ||
        setlanguage == "fra" ||
        setlanguage == "spa" ||
        setlanguage == "pt" ||
        setlanguage == "ara" ||
        setlanguage == "ru" ||
        setlanguage == "per" ||
        setlanguage == "hi"
      ) {
        this.$i18n.locale = setlanguage;
      } else {
        switch (navigator.language) {
          case "zh":
          case "zh-CN":
          case "zh-TW":
          case "zh-HK":
            this.$i18n.locale = "zh";
            break;
          case "en":
          case "en-AU":
          case "en-CA":
          case "en-US":
          case "en-ZA":
          case "en-NZ":
          case "en-IN":
          case "en-GB-oxendict":
          case "en-GB":
            this.$i18n.locale = "en";
            break;
          case "fr":
          case "fr-FR":
          case "fr-CA":
          case "fr-CH":
            this.$i18n.locale = "fra";
            break;
          case "es":
          case "es-AR":
          case "es-CO":
          case "es-CR":
          case "es-HN":
          case "es-419":
          case "es-US":
          case "es-PE":
          case "es-MX":
          case "es-VE":
          case "es-UY":
          case "es-ES":
          case "es-CL":
            this.$i18n.locale = "spa";
            break;
          case "pt":
          case "pt-BR":
          case "pt-PT":
            this.$i18n.locale = "pt";
            break;
          case "ar":
            this.$i18n.locale = "ara";
            break;
          case "ru":
            this.$i18n.locale = "ru";
            break;
          case "fa":
            this.$i18n.locale = "per";
            break;
          case "hi":
            this.$i18n.locale = "hi";
            break;
          default:
            this.$i18n.locale = "en";
            break;
        }
      }
    },
  },
};
</script>

<style lang="scss">
@use "./style/element_reset.scss";
@use "./style/bootstrap_reset.scss";

$--color-primary: teal;

#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.colorful {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
body {
  margin: 0;
  padding: 0;
}

.w {
  display: block;
  margin: 0 auto;
  width: 1190px;
}
img {
  max-width: 100%;
}
.centre {
  display: flex;
  justify-content: center;
  align-items: center;
}
.toast:not(.show) {
  display: inherit;
}
.imgbg {
  background-image: url("https://oss.sokogate.com/static/photoshop_background.png");
}
.max-one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.max-tow-line {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.flex-box {
  width: 100%;
  display: flex;
  align-items: center;
}
.flex-item-space {
  flex-grow: 1;
}

.bottom-space {
  height: 80px;
  display: block;
}
</style>
