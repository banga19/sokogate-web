<template>

  <b-container class="merchant-settlement-page">
<div v-title :data-title="$t('menuitems.shortcut.delivery')">
    <Breadcrumb :items="items" />
    <b-row v-if="locale == 'zh'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>可靠的航运到世界各地</h4>
          <p>
            sokgate承诺在运输的每一步都为您提供最好的运输体验，并确保采取所有适当的预防措施，以确保您的订单完整、及时地收到。
          </p>
          <p>
            您可以选择最便宜、最完美的送货方式。
            由于sokgate允许您与DHL或UPS公司比较多种方法，以选择最佳价格，无论是通过运费、船运或组合。
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'en'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Reliable Shipping to All Over the World</h4>
          <p>
            SokoGate promises to provide you with the best shipping experience
            at every step of the way and ensures all due precautions are taken
            to receive your order intact and on time.
          </p>
          <p>
            You can choose the cheapest and perfect delivery method. As SokoGate
            allows you to compare with multiple methods to choose the best
            prices, whether ship by freight, ship, or combination, with DHL or
            UPS companies.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'fr'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Expédition fiable dans le monde entier</h4>
          <p>
            Sokgate s’engage à vous offrir la meilleure expérience d’expédition
            à chaque étape de l’expédition et à s’assurer que toutes les
            précautions appropriées sont prises pour s’assurer que votre
            commande est reçue dans son intégralité et en temps opportun.
          </p>
          <p>
            Vous pouvez choisir la livraison la moins chère et parfaite. Depuis
            sokgate vous permet de comparer plusieurs méthodes avec les sociétés
            DHL ou UPS pour choisir le meilleur prix, que ce soit par fret,
            expédition ou combinaison.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'spa'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Envío confiable a todo el mundo</h4>
          <p>
            Sokgate se compromete a brindarle la mejor experiencia de envío en
            cada paso del envío y asegurarse de que todas las precauciones
            apropiadas se toman para garantizar que su pedido sea recibido en su
            totalidad y a tiempo.
          </p>
          <p>
            Usted puede elegir la manera más barata y perfecta de la entrega.
            Como sokgate le permite comparar varios métodos con las empresas DHL
            o UPS para elegir el mejor precio, ya sea por flete, envío o
            combinación.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'pt'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Envio confiável para todo o mundo</h4>
          <p>
            Sokgate promete oferecer-lhe a melhor experiência de envio em cada
            etapa do transporte e certifique-se de que todas as precauções
            apropriadas sejam tomadas para garantir que seu pedido seja recebido
            completo e oportuno.
          </p>
          <p>
            Você pode escolher a maneira a mais barata e perfeita da entrega.
            Como sokgate permite que você compare vários métodos com empresas
            DHL ou UPS para escolher o melhor preço, seja por frete, transporte
            ou combinação.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ara'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>الشحن الموثوق به إلى جميع أنحاء العالم</h4>
          <p>
            تتعهد Sokgate بتزويدك بأفضل تجربة في مجال النقل في كل خطوة من مراحل
            النقل، وكفالة اتخاذ جميع الاحتياطات المناسبة لضمان تلقي طلبك بالكامل
            وفي الوقت المناسب.
          </p>
          <p>
            يمكنك اختيار أرخص طريقة تسليم مثالية. بما أن Sokgate يسمح لك بمقارنة
            العديد من الطرق مع شركة DHL أو UPS لاختيار أفضل سعر، سواء عن طريق
            الشحن أو الشحن أو الجمع.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ru'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Надёжные поставки по всему миру</h4>
          <p>
            Сокгейт обещает обеспечить вам наилучший опыт транспортировки на
            каждом этапе перевозки и обеспечить все необходимые меры
            предосторожности для обеспечения полного и своевременного получения
            вашего заказа.
          </p>
          <p>
            Вы можете выбрать самый дешевый и идеальный способ доставки.
            Поскольку sokgate позволяет вам сравнить несколько методов с DHL или
            UPS, выбирая наилучшую цену, будь то через тариф, доставку или
            комбинацию.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'per'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>سفر قابل اعتماد به همه بخش‌های دنیا</h4>
          <p>
            Sokgate قول می دهد که بهترین تجربه انتقال در هر مرحله از انتقال به
            شما ارائه دهد و مطمئن می شود که تمام مراقبت مناسب برای مطمئن کردن
            دستورات شما به طریق کامل و زمانی دریافت شود.
          </p>
          <p>
            ميتوني ارزونترين و کامل ترين روش تحويل انتخاب کني چون سوکگیت به شما
            اجازه می دهد که روش‌های چندین را با DHL یا UPS مقایسه کنید تا بهترین
            قیمت را انتخاب کنید، چه با freight, shipping or combination.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'hi'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>दुनिया के सभी भागों के लिए विश्वासिल भेजेंगे</h4>
          <p>
            सकगेट प्रतिज्ञा देता है कि तुम्हें प्रत्येक चरण में सबसे अच्छा
            प्रवाह अनुभव प्रदान करने के लिए, और सुरक्षित है कि सभी उचित उपचार
            लिया जाता
          </p>
          <p>
            You can choose the cheapest and most perfect delivery method.
            क्योंकि सोकगेट आपको बहुत साधारण देता है कि DHL या UPS के साथ सबसे
            अच्छा मूल्य चुने के लिए बहुत साधारण में तुलना करें,
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96886.png"
          />
        </div>
      </b-col>
    </b-row>

    <b-row v-if="locale == 'zh'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>225多个国家</h4>
          <p>
            sokgate公司的货运业务遍及全球225个国家，其中有DHL和UPS货运公司。
          </p>
          <h4>跟踪你的订单</h4>
          <p>sokgate提供了一个跟踪功能，以便跟踪货物，直到送货上门。</p>
          <h4>专家助理</h4>
          <p>sokgate随时准备帮助您，因此您可以联系物流专家来管理运输流程。</p>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="locale == 'en'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Over 225 Countries</h4>
          <p>
            Sokogate ship to over 225 countries across the globe, where DHL and
            UPS shipping companies are existing.
          </p>
          <h4>Track your Order</h4>
          <p>
            SokoGate provides a tracking feature in order to track shipment
            until delivered to your door.
          </p>
          <h4>Assistant Experts</h4>
          <p>
            Sokogate is ready to help you, hence you can contact logistic
            experts to manage the shipping process.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="locale == 'fr'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Plus de 225 pays</h4>
          <p>
            Sokgate est présent dans 225 pays à travers le monde, avec des
            transporteurs DHL et UPS.
          </p>
          <h4>Suivre votre commande</h4>
          <p>
            Sokgate offre une fonction de suivi pour suivre les marchandises
            jusqu’à la livraison à votre porte.
          </p>
          <h4>Un assistant expert</h4>
          <p>
            Sokgate est prêt à vous aider afin que vous puissiez contacter des
            experts en logistique pour gérer le processus de transport.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'spa'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Más de 225 países</h4>
          <p>
            Sokgate opera en más de 225 países de todo el mundo. Entre ellos
            están las compañías de transporte DHL y UPS.
          </p>
          <h4>Seguimiento de su pedido</h4>
          <p>
            Sokgate ofrece una función de seguimiento para rastrear el envío
            hasta la entrega a su puerta.
          </p>
          <h4>Asistente experto</h4>
          <p>
            Sokgate está listo para ayudarle, por lo que puede ponerse en
            contacto con un experto en logística para gestionar el proceso de
            envío.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'pt'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Mais de 225 países</h4>
          <p>
            A sokgate está presente em 225 países em todo o mundo com empresas
            de transporte DHL e UPS.
          </p>
          <h4>Acompanhe seu pedido</h4>
          <p>
            Sokgate oferece um recurso de rastreamento para rastrear a remessa
            até a entrega à sua porta.
          </p>
          <h4>Assistente de especialistas</h4>
          <p>
            Sokgate está pronto para ajudá-lo, para que você possa entrar em
            contato com um especialista em logística para gerenciar o fluxo de
            transporte.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ara'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>أكثر من 225 دولة</h4>
          <p>
            وتقوم شركة سوكيت كيت بعمليات شحن في 225 بلدا في جميع أنحاء العالم،
            بما في ذلك شركات الشحن DHL و UPS للشحن.
          </p>
          <h4>تتبع طلبك</h4>
          <p>وتوفر Sokgate خاصية تتبع لتتبع البضائع حتى تسليم إلى الباب.</p>
          <h4>مساعد خبير</h4>
          <p>
            Sokgate دائمًا لمساعدتك، حتى تتمكن من الاتصال بخبراء اللوجستيات
            لإدارة عمليات النقل.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ru'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>Более 225 стран</h4>
          <p>
            Грузовая компания sokgate работает в 225 странах по всему миру,
            включая DHL и UPS грузовые компании.
          </p>
          <h4>Следуйте приказу</h4>
          <p>
            Sokgate предоставляет возможность отслеживать груз до тех пор, пока
            он не будет доставлен.
          </p>
          <h4>Помощник специалиста</h4>
          <p>
            Сокгейт готов вам помочь, поэтому вы можете связаться с экспертом по
            логистике, чтобы управлять транспортным процессом.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'per'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>بیش از ۲۲۵ کشور</h4>
          <p>
            تجارت فروش سوک گات ۲۲۵ کشور در سراسر جهان را پوشانده است، شامل
            شرکتهای فروش DHL و UPS.
          </p>
          <h4>سفارش شما را ردیاب کنید</h4>
          <p>
            Sokgate یک عملکرد ردیابی برای ردیابی کالاها تا زمانی که به درها
            رسیده شوند، پیشنهاد می دهد.
          </p>
          <h4>Expert assistant</h4>
          <p>
            Sokgate آماده است که به شما کمک کند، بنابراین می توانید با یک متخصص
            دانشمندان شناسی تماس بگیرید تا روش انتقال را مدیریت کند.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'hi'">
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-2"
            src="https://oss.sokogate.com/image/f30cce9b8d0fc8ac92c760157f1d790e.png"
          />
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <h4>225 से अधिक देश</h4>
          <p>
            सोक्गेट का फ्रेट व्यवसाय दुनिया के प्रत्येक देश में 225 राष्ट्रों को
            कवर करता है, जिसमें DHL और UPS फ्रेट कंपनीयों के
          </p>
          <h4>अपना क्रम ट्रैक करें</h4>
          <p>
            सॉक्गेट ने एक ट्रैकिंग फंक्शन प्रदान किया है जब तक वे द्वार पर
            प्रदान किया जाएँगा.
          </p>
          <h4>एक्सप्रेट सहायक</h4>
          <p>
            सॉक्गेट तैयार है तुम्हारी मदद करने के लिए, ताकि आप एक लॉजिस्टिक
            विश्वासकर्ता को संपर्क कर सकते हैं जो प्रक्र
          </p>
        </div>
      </b-col>
    </b-row>

    <b-row v-if="locale == 'zh'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>从两种运输方式中选择简单、安全的方式运送您的订单:</h4>
          <h4>1. 拼箱</h4>
          <p>
            sokgate公司的货运业务遍及全球225个国家，其中有DHL和UPS货运公司。
            拼箱是指小型的海运运力运输，为那些没有容量装满整个集装箱的人节省资金。
            公司运费将多个拼箱货物放在一起，并根据集装箱的重量或尺寸计算运费。
          </p>
          <h4>2. 整箱货</h4>
          <p>
            sokgate提供了一个跟踪功能，以便跟踪货物，直到送货上门。
            整箱是一种海运，在这种海运中，订单要装满集装箱。
            对于可能在一个或多个运输集装箱中发生的大量订单，这是一个完美的选择。
            买方将支付全部集装箱容量。
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'en'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>
            Ship your Orders in Easy, Safe Way by Choosing from Two Shipping
            Methods:
          </h4>
          <h4>1. Less than Container Load (LCL)</h4>
          <p>
            Sokogate ship to over 225 countries across the globe, where DHL and
            UPS shipping companies are existing. LCL refers to small ocean
            freight capacity shipment that save money for those who don’t have
            volume to fill an entire container. A company freight puts together
            multiple LCL shipments and the fare is calculated by Weight or
            Measure that taken from the container.
          </p>
          <h4>2. Full Container Load (FCL)</h4>
          <p>
            SokoGate provides a tracking feature in order to track shipment
            until delivered to your door. FCL is an ocean shipment in which the
            orders fill full containers. This is perfect option for high-volume
            orders that may take place in one or more shipping containers. The
            buyer will pay for the full container capacity.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'fr'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>
            Choisissez un moyen simple et sécurisé pour expédier votre commande
            parmi deux modes de transport:
          </h4>
          <h4>1. Expédition LCL</h4>
          <p>
            Sokgate est présent dans 225 pays à travers le monde, avec des
            transporteurs DHL et UPS. LCL est un petit transport de capacité
            maritime qui permet d’économiser de l’argent pour ceux qui n’ont pas
            la capacité de remplir un conteneur entier. Le fret de société met
            plusieurs marchandises de LCL ensemble et calcule le fret en
            fonction du poids ou de la taille du conteneur.
          </p>
          <h4>2. Marchandises pleines de conteneur</h4>
          <p>
            Sokgate offre une fonction de suivi pour suivre les marchandises
            jusqu’à la livraison à votre porte. Le FCL est un transport maritime
            dans lequel les commandes sont remplies de conteneurs. Une option
            parfaite pour les commandes importantes qui peuvent se produire dans
            un ou plusieurs conteneurs de transport. L’acheteur paiera pour la
            pleine capacité de conteneur.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'spa'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>
            Elija entre dos métodos de envío para enviar su pedido de forma
            fácil y segura:
          </h4>
          <h4>1. De contenedores</h4>
          <p>
            Sokgate opera en más de 225 países de todo el mundo. Entre ellos
            están las compañías de transporte DHL y UPS. LCL se refiere al
            transporte marítimo de pequeña capacidad, ahorrando dinero para
            aquellos que no tienen capacidad para llenar un contenedor completo.
            La carga de la compañía pone varias cargas de LCL juntas y calcula
            la carga según el peso o el tamaño del contenedor.
          </p>
          <h4>2. Carga completa de contenedores</h4>
          <p>
            Sokgate ofrece una función de seguimiento para rastrear el envío
            hasta la entrega a su puerta. FCL es un transporte marítimo en el
            que el pedido se llena de contenedores. Es una opción perfecta para
            pedidos de gran volumen que pueden ocurrir en uno o más contenedores
            de transporte. El comprador pagará por la capacidad completa del
            envase.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'pt'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>
            Escolha entre dois métodos de envio para enviar seu pedido de forma
            simples e segura:
          </h4>
          <h4>1. LCL</h4>
          <p>
            A sokgate está presente em 225 países em todo o mundo com empresas
            de transporte DHL e UPS. LCL refere-se ao transporte de pequena
            capacidade marítima, economizando dinheiro para aqueles que não têm
            capacidade para encher um contêiner inteiro. O frete da empresa põe
            muitos bens de LCL junto e calcula o frete de acordo com o peso ou o
            tamanho do recipiente.
          </p>
          <h4>2. Carga completa do recipiente</h4>
          <p>
            Sokgate oferece um recurso de rastreamento para rastrear a remessa
            até a entrega à sua porta. FCL é um transporte marítimo, no qual a
            ordem é preenchida com contêineres. É a opção perfeita para grandes
            volumes de encomendas que podem ocorrer em um ou mais contentores de
            transporte. O comprador pagará pela capacidade total do recipiente.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ara'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>اختر طريقة بسيطة وآمنة لإرسال طلبك من واسطة النقل:</h4>
          <h4>1. منافسة صندوق</h4>
          <p>
            وتقوم شركة سوكيت كيت بعمليات شحن في 225 بلدا في جميع أنحاء العالم،
            بما في ذلك شركات الشحن DHL و UPS للشحن. يقصد بمصطلح "التهجئة" النقل
            البحري الصغير الحجم الذي يوفر المال للأشخاص الذين لا يملكون القدرة
            على ملء الحاوية بكاملها. وكانت رسوم الشحن التي تتقاضاها الشركة تجمع
            الشحنات المركبة المتعددة معا وتحسب أجرة النقل على أساس وزن الحاوية
            أو حجمها.
          </p>
          <h4>2. الشحنة كلها</h4>
          <p>
            وتوفر Sokgate خاصية تتبع لتتبع البضائع حتى تسليم إلى الباب. والحقيبة
            بأكملها هي نوع من النقل البحري حيث تُملأ الطلبات بالحاويات. وهذا
            خيار مثالي فيما يتعلق بالطلبات الكبيرة التي قد تحدث في حاوية نقل
            واحدة أو أكثر. وسوف يدفع المشتري كامل سعة الحاوية.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ru'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>
            Выберите простой и безопасный способ доставки вашего заказа из двух
            путей:
          </h4>
          <h4>1. Написа ящик</h4>
          <p>
            Грузовая компания sokgate работает в 225 странах по всему миру,
            включая DHL и UPS грузовые компании. "Ящик"-это небольшой морской
            транспорт, который экономит деньги для тех, кто не может заполнить
            целый контейнер. Транспортные расходы компании складывают несколько
            упаковок грузов вместе и рассчитывают расходы на перевозку в
            зависимости от веса или размера контейнера.
          </p>
          <h4>2. Весь ящик.</h4>
          <p>
            Sokgate предоставляет возможность отслеживать груз до тех пор, пока
            он не будет доставлен. Целый ящик-это морской транспорт, в котором
            заказы должны быть заполнены контейнерами. Идеальный выбор для
            огромного количества заказов, которые могут произойти в одном или
            нескольких грузовых контейнерах. Покупатель заплатит за полный
            контейнер.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'per'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>راه ساده و امن انتخاب کنید تا سفارش شما را از دو روش انتقال:</h4>
          <h4>1. LCL</h4>
          <p>
            تجارت فروش سوک گات ۲۲۵ کشور در سراسر جهان را پوشانده است، شامل
            شرکتهای فروش DHL و UPS. LCL refers to small scale maritime
            transport, which saves money for those who do not have the capacity
            to fill the entire container. فروش شرکت تجارت متعدد LCL را جمع می
            کند و بار را بر اساس وزن یا اندازه کنترل محاسبه می کند.
          </p>
          <h4>2. بار کامل کنترل</h4>
          <p>
            Sokgate یک عملکرد ردیابی برای ردیابی کالاها تا زمانی که به درها
            رسیده شوند، پیشنهاد می دهد. کنترل کامل یک نوع انتقال دریا است که در
            آن دستور پر از کنترل است. این انتخاب عالی برای دستورات بزرگ است که
            ممکن است در یک یا بیشتر کانتینر کشتی اتفاق بیفتد. خريدار پول پول
            کانتينر رو ميده
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'hi'">
      <b-col cols="12" md="6">
        <div class="col">
          <h4>
            Choose a simple and safe way to ship your order from two modes of
            transportation:
          </h4>
          <h4>1. LCL</h4>
          <p>
            सोक्गेट का फ्रेट व्यवसाय दुनिया के प्रत्येक देश में 225 राष्ट्रों को
            कवर करता है, जिसमें DHL और UPS फ्रेट कंपनीयों के LCL ने छोटे स्केल
            समुद्री स्थान परिवहन की है, जो उन लोगों के लिए पैसा बचता है जिनके
            पास पूरा कन्टेनर भरने के लिए क्ष कंपनी फ्राइट बहुतेरे LCL मालों को
            एक साथ रखता है और कन्टेनर के वजन या आकार के अनुसार भार को गणना करता
            है.
          </p>
          <h4>2. पूरा कन्टेनर कार्गो</h4>
          <p>
            सॉक्गेट ने एक ट्रैकिंग फंक्शन प्रदान किया है जब तक वे द्वार पर
            प्रदान किया जाएँगा. पूरा कन्टेनर एक प्रकार समुद्र स्थानान्तरण है,
            जिसमें अनुक्रम पात्रों से भरा जाता है। यह बड़े आदेशों के लिए एक
            अच्छा चुना है जो एक या अधिक सार्वजन कंटेनर में हो सकते हैं. खरीदार
            पूरा कंटेनर क्षमता के लिए भरेगा.
          </p>
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <div class="col">
          <img
            class="img-1"
            src="https://oss.sokogate.com/image/1a0f31d980255f053ebd18842941c0e3.png"
          />
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
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.shortcut.delivery"),
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
    margin-bottom: 50px;
    .col {
      padding: 3% 5%;

      .img-1 {
        width: 100%;
        max-height: 277px;
        object-fit: contain;
      }

      .img-2 {
        width: 100%;
        max-height: 360px !important;
        position: relative;
        top: -50px;
        object-fit: contain;
      }
    }
  }
}
</style>