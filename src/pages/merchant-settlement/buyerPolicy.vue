<template>
  <b-container class="merchant-settlement-page">
    <div v-title :data-title="$t('menuitems.layout.buyerpolicy')">
      <Breadcrumb :items="items" />
      <b-row v-if="locale == 'zh'">
        <b-col cols="12">
          <div class="col">
            <p>
              爱是甜蜜的，爱是神圣的。 埃涅拉语，舌状叶。 Aenean马萨。
              我们的社会有生育能力，也有生育能力。
            </p>
            <p>
              这是一种特殊的物质，一种粉状的物质，一种特殊的物质。
              没有任何结果。 小扁桃、小扁桃、小扁桃、小扁桃、小扁桃
            </p>
            <p>
              在enim justo, rhoncus ut, imperdiet, venenatis vitae, justo中。
              这句话没有任何意义。 整数tincidunt。 耐腐蚀合金dapibus。
              我们是永恒的元素。 埃涅生阴唇，eleifend tellus。 他的名字叫leo
              ligula, porttitor eu, vitae, eleifend ac, enim。 Aliquam lorem
              ante, dapibus in, viverra quis, feugiat a， In enim justo, rhoncus
              ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu
              pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus
              elementum semper nisi. Aenean vulputate eleifend tellus. Aenean
              leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
              Aliquam lorem ante, dapibus in, viverra quis, feugiat a
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12">
          <div class="col">
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            </p>
            <p>
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu.
            </p>
            <p>
              In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
              Nullam dictum felis eu pede mollis pretium. Integer tincidunt.
              Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate
              eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae,
              eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis,
              feugiat a, In enim justo, rhoncus ut, imperdiet a, venenatis
              vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer
              tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
              vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
              consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus
              in, viverra quis, feugiat a,
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col cols="12">
          <div class="col">
            <p>
              L’amour est doux, l’amour est divin. Langue enera avec une langue
              à feuilles. Aenean massa. Notre société est fertile et fertile.
            </p>
            <p>
              C’est une substance particulière, une substance en poudre, une
              substance particulière. Aucun résultat n’a été trouvé. Amylophila,
              amylophila, amylophila, amylophila, amylophila, amylophila.
            </p>
            <p>
              Dans enim justo, rhoncus ut, imperdiet, venenatis vitae, justo.
              Cette déclaration n’a aucun sens. Entier tincidunt. Alliage
              résistant à la corrosion dapibus. Nous sommes des éléments
              éternels. 埃涅生阴唇，eleifend tellus。 他的名字叫leo ligula,
              porttitor eu, vitae, eleifend ac, enim。 Aliquam lorem ante,
              dapibus in, viverra quis, feugiat a， In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
              mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
              semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
              porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem
              ante, dapibus in, viverra quis, feugiat a,
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12">
          <div class="col">
            <p>
              El amor es dulce, el amor es divino. Enera, glosario de hojas.
              Aenea massa. Nuestra sociedad es fértil y fértil.
            </p>
            <p>
              Es una sustancia especial, una sustancia en polvo, una sustancia
              especial. No hay resultados. Lentejas lentejas lentejas lentejas
              lentejas lentejas
            </p>
            <p>
              En enim justo, rhoncus ut, imperdiet, venenatis vitae, justo. No
              tengo nada que decir. Número entero tincidunt. Aleación resistente
              a la corrosión dapibus. Somos elementos eternos. Enea produce
              labios, eleifend tellus. Su nombre era leo ligula, porttitor eu,
              vitae, eleifend ac, enim. Aliquam lorem ante, dapibus en, viverra
              quis, feugiat a, In enim justo, rhoncus ut, imperdiet a, venenatis
              vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer
              tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
              vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
              consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus
              in, viverra quis, feugiat a
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12">
          <div class="col">
            <p>
              O amor é doce, o amor é divino. Língua enera, língua de folha.
              Aenean massa. A nossa sociedade é fértil e fértil.
            </p>
            <p>
              É uma substância especial, uma substância em pó, uma substância
              especial. Não houve resultados. Amígdalas amígdalas amígdalas
              amígdalas amígdalas amígdalas
            </p>
            <p>
              Em enim justo, rhoncus ut, imperdiet, venenatis vitae, justo. Esta
              afirmação não faz sentido nenhum. O inteiro tincidunt. Liga
              resistente à corrosão dapibus. Somos elementos eternos. Enea
              produz lábios, eleifend tellus. Seu nome era leo ligula, porttitor
              eu, vitae, eleifend ac, enim. Dapibus em, viverra quis, feugiat a,
              In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
              Nullam dictum felis eu pede mollis pretium. Integer tincidunt.
              Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate
              eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae,
              eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis,
              feugiat a
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12">
          <div class="col">
            <p>
              الحب حلو والحب مقدس. لغة الإينيلا، ورقة لسان. . نان ماسا
              ومجتمعاتنا لديها القدرة على الإنجاب.
            </p>
            <p>
              هذه مادة خاصة، مادة مسحوق، مادة خاصة. بدون أي نتيجة. العدس، العدس،
              العدس، العدس، العدس
            </p>
            <p>
              في Eenim Justo، Rhoncus UT، Imperdiet، Venenatis Vitae، Just. هذه
              الجملة لا معنى لها. العدد الكامل Tincidun. مقاومة للتآكل سبائك
              Dapibus. نحن عناصر أبدية. شفاه (إرنييه)، (إليفيند تيلوس اسمه ليو
              Ligula، Portitor Eu، Vitae، Eleifend A، Enim. أليكم لورم آنتي،
              دابيبوس I، Viverraquis، Feugiat A، Ienim Justo، Rhoncus UT، . لا
              بأس، لا بأس ـ (ـ ـ (ـ (ـ ـ (ـ (ـ (ـ (ـ (ـ (ـ (ـ (ـ (ـ (ـ (ـ (ـ (ـ
              (ـ (ـ (ـ (ـ (ـ (ـ (ـ سيمبل)، لا بأس) Porttitor Eu، Consequatt
              Vitae، Elefend A، Eenen. Aliquam Lorem. .، دابيبوس، فيفيرا كويس،
              فيوجيات أ
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12">
          <div class="col">
            <p>
              Любовь сладка, любовь священна. Язык энелы, языковой лист. Энеан
              маса. Наше общество обладает плодовитостью и плодовитостью.
            </p>
            <p>
              Это особое вещество, порошкообразное вещество, особое вещество. Ни
              к чему это не привело. Чечевица, чечевица, чечевица, чечевица,
              чечевица, чечевица
            </p>
            <p>
              В "enim justo", "rhoncus ut", "imperdiet", "venenatis vitae", в
              "justo". В этом предложении нет никакого смысла. Целое число.
              Сплав, стойкий к коррозии, дапибус. Мы-вечный элемент. Половые
              губы энезона, eleifend tellus. Его зовут Лео Ligula, portitor eu,
              vitae, eleifend ac, enim. Аликам лорам анте, Dapibus in, viverra
              quis, feugiat, in enim justo, rhoncus ut, Imperdiet a, venenatis
              vitae, justo Nullam ditum eu pede Морис претиум Семпер ниссен.
              Портитор eu, consequat vitae, eleifend ac, enim Ante, dapibus in,
              viverra quis, feugiat a
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12">
          <div class="col">
            <p>
              عشق شيرينه عشق مقدسه انيلا، لوب زباني ماسا اينيا جامعه ما توانایی
              دارد که بچه ها را به دنیا بیاورند، و توانایی دارد که بچه ها را به
              دنیا بیاورند.
            </p>
            <p>
              این مواد ویژه، مواد پودر، مواد ویژه است. نتيجه اي نداشت آلمان
              کوچک، آلمان کوچک، آلمان کوچک، آلمان کوچک، آلمان کوچک، آلمان کوچک
            </p>
            <p>
              در نيم جوستو، رونکوس UT، امپراتور، venenatis vitae, Justo. اين
              جمله معني نداره کل کوچولو کروزيون مقاومت به لئوي دابيبوس ما عناصر
              ابدی هستیم. الیوف لابیا تلوس اسمش لئو ـه لیگولا، porttitor eu،
              vitae, eleifend ac, enim. Aliquam lorem ante، dapibus in, viverra
              quis, feugiat a, in enim justo, rhoncus ut, imperdiet a, venenatis
              vitae, justo. Nullam dictum felis eu pede موليس پرتيوم کل کوچولو
              کراس دابيبوس ابتدام Vivamus هميشه نيس الیف آهنی و تلویزیون می‌کند.
              Aenean leo ligula, porttitor eu, consequate vitae, eleifend ac,
              enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12">
          <div class="col">
            <p>
              प्रेम मीठा है, प्रेम पवित्र है। एनिएला, भाषा लोब। एनियन मासा.
              हमारे समाज में बच्चों को जन्म देने की सामर्थ्य है, और उसके पास
              बच्चों को जन्म देने की सामर्थ्य है।
            </p>
            <p>
              यह एक विशेष पदार्थ है, एक पावरी पदार्थ, एक विशेष पदार्थ है। कोई
              परिणाम नहीं था। छोटे बादल, छोटे बादल, छोटे बादल, छोटे बादल, छोटे
              बादल, छोटे बादल
            </p>
            <p>
              क्योंकि जास्तो, रोन्कुस ut, imperdiet, venenatis vitae, justo 中.
              इस वाक्य का अर्थ नहीं है. पूर्ण अंक टिंसिडुन्ट. कोरोसियन
              रेसिस्टेंट अलो डाबीबुस. हम अनन्त तत्व हैं। 埃涅生阴唇，eleifend
              tellus。 他的名字叫leo ligula, porttitor eu, vitae, eleifend ac,
              enim。 Aliquam lorem ante, dapibus in, viverra quis, feugiat a，
              In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
              Nullam dictum felis eu pede mollis pretium. Integer tincidunt.
              Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate
              eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae,
              eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis,
              feugiat a
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
          text: this.$t("menuitems.layout.buyerpolicy"),
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
}
</style>