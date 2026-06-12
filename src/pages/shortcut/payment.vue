<template>
  <b-container class="merchant-settlement-page">
    <div v-title :data-title="$t('menuitems.shortcut.payment')">
      <Breadcrumb :items="items" />
      <img
        v-if="locale == 'zh'"
        class="bg-images"
        src="https://oss.sokogate.com/image/143c793f21ffe3d3afc7b284472cd51d.png"
      />
      <img
        v-else-if="locale == 'en'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <img
        v-else-if="locale == 'fr'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <img
        v-else-if="locale == 'spa'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <img
        v-else-if="locale == 'pt'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <img
        v-else-if="locale == 'ara'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <img
        v-else-if="locale == 'ru'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <img
        v-else-if="locale == 'per'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <img
        v-else-if="locale == 'hi'"
        class="bg-images"
        src="https://oss.sokogate.com/image/97b3d968756a4274a9c8296c09a576bd.png"
      />
      <!-- <b-row v-if="locale == 'zh'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>你可以付现金</h4>
            <p>
              sokgate在提货点提供货到付款，无论提货地点是在您的门上还是在货运公司。
            </p>
            <p>简单地选择现金交货在付款方式，而购买您的订单，然后结帐。</p>
            <p>
              订单将被送到您的门口，让您在付款前检查并确认您的订单是否满意。
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>You can pay in cash</h4>
            <p>
              1. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            </p>
            <p>
              2. Donec quam feils,ultries nec,pellentesque eu,pretium
              quis,sem.Nulla consequat massa quis enim. Donec pede
              justo,fringilla val,aliquet nec,vulpuate eget,arcu.
            </p>
            <p>
              3.In enim justo,rhoncus ut,imperdiet a, venenatis
              vitae,justo.Nullam dictum feils eu pede mollis pretium.Integer
              tricidunt.Cata dapibus.Vivamus elementum semper nisi.
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fr'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>Vous pouvez payer en espèces</h4>
            <p>
              Sokgate offre le paiement à la livraison au point de ramassage,
              que le lieu de ramassage soit à votre porte ou dans une entreprise
              de transport.
            </p>
            <p>
              Il suffit de choisir la livraison en espèces dans le mode de
              paiement pendant l’achat de votre commande, puis de passer à la
              caisse.
            </p>
            <p>
              La commande sera livrée à votre porte, vous permettant de vérifier
              et de confirmer que vous êtes satisfait de votre commande avant de
              payer.
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>Puedes pagar en efectivo</h4>
            <p>
              Sokgate ofrece el pago contra reembolso en el punto de recogida,
              ya sea en su puerta o en la empresa de transporte.
            </p>
            <p>
              Simplemente seleccione la entrega en efectivo en el método de pago
              mientras compra su pedido y luego realice el pago.
            </p>
            <p>
              El pedido será entregado a su puerta, lo que le permite revisar y
              confirmar su satisfacción con su pedido antes de pagar.
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>Você pode pagar em dinheiro</h4>
            <p>Você pode pagar em dinheiro</p>
            <p>
              Basta selecionar entrega em dinheiro no método de pagamento
              enquanto compra o seu pedido e, em seguida, checkout.
            </p>
            <p>
              O pedido será entregue à sua porta, permitindo que você verifique
              e confirme se está satisfeito com o seu pedido antes do pagamento.
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>يمكنك الدفع نقداً</h4>
            <p>
              ويقدم سوكجيت ثمن التسليم عند نقطة التسليم، سواء كان التسليم على
              بابك أو في شركة الشحن.
            </p>
            <p>
              اختر ببساطة التسليم النقدي في طريقة الدفع، وشراء طلبك، ثم الحساب.
            </p>
            <p>
              سيتم إرسال الطلب إلى بابك للسماح لك بالتحقق والتحقق مما إذا كان
              طلبك راضياً قبل الدفع.
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>Можешь заплатить наличными</h4>
            <p>
              Сокгейт предоставляет платеж в пункте доставки, независимо от
              того, находится ли груз на вашей двери или в грузовой компании.
            </p>
            <p>
              Просто выберите денежную доставку в виде оплаты, покупайте ваш
              заказ и платите.
            </p>
            <p>
              Заказ будет доставлен к вашей двери, чтобы вы проверили и
              убедились, что ваш заказ удовлетворен, прежде чем платить.
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>می توانید پول نقد بپردازید</h4>
            <p>
              Sokgate کالاهایی را برای پرداخت در نقطه انتخاب فراهم می کند ، خواه
              محل انتخاب در درب شما باشد یا یک شرکت حمل و نقل.
            </p>
            <p>
              به سادگی تحویل پول نقد را در روش های پرداخت انتخاب کنید ، سفارش
              خود را بخرید و بررسی کنید.
            </p>
            <p>
              سفارش به درب شما ارسال می شود ، بنابراین شما قبل از پرداخت ، سفارش
              شما را بررسی و تأیید می کنید.
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="img-2"
              src="https://oss.sokogate.com/image/d624a22d6fed36ddef0fa57a337e3793.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col payment-menu-sub-item">
            <h4>आप पैसा में भर सकते हैं</h4>
            <p>
              साक्गेट पिक-अप बिन्दु में भुगता देने के लिए वस्तुएं प्रदान करता
              है, क्या पिक-अप स्थान तुम्हारे दरवाजे पर है या फ्
            </p>
            <p>
              आपके क्रम खरीद करते हैं और फिर जाँच आउट के दौरान पैसा प्रदान को
              पैसा में चुनें.
            </p>
            <p>
              आदेश तुम्हारे दरवाजे में प्रदान किया जाएगा, ताकि तुम जाँच सकते हो
              और पुष्टि कर सकते हो कि क्या तुम्हारा आदेश प
            </p>
            <img
              class="download-img"
              src="https://oss.sokogate.com/image/8344e7ab4a78e5da4158106483f9ca00.png"
              alt=""
            />
          </div>
        </b-col>
      </b-row> -->

      <!-- <b-row v-if="locale == 'zh'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>如何申请信贷</h4>
            <h5>无现金支付</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>
            <h5>交货付款</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>

            <h5>交货付款</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>
            <h5>在上升</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>

            <h5>你可以用奖励卡支付:</h5>
            <p>
              <span> 爱是一种痛苦，爱是一种幸福 </span>

              <span> 爱是一种痛苦，爱是一种幸福 </span>

              <span> 爱是一种痛苦，爱是一种幸福 </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>How to apply credit</h4>
            <h5>Cashless Payment</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>
            <h5>Livraison et paiement</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>
            <h5>On delivery</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, urna
              consequat felis vehicula class ultricies mollis dictumst, aenean
              non a in donec nulla. Phasellus ante pellentesque erat cum risus
              consequat imperdiet aliquam, integer placerat et turpis mi eros
              nec lobortis taciti, vehicula nisl litora tellus ligula porttitor
              metus.
            </p>
            <h5>At pick-up</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, urna
              consequat felis vehicula class ultricies mollis dictumst, aenean
              non a in donec nulla. Phasellus ante pellentesque erat cum risus
              consequat imperdiet aliquam, integer placerat et turpis mi eros
              nec lobortis taciti, vehicula nisl litora tellus ligula porttitor
              metus.
            </p>

            <h5>You can pay with a bonus card:</h5>
            <p>
              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>

              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>

              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fr'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Comment demander un crédit</h4>
            <h5>Paiement sans espèces</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>
            <h5>Livraison et paiement</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>

            <h5>Livraison et paiement</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>
            <h5>Dans la montée</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>

            <h5>Vous pouvez payer avec une carte bonus:</h5>
            <p>
              <span> L’amour est une souffrance, l’amour est un bonheur </span>

              <span> L’amour est une souffrance, l’amour est un bonheur </span>

              <span> L’amour est une souffrance, l’amour est un bonheur </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Cómo solicitar crédito</h4>
            <h5>Pago sin efectivo</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>
            <h5>Entrega y pago</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>

            <h5>Entrega y pago</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>
            <h5>En ascenso</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>

            <h5>Puedes pagar con una tarjeta de recompensas:</h5>
            <p>
              <span> El amor es un dolor, el amor es una felicidad </span>

              <span> El amor es un dolor, el amor es una felicidad </span>

              <span> El amor es un dolor, el amor es una felicidad </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Como solicitar crédito</h4>
            <h5>Pagamento sem dinheiro</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>
            <h5>Pagamento na entrega</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>

            <h5>Pagamento na entrega</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>
            <h5>Em ascensão em</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>

            <h5>Você pode pagar com um cartão de recompensa:</h5>
            <p>
              <span> O amor é uma dor, o amor é uma felicidade </span>

              <span> O amor é uma dor, o amor é uma felicidade </span>

              <span> O amor é uma dor, o amor é uma felicidade </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>كيف تتقدم بطلب للحصول على الائتمان</h4>
            <h5>لا نقدا</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>
            <h5>الدفع عند التسليم</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>

            <h5>الدفع عند التسليم</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>
            <h5>إنها ترتفع</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>

            <h5>يمكنك الدفع مع بطاقة حوافز:</h5>
            <p>
              <span> الحب هو ألم والحب هو السعادة </span>

              <span> الحب هو ألم والحب هو السعادة </span>

              <span> الحب هو ألم والحب هو السعادة </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Как получить кредит</h4>
            <h5>Платить наличными</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>
            <h5>Плата за доставку</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>

            <h5>Плата за доставку</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>
            <h5>Вверх.</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>

            <h5>Ты можешь заплатить премиальной картой:</h5>
            <p>
              <span> Любовь-это боль, любовь-это счастье </span>

              <span> Любовь-это боль, любовь-это счастье </span>

              <span> Любовь-это боль, любовь-это счастье </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>نحوه درخواست اعتبار</h4>
            <h5>پرداخت بدون پول</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد که زمان خوبی در زندگی ما است. به
              دلیل سوء تغذیه ، طبیعت غذایی ضعیف است ، کل عدس و عدس بزرگ برگ و
              همچنین عدس
            </p>
            <h5>تحویل</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد که زمان خوبی در زندگی ما است. به
              دلیل سوء تغذیه ، طبیعت غذایی ضعیف است ، کل عدس و عدس بزرگ برگ و
              همچنین عدس
            </p>

            <h5>تحویل</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد که زمان خوبی در زندگی ما است. به
              دلیل سوء تغذیه ، طبیعت غذایی ضعیف است ، کل عدس و عدس بزرگ برگ و
              همچنین عدس
            </p>
            <h5>رو به افزایش</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد که زمان خوبی در زندگی ما است. به
              دلیل سوء تغذیه ، طبیعت غذایی ضعیف است ، کل عدس و عدس بزرگ برگ و
              همچنین عدس
            </p>

            <h5>می توانید با کارت پاداش پرداخت کنید:</h5>
            <p>
              <span> عشق نوعی درد است ، عشق نوعی خوشبختی است </span>

              <span> عشق نوعی درد است ، عشق نوعی خوشبختی است </span>

              <span> عشق نوعی درد است ، عشق نوعی خوشبختی است </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12" md="6">
          <div class="col">
            <h4>क्रेडिट के लिए कैसे लागू करना है</h4>
            <h5>कैसिलेस पैसा</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>
            <h5>प्रदान पैसा</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>

            <h5>प्रदान पैसा</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>
            <h5>रोसिंग</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>

            <h5>आप एक बदला कार्ड के साथ भुगता कर सकते हैं:</h5>
            <p>
              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>

              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>

              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/b1b157611b7aec5ffc898ea8b1e00ef0.png"
            />
          </div>
        </b-col>
      </b-row> -->
      <img
        v-if="locale == 'zh'"
        class="bg-images"
        src="https://oss.sokogate.com/image/16906e465fedd1ed3f01f61bed34d281.png"
      />
      <img
        v-else-if="locale == 'en'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <img
        v-else-if="locale == 'fr'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <img
        v-else-if="locale == 'spa'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <img
        v-else-if="locale == 'pt'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <img
        v-else-if="locale == 'ara'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <img
        v-else-if="locale == 'ru'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <img
        v-else-if="locale == 'per'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <img
        v-else-if="locale == 'hi'"
        class="bg-images"
        src="https://oss.sokogate.com/image/6fa203e34b67cb5b37409a2b6ea0ee57.png"
      />
      <!-- <b-row v-if="locale == 'zh'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>如何申请信贷</h4>
            <h5>无现金支付</h5>
            <p>
              <span>
                1. 爱是甜蜜的，爱是神圣的。 埃涅拉语，舌状叶。 Aenean马萨。
                我们的社会有生育能力，也有生育能力。
              </span>

              <span>
                2. 这是一种特殊的物质，一种粉状的物质，一种特殊的物质。
                没有任何结果。 小扁桃、小扁桃、小扁桃、小扁桃、小扁桃。
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. 这句话没有任何意义。 整数tincidunt。 耐腐蚀合金dapibus。
                我们是永恒的元素。
              </span>
            </p>
            <h5>交货付款</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>
            <h5>在上升</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>

            <h5>你可以用奖励卡支付:</h5>
            <p>
              <span> 爱是一种痛苦，爱是一种幸福 </span>

              <span> 爱是一种痛苦，爱是一种幸福 </span>

              <span> 爱是一种痛苦，爱是一种幸福 </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>How to apply credit</h4>
            <h5>Cashless Payment</h5>
            <p>
              <span>
                1. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor.Aenean massa. Cum sociis
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus.
              </span>

              <span>
                2. Donec quam felis, ultricies nec, pellentesque eu, pretium
                quis, sem. Nulla consequat massa quis enim. Donec pede justo,
                fringilla vel, aliquet nec, vulputate eget, arcu.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi.
              </span>
            </p>
            <h5>On delivery</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, urna
              consequat felis vehicula class ultricies mollis dictumst, aenean
              non a in donec nulla. Phasellus ante pellentesque erat cum risus
              consequat imperdiet aliquam, integer placerat et turpis mi eros
              nec lobortis taciti, vehicula nisl litora tellus ligula porttitor
              metus.
            </p>
            <h5>At pick-up</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, urna
              consequat felis vehicula class ultricies mollis dictumst, aenean
              non a in donec nulla. Phasellus ante pellentesque erat cum risus
              consequat imperdiet aliquam, integer placerat et turpis mi eros
              nec lobortis taciti, vehicula nisl litora tellus ligula porttitor
              metus.
            </p>

            <h5>You can pay with a bonus card:</h5>
            <p>
              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>

              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>

              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Comment demander un crédit</h4>
            <h5>Paiement sans espèces</h5>
            <p>
              <span>
                1. L’amour est doux, l’amour est divin. Langue enera avec une
                langue à feuilles. Aenean massa. Notre société est fertile et
                fertile.
              </span>

              <span>
                2. C’est une substance particulière, une substance en poudre,
                une substance particulière. Aucun résultat n’a été trouvé.
                Amylophila, amylophila, amylophila, amylophila, amylophila,
                amylophila.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. Cette déclaration n’a aucun sens. Entier tincidunt. Alliage
                résistant à la corrosion dapibus. Nous sommes des éléments
                éternels.
              </span>
            </p>
            <h5>Livraison et paiement</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>
            <h5>Dans la montée</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>

            <h5>Vous pouvez payer avec une carte bonus:</h5>
            <p>
              <span> L’amour est une souffrance, l’amour est un bonheur </span>

              <span> L’amour est une souffrance, l’amour est un bonheur </span>

              <span> L’amour est une souffrance, l’amour est un bonheur </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Cómo solicitar crédito</h4>
            <h5>Pago sin efectivo</h5>
            <p>
              <span>
                1. El amor es dulce, el amor es divino. Enera, glosario de
                hojas. Aenea massa. Nuestra sociedad es fértil y fértil.
              </span>

              <span>
                2. Es una sustancia especial, una sustancia en polvo, una
                sustancia especial. No hay resultados. ¿Por qué no?
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. No tengo nada que decir. Número entero tincidunt. Aleación
                resistente a la corrosión dapibus. Somos elementos eternos.
              </span>
            </p>
            <h5>Entrega y pago</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>
            <h5>En ascenso</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>

            <h5>Puedes pagar con una tarjeta de recompensas:</h5>
            <p>
              <span> El amor es un dolor, el amor es una felicidad </span>

              <span> El amor es un dolor, el amor es una felicidad </span>

              <span> El amor es un dolor, el amor es una felicidad </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Em ascensão em</h4>
            <h5>Pagamento sem dinheiro</h5>
            <p>
              <span>
                1. O amor é doce, o amor é divino. Língua enera, língua de
                folha. Aenean massa. A nossa sociedade é fértil e fértil.
              </span>

              <span>
                2. É uma substância especial, uma substância em pó, uma
                substância especial. Não houve resultados. Amígdalas, amígdalas,
                amígdalas, amígdalas, amígdalas.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. Esta afirmação não faz sentido nenhum. O inteiro tincidunt.
                Liga resistente à corrosão dapibus. Somos elementos eternos.
              </span>
            </p>
            <h5>Pagamento na entrega</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>
            <h5>Em ascensão em</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>

            <h5>Você pode gastar com um cartão de recompensa:</h5>
            <p>
              <span> O amor é uma dor, o amor é uma felicidade </span>

              <span> O amor é uma dor, o amor é uma felicidade </span>

              <span> O amor é uma dor, o amor é uma felicidade </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>كيف تتقدم بطلب للحصول على الائتمان</h4>
            <h5>لا نقدا</h5>
            <p>
              <span>
                1. الحب حلو والحب مقدس. لغة الإينيلا، ورقة لسان. . نان ماسا
                ومجتمعاتنا لديها القدرة على الإنجاب.
              </span>

              <span>
                2. هذه مادة خاصة، مادة مسحوق، مادة خاصة. بدون أي نتيجة. العدس،
                العدس، العدس، العدس، العدس.
              </span>

              <span>
                3. لا بأس، لا بأس - نوليم فيليس Eue Mollee Pretium. Integer
                Tincidunt. كراس دابيبوس. Vivamus elementum Nisi. Aenean
                Volputate eleifend tellus.
              </span>

              <span>
                4. هذه الجملة لا معنى لها. العدد الكامل Tincidun. مقاومة للتآكل
                سبائك Dapibus. نحن عناصر أبدية.
              </span>
            </p>
            <h5>الدفع عند التسليم</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>
            <h5>إنها ترتفع</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>

            <h5>يمكنك الدفع مع بطاقة حوافز:</h5>
            <p>
              <span> الحب هو ألم والحب هو السعادة </span>

              <span> الحب هو ألم والحب هو السعادة </span>

              <span> الحب هو ألم والحب هو السعادة </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>Как получить кредит</h4>
            <h5>Платить наличными</h5>
            <p>
              <span>
                1. Любовь сладка, любовь священна. Язык энелы, языковой лист.
                Энеан маса. Наше общество обладает плодовитостью и
                плодовитостью.
              </span>

              <span>
                2. Это особое вещество, порошкообразное вещество, особое
                вещество. Ни к чему это не привело. Чечевица, чечевица,
                чечевица, чечевица, чечевица, чечевица.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dittum pretium. crapibus Eleifend tellus.
              </span>

              <span>
                4. В этом предложении нет никакого смысла. Целое число. Сплав,
                стойкий к коррозии, дапибус. Мы-вечный элемент.
              </span>
            </p>
            <h5>Плата за доставку</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>
            <h5>Вверх.</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>

            <h5>Ты можешь заплатить премиальной картой:</h5>
            <p>
              <span> Любовь-это боль, любовь-это счастье </span>

              <span> Любовь-это боль, любовь-это счастье </span>

              <span> Любовь-это боль, любовь-это счастье </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>نحوه درخواست اعتبار</h4>
            <h5>پرداخت بدون پول</h5>
            <p>
              <span>
                1. عشق شیرین است ، عشق مقدس است. Ainera ، برگ به شکل زبان. آننان
                ماسا. جامعه ما باروری و باروری دارد.
              </span>

              <span>
                2. این یک ماده خاص ، یک ماده مانند پودر ، یک ماده خاص است. نتیجه
                ای وجود ندارد لوزه های کوچک ، لوزه های کوچک ، لوزه های کوچک ،
                لوزه های کوچک و لوزه های کوچک.
              </span>

              <span>
                3. در Enim Justo ، Rhoncus UT ، Imperdiet A ، Venenatis Vitae ،
                Justo. nullam dictum felis eu pede mollis pretium. tincidunt عدد
                صحیح. cras dapibus. vivamus elementum semper nisi. aenean آسیب
                نویس eleifend tellus.
              </span>

              <span>
                4. این جمله معنی ندارد. tincidunt عدد صحیح. dapibus ما عناصر
                ابدی هستیم.
              </span>
            </p>
            <h5>تحویل</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد که زمان خوبی در زندگی ما است. به
              دلیل سوء تغذیه ، طبیعت غذایی ضعیف است ، کل عدس و عدس بزرگ برگ و
              همچنین عدس
            </p>
            <h5>رو به افزایش</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد که زمان خوبی در زندگی ما است. به
              دلیل سوء تغذیه ، طبیعت غذایی ضعیف است ، کل عدس و عدس بزرگ برگ و
              همچنین عدس
            </p>

            <h5>می توانید با کارت پاداش پرداخت کنید:</h5>
            <p>
              <span> عشق نوعی درد است ، عشق نوعی خوشبختی است </span>

              <span> عشق نوعی درد است ، عشق نوعی خوشبختی است </span>

              <span> عشق نوعی درد است ، عشق نوعی خوشبختی است </span>
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img1"
              src="https://oss.sokogate.com/image/6cfb2b264c21d43518386c944eff36de.png"
            />
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <h4>क्रेडिट के लिए कैसे लागू करना है</h4>
            <h5>कैसिलेस पैसा</h5>
            <p>
              <span>
                1. प्रेम मीठा है, प्रेम पवित्र है। एनिएला, भाषा लोब। एनियन मासा.
                हमारे समाज में बच्चों को जन्म देने की सामर्थ्य है, और उसके पास
                बच्चों को जन्म देने की सामर्थ्य है।
              </span>

              <span>
                2. यह एक विशेष पदार्थ है, एक पावरी पदार्थ, एक विशेष पदार्थ है।
                कोई परिणाम नहीं था। छोटे बादल, छोटे बादल, छोटे बादल, छोटे बादल,
                छोटे बादल।
              </span>

              <span>
                3. क्योंकि न्यूस्टो में, रोन्कुस ut, इम्पार्डिटेट, वेनेटिस
                जीवित, न्यूस्टो में। Nullam dictum felis eu pede mollis pretium.
                पूर्ण अंक टिंसिडुन्ट. क्रैस डापाबुस. विवामुस तत्व सेम्प्रेर
                नीसी. Name हीलिफ़न्ड और हमें बताते हैं।
              </span>

              <span>
                4. इस वाक्य का अर्थ नहीं है. पूर्ण अंक टिंसिडुन्ट. कोरोसियन
                रेसिस्टेंट अलो डाबीबुस. हम अनन्त तत्व हैं।
              </span>
            </p>
            <h5>प्रदान पैसा</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>
            <h5>रोसिंग</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>

            <h5>आप एक बदला कार्ड के साथ भुगता कर सकते हैं:</h5>
            <p>
              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>

              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>

              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>
            </p>
          </div>
        </b-col>
      </b-row> -->

      <!-- <b-row v-if="locale == 'zh'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>无现金支付</h5>
            <p>
              <span>
                1. 爱是甜蜜的，爱是神圣的。 埃涅拉语，舌状叶。 Aenean马萨。
                我们的社会有生育能力，也有生育能力。
              </span>

              <span>
                2. 这是一种特殊的物质，一种粉状的物质，一种特殊的物质。
                没有任何结果。 小扁桃、小扁桃、小扁桃、小扁桃、小扁桃。
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. 这句话没有任何意义。 整数tincidunt。 耐腐蚀合金dapibus。
                我们是永恒的元素。
              </span>
            </p>
            <h5>交货付款</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>
            <h5>在上升</h5>
            <p>
              在我们的生活中，有一段美好的时光，这是我们生活的美好时光。
              由于营养不良导致的食性不良，整只扁豆和大叶扁豆，以及扁豆
            </p>

            <h5>你可以用奖励卡支付:</h5>
            <p>
              <span> 爱是一种痛苦，爱是一种幸福 </span>

              <span> 爱是一种痛苦，爱是一种幸福 </span>

              <span> 爱是一种痛苦，爱是一种幸福 </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>Cashless Payment</h5>
            <p>
              <span>
                1. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor.Aenean massa. Cum sociis
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus.
              </span>

              <span>
                2. Donec quam felis, ultricies nec, pellentesque eu, pretium
                quis, sem. Nulla consequat massa quis enim. Donec pede justo,
                fringilla vel, aliquet nec, vulputate eget, arcu.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi.
              </span>
            </p>
            <h5>On delivery</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, urna
              consequat felis vehicula class ultricies mollis dictumst, aenean
              non a in donec nulla. Phasellus ante pellentesque erat cum risus
              consequat imperdiet aliquam, integer placerat et turpis mi eros
              nec lobortis taciti, vehicula nisl litora tellus ligula porttitor
              metus.
            </p>
            <h5>At pick-up</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, urna
              consequat felis vehicula class ultricies mollis dictumst, aenean
              non a in donec nulla. Phasellus ante pellentesque erat cum risus
              consequat imperdiet aliquam, integer placerat et turpis mi eros
              nec lobortis taciti, vehicula nisl litora tellus ligula porttitor
              metus.
            </p>

            <h5>You can pay with a bonus card:</h5>
            <p>
              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>

              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>

              <span>
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'fr'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>Paiement sans espèces</h5>
            <p>
              <span>
                1. L’amour est doux, l’amour est divin. Langue enera avec une
                langue à feuilles. Aenean massa. Notre société est fertile et
                fertile.
              </span>

              <span>
                2. C’est une substance particulière, une substance en poudre,
                une substance particulière. Aucun résultat n’a été trouvé.
                Amylophila, amylophila, amylophila, amylophila, amylophila,
                amylophila.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. Cette déclaration n’a aucun sens. Entier tincidunt. Alliage
                résistant à la corrosion dapibus. Nous sommes des éléments
                éternels.
              </span>
            </p>
            <h5>Livraison et paiement</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>
            <h5>Dans la montée</h5>
            <p>
              Dans notre vie, il y a un bon moment, c’est le bon moment que nous
              vivons. Mauvaise alimentation due à une mauvaise alimentation,
              lentilles entières et à feuilles grandes, et lentilles
            </p>

            <h5>Vous pouvez payer avec une carte bonus:</h5>
            <p>
              <span> L’amour est une souffrance, l’amour est un bonheur </span>

              <span> L’amour est une souffrance, l’amour est un bonheur </span>

              <span> L’amour est une souffrance, l’amour est un bonheur </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>Pago sin efectivo</h5>
            <p>
              <span>
                1. El amor es dulce, el amor es divino. Enera, glosario de
                hojas. Aenea massa. Nuestra sociedad es fértil y fértil.
              </span>

              <span>
                2. Es una sustancia especial, una sustancia en polvo, una
                sustancia especial. No hay resultados. ¿Por qué no?
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. No tengo nada que decir. Número entero tincidunt. Aleación
                resistente a la corrosión dapibus. Somos elementos eternos.
              </span>
            </p>
            <h5>Entrega y pago</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>
            <h5>En ascenso</h5>
            <p>
              En nuestra vida, hay un buen momento, es un buen momento que
              vivimos. Alimentación deficiente debido a la desnutrición,
              lentejas enteras y de hoja grande, así como lentejas
            </p>

            <h5>Puedes pagar con una tarjeta de recompensas:</h5>
            <p>
              <span> Puedes pagar con una tarjeta de recompensas </span>

              <span> Puedes pagar con una tarjeta de recompensas </span>

              <span> Puedes pagar con una tarjeta de recompensas </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>Pagamento sem dinheiro</h5>
            <p>
              <span>
                1. O amor é doce, o amor é divino. Língua enera, língua de
                folha. Aenean massa. A nossa sociedade é fértil e fértil.
              </span>

              <span>
                2. É uma substância especial, uma substância em pó, uma
                substância especial. Não houve resultados. Amígdalas, amígdalas,
                amígdalas, amígdalas, amígdalas.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus.
              </span>

              <span>
                4. Esta afirmação não faz sentido nenhum. O inteiro tincidunt.
                Liga resistente à corrosão dapibus. Somos elementos eternos.
              </span>
            </p>
            <h5>Pagamento na entrega</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>
            <h5>Em ascensão em</h5>
            <p>
              Em nossas vidas, há um bom tempo, é um bom tempo que vivemos. Má
              alimentação devido à má nutrição. Lentilhas inteiras e de folha
              grande, bem como lentilhas
            </p>

            <h5>Você pode pagar com um cartão de recompensa:</h5>
            <p>
              <span> O amor é uma dor, o amor é uma felicidade </span>

              <span> O amor é uma dor, o amor é uma felicidade </span>

              <span> O amor é uma dor, o amor é uma felicidade </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>لا نقدا</h5>
            <p>
              <span>
                1. الحب حلو والحب مقدس. لغة الإينيلا، ورقة لسان. . نان ماسا
                ومجتمعاتنا لديها القدرة على الإنجاب.
              </span>

              <span>
                2. هذه مادة خاصة، مادة مسحوق، مادة خاصة. بدون أي نتيجة. العدس،
                العدس، العدس، العدس، العدس.
              </span>

              <span>
                3. لا بأس، لا بأس - نوليم فيليس Eue Mollee Pretium. Integer
                Tincidunt. كراس دابيبوس. Vivamus elementum Nisi. Aenean
                Volputate eleifend tellus.
              </span>

              <span>
                4. هذه الجملة لا معنى لها. العدد الكامل Tincidun. مقاومة للتآكل
                سبائك Dapibus. نحن عناصر أبدية.
              </span>
            </p>
            <h5>الدفع عند التسليم</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>
            <h5>إنها ترتفع</h5>
            <p>
              في حياتنا، هناك وقت جيد، هذا وقت جيد لحياتنا. العدس والعدس، العدس،
              والعدس
            </p>

            <h5>يمكنك الدفع مع بطاقة حوافز:</h5>
            <p>
              <span> الحب هو ألم والحب هو السعادة </span>

              <span> الحب هو ألم والحب هو السعادة </span>

              <span> الحب هو ألم والحب هو السعادة </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>Платить наличными</h5>
            <p>
              <span>
                1. Любовь сладка, любовь священна. Язык энелы, языковой лист.
                Энеан маса. Наше общество обладает плодовитостью и
                плодовитостью.
              </span>

              <span>
                2. Это особое вещество, порошкообразное вещество, особое
                вещество. Ни к чему это не привело. Чечевица, чечевица,
                чечевица, чечевица, чечевица, чечевица.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dittum pretium. crapibus Eleifend tellus.
              </span>

              <span>
                4. В этом предложении нет никакого смысла. Целое число. Сплав,
                стойкий к коррозии, дапибус. Мы-вечный элемент.
              </span>
            </p>
            <h5>Плата за доставку</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>
            <h5>Вверх.</h5>
            <p>
              В нашей жизни есть хорошие времена, и это хорошие времена для нас.
              Полная чечевица и большая чечевица, а также чечевица, вызванная
              недоеданием
            </p>

            <h5>Ты можешь заплатить премиальной картой:</h5>
            <p>
              <span> Любовь-это боль, любовь-это счастье </span>

              <span> Любовь-это боль, любовь-это счастье </span>

              <span> Любовь-это боль, любовь-это счастье </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>پول بدون پول</h5>
            <p>
              <span>
                1. عشق شيرينه عشق مقدسه انيلا، لوب زباني ماسا اينيا جامعه ما
                توانایی دارد که بچه ها را به دنیا بیاورند، و توانایی دارد که بچه
                ها را به دنیا بیاورند.
              </span>

              <span>
                2. این مواد ویژه، مواد پودر، مواد ویژه است. نتيجه اي نداشت آلمان
                کوچک، آلمان کوچک، آلمان کوچک، آلمان کوچک، آلمان کوچک.
              </span>

              <span>
                3. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. کل کوچولو
                کراس دابيبوس ابتدام ويوام هميشه نيس Name الیفان بهمون میگه
              </span>

              <span>
                4. اين جمله معني نداره کل کوچولو کروزيون مقاومت به لئوي دابيبوس
                ما عناصر ابدی هستیم.
              </span>
            </p>
            <h5>پول تحويل</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد. این زمان خوبی زندگی ما است. عادت
              غذای بیچاره به خاطر غذای غذایی، کل چشمه‌ها و چشمه‌های برگ بزرگ و
              چشمه‌ها
            </p>
            <h5>بالا</h5>
            <p>
              در زندگی ما زمان خوبی وجود دارد. این زمان خوبی زندگی ما است. عادت
              غذای بیچاره به خاطر غذای غذایی، کل چشمه‌ها و چشمه‌های برگ بزرگ و
              چشمه‌ها
            </p>

            <h5>ميتوني با يه کارت پاداش بدي:</h5>
            <p>
              <span> عشق يه جورايي درد داره عشق يه جورايي خوشحاله </span>

              <span> عشق يه جورايي درد داره عشق يه جورايي خوشحاله </span>

              <span> عشق يه جورايي درد داره عشق يه جورايي خوشحاله </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12" md="6">
          <div class="col">
            <h5>कैसिलेस पैसा</h5>
            <p>
              <span>
                1. प्रेम मीठा है, प्रेम पवित्र है। एनिएला, भाषा लोब। एनियन मासा.
                हमारे समाज में बच्चों को जन्म देने की सामर्थ्य है, और उसके पास
                बच्चों को जन्म देने की सामर्थ्य है।
              </span>

              <span>
                2. यह एक विशेष पदार्थ है, एक पावरी पदार्थ, एक विशेष पदार्थ है।
                कोई परिणाम नहीं था। छोटे बादल, छोटे बादल, छोटे बादल, छोटे बादल,
                छोटे बादल।
              </span>

              <span>
                3. क्योंकि न्यूस्टो में, रोन्कुस ut, इम्पार्डिटेट, वेनेटिस
                जीवित, न्यूस्टो में। Nullam dictum felis eu pede mollis pretium.
                पूर्ण अंक टिंसिडुन्ट. क्रैस डापाबुस. विवामुस तत्व सेम्प्रेर
                नीसी. Name हीलिफ़न्ड और हमें बताते हैं।
              </span>

              <span>
                4. इस वाक्य का अर्थ नहीं है. पूर्ण अंक टिंसिडुन्ट. कोरोसियन
                रेसिस्टेंट अलो डाबीबुस. हम अनन्त तत्व हैं।
              </span>
            </p>
            <h5>प्रदान पैसा</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>
            <h5>रोसिंग</h5>
            <p>
              In our life, there is a good time. This is the good time of our
              life. पोषण के कारण गरीब खाने के आधार, पूरी लेंटिल्स, बड़ी पानी
              लेंटिल्स, और लेंटिल्स
            </p>

            <h5>आप एक बदला कार्ड के साथ भुगता कर सकते हैं:</h5>
            <p>
              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>

              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>

              <span> प्रेम एक प्रकार दु:ख है, प्रेम एक प्रकार सुख है </span>
            </p>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="col">
            <img
              class="card-img"
              src="https://oss.sokogate.com/image/aecf7dbb1713defd18c9e359a8c59531.png"
            />
          </div>
        </b-col>
      </b-row> -->
      <img
        class="bg-images"
        src="https://oss.sokogate.com/image/1046417f510eff949a257b3de6ee34e4.png"
      />
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
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.shortcut.payment"),
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
  .bg-images {
    object-fit: contain;
  }
  .top-banner {
    background-image: url("https://oss.sokogate.com/image/94e62342888b3344930a25bd11656aff.png");
    height: 230px;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
  }

  h5 {
    font-size: 15px;
    font-weight: 500;
  }

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

    span {
      display: block;
      margin-bottom: 0;
    }
  }
  .row {
    margin-bottom: 50px;
    .col {
      padding: 3% 5%;

      .download-img {
        height: 20px;
        object-fit: contain;
      }
      .card-img1 {
        width: 100%;
        max-height: 688px;
        object-fit: contain;
      }

      .card-img {
        height: auto;
        width: 100%;
        max-height: 515px;
        object-fit: contain;
      }
      .img-2 {
        width: 100%;
        max-height: 300px !important;
        object-fit: contain;
      }
    }
  }

  .bg-images {
    margin-bottom: 100px;
  }
}
</style>