<template>

  <b-container class="merchant-settlement-page">
<div v-title :data-title="$t('menuitems.layout.tradeAssurance')">
    <Breadcrumb :items="items" />
    <b-row v-if="locale == 'zh'">
      <b-col>
        <div class="col">
          <h4>有sokgate贸易保障, 您安全!</h4>
          <p>
            贸易保证被认为是一个非常重要的服务, 建立买家和供应商之间的信任在sokgate.
          </p>
          <p>
            放心, 贸易保证保证您的订单的质量和数量以及装运日期, 以满足您的期望.
          </p>

          <h4>确保你的command安全!</h4>
          <p>
            SokoGate提供贸易保证服务, 以保护您的订单, 以避免任何航运或质量相关的纠纷."
          </p>
          <p>
            虽然sokgate为可信赖的供应商提供担保, 但意外还是会发生.
            因此, Sokogate贸易保证帮助您在任何纠纷中达到满意的结果, 甚至强调要回您的钱.
          </p>
          <p>
            您可以在sokogate.com上购买任何由供应商提供的产品, 商品, 项目, 并有信心您是受贸易保证保护的.
          </p>

          <h4>如何使用贸易保证?</h4>
          <p>为了应对sokgate贸易保证, 请记住以下提示:</p>
          <p>1,通过贸易保险公司订购.</p>
          <p>2, 寻找在sokogate上与贸易保证合作的供应商.</p>
          <p>
            3,
            使用sokgate支付method在线支付, 包括银行转账, 信用卡或借记卡, 或更多.
          </p>
          <p>
            如果订单有任何问题, 那么您可以填写贸易担保request, 我们会协助您完全得到满意.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'en'">
      <b-col>
        <div class="col">
          <h4>With SokoGate Trade Assurance, You are Safe!</h4>
          <p>
            Trade Assurance is considered a very important service that builds
            trust between buyers and suppliers on SokoGate.
          </p>
          <p>
            Rest Assured, trade assurance guarantees the quality and quantity of
            your orders as well as shipment date to meet your expectations.
          </p>

          <h4>Keep Your Orders Safe!</h4>
          <p>
            SokoGate provides Trade Assurance Service to protect your orders in
            order to save you from any shipping or quality-related disputes.
          </p>
          <p>
            Although Sokogate guarantees trusted suppliers, the unexpected can
            occur. Thus, Sokogate trade assurance helps you at any disputes to
            reach a satisfying outcome even emphasizes getting your money back.
          </p>
          <p>
            You can purchase any products, goods, items offered by suppliers on
            sokogate.com with confidence that you’re protected with trade
            assurance.
          </p>

          <h4>How do I Use Trade Assurance?</h4>
          <p>
            In order to deal with SokoGate Trade Assurance, keep in mind the
            following tips:
          </p>
          <p>1,Place your orders through Trade Assurance.</p>
          <p>
            2,Look for suppliers who are working with trade assurance on
            sokogate.
          </p>
          <p>
            3,Pay online with Sokogate payment methods, including Bank transfer,
            Credit or Debit Cards, or more.
          </p>
          <p>
            If there is any problem with the orders, then you can fill the trade
            assurance application, and we will assist you to completely get
            satisfied.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'fra'">
      <b-col>
        <div class="col">
          <h4>Avec sokgate trade assurance, vous êtes en sécurité!</h4>
          <p>
            Trade assurance est considéré comme un service très important pour
            établir la confiance entre les acheteurs et les fournisseurs chez
            sokgate.
          </p>
          <p>
            Soyez assuré que l’assurance commerciale garantit la qualité et la
            quantité de votre commande ainsi que la date d’expédition pour
            répondre à vos attentes.
          </p>

          <h4>Sécurisez vos commandes!</h4>
          <p>
            SokoGate offre un service d’assurance commerciale pour protéger vos
            commandes afin d’éviter tout litige relatif à l’expédition ou à la
            qualité.
          </p>
          <p>
            Bien que sokgate offre une garantie aux fournisseurs de confiance,
            les imprévus peuvent arriver. Ainsi, l’assurance commerciale de
            Sokogate vous aide à atteindre un résultat satisfaisant dans
            n’importe quel différend, même insistant pour récupérer votre
            argent.
          </p>
          <p>
            Vous pouvez acheter n’importe quel produit, marchandise, article
            offert par le fournisseur sur sokogate.com avec la confiance que
            vous êtes protégé par l’assurance commerciale.
          </p>

          <h4>Comment utiliser trade assurance?</h4>
          <p>
            Pour faire face à l’assurance commerciale de sokgate, gardez les
            conseils suivants à l’esprit:
          </p>
          <p>1, Ordre par l’intermédiaire de l’assurance commerciale.</p>
          <p>
            2, Recherchez le fournisseur qui coopèrent avec l’assurance
            commerciale sur sokogate.
          </p>
          <p>
            3, Payez en ligne avec les méthodes de paiement sokgate, y compris
            les virements bancaires, les cartes de crédit ou de débit, ou plus.
          </p>
          <p>
            S’il y a un problème avec l’ordre, alors vous pouvez remplir une
            demande d’assurance commerciale, nous vous aiderons à obtenir
            pleinement satisfaction.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'spa'">
      <b-col>
        <div class="col">
          <h4>¡Con la seguridad comercial de sokgate, usted está seguro!</h4>
          <p>
            Trade assurance se considera un servicio muy importante para crear
            confianza entre compradores y proveedores en sokgate.
          </p>
          <p>
            Tenga la tranquilidad de que la garantía comercial garantiza la
            calidad y la cantidad de su pedido y la fecha de envío para
            satisfacer sus expectativas.
          </p>

          <h4>Mantenga sus pedidos seguros!</h4>
          <p>
            SokoGate proporciona el servicio comercial de la garantía para
            proteger su orden para evitar cualquier envío o disputa relacionada
            de la calidad."
          </p>
          <p>
            Aunque sokgate ofrece garantías a proveedores de confianza, los
            accidentes pueden ocurrir. Por lo tanto, la garantía comercial de
            Sokogate le ayuda a lograr un resultado satisfactorio en cualquier
            disputa, incluso enfatizando para recuperar su dinero.
          </p>
          <p>
            Puede comprar cualquier producto, mercancía, artículo ofrecido por
            un proveedor en sokogate.com con la confianza de que está protegido
            por trade assurance.
          </p>

          <h4>Cómo usar trade assurance?</h4>
          <p>
            Para hacer frente a la garantía comercial de sokgate, tenga en
            cuenta los siguientes consejos:
          </p>
          <p>1,Orden a través de trade assurance company.</p>
          <p>
            2, Encuentre a un proveedor que trabaje con trade assurance en
            sokogate.
          </p>
          <p>
            3, Pague en línea con los métodos de pago sokgate, incluyendo
            transferencia bancaria, tarjeta de crédito o débito, o más.
          </p>
          <p>
            Si hay algún problema con la orden, entonces puede rellenar la
            solicitud de garantía comercial, le ayudaremos a obtener una
            completa satisfacción.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'pt'">
      <b-col>
        <div class="col">
          <h4>Com segurança de comércio de sokgate, você é seguro!</h4>
          <p>
            Trade assurance é considerado um serviço muito importante para
            construir confiança entre compradores e fornecedores em sokgate.
          </p>
          <p>
            Descanso assegurado, a garantia de comércio assegura a qualidade e a
            quantidade de suas ordens assim como a data de envio para encontrar
            suas expectativas.
          </p>

          <h4>Mantenha seu pedido seguro!</h4>
          <p>
            SokoGate fornece o serviço de comércio da garantia para proteger sua
            ordem para evitar toda a disputa relacionada do transporte ou da
            qualidade.
          </p>
          <p>
            Embora a sokgate ofereça garantias para fornecedores confiáveis,
            acidentes podem acontecer. Portanto, a garantia de comércio Sokogate
            ajuda você a alcançar um resultado satisfatório em qualquer disputa,
            mesmo enfatizando para voltar seu dinheiro.
          </p>
          <p>
            Você pode comprar qualquer produto, mercadoria, item fornecido pelo
            fornecedor em sokogate.com com a confiança de que você está
            protegido pela trade assurance.
          </p>

          <h4>Como usar a garantia de comércio?</h4>
          <p>
            Para lidar com sokgate trade assurance, lembre-se das dicas abaixo:
          </p>
          <p>1,Ordem por trade assurance company.</p>
          <p>
            2, Procurando fornecedores que trabalham com segurança de comércio
            em sokogate.
          </p>
          <p>
            3, Pague online com os métodos de pagamento sokgate, incluindo
            transferência bancária, cartão de crédito ou débito ou mais.
          </p>
          <p>
            Se houver algum problema com a ordem, então você pode preencher o
            pedido de garantia de comércio, vamos ajudá-lo a obter satisfação
            completa.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ara'">
      <b-col>
        <div class="col">
          <h4>هناك ضمان تجاري Sokgate، أنت آمن!</h4>
          <p>
            وتعتبر الضمانات التجارية خدمة بالغة الأهمية، الثقة بين المشترين
            والموردين في سوككيت.
          </p>
          <p>
            كن مطمئنا أن ضمان التجارة يضمن جودة وكمية طلباتك وتاريخ الشحن لتلبية
            توقعاتك.
          </p>

          <h4>تأكد من أن أوامرك آمنة!</h4>
          <p>
            وتوفر شركة سوكوغاتي خدمات ضمان التجارة لحماية طلباتك من أي منازعات
            تتعلق بالنقل البحري أو الجودة.
          </p>
          <p>
            وعلى الرغم من أن "سوكيت" يقدم ضمانات للموردين الموثوق بهم، فإن
            الحوادث تقع. وبالتالي، فإن ضمانات سوكوغاتي التجارية تساعدك على تحقيق
            نتيجة مرضية في أي نزاع، بل تشدد على استرداد أموالك.
          </p>
          <p>
            يمكنك شراء أي منتجات أو سلع أو مشاريع يقدمها الموردون على
            Sokoggate.com، وأن على ثقة من أنك محمي بضمان التجارة.
          </p>

          <h4>كيف تستخدم ضمانات التجارة؟?</h4>
          <p>استجابة لضمانات Sokgate التجارية، يرجى تذكر النصائح التالية:</p>
          <p>1,طلب من خلال شركة التأمين التجاري.</p>
          <p>2, ابحث عن موردين يتعاونون مع ضمانات التجارة على سوكوغاتي.</p>
          <p>
            3, ويتم الدفع عبر الإنترنت باستخدام طريقة "سوكيت" للدفع، بما في ذلك
            التحويلات المصرفية أو بطاقات الائتمان أو بطاقات الخصم، أو أكثر.
          </p>
          <p>
            إذا كان هناك أي مشكلة في طلب الشراء، يمكنك ملء طلب ضمان التجارة
            وسنساعدك في الحصول على الرضا الكامل.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ru'">
      <b-col>
        <div class="col">
          <h4>С обеспечением торговли сокгейт вы в безопасности!</h4>
          <p>
            Торговые гарантии считаются очень важной услугой для установления
            доверия между покупателями и поставщиками в сокгейт.
          </p>
          <p>
            Будьте уверены, торговые гарантии гарантируют качество и количество
            заказов, а также дату отправки, чтобы оправдать ваши ожидания.
          </p>

          <h4>Убедись, что твои приказы в безопасности!</h4>
          <p>
            Сокогейт предоставляет услуги гарантии торговли, чтобы защитить ваш
            заказ от любых споров по поводу доставки или качества.
          </p>
          <p>
            Хотя sokgate предоставляет гарантии надежным поставщикам,
            случайности случаются. Таким образом, торговые гарантии Sokogate
            помогают вам достичь удовлетворительных результатов в любых спорах и
            даже подчеркивают необходимость возвращения ваших денег.
          </p>
          <p>
            Вы можете купить на sokogate.com любую продукцию, товары, проекты
            поставщиков и быть уверенными, что вы защищены гарантиями торговли.
          </p>

          <h4>Как использовать торговые гарантии?</h4>
          <p>
            В ответ на торговые гарантии sokgate, пожалуйста, запомните
            следующее:
          </p>
          <p>1,Закажите через страховую компанию.</p>
          <p>
            2, Ищите поставщика, который сотрудничает с гарантиями торговли на
            сокогейт.
          </p>
          <p>
            3, Онлайн платежи с использованием sokgate, включая банковские
            переводы, кредитные или дебетовые карты, или больше.
          </p>
          <p>
            Если что-то не так с ордером, вы можете заполнить заявление на
            торговый залог, и мы поможем вам получить полное удовлетворение.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'per'">
      <b-col>
        <div class="col">
          <h4>با محافظت تجارت سوکگيت، تو در امان هستي!</h4>
          <p>
            مطمئن کردن تجارت به عنوان خدمت بسیار مهم برای ساختن اعتماد بین
            خریداران و تهیه کنندگان در سوکگیت است.
          </p>
          <p>
            مطمئن شوید، تضمین تجارت کیفیت و تعداد دستور شما و تاریخ انتقال شما
            را تضمین می‌کند.
          </p>

          <h4>Make sure your orders are safe!</h4>
          <p>
            سوکوگیت خدمات اطمینان تجارت را برای حفاظت از دستور شما از هر کشتی یا
            اختلاف‌های مربوط به کیفیت فراهم می‌کند."
          </p>
          <p>
            اگرچه سوکگیت تضمین برای تهیه‌کنندگان اعتماد می‌کند، حادثه‌ها
            می‌توانند اتفاق بیفتند. بنابراین، تضمین تجارت سوکوگات برای کمک به
            شما به رسیدن نتیجه راضی در هر اختلاف، و حتی استرس برای برگرداندن
            پولتون.
          </p>
          <p>
            می‌توانید سوکوگات را ملاقات کنید ما مطمئنيم که شما با تضمين تجارت
            محافظت مي کنيد
          </p>

          <h4>چطور از تضمین تجارت استفاده کنیم?</h4>
          <p>
            برای اینکه با تضمین تجارت سوکگیت معامله کنید، لطفا این نقشه‌های بعدی
            را در ذهن نگه دارید:
          </p>
          <p>1,از طريق شرکت بيمه تجارت دستور بده</p>
          <p>
            2, دنبال تهيه کننده ها که با اطمينان تجارت در سوکوگات همکاري ميکنن
          </p>
          <p>
            3, استفاده از روش پرداخت سوکگیت برای پرداخت آنلاین، شامل انتقال
            بانک، کارت اعتبار یا کارت debit، یا بیشتر.
          </p>
          <p>
            اگر مشکلی با سفارش وجود دارد، می توانید درخواست تضمین تجارت را پر
            کنید، و ما به شما کمک می کنیم تا کامل راضی شوید.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'hi'">
      <b-col>
        <div class="col">
          <h4>सोकगेट व्यापार सुरक्षा से आप सुरक्षित हैं!</h4>
          <p>
            व्यापार सुरक्षा को बहुत महत्वपूर्ण सेवा बनाने के लिए सोकगेट में
            विश्वास करने के लिए बहुत महत्वपूर्ण स
          </p>
          <p>
            सुरक्षित हो जाओ, व्यापार गारंटी अपने क्रम की गुणवत्ता और मात्रा और
            भेजाने की तारीख तुम्हारी आशा से पूरा करने के लि
          </p>

          <h4>तुम्हारे आदेश सुरक्षित हैं!</h4>
          <p>
            सोकोगेट व्यापार सुरक्षा सेवा प्रदान करता है कि तुम्हारे आदेश को कोई
            भेजी या गुणवत्ता संबंधित वि"
          </p>
          <p>
            हालाँकि सोकगेट विश्वासित प्रदान करनेवालों के लिए गारंटी प्रदान करता
            है, अपघातें हो सकती हैं। इसलिए, तुम्हारी मदद करने के लिए कोई संतुष्ट
            परिणाम प्राप्त होने के लिए सोकोगाट व्यापार गारंटियाँ हैं, और तुम्हार
          </p>
          <p>
            आप सोकोगाट को भेट सकते हैं हम भरोसा रखते हैं कि तुम्हें व्यापार की
            गुरानियाँ द्वारा सुरक्षित है।
          </p>

          <h4>व्यापार गारांटी कैसे इस्तेमाल करना है?</h4>
          <p>
            सॉकगेट व्यापार गारंटी के साथ संबंध करने के लिए, कृपया निम्न सूचना को
            मन में रखें:
          </p>
          <p>1,व्यापार बीमा कंपनी के द्वारा आदेश करें.</p>
          <p>
            2, प्रदान करनेवालों के लिए खोज रहे हैं जो सोकोगाट पर व्यापार सुरक्षा
            के साथ सहयोग करते हैं।
          </p>
          <p>
            3, ऑनलाइन पैसा करने के लिए सॉकगेट पैसा पद्धति इस्तेमाल करें, बैंक
            स्थानान्तरण, क्रेडिट कार्ड या डेबिट का
          </p>
          <p>
            यदि क्रम के साथ कोई समस्या है, तो आप व्यापार गारंटी अनुप्रयोग में भर
            सकते हैं, और हम आपको पूरा संतुष्ट पाने के लिए मदद करें
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
          text: this.$t("menuitems.layout.tradeAssurance"),
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

  h5 {
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 36px;
    color: #000;
    margin-left: 3%;
  }

  p {
    font-weight: normal;
    font-size: 13px;
    line-height: 26px;
    color: #000;
  }

  li {
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