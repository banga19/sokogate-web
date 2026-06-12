<template>
  <b-container class="merchant-settlement-page">
    <div v-title :data-title="$t('common.aboutus')">
      <Breadcrumb :items="items" />
      <div v-if="locale == 'zh'">
        <p class="about-title">关于我们的SOKOGATE</p>
        <h4>
            Sokogate是一个创新的在线市场，它将斯瓦希里语单词“SOKO”(意思是“商店”)与英语单词“GATE”无缝结合在一起。这种融合反映了我们作为一个充满活力的B2B和B2C电子商务平台的使命，该平台将制造商与批发商和消费者联系起来。Sokogate总部位于中国广州，为企业和个人提供了一个享有盛誉的市场。
        </h4>
        <h4>
            我们的主要目标是为中小型企业和消费者提供一个用户友好的平台，让他们展示和获取各种各样的产品。通过Sokogate，制造商有机会展示他们的产品，而批发商和消费者可以方便地浏览，选择和购买他们想要的产品。
        </h4>
        <h4>
            凭借对质量、透明度和效率的承诺，Sokogate促进了商业交易，促进了经济增长，并促进了全球贸易关系网络。我们致力于弥合供应商和买家之间的差距，促进经济增长，并提供一个值得信赖的商业平台。
        </h4>
        <h4>
            Sokogate欢迎您探索我们的在线市场，体验企业对企业和企业对消费者商务的新时代。
        </h4>
      </div>
      <div v-else-if="locale == 'en'">
        <p class="about-title">SOKOGATE ABOUT US</p>
        <h4>
            Sokogate is an innovative online marketplace that seamlessly combines the Swahili word "SOKO," meaning "shop," with the English word "GATE."  This fusion reflects our mission as a dynamic B2B and B2C e-commerce platform that connects manufacturers with wholesalers and consumers.  Based in Guangzhou, People's Republic of China, Sokogate serves as a prestigious marketplace for businesses and individuals alike.
        </h4>
        <h4>
            Our primary objective is to empower small and medium enterprises (SMEs) and consumers by providing them with a user-friendly platform to showcase and access a wide range of products.  Through Sokogate, manufacturers have the opportunity to showcase their products, while wholesalers and consumers can conveniently browse, select, and purchase the products they desire.        </h4>
        <h4>
            With a commitment to quality, transparency, and efficiency, Sokogate facilitates business transactions, fosters economic growth, and promotes a global network of trade relationships.  We are dedicated to bridging the gap between suppliers and buyers, fostering economic growth, and providing a trusted platform for commerce.
        </h4>
        <h4>
            Sokogate welcomes you to explore our online marketplace and experience a new era of business-to-business and business-to-consumer commerce.        </h4>
      </div>
      <div v-else-if="locale == 'fra'">
        <p class="about-title">À propos de notre socogate</p>
        <h4>
            Sokogate est un marché en ligne innovant qui combine parfaitement le mot Swahili «SOKO», qui signifie «boutique», avec le mot anglais «GATE». Cette fusion reflète notre mission en tant que plateforme e-commerce B2B et B2C dynamique qui relie les fabricants aux grossistes et aux consommateurs. Basée à Guangzhou, en république populaire de Chine, Sokogate est un marché prestigieux pour les entreprises et les particuliers.
        </h4>
        <h4>
            Notre objectif premier est d’autonomiser les petites et moyennes entreprises (pme) et les consommateurs en leur fournissant une plate-forme conviviale pour présenter et accéder à une large gamme de produits. Grâce à Sokogate, les fabricants ont la possibilité de présenter leurs produits, tandis que les grossistes et les consommateurs peuvent facilement parcourir, sélectionner et acheter les produits qu’ils souhaitent.        </h4>
        <h4>
            Avec un engagement envers la qualité, la transparence et l’efficacité, Sokogate facilite les transactions commerciales, favorise la croissance économique et promeut un réseau mondial de relations commerciales. Nous nous engageons à combler le fossé entre les fournisseurs et les acheteurs, à favoriser la croissance économique et à fournir une plate-forme de confiance pour le commerce.        </h4>
        <h4>
            Sokogate vous souhaite la bienvenue pour explorer notre marché en ligne et vivre une nouvelle ère de commerce interentreprises et interentreprises.        </h4>
      </div>
      <div v-else-if="locale == 'spa'">
        <p class="about-title">Sobre nuestro socoguet</p>
        <h4>
            Sokogate es un mercado en línea innovador que combina a la perfección la palabra Swahili "SOKO ", que significa "tienda", con la palabra inglesa "GATE ". Esta fusión refleja nuestra misión como una dinámica plataforma de comercio electrónico B2B y B2C que conecta a fabricantes con mayoristas y consumidores. Con sede en Guangzhou, República popular China, Sokogate sirve como un mercado de prestigio para empresas y particulares por igual.
        </h4>
        <h4>
            Nuestro objetivo principal es empodera las pequeñas y medianas empresas (pymes) y los consumidores proporcionándoles una plataforma fácil de usar para mostrar y acceder a una amplia gama de productos. A través de Sokogate, los fabricantes tienen la oportunidad de mostrar sus productos, mientras que los mayoristas y los consumidores pueden navegar, seleccionar y comprar los productos que deseen.        </h4>
        <h4>
            Con un compromiso con la calidad, la transparencia y la eficiencia, Sokogate facilita las transacciones comerciales, fomenta el crecimiento económico y promueve una red global de relaciones comerciales. Nos dedicamos a cerrar la brecha entre proveedores y compradores, fomentar el crecimiento económico, y proporcionar una plataforma de confianza para el comercio.        </h4>
        <h4>
            Sokogate le da la bienvenida para explorar nuestro mercado en línea y experimentar una nueva era de negocio a negocio y de negocio a consumidor.        </h4>
      </div>
      <div v-else-if="locale == 'pt'">
        <p class="about-title">SOKOGATE SOBRE NÓS</p>
        <h4>
            Sokogate é um mercado online inovador que combina perfeitamente a palavra suaíli "SOKO", que significa "loja", com a palavra inglesa "GATE".  Essa fusão reflete nossa missão como uma plataforma dinâmica de comércio eletrônico B2B e B2C que conecta fabricantes com atacadistas e consumidores.  Com sede em Guangzhou, República Popular da China, a Sokogate serve como um mercado de prestígio para empresas e indivíduos.
        </h4>
        <h4>
            Nosso principal objetivo é capacitar pequenas e médias empresas (PMEs) e consumidores, fornecendo-lhes uma plataforma amigável para mostrar e acessar uma ampla gama de produtos.  Através do Sokogate, os fabricantes têm a oportunidade de mostrar seus produtos, enquanto atacadistas e consumidores podem convenientemente navegar, selecionar e comprar os produtos que desejam.        </h4>
        <h4>
            Com um compromisso com a qualidade, transparência e eficiência, a Sokogate facilita as transações comerciais, promove o crescimento econômico e promove uma rede global de relações comerciais.  Estamos dedicados a preencher a lacuna entre fornecedores e compradores, promover o crescimento econômico e fornecer uma plataforma confiável para o comércio.        </h4>
        <h4>
            A Sokogate dá-lhe as boas-vindas para explorar o nosso mercado online e experimentar uma nova era de comércio entre empresas e entre empresas e consumidores.        </h4>
      </div>
      <div v-else-if="locale == 'ara'">
        <p class="about-title">عن سوكولجيت</p>
        <h4>
            إن سوكوغات سوق إبداعية على شبكة الإنترنت تجمع بسلاسة بين الكلمة السواحلية "سوكو" التي تعني "متجر" والكلمة الإنجليزية "جيت". ويعكس هذا الاندماج مهمتنا كمنصة ديناميكية للتجارة الإلكترونية بين مؤسسات الأعمال وبين مؤسسات الأعمال والمستهلكين تربط المصنعين بتجار الجملة والمستهلكين. مقرها في قوانغتشو، جمهورية الصين الشعبية، سوكوجيت بمثابة سوق مرموقة للشركات والأفراد على حد سواء.</h4>
        <h4>
            وهدفنا الرئيسي هو تمكين المؤسسات الصغيرة والمتوسطة والمستهلكين بتزويدهم بمنبر سهل الاستخدام لعرض طائفة واسعة من المنتجات والحصول عليها. ومن خلال نظام سوكوغات، تتاح للمصنعين الفرصة لعرض منتجاتهم، في حين يمكن لتجار الجملة والمستهلكين تصفح واختيار وشراء المنتجات التي يرغبون فيها.
        </h4>
        <h4>
            ومن خلال الالتزام بالجودة والشفافية والكفاءة، يعمل سوكوغات على تيسير المعاملات التجارية، وتعزيز النمو الاقتصادي، وتعزيز شبكة عالمية من العلاقات التجارية. ونحن حريصون على سد الفجوة بين الموردين والمشترين، وتعزيز النمو الاقتصادي، وتوفير منصة جديرة بالثقة للتجارة.
        </h4>
        <h4>
            سوكوجيت يرحب بكم لاستكشاف سوقنا على الإنترنت وتجربة عصر جديد من التجارة بين الأعمال التجارية وبين الأعمال التجارية والمستهلكين. 
        </h4>
      </div>
      <div v-else-if="locale == 'ru'">
        <p class="about-title">о нас</p>
        <h4>
            Sokogate — инновационный интернет-рынок, который гармонично сочетает в себе суахили слово "SOKO ", означающее "магазин", с английским словом "GATE ". Это слияние отражает нашу миссию как динамичной платформы электронной коммерции B2B и B2C, которая связывает производителей с оптовыми торговцами и потребителями. Расположенная в гуанчжоу, Китайская Народная Республика, Sokogate является престижным рынком как для бизнеса, так и для частных лиц.
        </h4>
        <h4>
            Наша главная цель заключается в расширении прав и возможностей малых и средних предприятий (МСП) и потребителей путем предоставления им удобной для пользователей платформы для демонстрации широкого ассортимента продукции и доступа к ней. Через Sokogate производители имеют возможность продемонстрировать свою продукцию, в то время как оптовики и потребители могут удобно просматривать, выбирать и покупать продукцию, которую они хотят.
        </h4>
        <h4>
            Будучи приверженной качеству, прозрачности и эффективности, сокогате способствует деловым операциям, стимулирует экономический рост и способствует развитию глобальной сети торговых отношений. Мы привержены сокращению разрыва между поставщиками и покупателями, содействию экономическому росту и обеспечению надежной платформы для торговли.
        </h4>
        <h4>
            Компания Sokogate приглашает вас познакомиться с нашим онлайн-рынком и познакомиться с новой эрой торговли между предприятиями и потребителями.
        </h4>
      </div>
      <div v-else-if="locale == 'per'">
        <p class="about-title">درباره ما</p>
        <h4>
            Sokogate یک بازار انلاین نواورانه است که به طور یکپارچه کلمه سواحیلی "SOKO" به معنی "فروشگاه" را با کلمه انگلیسی "GATE" ترکیب می کند. این فیوژن نشان دهنده ماموریت ما به عنوان یک پلت فرم تجارت الکترونیک پویا B2B و B2C است که تولید کنندگان را با عمده فروشان و مصرف کنندگان متصل می کند. مستقر در گوانگژو، جمهوری خلق چین، Sokogate به عنوان یک بازار معتبر برای کسب و کار و افراد به طور یکسان عمل می کند.
        </h4>
        <h4>
            هدف اصلی ما توانمند سازی شرکت های کوچک و متوسط (SMEs) و مصرف کنندگان با ارائه یک پلت فرم کاربر پسند برای نمایش و دسترسی به طیف گسترده ای از محصولات است. از طریق Sokogate، تولید کنندگان این فرصت را دارند که محصولات خود را به نمایش بگذارند، در حالی که عمده فروشان و مصرف کنندگان می توانند به راحتی محصولات مورد نظر خود را مرور، انتخاب و خریداری کنند.
        </h4>
        <h4>
            با تعهد به کیفیت، شفافیت و کارایی، Sokogate معاملات تجاری را تسهیل می کند، رشد اقتصادی را تقویت می کند و شبکه جهانی روابط تجاری را ترویج می کند. ما متعهد به پر کردن شکاف بین تامین کنندگان و خریداران، تقویت رشد اقتصادی و ارائه یک پلت فرم قابل اعتماد برای تجارت هستیم.
        </h4>
        <h4>
            Sokogate از شما استقبال می کند تا بازار انلاین ما را کشف کنید و عصر جدیدی از تجارت کسب و کار به کسب و کار و تجارت به مصرف کننده را تجربه کنید.
        </h4>
      </div>
      <div v-else-if="locale == 'hi'">
        <p class="about-title">SOKOGATE ABOUT US</p>
        <h4>
            सोकोगेट हे एक अभिनव ऑनलाइन मार्केटप्लेस आहे जे स्वाहिली शब्द "सोको" म्हणजे "शॉप" आणि इंग्रजी शब्द "गेट" एकत्र करते. हे फ्यूजन गतिशील बी 2 बी आणि बी 2 सी ई-कॉमर्स प्लॅटफॉर्म म्हणून आमचे ध्येय प्रतिबिंबित करते जे उत्पादकांना घाऊक विक्रेते आणि ग्राहकांशी जोडते. ग्वांगझू, पीपल्स रिपब्लिक ऑफ चायना येथे स्थित, सोकोगेट व्यवसाय आणि व्यक्तींसाठी एक प्रतिष्ठेची बाजारपेठ म्हणून कार्य करते.
        </h4>
        <h4>
            लघु आणि मध्यम उद्योग (एसएमई) आणि ग्राहकांना विविध प्रकारच्या उत्पादनांचे प्रदर्शन आणि प्रवेश करण्यासाठी वापरकर्ता-अनुकूल व्यासपीठ प्रदान करून त्यांचे सक्षमीकरण करणे हे आमचे प्राथमिक उद्दीष्ट आहे. सोकोगेटच्या माध्यमातून, उत्पादकांना त्यांची उत्पादने प्रदर्शित करण्याची संधी आहे, तर घाऊक विक्रेते आणि ग्राहक सोयीस्करपणे त्यांना हवी असलेली उत्पादने ब्राउझ करू शकतात, निवडू शकतात आणि खरेदी करू शकतात.
        </h4>
        <h4>
            गुणवत्ता, पारदर्शकता आणि कार्यक्षमतेच्या बांधिलकीसह, सोकोगेट व्यावसायिक व्यवहार सुलभ करते, आर्थिक वाढीस चालना देते आणि व्यापार संबंधांच्या जागतिक नेटवर्कला प्रोत्साहन देते. आम्ही पुरवठादार आणि खरेदीदार ांमधील दरी कमी करण्यासाठी, आर्थिक वाढीस चालना देण्यासाठी आणि व्यापारासाठी विश्वासार्ह व्यासपीठ प्रदान करण्यासाठी समर्पित आहोत.
        </h4>
        <h4>
            सोकोगेट आपल्या ऑनलाइन बाजारपेठेचा शोध घेण्यासाठी आणि व्यवसाय-टू-व्यवसाय आणि व्यवसाय-टू-कन्झ्युमर कॉमर्सच्या नवीन युगाचा अनुभव घेण्यासाठी आपले स्वागत करते.
        </h4>
      </div>
      <b-row>
        <b-col cols="12" md="6">
          <div class="col">
            <div
              v-for="(item, index) in list"
              :key="`aboutus_${index}`"
              class="about-msg"
            >
              <p class="adoutus-name">
                <i class="sokogate icon-pin2 icon"></i>{{ item.name }}
              </p>
              <p>{{ item.address }}</p>
              <p class="adoutus-phone">{{ item.phone }}</p>
            </div>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <!-- <img
              src="https://oss.sokogate.com/static/address.jpg"
              alt=""
              class="about-img"
            /> -->
            <MapView></MapView>
          </div>
        </b-col>
      </b-row>
      <b-row class="adout-qrcode">
        <b-col
          cols="12"
          md="4"
          v-for="(item, index) in qrcode"
          :key="`qrcode-${index}`"
        >
          <div class="qrcode-box">
            <img :src="item.img" alt="" class="qrcode-img" />
            <span>{{ item.msg }}</span>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import MapView from "@/components/Map";
export default {
  components: { Breadcrumb, MapView },
  data() {
    return {
      items: [
        {
          text: this.$t("index.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("common.aboutus"),
          active: true,
        },
      ],
      list: [
        {
          name: this.$t("common.Chinaoffice"),
          phone: "+86 020 33972585",
          address: this.$t("common.address"),
        },
        // {
        //   name: this.$t("common.Africaoffice"),
        //   address: this.$t("common.Africaoaddress"),
        //   phone: "00221 775186237",
        // },
      ],
      qrcode: [
        {
          img: "https://oss.sokogate.com/static/wechat.jpg",
          msg: "WeChat",
        },
        {
          img: "https://oss.sokogate.com/static/whatsApp.jpg",
          msg: "WhatsApp",
        },
        {
          img: "https://oss.sokogate.com/static/telegram.jpg",
          msg: "Telegram",
        },
      ],
    };
  },
  computed: {
    locale: function () {
      return this.$i18n.locale;
    },
  },
};
</script>

<style lang="scss" scoped>
.merchant-settlement-page {
  margin-top: 20px;
  .about-title {
    font-size: 30px;
    color: #ef2e22;
  }
  h4 {
    color: #000;
    padding: 30px;
    font-size: 16px;
    line-height: 30px;
  }
  .about-msg {
    width: 400px;
    margin: 8% 0 5% 0;
    border-bottom: 0.013333rem solid #e7e5e5;
    padding-bottom: 2%;
    .icon {
      font-size: 50px;
      color: #ef2e22;
    }
    .adoutus-phone {
      font-size: 30px;
      color: #000;
    }
  }
  .about-img {
    margin: 8% 0 5% 0;
    height: 550px;
  }
  .adout-qrcode {
    margin-top: 5%;
    margin-bottom: 5%;
    .qrcode-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .qrcode-img {
        width: 150px;
        height: 150px;
      }
    }
  }
}
</style>