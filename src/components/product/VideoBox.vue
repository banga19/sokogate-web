<template>
  <div class="video-wrap">
    <div class="video-play-wrap">
      <i
        v-if="!playing"
        class="sokogate video-play icon-play"
        @click="videoPlay"
      ></i>
    </div>
    <el-image class="video-cover" :src="url" v-if="!playing" fit="contain">
    </el-image>
    <template v-else>
      <video
        id="video"
        :src="src"
        class="video"
        controls="controls"
        controlsList="nodownload"
        @play="playing = true"
        @ended="playing = false"
      ></video>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      playing: false,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "1:1", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  methods: {
    videoPlay() {
      this.playing = true;
      this.$nextTick(() => {
        // console.log(
        //   "this.video.FileUpload.FileUrl:",
        //   this.video.FileUpload.FileUrl
        // );
        // this.$refs.videoPlayer.player.src(this.video.FileUpload.FileUrl); // 重置进度条
        // this.$refs.videoPlayer.player.play(); // 播放
      });
    },
  },
};
</script>

<style lang="scss">
.video {
  width: 100%;
  height: 100%;
  object-fit: contain;

  &-wrap {
    position: relative;
  }
  &-cover {
    width: 100%;
    height: 100%;
  }
  &-play {
    font-size: 60px;
    color: rgba(255, 255, 255, 0.9);
    z-index: 3;

    &-wrap {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
    }

    &:hover {
      color: rgba(220, 220, 220, 0.9);
    }
  }
}
.transcoding {
  background-color: #fff;
}
</style>