<template>
  <div>
    <div class="app-guide-overlay" ref="appGuideRef">
      <div class="app-guide-header">
        <div class="app-icon">S</div>
        <div class="app-info">
          <div class="app-name">SokoGate</div>
          <div class="app-tagline">{{ $t('productDetail.A more convenient shopping experience') }}</div>
        </div>
        <button class="close-btn" @click="hide">×</button>
      </div>
      <div class="app-guide-body">
        <div class="guide-title">{{ $t('productDetail.Open in the App for full functionality') }}</div>
        <div class="guide-text">{{ $t('productDetail.To App experience') }}</div>
        <div class="action-buttons">
          <a :href="getURLScheme()" class="btn btn-primary">{{ $t('productDetail.Open in the App') }}</a>
          <a href="/appDownload.html" class="btn btn-secondary">{{ $t('productDetail.Download the App') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailToApp',
  mounted() {
    if (this.$store.state.nav.layoutMode !== 'PC') {
      this.show()
    }
  },
  methods: {
    show() {
      this.$refs.appGuideRef.style.display = 'block';
    },
    hide() {
      this.$refs.appGuideRef.style.display = 'none';
    },
    getURLScheme() {
      const targetUrl = `${location.pathname}${location.search}`;
      const encodedUrl = encodeURIComponent(targetUrl);
      const schemeUrl = `sokogate://open?url=${encodedUrl}`;
      return schemeUrl
    }
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";

$mainColor: #EF2E22;

// 引导浮层样式
.app-guide-overlay {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
  transform-origin: bottom right;
  display: none;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}

.app-guide-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, color.adjust($mainColor, $lightness: 25%) 0%, $mainColor 100%);
  color: white;
}

.app-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: $mainColor;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: bold;
  color: white;
  font-size: 20px;
}

.app-info {
  flex: 1;
}

.app-name {
  font-weight: 600;
  font-size: 16px;
}

.app-tagline {
  font-size: 12px;
  opacity: 0.9;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

.app-guide-body {
  padding: 20px;
}

.guide-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
}

.guide-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;

  &-primary {
    background: $mainColor;
    color: white;

    &:hover {
      background: color.adjust($mainColor, $lightness: -8%);
    }
  }

  &-secondary {
    background: #f1f2f6;
    color: #2c3e50;

    &:hover {
      background: #e4e5e9;
    }
  }
}

// 响应式调整
@media (max-width: 480px) {
  .app-guide-overlay {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
  }
}
</style>