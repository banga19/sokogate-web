<template>
  <div class="about-page">
    <!-- 页面标题 -->
    <h1>About Sokogate</h1>
    
    <!-- 公司简介 -->
    <section class="section">
      <p>Sokogate is a global B2B commerce and sourcing platform connecting businesses to manufacturers and suppliers worldwide.</p>
      <p>We help companies source products efficiently, negotiate better pricing, and manage cross-border trade with confidence. By combining technology, supplier networks, and logistics coordination, Sokogate simplifies bulk purchasing and international procurement for modern businesses.</p>
    </section>

    <!-- 服务内容 -->
    <section class="section">
      <h2>What We Do</h2>
      <p class="subtitle">Sokogate is built for scale, speed, and trust:</p>
      
      <ul class="services-list">
        <li>
          <strong>🏭 Direct Manufacturer Access</strong><br>
          We connect buyers with verified factories and suppliers, with a strong focus on China-to-global trade.
        </li>
        <li>
          <strong>Bulk & Wholesale Sourcing</strong><br>
          Designed for importers, distributors, retailers, and enterprises sourcing at volume.
        </li>
        <li>
          <strong>Flexible Payment Structures</strong><br>
          Transparent pricing, deposits, milestone payments, and buyer protection mechanisms.
        </li>
        <li>
          <strong>Quality Control & Verification</strong><br>
          Supplier vetting, product inspections, and order tracking to reduce risk.
        </li>
        <li>
          <strong>🚢 Logistics & Trade Support</strong><br>
          Shipping coordination, documentation support, and end-to-end order visibility.
        </li>
      </ul>
    </section>

    <!-- 服务对象 -->
    <section class="section">
      <h2>Who We Serve</h2>
      <ul class="clients-list">
        <li>Importers and distributors</li>
        <li>Retail chains and wholesalers</li>
        <li>SMEs and fast-growing startups</li>
        <li>Large enterprises sourcing internationally</li>
      </ul>
    </section>

    <!-- 愿景 -->
    <section class="section">
      <h2>Our Vision</h2>
      <p>To become a leading global gateway for B2B trade, enabling businesses to source, buy, and scale across borders with ease.</p>
    </section>

    <!-- 使命 -->
    <section class="section">
      <h2>Our Mission</h2>
      <p>To remove complexity from international sourcing by delivering a transparent, technology-driven platform that empowers businesses to trade smarter and grow faster.</p>
    </section>

    <!-- 标语 -->
    <section class="section">
      <h2>Why Sokogate</h2>
      <p class="highlight">Because global sourcing should be simple, secure, and profitable.</p>
      
      <div class="taglines">
        <p>"Your Gateway to Global Sourcing."</p>
        <p>"B2B Trade. Simplified."</p>
        <p>"From Factory to Market — Made Easy."</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style lang="scss" scoped>
// 基础样式
.about-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 30px;
    color: #ef2e22;
    border-bottom: 2px solid #ef2e22;
    padding-bottom: 10px;
  }
  
  h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 30px 0 15px 0;
    color: #333;
  }
}

// 区块样式
.section {
  margin-bottom: 40px;
  
  p {
    margin-bottom: 15px;
    font-size: 16px;
    color: #444;
  }
  
  .subtitle {
    font-size: 17px;
    font-weight: 500;
    margin-bottom: 20px;
    color: #555;
  }
}

// 服务列表
.services-list {
  list-style: none;
  padding-left: 0;
  margin-top: 20px;
  
  li {
    margin-bottom: 25px;
    padding-left: 0;
    
    strong {
      display: block;
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 5px;
      color: #ef2e22;
    }
    
    &::before {
      display: none;
    }
  }
}

// 客户列表
.clients-list {
  list-style: none;
  padding-left: 0;
  
  li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    
    &::before {
      content: "•";
      color: #ef2e22;
      font-size: 20px;
      position: absolute;
      left: 0;
      top: -2px;
    }
  }
}

// 高亮文本
.highlight {
  font-size: 18px !important;
  font-weight: 500;
  color: #ef2e22 !important;
  margin: 20px 0 !important;
}

// 标语
.taglines {
  margin-top: 30px;
  
  p {
    font-style: italic;
    font-size: 16px;
    color: #666;
    margin-bottom: 10px !important;
    padding-left: 15px;
    border-left: 3px solid #eee;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .about-page {
    padding: 30px 15px;
    
    h1 {
      font-size: 24px;
    }
    
    h2 {
      font-size: 20px;
    }
  }
}
</style>