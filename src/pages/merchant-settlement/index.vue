<template>
  <b-container class="merchant-settlement-page">
    <div v-title :data-title="$t('layout.sellon-sokogate')">
      <!-- <br />
    <router-link to="/v2/order">Go to order/index</router-link>
    <br />
    <router-link to="/v2/login">Go to user/login</router-link> -->

      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-if="locale == 'zh'"
      >
        <img
          src="https://oss.sokogate.com/image/5a5f59d9b88acc1eacd9b6b8f6378c7a.jpeg"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'en'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'fra'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'spa'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'pt'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'ara'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'ru'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'per'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>
      <a
        href="https://vendor.sokogate.com/v2/register"
        target="_blank"
        v-else-if="locale == 'hi'"
      >
        <img
          src="https://oss.sokogate.com/image/553623b89b4ae03309bf992f591491c3.png"
        />
      </a>

      <b-row v-if="locale == 'zh'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              2020年中国货物贸易及跨境电商进出口增速对比情况
            </h4>
            <img
              src="https://oss.sokogate.com/image/ff9d0df62eb9a3334e14abdb424fb517.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>外贸转型出口——跨境电商</h4>
            <p>
              由于新冠疫情在海外的肆略导致海外市场需求下降，2020年外贸进出口低迷，至三季度实现由负转正。反观跨境电商，其进出口则一直保持逆势增长的态势，前三季度海关跨境电商监管平台进出口1873.9亿元，已超去年全年，大幅增长52.8%，为外贸进出口回稳做出突出贡献。
            </p>
            <p>
              截止至2020年底中国货物贸易进出口总值达到32.16万亿元，比2019年增长1.9%。其中，2020年中国跨境电商进出口1.69万亿元，增长了31.1%。
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              Comparison of growth rate of China's goods trade and cross-border
              e-commerce import and export in 2020
            </h4>
            <img
              src="https://oss.sokogate.com/image/bc296830a9c8b01707e920b913bf4d1e.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>
              Foreign trade transformation and export - cross border E-commerce
            </h4>
            <p>
              Covid-19's overseas market demand declined, and foreign trade and
              imports in 2020 were in a doldrums, which reached a negative turn
              in the three quarter. In contrast, the import and export of
              cross-border e-commerce has maintained a trend of contrarian
              growth. In the first three quarters, the import and export of the
              customs cross-border e-commerce supervision platform reached
              187.39 billion yuan, a significant increase of 52.8% over last
              year, making outstanding contributions to the stabilization of
              foreign trade import and export.
            </p>
            <p>
              By the end of 2020, the total import and export value of China's
              goods trade has reached 32.16 trillion yuan, an increase of 1.9%
              over 2019. Among them, China's cross-border e-commerce import and
              export reached 1.69 trillion yuan in 2020, an increase of 31.1%.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              Comparaison des taux de croissance des importations et des
              exportations du commerce de marchandises chinois et du commerce
              électronique transfrontalier en 2020
            </h4>
            <img
              src="https://oss.sokogate.com/image/bc296830a9c8b01707e920b913bf4d1e.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>
              Transformation du commerce extérieur exportation - commerce
              électronique transfrontalier
            </h4>
            <p>
              En raison de l’épidémie de covid-19 à l’étranger a légèrement
              conduit à la baisse de la demande du marché étranger, les
              importations et les exportations de commerce extérieur en 2020
              sont faibles, à trois trimestres pour réaliser un redressement
              négatif. Au contraire, le commerce électronique transfrontalier,
              ses importations et exportations ont maintenu une position de
              croissance à contre-courant, les trois premiers trimestres de la
              plate-forme de surveillance du commerce électronique
              transfrontalier douanière d’importation et d’exportation 187,39
              milliards de yuans, a dépassé l’année dernière toute l’année, une
              augmentation substantielle de 52,8%, une contribution
              exceptionnelle à la reprise des exportations et des importations
              du commerce extérieur.
            </p>
            <p>
              La valeur totale des importations et des échanges de marchandises
              de la Chine a atteint 32,16 milliards de yuans à la fin de 2020,
              soit une augmentation de 1,9% par rapport à 2019. Parmi eux, les
              importations et exportations transfrontalières de commerce
              électronique de la Chine 1,69 billion de yuans en 2020, soit une
              augmentation de 31,1%.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              Comparación de la tasa de crecimiento de las importaciones y
              exportaciones del comercio de bienes de China y comercio
              electrónico transfronterizo en 2020
            </h4>
            <img
              src="https://oss.sokogate.com/image/ff9d0df62eb9a3334e14abdb424fb517.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>
              Exportación de transformación de comercio exterior - comercio
              electrónico transfronterizo
            </h4>
            <p>
              Debido a la epidemia de covid-19 en el extranjero, la demanda del
              mercado de ultramar se redujo ligeramente, las importaciones y
              exportaciones de comercio exterior en 2020 se desaceleraron, a
              tres trimestres para lograr una rotación negativa. En contraste
              con el comercio electrónico transfronterizo, sus importaciones y
              exportaciones han mantenido una postura de crecimiento en contra
              de la tendencia, los primeros tres trimestres de aduanas
              plataforma de supervisión de comercio electrónico transfronterizo
              de importación y exportación 187,39 mil millones de yuanes, ha
              superado el año pasado todo el año, un aumento sustancial de
              52,8%, hacer una contribución sobresaliente para la recuperación
              del comercio exterior de importación y exportación.
            </p>
            <p>
              El valor total de las importaciones y exportaciones de comercio de
              bienes de China alcanzó 32,16 billones de yuanes a finales de
              2020, un 1,9% más que en 2019. De ellos, las importaciones y
              exportaciones transfronterizas de comercio electrónico de China
              1.69 billones de yuanes en 2020, un aumento del 31,1%.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              Comparação da taxa de crescimento de importação e exportação do
              comércio de mercadorias chinês e comércio eletrônico
              transfronteiriço em 2020
            </h4>
            <img
              src="https://oss.sokogate.com/image/ff9d0df62eb9a3334e14abdb424fb517.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>
              Transformação de comércio exterior para exportação- comércio
              eletrônico transfronteiriço
            </h4>
            <p>
              Devido à epidemia de covid-19 no exterior levou ligeiramente a uma
              queda na demanda do mercado externo, a importação e exportação de
              comércio exterior em 2020 é baixa, para três trimestres para
              alcançar uma mudança negativa positiva. Ao contrário do comércio
              eletrônico transfronteiriço, suas importações e exportações têm
              mantido uma postura de crescimento inverso, nos primeiros três
              trimestres de alfândega plataforma de supervisão de comércio
              eletrônico transfronteiriço importação e exportação 187.39 bilhões
              de yuan, superou o ano passado, um aumento substancial de 52, 8%,
              para a recuperação de importação e exportação de comércio exterior
              para fazer uma contribuição proeminente.
            </p>
            <p>
              Até o final de 2020, o valor total das importações e exportações
              de mercadorias da china atingiu 32, 16 trilhões de yuan, 1, 9%
              mais do que em 2019. Dos quais, as importações e exportações
              transfronteiriças de comércio eletrônico da china 1.69 trilhões de
              yuan em 2020, aumentaram 31, 1%.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              مقارنة الزيادة في تجارة السلع الصينية وفي واردات وصادرات شركات
              الكهرباء عبر الحدود في عام 2020.
            </h4>
            <img
              src="https://oss.sokogate.com/image/ff9d0df62eb9a3334e14abdb424fb517.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>تصدير التجارة الخارجية -تجار عبر الحدود</h4>
            <p>
              ومع تراجع الطلب في الأسواق الخارجية بسبب تفشي الوباء الجديد في
              الخارج، انخفضت الصادرات والواردات الخارجية في عام 2020، مما أدى
              إلى حدوث تحول سلبي في الربع الثالث. وعلى النقيض من ذلك، ظل تجار
              الطاقة عبر الحدود، ووارداتهم وصادراتهم، في اتجاه معاكس، مع زيادة
              كبيرة بلغت 52.8 في المائة خلال العام الماضي في الصادرات والواردات
              الخارجية من خلال منصة الجمارك لرقابة شركات عبر الحدود التي بلغت
              قيمتها 3.39 18 مليون يوان في الربع الثالث السابق.
            </p>
            <p>
              وبحلول نهاية عام 2020، بلغ إجمالي صادرات وواردات الصين من السلع
              32.16 تريليون يوان، أي بزيادة قدرها 1.9 في المائة عن عام 2019. ومن
              بين هذا المبلغ، بلغ حجم الواردات والصادرات الصينية عبر الحدود 1.69
              تريليون يوان في عام 2020، أي بزيادة قدرها 31.1 في المائة.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              Сравнение темпов роста импорта и экспорта товаров и транзитных
              товаров китая в 2020 году
            </h4>
            <img
              src="https://oss.sokogate.com/image/ff9d0df62eb9a3334e14abdb424fb517.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>
              Переходный экспорт внешней торговли — международные электрики
            </h4>
            <p>
              Поскольку новая вспышка коронального заболевания привела к
              снижению спроса на зарубежные рынки, спад в 2020 году в импорте и
              экспорте внешней торговли в 2020 году привел к отрицательному
              сдвигу в третьем квартале. В свою очередь, ее экспортно-импортная
              компания, экспортирующая и импортирующая товары, оставалась в
              ретрограде роста, в то время как первые три четверти таможенных
              транзит регулирующих платформ, экспортируемых через границу,
              импортировали и экспортировали 187390 миллионов юаней, значительно
              увеличившись за прошедший год на 52,8%, внесла значительный вклад
              в восстановление стабильности импорта и экспорта во внешней
              торговле.
            </p>
            <p>
              ВВП китая на импорт и экспорт товаров достиг 32,16 триллионов
              юаней к концу 2020 года, что на 1,9% больше, чем в 2019 году. В
              2020 году импорт и экспорт международных электрических предприятий
              китая увеличился на 31,1%.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              Comparison of growth rate of goods trade in China and cross-border
              e-commerce import and export in 2020
            </h4>
            <img
              src="https://oss.sokogate.com/image/ff9d0df62eb9a3334e14abdb424fb517.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>انتقال تغییرات تجارت خارجی - تجارت برق مرز E</h4>
            <p>
              به دلیل کوچک گسترش COVID-19 در بازارهای خارجی، نیازی بازارهای
              خارجی کمتر شد. در سال ۲۰۰۲، واردات و انتقال تجارت خارجی ناتوان بود
              و سومین چهارم سال تغییر مثبتی از منفی دید. از طرف دیگر، وارد و
              اخراج تجارت برق مرز بر خلاف این ترند افزایش می‌کند. در سه چهارپای
              اول، وارد و اخراج Plataforma کنترل برق برق برق برق برق برق برق برق
              برق رسیده است که به 187.39 میلیارد یوان رسیده است، که در طول سال
              به 52.8 درصد افزایش یافت، و در طول سال به ثابت کردن وارد و اخراج
              تجارت خارجی کمک‌های زیادی
            </p>
            <p>
              تا پایان ۲۰۰۲، کل ارزش وارد و صادرات تجارت کالایی چین ۲۲.۶ تریلیون
              یوان رسید، که در سال ۲۰۱۹ افزایش ۱.۹ درصد بود. بین آنها، در سال
              ۲۰۰۲، واردات و انتقال برق برق برق برق و برق برق چین به ۱.69
              تریلیون یوان رسید، و افزایش ۳۱.۱%.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4 style="color: #5a78ec">
              चीन के सामान व्यापार के वृद्धि दर के तुलना
            </h4>
            <img
              src="https://oss.sokogate.com/image/ff9d0df62eb9a3334e14abdb424fb517.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>विदेशी व्यापार परिवर्तन निर्यात</h4>
            <p>
              बाहिरी बाजारों में COVID-19 के छोटे प्रदेश के कारण, बाहिरी बाजारों
              की अनुरोध कमी हुई है। २००2020 में, विदेशी व्यापार के आयात और
              निर्यात के द्वारा के आयात और निर् दूसरे बारे में, क्रास्स सीमा के
              e-व्यापार का आयात और निर्यात ट्रेंड के विरूद्ध बढ़ता है। पहले तीन
              चौथे में, क्रास्स सीमा के e-व्यापार का आयात और निर्यात प्लेटफ़ॉर्म
              के आयात 187.39 बिलियन यूआ
            </p>
            <p>
              २००२ के अन्त में चीन के कुल आयात और निर्यात की मूल्य २०१९ के लिए
              32.16 ट्रिलियन यूआन तक पहुँच गया। उनके बीच, २००2020 में, चीन के
              क्रास्स सीमा के e-व्यापारी आयात और निर्यात 1.69 ट्रिलियन यूआन तक
              पहुँचा, 31.1% का बढ़ाया
            </p>
          </div>
        </b-col>
      </b-row>

      <b-row v-if="locale == 'zh'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>广阔的非洲市场</h4>
            <h4>跨境电商的最后一片蓝海</h4>
            <p>
              非洲，世界第二大洲，同时也是人口第二大洲（约12.86亿），有54个国家，2亿网民，市场渗透率在18%左右。预计2025年非洲人口将突破20亿人次，年轻人口占比超70%，麦肯锡数据称2025年非洲50%的网络覆盖率，电子商务市场的GMV将达到750亿美元，预计年增长率（CAGR
              2020-2025）为19.6％。
            </p>
            <p>
              非洲地区本国的工业基础较为薄弱，需求严重依赖于进口，这为跨境电商创造了巨大商机，在国家政策惠利帮扶下，非洲的跨境电商卖家利好优势明显，因此被誉为一带一路上的电商明珠。
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Broad African market</h4>
            <h4>The last blue ocean of cross-border E-commerce</h4>
            <p>
              Africa, the world's second largest continent and the second
              largest continent with a population of about 1.286 billion, has 54
              countries and 200 million Internet users, with a market
              penetration rate of about 18%. It is estimated that Africa's
              population will exceed 2 billion person times in 2025, and the
              young population accounts for more than 70%. According to
              McKinsey's data, Africa's network coverage will reach 50% in 2025,
              and the Gmv of e-commerce market will reach US $75 billion, with
              an estimated annual growth rate (CAGR 2020-2025) of 19.6%.
            </p>
            <p>
              One belt, one road, is the most important business in Africa. The
              industrial base in Africa is relatively weak and its demand is
              heavily dependent on imports. This creates huge business
              opportunities for cross-border electricity providers. Under the
              help of national policy, the cross-border electricity supplier in
              Africa has a good advantage.
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fra'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Vaste marché africain</h4>
            <h4>
              {La dernière mer bleue pour le commerce électronique
              transfrontalier
            </h4>
            <p>
              L’afrique, 2ème continent mondial mais aussi 2ème continent en
              termes de population (environ 1,286 milliard d’habitants), compte
              54 pays, 200 millions d’internautes et un taux de pénétration du
              marché d’environ 18%. On s’attend à ce que la population africaine
              dépasse les 2 milliards de passagers en 2025 et que les jeunes
              représentent plus de 70%. Selon mckinsey, 50% de la couverture
              internet de l’afrique en 2025, le marché du commerce électronique
              atteindra 75 milliards de dollars américains en GMV, avec un taux
              de croissance annuel estimé (CAGR 2020-2025) de 19,6%.
            </p>
            <p>
              La base industrielle nationale de l’afrique est faible et la
              demande dépend fortement des importations, ce qui a créé d’énormes
              opportunités commerciales pour le commerce électronique
              transfrontalier. Aidé par les avantages de la politique nationale,
              l’afrique est connue comme la perle du commerce électronique dans
              la région.
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Amplio mercado africano</h4>
            <h4>
              El último mar azul para el comercio electrónico transfronterizo
            </h4>
            <p>
              África, el segundo continente del mundo y al mismo tiempo el
              segundo en población (alrededor de 1.286 millones), con 54 países,
              200 millones de usuarios de internet y una penetración de mercado
              de alrededor del 18%. Se espera que la población de áfrica supere
              los 2 mil millones de visitas en 2025 y que los jóvenes
              representen más del 70%. Mckinsey dice que 50% de la cobertura de
              internet de áfrica en 2025. El mercado de comercio electrónico
              alcanzará un GMV de 75 mil millones de dólares. 2020-2025) es del
              19,6%.
            </p>
            <p>
              La base industrial nacional es débil y la demanda depende en gran
              medida de las importaciones, lo que ha creado enormes
              oportunidades de negocio para el comercio electrónico
              transfronterizo. Ayudado por los beneficios de las políticas
              nacionales, áfrica es conocida como la perla del comercio
              electrónico en toda la región.
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Vasto mercado africano</h4>
            <h4>O último mar azul do comércio eletrônico transfronteiriço</h4>
            <p>
              África, o segundo continente do mundo e, ao mesmo tempo, o segundo
              em termos de população (cerca de 1.186 milhões), com 54 países,
              200 milhões de internautas e uma penetração de mercado de cerca de
              18%. Espera-se que a população africana ultrapasse os 2 bilhões de
              visitas em 2025, e os jovens representem mais de 70%. Os dados da
              mckinsey dizem que 50% da cobertura de rede da áfrica em 2025. O
              GMV do mercado de comércio eletrônico alcançará 75 bilhões de
              dólares. A taxa de crescimento anual projetada (CAGR 2020-2025) é
              de 19, 6%.
            </p>
            <p>
              A base industrial nacional da região da áfrica é fraca e a demanda
              depende fortemente das importações, o que cria grandes
              oportunidades de negócios para o comércio eletrônico
              transfronteiriço. Ajudado pelos benefícios da política nacional,
              os vendedores de comércio eletrônico transfronteiriço da áfrica
              têm vantagens positivas óbvias, por isso é conhecida como a pérola
              do comércio eletrônico ao longo da região.
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>سوق أفريقية واسعة</h4>
            <h4>آخر جزء من البحر الأزرق لمتعهدي الكهرباء عبر الحدود</h4>
            <p>
              فأفريقيا، وهي ثاني قارة في العالم وثاني أكبر قارة سكانية (حوالي
              1.86 بليون نسمة)، تضم 54 بلدا و 200 مليون من مستخدمي الإنترنت،
              بمعدل تغلغل في السوق يبلغ 18 في المائة. ومن المتوقع أن يتجاوز عدد
              سكان أفريقيا بليوني نسمة بحلول عام 2025، مع وصول نسبة الشباب إلى
              70 في المائة، وتشير بيانات ماكينزي إلى أن 50 في المائة من التغطية
              بشبكة الإنترنت في أفريقيا بحلول عام 2025، وأن يصل الناتج العالمي
              الإجمالي في سوق التجارة الإلكترونية إلى 75 مليار دولار أميركي، مع
              توقع نمو سنوي سنوي (CAGR) (2020-2025) 19.6 في المائة.
            </p>
            <p>
              إن ضعف القاعدة الصناعية المحلية في أفريقيا والاعتماد الشديد على
              الواردات قد أوجد فرصاً تجارية كبيرة للتجار عبر الحدود، الذين
              يتمتعون بمزايا واضحة بفضل السياسة العامة للدولة، ويحظون بالتقدير
              كجواهر للكهرباء على طول الطريق.
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Огромный африканский рынок</h4>
            <h4>
              Последний кусок голубого моря в трансграничной торговле
              электричеством
            </h4>
            <p>
              Африка, второй континент мира, а также второй по населению
              континент (около 1,2 МЛРД человек), 54 страны, 200 миллионов
              интернет-пользователей и 18% проникновения на рынки. Ожидается,
              что к 2025 году население африки превысит 2 миллиарда человек,
              доля молодежи составит более 70%, согласно данным маккинси, 50%
              охвата в африке к 2025 году, а GMV на рынке электронной торговли
              достигнет 75 миллиардов долларов США, прогнозируя ежегодный рост
              (CAGR) 2020-2025) — 19,6 % населения.
            </p>
            <p>
              В странах африки имеется относительно слабая промышленная основа,
              в которой спрос сильно зависит от импорта, что создает огромные
              коммерческие возможности для трансграничных торговцев
              электричеством, которые, при поддержке национальных политических
              организаций, имеют явное преимущество перед продавцами
              трансграничного электричества в африке, и поэтому их называют
              «мизинью» в качестве поставщика электроэнергии по соседству.
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>بازار فراوانی آفریقایی</h4>
            <h4>آخرین دریا آبی از تجارت عبور مرز E</h4>
            <p>
              آفریقا دومین بزرگترین قاره در جهان و دومین بزرگترین قاره در جمعیت
              است (حدود ۱.286 میلیارد میلیارد). 54 کشور و 200 میلیارد کاربر
              اینترنت وجود دارد، با سرعت داخل بازار حدود ۱۸ درصد. تقریباً جمعیت
              آفریقا در سال ۲۰۰۵ بیشتر از ۲ میلیارد نفر خواهد بود، و جمعیت جوان
              بیشتر از ۷۰ درصد حساب خواهد داشت. طبق داده های مک کینزی، سرعت پوشش
              شبکه آفریقا در سال ۲۰۰۵ به ۵۰ درصد رسید، و Gmv بازار e-commerce به
              ۷۵ میلیارد دلار آمریکا رسید. تقریباً سرعت رشد سالی ( ۲۰۰۲-۲۰۰۵)
              ۱۹.۶ درصد است.
            </p>
            <p>
              بنیاد صنعتی آفریقا نسبتا ضعیف است، و درخواست بسیار بستگی دارد از
              واردات، که فرصت های تجارت بزرگی برای تجارت برق مرزی را ایجاد می
              کند. با کمک سیاست ملی، فروشندگان برق مرزی و تجارت در آفریقا سودهای
              مشخص دارند، بنابراین آنها به عنوان مرزی برق و جاده ای شناخته می
              شوند.
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'" style="background-color: #f8e4e3">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>ब्रोड अफ्रीकी बाजार</h4>
            <h4>क्रॉस-सीमा E-व्यापार के अन्तिम नीला समुद्र</h4>
            <p>
              Africa is the second largest continent in the world and the second
              largest continent in population (about 1.286 billion). There are
              54 countries and 200 million Internet users, with a market
              penetration rate of about 18%. मैकिंसी डाटा के अनुसार, अफ्रीका
              नेटवर्क का कवरेज दर २००५ में पहुँचेगा, और इमेल व्यापारी बाजार का
              Gmv अमेरिका 75 बिलियन डालर पहुँचेगा. यह अनुमानित है कि वर्षीय
              वृद्धि दर (CAGR) 2020-2025) 19.6%.
            </p>
            <p>
              अफ्रीका के औद्योगिक आधार सामान्य दुर्बल है, और अनुरोध आयात पर भारी
              निर्भर है, जो क्रास्स-सीमा के व्यापार के लिए बड़ी व्यापारिक
              संभावना बनाता है। राष्ट्रीय नीति की मदद से अफ्रीका में क्
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/420514c024b285d9a15f8a680094adee.png"
            />
          </div>
        </b-col>
      </b-row>

      <b-row v-if="locale == 'zh'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>平台介绍</h4>
            <p>
              Sokogate.com
              是位于非洲的B2B跨境电商平台，致力于促成全球中小企业国际贸易，连接诚信国际供应商和非洲采购商，提供定制化的采购方案，搭建一个值得信赖、可持续发展的贸易交易平台。我们为采购流程双方提供服务，以创建能够为行业提供信息、支持和赋能的解决方案。
            </p>
            <p>
              Sokogate.com会搭建一套完整的诚信系统，降低买卖双方的交易风险，制定严格的供应商&采购商资格审核制度，为买卖双方提供担保，让国际供应商和非洲采购商可以无后顾之忧的完成交易。
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Platform introduction</h4>
            <p>
              Sokogate.com is a B2B cross-border e-commerce platform located in
              Africa. It is committed to promoting international trade of global
              small and medium-sized enterprises, connecting honest
              international suppliers and African purchasers, providing
              customized procurement solutions, and building a trusted and
              sustainable trade trading platform. We provide services to both
              parties in the procurement process to create solutions that
              provide information, support and empowerment to the industry.
            </p>
            <p>
              Sokogate.com will build a complete integrity system to reduce the
              transaction risk of the buyer and the seller, formulate a strict
              supplier purchaser qualification review system, and provide
              guarantees for the buyer and the seller, so that international
              suppliers and African purchasers can complete the transaction
              without worry.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Présentation de la plateforme</h4>
            <p>
              Sokogate.com est une plate-forme de commerce électronique
              transfrontalier B2B basée en afrique. Sokogate.com est dédié à
              faciliter le commerce international pour les petites et moyennes
              entreprises du monde entier. Nous connectons les fournisseurs
              internationaux honnêtes et les acheteurs africains pour fournir
              des programmes d’achat personnalisés et construire une plate-forme
              de commerce fiable et durable. Nous servons les deux côtés du
              processus d’approvisionnement afin de créer des solutions qui
              informent, soutiennent et habilitent l’industrie.
            </p>
            <p>
              Sokogate.com mettra en place un système d’intégrité complet pour
              réduire les risques de transaction entre les acheteurs et les
              vendeurs. Un système rigoureux de vérification de la qualification
              des fournisseurs et des acheteurs sera mis en place pour fournir
              des garanties aux acheteurs et aux vendeurs, afin que les
              fournisseurs internationaux et les acheteurs africains puissent
              conclure la transaction sans soucis.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Presentación de la plataforma</h4>
            <p>
              Sokogate.com Es una plataforma de comercio electrónico
              transfronterizo B2B ubicada en áfrica, dedicada a facilitar el
              comercio internacional de pequeñas y medianas empresas globales,
              conectando proveedores internacionales honestos y compradores
              africanos, proporcionando programas de compra personalizados y
              construyendo una plataforma de comercio comercial confiable y
              sostenible. Servimos a ambas partes del proceso de compra para
              crear soluciones que informen, apoyen y empoderen a la industria.
            </p>
            <p>
              Sokogate.com construirá un sistema completo de integridad para
              reducir el riesgo de las transacciones entre compradores y
              vendedores, y desarrollará un estricto sistema de auditoría de
              calificación de proveedores y compradores para proporcionar
              garantías a los compradores y vendedores, de modo que los
              proveedores internacionales y los compradores africanos puedan
              completar las transacciones sin preocupaciones.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Apresentação da plataforma</h4>
            <p>
              Sokogate.com É uma plataforma de comércio eletrônico
              transfronteiriço B2B localizada na áfrica, dedicada a facilitar o
              comércio internacional de pequenas e médias empresas globais,
              conectando fornecedores internacionais honestos e compradores
              africanos, fornecendo programas de compras personalizados e
              construindo uma plataforma de comércio confiável e sustentável.
              Atendemos ambos os lados do processo de compras para criar
              soluções que informem, apoiem e capacitem a indústria.
            </p>
            <p>
              Sokogate.com irá construir um sistema completo de integridade para
              reduzir o risco de transação entre compradores e vendedores,
              desenvolver um rigoroso sistema de auditoria de qualificação de
              fornecedor e comprador para fornecer garantias para compradores e
              vendedores, para que fornecedores internacionais e compradores
              africanos possam concluir transações sem preocupações.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>مقدمة المنصة</h4>
            <p>
              Sokogate.com ) هي منصة B2B لمتعهدي الكهرباء عبر الحدود في أفريقيا،
              تعمل على تعزيز التجارة الدولية بين المشاريع الصغيرة والمتوسطة
              الحجم على الصعيد العالمي، والربط بين الموردين الدوليين ذوي النوايا
              الحسنة والمشترين الأفريقيين، وتوفير برامج مشتريات مكيفة حسب
              الاحتياجات، وإنشاء منصة موثوقة للتجارة التجارية من أجل التنمية
              المستدامة. ونحن نخدم طرفي عملية الشراء لإيجاد حلول توفر المعلومات
              والدعم والتمكين للصناعة.
            </p>
            <p>
              وسينشئ سوكوغات.com نظاما كاملا للنزاهة من أجل الحد من مخاطر
              المعاملات بين المشترين والبائعين، ووضع نظام صارم للتحقق من أهلية
              الموردين والمشترين، وتوفير ضمانات للبائعين الدوليين والمشترين
              الأفريقيين من إتمام المعاملات دون خوف.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Введение на платформу</h4>
            <p>
              Sokogate.com Международная торговая платформа B2B, расположенная в
              африке, призвана способствовать международной торговле между
              мелкими и средним предприятиям по всему миру, соединяя
              международные поставщики и африканские закупки, предлагая
              специальные программы закупок и создавая надежную торговую
              торговую платформу для устойчивого развития. Мы предоставляем
              услуги обеим сторонам процесса закупок для создания решений,
              которые могли бы обеспечить промышленность информацией, поддержкой
              и распределением ресурсов.
            </p>
            <p>
              Sokogate.com построит систему целостности, которая уменьшит риск
              торговли между покупателями и покупателями, установит строгую
              систему оценки квалификаций продавцов и покупателей, обеспечивая
              покупателям и покупателям гарантии, с тем чтобы международные
              поставщики и африканские покупатели могли завершить сделку без
              особых последствий.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>معرفی برنامه</h4>
            <p>
              Sokogate.com این یک برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ
              برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ
              برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ برنامهٔ
              برنامهٔ برنامهٔ برنامهٔ برنامهٔ ما خدمات را به هر دو گروهی در
              فرایند سوداگرایی برای ایجاد راه حل‌ها می‌دهیم که می‌توانند
              اطلاعات، حمایت و قدرت صنعت را بدهند.
            </p>
            <p>
              سوکوگيت کم یک سیستم کامل کامل کامل برای کاهش خطر تجارت خریدن و
              فروشنده ساخته می‌شود، سیستم تحقیقات قابلیت‌شناسی و خریدن سخت را
              فرمول می‌کند، برای خریدن و فروشنده تضمین می‌دهد، و اجازه می‌دهد
              پردازگاران بین المللی و خریداران آفریقا بدون نگرانی تجارت را کامل
              کنند.
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              src="https://oss.sokogate.com/image/441a733729106b6db41c6390db411d36.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>प्लेटफॉर्म परिचय</h4>
            <p>
              Sokogate.com यह अफ्रीका में एक बी2बी क्रास्स-सीमा व्यापारिक
              प्लेटफर्म है, जो वैश्विक छोटे और मध्यम आकारियों के अन्तराष्ट्रीय
              व्यापारिकों को प्रगति करने के लिए आवश्यक है, सच्चात अन्तर् हम
              दोनों प्रक्रिया में समाधान बनाने के लिए सेवा प्रदान करते हैं, जो
              सूचना, समर्थन और उद्योग को सामर्थ्य देते हैं.
            </p>
            <p>
              सोकोगेट. कॉम विक्रेता और विक्रेता के लिए एक पूरा संपूर्ण संपूर्ण
              तंत्र निर्माण करेगा, एक संपूर्ण प्रदाता और विक्रेता क्वालिफिकेशन
              रीविक्शन सिस्टम को सूमित करेगा, खर
            </p>
          </div>
        </b-col>
      </b-row>

      <div v-if="locale == 'zh'" class="red-stripe">我们的优势</div>
      <div v-else-if="locale == 'en'" class="red-stripe">Our advantages</div>
      <div v-else-if="locale == 'fra'" class="red-stripe">
        Avantages de nous
      </div>
      <div v-else-if="locale == 'spa'" class="red-stripe">
        Ventajas de nosotros
      </div>
      <div v-else-if="locale == 'pt'" class="red-stripe">Vantagens de nós</div>
      <div v-else-if="locale == 'ara'" class="red-stripe">قوتنا</div>
      <div v-else-if="locale == 'ru'" class="red-stripe">
        Наше преимущество.
      </div>
      <div v-else-if="locale == 'per'" class="red-stripe">سود ما</div>
      <div v-else-if="locale == 'hi'" class="red-stripe">हमारे लाभ</div>

      <b-row v-if="locale == 'zh'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>全程客户服务</h4>
                  <p>
                    从注册、运营、交易环节提供1V1的商户服务，无论是否有做过外贸，或者是否有做过线上电商，都可以轻松开启跨境电商业务
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>专业运营团队</h4>
                  <p>
                    非洲当地的运营团队，更懂非洲采购商的需求，提供更准确的市场资讯，为国际采购商解决本地文化、语言沟通障碍
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>高效营销方式</h4>
                  <p>
                    非洲当地的市场人员，会在非洲当地针对性的批发市场商家进行采购商指引，为国际供应商挖掘更多实力的采购商
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>便捷无障碍沟通</h4>
                  <p>
                    移动端同步，在线实时翻译，随时随地接收采购信息，不漏掉任何商机
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>公平与合规环境</h4>
                  <p>
                    平台对于买卖双方，均进行严格的资质审核，建立完善的诚信系统，解决双方的信任问题，降低买卖双方的交易风险
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Whole process customer service</h4>
                  <p>
                    Provide 1v1 merchant services from the aspects of
                    registration, operation and transaction. Whether you have
                    done foreign trade or online e-commerce, you can easily
                    start cross-border e-commerce business
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Professional operation team</h4>
                  <p>
                    The local operation team in Africa can better understand the
                    needs of African purchasers, provide more accurate market
                    information, and solve the local cultural and language
                    communication barriers for international purchasers
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Efficient marketing mode</h4>
                  <p>
                    Local marketing personnel in Africa will provide guidance to
                    purchasers in local wholesale markets in Africa, so as to
                    tap more powerful purchasers for international suppliers
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Convenient and accessible communication</h4>
                  <p>
                    Mobile terminal synchronization, online real-time
                    translation, receiving procurement information anytime and
                    anywhere, without missing any business opportunities
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Fair and compliance environment</h4>
                  <p>
                    The platform carries out strict qualification audit for both
                    parties, establishes a perfect credit system, solves the
                    trust problem of both parties, and reduces the transaction
                    risk of both parties
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Service client complet</h4>
                  <p>
                    De l’enregistrement, l’opération, le lien commercial pour
                    fournir des services 1V1, peu importe si vous avez fait du
                    commerce extérieur, ou si vous avez fait du commerce
                    électronique en ligne, vous pouvez facilement ouvrir des
                    affaires de commerce électronique transfrontalières
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Équipe opérationnelle spécialisée</h4>
                  <p>
                    Équipe opérationnelle locale en afrique, mieux comprendre
                    les besoins des acheteurs africains, fournir des
                    informations plus précises sur le marché, résoudre les
                    barrières de communication culturelle et linguistique
                    locales pour les acheteurs internationaux
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Méthodes de marketing efficaces</h4>
                  <p>
                    Le personnel du marché local en afrique, ciblera les
                    commerçants du marché de gros locaux en afrique pour guider
                    les acheteurs, pour les fournisseurs internationaux pour
                    extraire plus de force des acheteurs
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Communication facile et accessible</h4>
                  <p>
                    Synchronisation mobile, traduction en ligne en temps réel,
                    recevoir des informations d’achat à tout moment, n’importe
                    où, ne manquez aucune opportunité commerciale
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Environnement équitable et conforme</h4>
                  <p>
                    Plate-forme pour les acheteurs et les vendeurs, tous les
                    deux mènent un audit de qualification strict, établissent un
                    système d’intégrité parfait, résolvent les problèmes de
                    confiance des deux parties, réduisent le risque commercial
                    des acheteurs et des vendeurs
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Servicio completo al cliente</h4>
                  <p>
                    Desde el registro, operación, enlace comercial para
                    proporcionar 1V1 servicios comerciales, ya sea que haya
                    hecho comercio exterior, o si ha hecho comercio electrónico
                    en línea, puede abrir fácilmente un negocio de comercio
                    electrónico transfronterizo
                  </p></b-col
                >
              </div>
            </div>
            <div cols="12" md="2" class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Equipo de operaciones profesional</h4>
                  <p>
                    Equipo de operaciones locales en áfrica, mejor comprensión
                    de las necesidades de los compradores africanos,
                    proporcionar información de mercado más precisa, para los
                    compradores internacionales para resolver las barreras
                    culturales y lingüísticas locales de comunicación
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Formas eficientes de marketing</h4>
                  <p>
                    El personal del mercado local en áfrica dirigirá a los
                    comerciantes del mercado mayorista en áfrica para guiar a
                    los compradores y extraer más fuerza para los proveedores
                    internacionales
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Comunicación fácil y accesible</h4>
                  <p>
                    Sincronización móvil, traducción en línea en tiempo real,
                    recibir información de compra en cualquier momento y en
                    cualquier lugar, sin perder ninguna oportunidad de negocio
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Entorno de equidad y cumplimiento</h4>
                  <p>
                    Plataforma para compradores y vendedores, ambos llevan a
                    cabo una estricta auditoría de calificación, establecer un
                    sistema de integridad perfecto, resolver los problemas de
                    confianza de ambas partes, reducir el riesgo comercial de
                    compradores y vendedores
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Serviço completo ao cliente</h4>
                  <p>
                    Do registro, operação, link de negociação para fornecer
                    serviços comerciais 1V1, não importa se você fez comércio
                    exterior, ou se você fez comércio eletrônico on-line, você
                    pode facilmente abrir negócios de comércio eletrônico
                    transfronteiriço
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Equipe de operações profissional</h4>
                  <p>
                    Equipe de operação local na áfrica, melhor entender as
                    necessidades dos compradores africanos, fornecer informações
                    de mercado mais precisas, resolver as barreiras de
                    comunicação cultural e linguística locais para compradores
                    internacionais
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Formas eficientes de marketing</h4>
                  <p>
                    Pessoal de mercado local na áfrica, irá direcionar os
                    comerciantes do mercado de atacado na áfrica local para a
                    orientação do comprador, para os fornecedores internacionais
                    para cavar mais força do comprador
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Comunicação fácil e acessível</h4>
                  <p>
                    Sincronização móvel, tradução on-line em tempo real, receber
                    informações de compra a qualquer momento, em qualquer lugar,
                    sem perder nenhuma oportunidade de negócio
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Ambiente de equidade e conformidade</h4>
                  <p>
                    Plataforma para compradores e vendedores, ambos conduzem uma
                    auditoria de qualificação rigorosa, estabelecem um sistema
                    de integridade perfeito, resolvem os problemas de confiança
                    de ambos os lados, reduzem o risco de negociação entre
                    compradores e vendedores
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>خدمة العملاء</h4>
                  <p>
                    فالخدمات التجارية البالغة 1V1 التي تقدم من خلال سلسلة
                    التسجيل والتشغيل والمعاملات التجارية، سواء كانت تجارياً
                    تجارياً أم لا، أو إذا كانت تعمل على خط هاتفي، يمكن أن تيسر
                    فتح عمليات التجارية عبر الحدود
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>فريق التشغيل المهني</h4>
                  <p>
                    ويفهم القائمون بالأعمال المحليون في أفريقيا احتياجات
                    المشترين الأفارقة بشكل أفضل، ويوفرون معلومات أكثر دقة عن
                    السوق، ويعالجون العقبات التي تعترض التواصل الثقافي واللغوي
                    لدى المشترين الدوليين
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>طريقة تسويق فعالة</h4>
                  <p>
                    ويقوم العاملون في الأسواق المحلية في أفريقيا بإرشاد المشترين
                    في أسواق الجملة المستهدفة محليا في أفريقيا من أجل استكشاف
                    المزيد من المشترين من أجل الموردين الدوليين
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>سهولة الوصول</h4>
                  <p>
                    وتترجم في الوقت الحقيقي على الإنترنت في الوقت الحقيقي،
                    وتتلقى معلومات الشراء في أي وقت وفي أي مكان، دون إغفال أي
                    فرص تجارية
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>بيئة الإنصاف والامتثال</h4>
                  <p>
                    وينظم المنبر إجراءات صارمة للتحقق من مؤهلات المشترين
                    والبائعين، وينشئ نظاما حسن النية، ويعالج مسائل الثقة بين
                    الطرفين، ويقلل من مخاطر المعاملات بينهما
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Полное обслуживание клиентов</h4>
                  <p>
                    Коммерческие услуги, предоставляющие услуги 1V1 из реестра,
                    операций, торговых операций, вне зависимости от того, была
                    ли когда-либо иностранная торговля или онлайн-продавец,
                    могут легко открываться для трансграничных торговцев
                    электричеством
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Профессиональная оперативная команда</h4>
                  <p>
                    Местные оперативные группы в африке, которые лучше
                    осведомлены о потребностях африканских покупателей,
                    предоставляют более точную рыночную информацию для
                    международных закупщиков, чтобы решить местные культурные и
                    языковые барьеры коммуникации
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Эффективный способ маркетинга</h4>
                  <p>
                    Местные работники рынка в африке, направляющие закупщиков в
                    местные ориентированные оптовые торговцы в африке, приобрели
                    больше власти для международных поставщиков
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Легко общаться без препятствий</h4>
                  <p>
                    Синхронизированный конец мобильного телефона, онлайн-перевод
                    в реальном времени, получение информации о закупках в любое
                    время и в любом месте, не упуская возможности для бизнеса
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Справедливая и гармоничная окружающая среда</h4>
                  <p>
                    Платформа проводит тщательный пересмотр квалификационных
                    данных между покупателями и покупателями, устанавливает
                    совершенную систему добросовестности, решает вопросы доверия
                    между сторонами и снижает риск сделки между покупателями и
                    покупателями
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>خدمت کامل پروژه مشتری</h4>
                  <p>
                    خدمات تجاری 1v1 از ارتباط ثبت، عملیات و تجارت ارتباط داده
                    می‌شود. آیا تجارت خارجی یا تجارت الین انجام داده‌اید،
                    می‌توانید به آسانی تجارت تجارت e-commerce cross-border را
                    باز کنید
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>تیم عملیات حرفه ای</h4>
                  <p>
                    تیم عملیات محلی در آفریقا می تواند نیازهای خریداران آفریقا
                    را بهتر درک کند، اطلاعات بازار دقیق‌تری را پیشنهاد کند، و
                    بازداشتهای ارتباطی فرهنگی و زبان محلی را برای خریداران بین
                    المللی حل کند
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Modus marketing efficient</h4>
                  <p>
                    افراد بازاری محلی در آفریقا راهنمایی برای خریدگان در
                    بازارهای موجود موجود در آفریقا خواهند داد تا خریدارهای قوی
                    تر برای خریداران موجود بین المللی را پیدا کنند
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>Convenient and barrier free communication</h4>
                  <p>
                    هماهنگ ترمینال موبایل، ترجمه زمان واقعی آنلاین، اطلاعات خرید
                    در هر زمان و هر جایی، بدون هیچ فرصت تجاری از دست دادن
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>محیط عادلانه و پیروزی</h4>
                  <p>
                    Platform conducts strict qualification review for both the
                    buyer and the seller, establishes a complete integrity
                    system, solves the trust problems of both parties, and
                    reduces the transaction risks of both parties
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col
          cols="12"
          md="10"
          offset="0"
          offset-md="1"
          class="red-stripe-box"
        >
          <div align-h="between" class="red-stripe-box-row">
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/3346ff9dddf81402c2db3bfafe8eb5b8.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>पूरा प्रक्रिया ग्राहक सेवा</h4>
                  <p>
                    1v1 व्यापारी सेवा रिजिस्ट्रेशन, ऑपरेशन तथा ट्रांसेक्शन लिंक
                    से प्रदान किया जाता है. क्या आप विदेशी व्यापार या ऑनलाइन ईम-
                    व्या
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/2f1487f4ddf484506de532f357d6402b.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>व्यवसायिक आपरेशन टीम</h4>
                  <p>
                    अफ्रीका में स्थानीय ऑपरेशन टीम अफ्रीकी खरीद करनेवालों की
                    जरूरतों को बेहतर समझ सकता है, अधिक सुधार बाजार सूचना देता
                    है, और स्थान
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/378827d6d2b90d8fdf56114264d04a6d.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>प्रभावी मार्केटिंग मोड</h4>
                  <p>
                    अफ्रीका में स्थानीय मार्केटिंग व्यक्तियों को आफ्रिका में
                    स्थानीय मार्केटिंग व्यक्तियों के लिए स्थानीय मार्केट
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/4836c5fbda02be418584f11dd4ede056.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>मुक्त संपर्क से उपयोगी और रोकें</h4>
                  <p>
                    मोबाइल टर्मिनल सिंक्रोनाइज़ेशन, ऑनलाइन वास्तविक समय अनुवाद,
                    प्राप्त सूचना प्राप्त होने के बिना किसी व्यापार
                  </p></b-col
                >
              </div>
            </div>
            <div class="red-stripe-box-item">
              <div class="p0">
                <b-col cols="12" class="red-stripe-box-item-head centre"
                  ><img
                    src="https://oss.sokogate.com/image/5b152c049124a20bf882ad635348fe57.png"
                /></b-col>
                <b-col cols="12"
                  ><h4>साधारण और अनुपूर्ण वातावरण</h4>
                  <p>
                    The platform conducts strict qualification review for both
                    the buyer and the seller, establishes a complete integrity
                    system, solves the trust problems of both parties, and
                    reduces the transaction risks of both parties
                  </p></b-col
                >
              </div>
            </div>
          </div>
        </b-col>
      </b-row>

      <img
        v-if="locale == 'zh'"
        src="https://oss.sokogate.com/image/219b45aa913ff3886eced3aadfa012f6.png"
      />
      <img
        v-else-if="locale == 'en'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <img
        v-else-if="locale == 'fra'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <img
        v-else-if="locale == 'spa'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <img
        v-else-if="locale == 'pt'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <img
        v-else-if="locale == 'ara'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <img
        v-else-if="locale == 'ru'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <img
        v-else-if="locale == 'per'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <img
        v-else-if="locale == 'hi'"
        src="https://oss.sokogate.com/image/d5fdec6ee102605a3c7f760b4f9f6617.png"
      />
      <div
        style="
          background-image: url('https://oss.sokogate.com/image/9d1e16590b6e88575d189f5465c345b7.png');
        "
        class="bg-image"
      >
        <b-button pill size="lg" v-if="locale == 'zh'">我要开店 ></b-button>
        <b-button pill size="lg" v-else-if="locale == 'en'"
          >I want to open a shop ></b-button
        >
        <b-button pill size="lg" v-else-if="locale == 'fra'"
          >Je veux ouvrir une boutique ></b-button
        >
        <b-button pill size="lg" v-else-if="locale == 'spa'"
          >Quiero abrir una tienda ></b-button
        >
        <b-button pill size="lg" v-else-if="locale == 'pt'"
          >Quero abrir uma loja ></b-button
        >
        <b-button pill size="lg" v-else-if="locale == 'ara'"
          >سأفتح المتجر ></b-button
        >
        <b-button pill size="lg" v-else-if="locale == 'ru'"
          >Я собираюсь открыть магазин ></b-button
        >
        <b-button pill size="lg" v-if="locale == 'per'"
          >ميخوام يه مغازه باز کنم ></b-button
        >
        <b-button pill size="lg" v-else-if="locale == 'hi'"
          >मैं एक दुकान खोलना चाहता हूँ ></b-button
        >
        <h4 v-if="locale == 'zh'">联系我们，了解更多业务知识</h4>
        <h4 v-else-if="locale == 'en'">
          Contact us for more business knowledge
        </h4>
        <h4 v-else-if="locale == 'fra'">
          Contactez-nous pour en savoir plus sur notre entreprise
        </h4>
        <h4 v-else-if="locale == 'spa'">
          Contáctenos para saber más sobre el negocio
        </h4>
        <h4 v-else-if="locale == 'pt'">
          Contacte-nos e saiba mais sobre o negócio
        </h4>
        <h4 v-else-if="locale == 'ara'">اتصل بنا لمعرفة المزيد عن الأعمال</h4>
        <h4 v-else-if="locale == 'ru'">
          Свяжись с нами, узнай больше о бизнесе
        </h4>
        <h4 v-else-if="locale == 'per'">
          برای دانش تجارت بیشتری با ما تماس بگیرید
        </h4>
        <h4 v-else-if="locale == 'hi'">
          अधिक व्यवसाय ज्ञान के लिए हमसे संपर्क करें
        </h4>
        <img
          src="https://oss.sokogate.com/image/3371223c03d9dc18945e8b346833ed38.png"
        />
        <p v-if="locale == 'zh'">招商经理 微信二维码</p>
        <p v-else-if="locale == 'en'">Merchants manager wechat QR code</p>
        <p v-else-if="locale == 'fra'">Manager wechat code qr</p>
        <p v-else-if="locale == 'spa'">
          Gerente de atracción de negocios wechat código qr
        </p>

        <p v-else-if="locale == 'pt'">Gerente de negócios wechat código qr</p>
        <p v-else-if="locale == 'ara'">. مدير أعمال على الهاتف</p>
        <p v-else-if="locale == 'ru'">
          Двухмерный код для менеджера по продажам
        </p>
        <p v-else-if="locale == 'per'">Comment</p>
        <p v-else-if="locale == 'hi'">Wechat QR code of investment manager</p>
      </div>
    </div>
  </b-container>
</template>
<script>
export default {
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
    padding: 3%;
    margin-bottom: 50px;

    .col {
      padding: 3% 5%;
    }
  }

  .row.p0 {
    padding: 0;
  }

  .red-stripe {
    background: #ff6666;
    width: 100%;
    height: 150px;
    align-items: center;
    justify-content: center;
    display: flex;
    font-weight: 600;
    font-size: 30px;
    color: #fff;
    font-style: normal;

    &-box {
      background: #fff;
      box-shadow: 9px 1px 48px rgba(255, 102, 102, 15%);
      border-radius: 15px;
      padding: 30px 30px;
      margin-top: -60px;

      &-item {
        background: #fff;
        border: 1px solid #ff6666;
        box-sizing: border-box;
        border-radius: 30px 31px 30px 30px;
        overflow: hidden;

        &-head {
          background-color: #f8e4e3;
          height: 150px;
          margin-bottom: 15px;

          img {
            width: 120px;
            height: 120px;
            object-fit: contain;
          }
        }

        h4 {
          font-size: 14px;
          line-height: 20px;
        }

        p {
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
  
  }
    .red-stripe-box-row{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      grid-row-gap: 20px;
      grid-column-gap: 20px;
    }

  .bg-image {
    height: 400px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-bottom: 100px;
    text-align: center;

    .btn {
      width: 450px;
      max-width: 100%;
      display: block;
      margin: 30px auto;
      background-color: #ef2e22;
      border-color: #ef2e22;
    }
  }
}
</style>