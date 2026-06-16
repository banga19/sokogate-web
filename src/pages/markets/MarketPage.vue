<template>
  <div class="market-page-container">
    <div class="market-page">
      <div class="market-header">
        <h1 class="market-title">{{ market.h1 }}</h1>
      </div>
      
      <div class="snippet-section">
        <p class="featured-snippet">{{ market.snippet }}</p>
        <router-link :to="'/v2/login'" class="cta-button">Start Importing Now</router-link>
      </div>

      <div class="howto-section">
        <h2 class="section-title">
          <i class="el-icon-truck"></i>
          How to Import - {{ market.steps.length }} Steps
        </h2>
        <div class="steps-container">
          <div v-for="(step, i) in market.steps" :key="i" class="step-item">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="faq-section">
        <h2 class="section-title">
          <i class="el-icon-question"></i>
          Frequently Asked Questions
        </h2>
        <div v-for="(faq, i) in market.faqs" :key="i" class="faq-item">
          <h3 class="faq-question">{{ faq.q }}</h3>
          <p class="faq-answer">{{ faq.a }}</p>
        </div>
      </div>

      <div class="market-footer">
<div class="payment-methods">
         <h4>Accepted Payment Methods:</h4>
         <ul class="payment-list">
           <li v-if="market.currency === 'GHS'">MTN MoMo, Visa</li>
           <li v-else-if="market.currency === 'XOF' || market.currency === 'XAF'">Orange Money, Moov Money</li>
           <li v-else>M-Pesa, EcoCash, Visa</li>
         </ul>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MARKETS } from "@/locale/markets";

export default {
  name: "MarketPage",
  props: {
    marketKey: {
      type: String,
      required: true
    }
  },
  computed: {
    market() {
      return MARKETS[this.marketKey] || MARKETS.GN;
    }
  },
  metaInfo() {
    const m = this.market;
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: m.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    };
    
    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: m.h1,
      description: m.snippet,
      totalTime: 'P21D',
      step: m.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.desc
      }))
    };
    
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `Sokogate ${m.name}`,
      url: `https://sokogate.com/${m.slug}`,
      areaServed: m.name
    };

    return {
      title: m.metaTitle,
      meta: [
        { name: 'description', content: m.metaDesc },
        { name: 'robots', content: 'index, follow' }
      ],
      script: [
        { type: 'application/ld+json', json: faqSchema },
        { type: 'application/ld+json', json: howToSchema },
        { type: 'application/ld+json', json: localBusinessSchema }
      ]
    };
  }
};
</script>

<style scoped>
.market-page-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 30px 20px;
}

.market-page {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.market-title {
   font-size: 28px;
   font-weight: 700;
   color: #333;
   margin: 0;
   line-height: 1,3;
 }

 .snippet-section {
  background: #f8f9ff;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
}

.featured-snippet {
  font-size: 18px;
  line-height: 1,7;
  color: #555;
  margin: 0 0 20px 0;
}

.cta-button {
  display: inline-block;
  background: #EF2E22;
  color: #fff;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: #d4261f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 46, 34, 0.3);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 30px 0 20px 0;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  border-left: 4px solid #EF2E22;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #EF2E22;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.step-content p {
  margin: 0;
  color: #666;
  line-height: 1,6;
}

.faq-section {
  margin-top: 30px;
}

.faq-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
}

.faq-question {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.faq-answer {
  color: #666;
  margin: 0;
  line-height: 1,6;
}

.market-footer {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.payment-methods h4 {
   margin: 0 0 15px 0;
   color: #555;
   font-size: 14px;
 }

 .payment-list {
   margin: 0;
   padding: 0;
   list-style: none;
   color: #666;
   font-size: 14px;
 }
</style>