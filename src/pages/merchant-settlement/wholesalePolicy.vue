<template>
    <b-container class="merchant-settlement-page">
  <div v-title :data-title="$t('menuitems.layout.wholesalePolicy')">
      <Breadcrumb :items="items" />
      <b-row v-if="locale == 'zh'">
        <b-col>
          <div class="col">
            <p>
              准备在领先的电子business team平台上发展批发业务.
              今天, sokgate在世界各地提供了数以百万计的买家, 允许你开始你的B2B业务.
            </p>
            <p>
              你可以批量销售你的产品, 而不是单独卖给消费者.
              sokgate让这个过程对你来说很容易, 无论你是制造商还是制造商和分销商之间的中间人.
            </p>
            <p>
              通过sokgate平台, 您可以轻松找到来自150多个国家的批发商和分销商, 并与他们进行可靠可信的沟通, 具体如下:
            </p>

            <h4>找到市场</h4>
            <p>
              找到产品和市场被认为是开始批发业务的第一步.
              sokgate提供数以千计的产品和商品供您选择.
            </p>

            <h4>得到一个报价</h4>
            <p>对于卖家, sokgate允许你设定你的定价标准并contact买家.</p>
            <p>
              对于买家来说, sokgate可以让你从买家那里得到你正在寻找的产品的定价标准.
            </p>

            <h4>付款ProtectionPayment保护</h4>
            <p>
              sokgate通过贸易担保服务为买卖双方提供安全的付款method, 在买卖双方之间建立信任, 确保产品按时, 完好地送达.
            </p>

            <h4>发货选项</h4>
            <p>
              sokgate确保可靠的航运解决方案, 无论是与货运, 船舶, 还是与最可靠的航运公司联合;
              DHL或UPS公司. 因此, 您可以选择适合您的业务的最佳和最便宜的价格.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col>
          <div class="col">
            <p>
              Get ready to grow your wholesale business on a leading e-commerce
              platform. Today, SokoGate provides millions of buyers around the
              world, allowing you to start your B2B business.
            </p>
            <p>
              Instead of selling your products individually to consumers, you
              can sell them in bulk. Sokogate makes this process easy for you
              whether you’re a manufacturer or an intermediary between the
              manufacturer and the distributor.
            </p>
            <p>
              Through the SokoGate platform, you can easily find wholesalers and
              distributors from above 150 countries and communicate with them in
              a reliable and trusted way as follows:
            </p>

            <h4>Find The Market</h4>
            <p>
              Find the products and the marketplace is considered the first step
              ahead to start your wholesale business. As sokogate provides
              thousands of products and goods you can choose from.
            </p>

            <h4>Get a Quotation</h4>
            <p>
              For the seller, sokogate allows you to set your pricing criteria
              and contact the buyer.
            </p>
            <p>
              For the buyer, sokogate allows you to get the pricing criteria
              from the buyer for the products you’re looking for.
            </p>

            <h4>Payment Protection</h4>
            <p>
              Sokogate provides a secure payment for the seller and the buyer
              with the trade assurance service that builds trust between the
              buyer and seller, guaranteeing that the products arrive on time
              and in a good condition.
            </p>

            <h4>Shipment Options</h4>
            <p>
              Sokogate ensures reliable shipping solutions, whether with
              freight, ship, or combination with the most reliable shipping
              companies; DHL or UPS companies. Thus, you can choose the best and
              cheapest prices that suit your business.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col>
          <div class="col">
            <p>
              Préparez-vous à développer votre entreprise de gros sur les
              principales plateformes de commerce électronique. Aujourd’hui,
              sokgate fournit des millions d’acheteurs dans le monde entier,
              vous permettant de démarrer votre entreprise B2B.
            </p>
            <p>
              Vous pouvez vendre vos produits en vrac au lieu de les vendre
              individuellement aux consommateurs. Sokgate rend le processus
              facile pour vous, que vous soyez un fabricant ou un intermédiaire
              entre le fabricant et le distributeur.
            </p>
            <p>
              Avec la plate-forme sokgate, vous pouvez facilement trouver et
              communiquer de manière fiable et fiable avec des grossistes et des
              distributeurs de plus de 150 pays, comme suit:
            </p>

            <h4>Trouver un marché</h4>
            <p>
              Trouver des produits et des marchés est considéré comme la
              première étape pour démarrer une entreprise de gros. Sokgate
              fournit des milliers de produits et de marchandises pour votre
              choix.
            </p>

            <h4>Obtenir une soumission</h4>
            <p>
              Pour les vendeurs, sokgate vous permet de définir vos critères de
              prix et de contacter les acheteurs.
            </p>
            <p>
              Pour les acheteurs, sokgate vous permet d’obtenir les critères de
              prix des acheteurs pour les produits que vous recherchez.
            </p>

            <h4>Protection des paiements protection des paiements</h4>
            <p>
              Sokgate fournit des méthodes de paiement sûres pour le vendeur et
              le vendeur par le service commercial d’assurance, qui établit la
              confiance entre le vendeur et l’acheteur et s’assure que les
              produits sont livrés à temps et en bon état.
            </p>

            <h4>Options de livraison</h4>
            <p>
              Sokgate assure des solutions d’expédition fiables, que ce soit
              avec le fret, les navires ou en association avec les compagnies
              maritimes les plus fiables; Société DHL ou UPS. Ainsi, vous pouvez
              choisir le meilleur prix et le moins cher qui convient à votre
              entreprise.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col>
          <div class="col">
            <p>
              Listo para hacer crecer su negocio mayorista en las principales
              plataformas de comercio electrónico. Hoy, sokgate ofrece millones
              de compradores en todo el mundo, lo que le permite iniciar su
              negocio B2B.
            </p>
            <p>
              Puede vender sus productos a granel en lugar de venderlos
              individualmente a los consumidores. Sokgate hace que el proceso
              sea fácil para usted, ya sea un fabricante o un intermediario
              entre el fabricante y el distribuidor.
            </p>
            <p>
              A través de la plataforma sokgate, es fácil encontrar y
              comunicarse de manera confiable y confiable con mayoristas y
              distribuidores de más de 150 países, como sigue:
            </p>

            <h4>Encuentra un mercado</h4>
            <p>
              Encontrar productos y mercados se considera el primer paso para
              iniciar un negocio mayorista. Sokgate ofrece miles de productos y
              mercancías para que usted elija.
            </p>

            <h4>Obtenga una cotización</h4>
            <p>
              Para los vendedores, sokgate le permite establecer sus criterios
              de precios y contactar a los compradores.
            </p>
            <p>
              Para los compradores, sokgate le permite obtener los criterios de
              precios de los compradores para los productos que está buscando.
            </p>

            <h4>Protección de pago protección de pago</h4>
            <p>
              Sokgate ofrece un método de pago seguro para compradores y
              vendedores a través del servicio de garantía comercial, que crea
              confianza entre compradores y vendedores y asegura que los
              productos se entregan a tiempo y en buenas condiciones.
            </p>

            <h4>Opciones de envío</h4>
            <p>
              Sokgate garantiza soluciones de envío confiables, ya sea con
              carga, buques o en asociación con las compañías navieras más
              confiables; Compañía de DHL o UPS. Para que pueda elegir el mejor
              y más barato precio que se adapte a su negocio.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col>
          <div class="col">
            <p>
              Prepare-se para crescer seu negócio de atacado nas principais
              plataformas de comércio eletrônico. Hoje, a sokgate oferece
              milhões de compradores em todo o mundo, permitindo que você comece
              seu negócio B2B.
            </p>
            <p>
              Você pode vender seus produtos em massa, em vez de vendê-los
              individualmente aos consumidores. Sokgate torna o processo fácil
              para você, se você é um fabricante ou um intermediário entre o
              fabricante e o distribuidor.
            </p>
            <p>
              Através da plataforma sokgate, você pode facilmente encontrar e se
              comunicar de forma confiável e confiável com atacadistas e
              distribuidores de mais de 150 países, como segue:
            </p>

            <h4>Encontre um mercado</h4>
            <p>
              Encontrar produtos e mercados é considerado o primeiro passo para
              iniciar um negócio de atacado. Sokgate oferece milhares de
              produtos e mercadorias para você escolher.
            </p>

            <h4>Obter uma cotação</h4>
            <p>
              Para vendedores, sokgate permite que você defina seus critérios de
              preços e entre em contato com compradores.
            </p>
            <p>
              Para os compradores, sokgate permite que você obtenha o padrão de
              preços do comprador para o produto que você está procurando.
            </p>

            <h4>Proteção de pagamento proteção de pagamento</h4>
            <p>
              Sokgate oferece um método de pagamento seguro para compradores e
              vendedores através do serviço de garantia de comércio. Isso cria
              confiança entre compradores e vendedores e garante que os produtos
              sejam entregues no tempo e em boas condições.
            </p>

            <h4>Opções de envio</h4>
            <p>
              Sokgate garante soluções de transporte confiáveis, seja com frete,
              navios ou em conjunto com as empresas de transporte mais
              confiáveis; Empresa DHL ou UPS. Assim, você pode escolher o melhor
              e mais barato preço adequado para o seu negócio.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col>
          <div class="col">
            <p>
              التحضير لتطوير عمليات الجملة على منصات التجارة الإلكترونية
              الرائدة. اليوم، قدم سوكيت الملايين من المشترين في جميع أنحاء
              العالم وسمحت لك ببدء عملك B2B.
            </p>
            <p>
              يمكنك بيع منتجاتك بالجملة، وليس للمستهلكين وحدهم. سوكجيت يجعل هذه
              العملية سهلة بالنسبة لك، سواء كنت مصنعا أو وسيطا بين الصانع
              وموزعا.
            </p>
            <p>
              من خلال منصة سوكيت، يمكنك بسهولة العثور على تجار الجملة والموزعين
              من أكثر من 150 بلدا والاتصال بهم بطريقة موثوقة وموثوق بها، على
              النحو التالي:
            </p>

            <h4>أعثر على السوق</h4>
            <p>
              ويعتبر العثور على المنتجات والأسواق الخطوة الأولى في بدء تجارة
              الجملة. Sokgate يوفر الآلاف من المنتجات والسلع بالنسبة لك.
            </p>

            <h4>احصل على اقتباس</h4>
            <p>
              للبائعين، يسمح لك Sokgate بتحديد معايير التسعير الخاصة بك والاتصال
              بالمشترين.
            </p>
            <p>
              بالنسبة للمشترين، يمكن Sokgate السماح لك بالحصول على معايير تسعير
              المنتج الذي تبحث عنه من المشترين.
            </p>

            <h4>دفع حماية Protectionpay.</h4>
            <p>
              وتوفر شركة سوكجيت للمشترين بالسداد المأمون من خلال خدمات ضمان
              التجارة، وتبني الثقة بين المشترين وتكفل وصول المنتجات في الوقت
              المحدد وبطريقة سليمة.
            </p>

            <h4>خيار الشحن</h4>
            <p>
              تكفل شركة سوكجيت وجود حلول موثوقة للنقل البحري، سواء مع الشحن أو
              السفن أو مع أكثر شركات النقل البحري موثوقية ؛ DHL أو UPS. لذلك،
              يمكنك اختيار أفضل أرخص سعر يناسب عملك.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col>
          <div class="col">
            <p>
              Приготовьтесь развивать оптовый бизнес на лидирующих платформах
              электронной торговли. Сегодня sokgate поставляет миллионы
              покупателей по всему миру, позволяя вам начать свой бизнес на B2B.
            </p>
            <p>
              Вы можете продавать свою продукцию оптом, а не отдельно для
              потребителей. Sokgate облегчает этот процесс для вас, будь вы
              посредником между производителем или производителем и
              распространителем.
            </p>
            <p>
              Через платформу sokgate можно легко найти оптовых торговцев и
              дистрибьюторов из более чем 150 стран, и с ними можно будет
              общаться надежно и надежно, а именно:
            </p>

            <h4>Найти рынок</h4>
            <p>
              Поиск продуктов и рынков считается первым шагом к открытию
              оптового бизнеса. Sokgate предлагает тысячи продуктов и товаров на
              ваш выбор.
            </p>

            <h4>Получить предложение</h4>
            <p>
              Для продавца sokgate позволяет установить ваш ценовой стандарт и
              связаться с покупателем.
            </p>
            <p>
              Для покупателя sokgate позволяет получить ценовые критерии
              продукции, которую вы ищете от покупателя.
            </p>

            <h4>Плата за защиту</h4>
            <p>
              Sokgate предоставляет покупателям и покупателям безопасный способ
              оплаты через услуги по торговым гарантиям, создавая доверие между
              покупателями и покупателями, обеспечивая доставку продукции в срок
              и в целости.
            </p>

            <h4>Опция отправки</h4>
            <p>
              Сокгейт обеспечивает надежное решение для судоходства, будь то с
              грузовыми, судами или с самыми надежными судоходными компаниями;
              DHL или UPS компании. Таким образом, вы можете выбрать лучшую и
              самую дешевую цену для вашего бизнеса.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col>
          <div class="col">
            <p>
              آماده باشید برای توسعه تجارت کلی در Platform e-commerce رهبری
              کنید. امروز، سوکگیت میلیون خریداری در سراسر دنیا را پیشنهاد می کند
              که به شما اجازه می دهد تجارت B2B را شروع کنید.
            </p>
            <p>
              شما می توانید محصولات خود را با گروهی بفروشید به جای فروش آنها
              تنها به مصرف کنندگان. Sokgate این فرایند را برای شما آسان می‌سازد،
              آیا شما یک تولید کننده یا یک متوسط بین یک تولید کننده و یک تولید
              کننده هستید.
            </p>
            <p>
              از طریق صفحه سوکگیت، شما می توانید به آسانی از بیش از ۱۵۰ کشور
              متفرقه‌کننده‌ها و متفرقه‌کننده‌ها را پیدا کنید و با آنها ارتباط
              قابل و قابل اطمینان داشته باشید، همچنین:
            </p>

            <h4>بازار را پیدا کنید</h4>
            <p>
              پیدا کردن محصولات و بازارها اولین قدم در شروع تجارت کلی به نظر می
              رسد. Sokgate offers thousands of products and commodities for you
              to choose from.
            </p>

            <h4>يه نقل بگير</h4>
            <p>
              For sellers, sokgate allows you to set your pricing standards and
              contact buyers.
            </p>
            <p>
              برای خریدن، سوکگیت می تواند اجازه دهد که استاندارد قیمت‌گیری از
              محصولات را که از خریدن دنبال می‌کنید بگیرید.
            </p>

            <h4>محافظت پول</h4>
            <p>
              Sokgate به خریدگار و فروشنده یک روش پرداخت امن را از طریق خدمت
              تضمین تجارت می‌دهد، اعتماد بین خریدگار و فروشنده می‌سازد، و مطمئن
              می‌شود که محصولات در زمان و در حالت خوب تحویل می‌شوند.
            </p>

            <h4>گزینه‌های قایق</h4>
            <p>
              سگ‌گات راه‌حل‌های قابل اطمینان کشتی را تضمین می‌کند، چه با بار،
              کشتی‌ها، یا با بهترین شرکت‌های قابل اطمینان کشتی‌ها. DHL يا UPS.
              پس ميتوني بهترين و ارزونترين قيمت رو براي تجارت انتخاب کني
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col>
          <div class="col">
            <p>
              प्रमुख e-commerce प्लेटफ़ॉर्म पर पूर्ण व्यवसाय को विकास करने के
              लिए तैयार करने के लिए तैयार करें. आज, सोकगेट दुनिया के सारे दशलक्ष
              लाख खरीदारों को उपलब्ध करता है, जो आपको अपने बी2B व्यवसाय सुरु
              करने की अनुमति दे
            </p>
            <p>
              आप अपने उत्पादन को बैचों में बेच सकते हैं कि उन्हें अकेले
              व्यापारिकों से बेच सकते हैं। Sokgate ने इस प्रक्रिया को तुम्हारे
              लिए आसान बनाया है, क्या आप एक उत्पादक है या एक उत्पादक और वितरक के
              बीच मध्यमन हैं.
            </p>
            <p>
              सोकगेट प्लेटफॉर्म द्वारा आप 150 देश से अधिक पूर्ण वितरण करनेवालों
              और वितरण करनेवालों को आसान से मिल सकते हैं, और उनके साथ विश्वासी
              और व
            </p>

            <h4>बाजार ढूंढें</h4>
            <p>
              उत्पादनों और बाजारों को ढूंढने के लिए प्रथम चरण है कि एक व्यवसाय
              को शुरू करने के लिए. सॉक्गेट तुम्हारे लिए हजारों उत्पादन और
              वस्तुओं को चुनाने के लिए उपलब्ध करता है.
            </p>

            <h4>उद्धरण प्राप्त करें</h4>
            <p>
              विक्रेताओं के लिए, सोकगेट तुम्हें अपने क्रिया मानकों और खरीदारों
              से सम्पर्क करने की अनुमति देता है।
            </p>
            <p>
              खरीद करनेवाले के लिए, सोकगेट तुम्हें उत्पादक के मूल्य मिल सकता है
              जिसे आप खरीद करनेवाले से खोज रहे हैं.
            </p>

            <h4>Payment protectionpayment protection</h4>
            <p>
              Sokgate खरीदार और विक्रेता को व्यापारिक के द्वारा व्यापारिक गारंटी
              सेवा के द्वारा सुरक्षित पैसा पद्धति से प्रदान करता है, व्यापारिक
              और वि
            </p>

            <h4>शिपिंग विकल्प</h4>
            <p>
              सॉक्गेट सुरक्षित करता है कि भरोसा, जहाजों के साथ या सबसे विश्वासिल
              जहाज कंपनियों के साथ सुरक्षित है; DHL या UPS. इसलिए, आप अपने
              व्यवसाय के लिए सबसे अच्छा और स्रोत्तम मूल्य चुन सकते हैं.
            </p>
          </div>
        </b-col>
      </b-row>
  </div>
    </b-container>
</template>



<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  components: { Breadcrumb },
  data() {
    return {
      items: [
        {
          text: this.$t("menuitems.home"),
          to: { name: "merchant_settlement" },
        },
        {
          text: this.$t("menuitems.layout.wholesalePolicy"),
          active: true,
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
  h4 {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 36px;
    color: #000;
  }

  p {
    font-weight: normal;
    font-size: 13px;
    line-height: 26px;
    color: #000;
  }
  .row {
    .col {
      padding-bottom: 80px;
    }
  }
}
</style>