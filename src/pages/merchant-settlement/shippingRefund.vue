<template>
  <b-container class="merchant-settlement-page">
<div v-title :data-title="$t('menuitems.layout.shippingRefund')">
    <Breadcrumb :items="items" />
    <b-row v-if="locale == 'zh'">
      <b-col>
        <div class="col">
          <h4>退款政策</h4>
          <p>
            要使用退款权，退款的产品、商品或/和物品必须有制造缺陷、损坏、破损、错误、假冒/不真实，或不符合先决条件的基本要求。
          </p>

          <h4>简单的退款</h4>
          <p>
            您可以通过电子邮件轻松地通知sokgate关于您的退款产品、商品和/或项目，我们将随时更新您的退款状态
          </p>

          <h4>真实性保证</h4>
          <p>
            你必须确保所有的封条，标签和附件是完好无损的，项目是在其原始包装。
          </p>
          <p>
            作为一家专业的B2B和电子商务企业，sokgate将在发货前提供货物、产品或/和物品的样品，并有保证，因此退货的产品、产品或/和物品的运费将由买方承担。
          </p>

          <h4>如何退还订单?</h4>
          <p>您可透过电子邮件联络我们或按以下步骤在网上退款:</p>
          <p>1.登录你的账户，选择我的订单</p>
          <p>2.选择您想要退款的订单</p>
          <p>3.选择退货理由，请确认您选择的理由正确。</p>
          <p>4.选择退款方式和货物，无论是DHL, UPS，或您购买的国家当地运费。</p>
          <p>5.审核退款详情并提交。</p>
          <p>6.在货物离开购买国之前，一定要把钱退了。</p>

          <h4>可靠的运输到非洲各地</h4>
          <p>
            sokgate承诺在运输的每一步都为您提供最好的运输体验，并确保采取所有适当的预防措施，以确保您的订单完整、及时地收到。
            sokgate承诺在运输的每一步都为您提供最好的运输体验，并确保采取所有适当的预防措施，以确保您的订单完整、及时地收到。
          </p>
          <p>
            您可以选择最便宜、最完美的送货方式。
            由于sokgate允许您与DHL或UPS公司比较多种方法，以选择最佳价格，无论是通过运费、船运或组合
          </p>

          <h4>在54个国家</h4>
          <p>sokgate可将货物运送到非洲超过54个国家，其中有DHL和UPS运输公司。</p>

          <h4>跟踪你的订单</h4>
          <p>sokgate提供了一个跟踪功能，以便跟踪货物，直到送货上门。</p>

          <h4>专家助理</h4>
          <p>sokgate随时准备帮助您，因此您可以联系物流专家来管理运输流程。</p>

          <h4>从两种运输方式中选择简单、安全的方式运送您的订单:</h4>
          <h5>1.拼箱</h5>
          <p>
            sokgate随时准备帮助您，因此您可以联系物流专家来管理运输流程。
            拼箱是指小型的海运运力运输，为那些没有容量装满整个集装箱的人节省资金。
            公司运费将多个拼箱货物放在一起，并根据集装箱的重量或尺寸计算运费。
          </p>
          <h5>2.整箱货</h5>
          <p>
            整箱是一种海运，在这种海运中，订单要装满集装箱。
            对于可能在一个或多个运输集装箱中发生的大量订单，这是一个完美的选择。
            买方将支付全部集装箱容量。
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'en'">
      <b-col>
        <div class="col">
          <h4>Refund Policy</h4>
          <p>
            To use the right of refund, the refunded products, goods, or/and
            items must have a manufacturing defect, damage, broken, wrong,
            fake/unauthentic, or doesn’t fit the prerequisite basics.
          </p>

          <h4>Easy Refunds</h4>
          <p>
            You can easily notify SokoGate by email about your refunded
            products, goods, and/or items, and we will keep you updated about
            the status of your refunds.
          </p>

          <h4>Authenticity Guarantee</h4>
          <p>
            You have to ensure all seals, tags, and accessories are left intact
            and the item is in its original packaging.
          </p>
          <p>
            As a professional B2B and e-commerce business, SokoGate will send
            samples of the goods, products, or/and items with assurance before
            shipping, so the shipping charges of the refunded products, items,
            or/and goods will be under the buyer’s responsibility.
          </p>

          <h4>How Do I Refund an Order?</h4>
          <p>
            You can contact us via email or refund your order online by the
            following steps:
          </p>
          <p>1.Sign in to your account and select my order.</p>
          <p>2.Select the order that you would like to refund.</p>
          <p>
            3.Select the return reason, please make sure that you choose the
            right reason.
          </p>
          <p>
            4.Select the refund method and cargo whether DHL, UPS, or the
            country you purchased local Freight.
          </p>
          <p>5.Review the refund details and submit.</p>
          <p>
            6.Make sure to refund before the goods leave the country of
            purchase.
          </p>

          <h4>Reliable Shipping to All Over Africa</h4>
          <p>
            SokoGate promises to provide you with the best shipping experience
            at every step of the way and ensures all due precautions are taken
            to receive your order intact and on time. SokoGate promises to
            provide you with the best shipping experience at every step of the
            way and ensures all due precautions are taken to receive your order
            intact and on time.
          </p>
          <p>
            You can choose the cheapest and perfect delivery method. As SokoGate
            allows you to compare with multiple methods to choose the best
            prices, whether ship by freight, ship, or combination, with DHL or
            UPS companies.
          </p>

          <h4>Over 54 Countries</h4>
          <p>
            Sokogate ship to over 54 countries across Africa where DHL ,UPS
            shipping companies are existing.
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

          <h4>
            Ship your Orders in Easy, Safe Way by Choosing from Two Shipping
            Methods:
          </h4>
          <h5>1.Less than Container Load (LCL)</h5>
          <p>
            LCL refers to small ocean freight capacity shipment that save money
            for those who don’t have volume to fill an entire container. A
            company freight puts together multiple LCL shipments and the fare is
            calculated by Weight or Measure that taken from the container.
          </p>
          <h5>2.Full Container Load (FCL)</h5>
          <p>
            FCL is an ocean shipment in which the orders fill full containers.
            This is perfect option for high-volume orders that may take place in
            one or more shipping containers. The buyer will pay for the full
            container capacity.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'fra'">
      <b-col>
        <div class="col">
          <h4>Politique de remboursement</h4>
          <p>
            Pour utiliser le droit de remboursement, les produits, marchandises
            ou/et articles remboursés doivent être défectueux de fabrication,
            endommagés, cassés, erronés, contrefaits/faux, ou ne pas répondre
            aux exigences essentielles des conditions préalables.
          </p>

          <h4>Un remboursement simple</h4>
          <p>
            Vous pouvez facilement informer sokgate de votre produit,
            marchandise et/ou article remboursé par e-mail et nous vous
            tiendrons au courant de l’état de votre remboursement
          </p>

          <h4>Garantie d’authenticité</h4>
          <p>
            Vous devez vous assurer que tous les sceaux, étiquettes et
            accessoires sont intacts et que l’article est dans son emballage
            d’origine.
          </p>
          <p>
            En tant qu’entreprise B2B et e-commerce professionnelle, sokgate
            fournira des échantillons de marchandises, produits ou/et articles
            avant l’expédition avec une garantie, de sorte que les frais
            d’expédition des produits, produits ou/et articles retournés seront
            à la charge de l’acheteur.
          </p>

          <h4>Comment retourner une commande?</h4>
          <p>
            Vous pouvez faire un remboursement en ligne en nous contactant par
            e-mail ou en suivant les étapes ci-dessous:
          </p>
          <p>1. Connectez-vous à votre compte et sélectionnez Mes Commandes</p>
          <p>2. Sélectionnez la commande que vous souhaitez rembourser</p>
          <p>
            3. Choisissez la raison du retour. Veuillez vous assurer que vous
            avez choisi la bonne raison.
          </p>
          <p>
            4. Choisissez la méthode de remboursement et les marchandises, que
            ce soit DHL, UPS, ou les frais de transport locaux dans le pays où
            vous avez acheté.
          </p>
          <p>
            5. Passez en revue les détails de remboursement et soumettez-les.
          </p>
          <p>
            6. Toujours rembourser l’argent avant que les marchandises quittent
            le pays d’achat.
          </p>

          <h4>Transport fiable partout en afrique</h4>
          <p>
            Sokgate s’engage à vous offrir la meilleure expérience d’expédition
            à chaque étape de l’expédition et à s’assurer que toutes les
            précautions appropriées sont prises pour s’assurer que votre
            commande est reçue dans son intégralité et en temps opportun.
            Sokgate s’engage à vous offrir la meilleure expérience d’expédition
            à chaque étape de l’expédition et à s’assurer que toutes les
            précautions appropriées sont prises pour s’assurer que votre
            commande est reçue dans son intégralité et en temps opportun.
          </p>
          <p>
            Vous pouvez choisir la livraison la moins chère et parfaite. Comme
            sokgate vous permet de comparer plusieurs méthodes avec les sociétés
            DHL ou UPS pour choisir le meilleur prix, que ce soit par fret,
            expédition ou combinaison
          </p>

          <h4>Dans 54 pays</h4>
          <p>
            Sokgate est en mesure de livrer dans plus de 54 pays en afrique,
            parmi lesquels les transporteurs DHL et UPS.
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

          <h4>
            Choisissez un moyen simple et sécurisé pour expédier votre commande
            parmi deux modes de transport:
          </h4>
          <h5>1. Expédition LCL</h5>
          <p>
            Sokgate est prêt à vous aider afin que vous puissiez contacter des
            experts en logistique pour gérer le processus de transport. LCL est
            un petit transport de capacité maritime qui permet d’économiser de
            l’argent pour ceux qui n’ont pas la capacité de remplir un conteneur
            entier. Le fret de société met plusieurs marchandises de LCL
            ensemble et calcule le fret en fonction du poids ou de la taille du
            conteneur.
          </p>
          <h5>2. Marchandises pleines de conteneur</h5>
          <p>
            Le FCL est un transport maritime dans lequel les commandes sont
            remplies de conteneurs. Une option parfaite pour les commandes
            importantes qui peuvent se produire dans un ou plusieurs conteneurs
            de transport. L’acheteur paiera pour la pleine capacité de
            conteneur.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'spa'">
      <b-col>
        <div class="col">
          <h4>Política de reembolso</h4>
          <p>
            Para hacer uso del derecho de reembolso, los productos, mercancías
            o/y artículos reembolsados deben ser defectuosos de fabricación,
            dañados, rotos, erróneos, falsificados/falsos, o no cumplen con los
            requisitos esenciales de los prerrequisitos.
          </p>

          <h4>Reembolso fácil</h4>
          <p>
            Puede notificar fácilmente a sokgate sobre su producto, mercancía
            y/o artículo reembolsado por correo electrónico y le mantendremos
            actualizado sobre el estado de su reembolso
          </p>

          <h4>Garantía de autenticidad</h4>
          <p>
            Debe asegurarse de que todos los sellos, etiquetas y accesorios
            están intactos y que el artículo está en su embalaje original.
          </p>
          <p>
            Como empresa especializada en B2B y comercio electrónico, sokgate
            proporcionará muestras de bienes, productos o/y artículos antes del
            envío con garantías, por lo que los gastos de envío de los
            productos, productos o/y artículos devueltos correrán a cargo del
            comprador.
          </p>

          <h4>Cómo devolver un pedido?</h4>
          <p>
            Puede realizar su reembolso en línea contactando con nosotros por
            correo electrónico o siguiendo los siguientes pasos:
          </p>
          <p>1.Ingrese a su cuenta y seleccione mis pedidos</p>
          <p>2.Seleccione el pedido que desea reembolsar</p>
          <p>
            3.Seleccione el motivo de la devolución. Asegúrese de que ha
            seleccionado el motivo correcto.
          </p>
          <p>
            4.Elija el método de reembolso y el envío, ya sea DHL, UPS, o los
            costos de envío locales del país en el que compró.
          </p>
          <p>5.Revise los detalles del reembolso y envíelos.</p>
          <p>
            6.Asegúrese de devolver el dinero antes de que la mercancía salga
            del país de compra.
          </p>

          <h4>Envíos fiables a toda áfrica</h4>
          <p>
            Sokgate se compromete a brindarle la mejor experiencia de envío en
            cada paso del envío y asegurarse de que todas las precauciones
            apropiadas se toman para garantizar que su pedido sea recibido en su
            totalidad y a tiempo. Sokgate se compromete a brindarle la mejor
            experiencia de envío en cada paso del envío y asegurarse de que
            todas las precauciones apropiadas se toman para garantizar que su
            pedido sea recibido en su totalidad y a tiempo.
          </p>
          <p>
            Usted puede elegir la manera más barata y perfecta de la entrega.
            Como sokgate le permite comparar varios métodos con las empresas DHL
            o UPS para elegir el mejor precio, ya sea por flete, envío o
            combinación
          </p>

          <h4>En 54 países</h4>
          <p>
            Sokgate puede enviar a más de 54 países en áfrica, entre ellos las
            empresas de transporte DHL y UPS.
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

          <h4>
            Elija entre dos métodos de envío para enviar su pedido de forma
            fácil y segura:
          </h4>
          <h5>1.De contenedores</h5>
          <p>
            Sokgate está listo para ayudarle, por lo que puede ponerse en
            contacto con un experto en logística para gestionar el proceso de
            envío. LCL se refiere al transporte marítimo de pequeña capacidad,
            ahorrando dinero para aquellos que no tienen capacidad para llenar
            un contenedor completo. La carga de la compañía pone varias cargas
            de LCL juntas y calcula la carga según el peso o el tamaño del
            contenedor.
          </p>
          <h5>2.Carga completa de contenedores</h5>
          <p>
            FCL es un transporte marítimo en el que el pedido se llena de
            contenedores. Es una opción perfecta para pedidos de gran volumen
            que pueden ocurrir en uno o más contenedores de transporte. El
            comprador pagará por la capacidad completa del envase.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'pt'">
      <b-col>
        <div class="col">
          <h4>Política de reembolso</h4>
          <p>
            Para usar o direito de reembolso, os produtos, mercadorias e/ou
            itens reembolsados devem estar com defeito de fabricação,
            danificados, quebrados, incorretos, falsificados/irreais ou não
            atender aos requisitos essenciais do pré-requisito.
          </p>

          <h4>Reembolso simples</h4>
          <p>
            Você pode facilmente notificar sokgate sobre seus produtos,
            mercadorias e/ou itens reembolsados por e-mail e nós o manteremos
            atualizado sobre o status do seu reembolso
          </p>

          <h4>Garantia de autenticidade</h4>
          <p>
            Você deve certificar-se de que todos os selos, rótulos e acessórios
            estão intactos e que o item está em sua embalagem original.
          </p>
          <p>
            Como uma empresa profissional B2B e e-commerce, a sokgate fornecerá
            amostras de mercadorias, produtos ou/e itens antes do envio com
            garantia, de modo que o custo de envio dos produtos, produtos ou/e
            itens devolvidos será suportado pelo comprador.
          </p>

          <h4>Como devolver um pedido?</h4>
          <p>
            Você pode fazer seu reembolso on-line entrando em contato conosco
            por e-mail ou seguindo os passos abaixo:
          </p>
          <p>1.Entre na sua conta e selecione meus pedidos</p>
          <p>2.Selecione a encomenda que deseja reembolsar</p>
          <p>
            3.Selecione o motivo da devolução. Por favor, verifique se você
            selecionou o motivo correto.
          </p>
          <p>
            4.Escolha o método de reembolso e a remessa, seja pela DHL, UPS ou
            pelo frete local do país onde você comprou.
          </p>
          <p>5.Reveja os detalhes do reembolso e envie.</p>
          <p>
            6.Certifique-se de devolver o dinheiro antes que a mercadoria saia
            do país de compra.
          </p>

          <h4>Transporte confiável para toda a áfrica</h4>
          <p>
            Sokgate promete oferecer-lhe a melhor experiência de envio em cada
            etapa do transporte e certifique-se de que todas as precauções
            apropriadas sejam tomadas para garantir que seu pedido seja recebido
            completo e oportuno. Sokgate promete oferecer-lhe a melhor
            experiência de envio em cada etapa do transporte e certifique-se de
            que todas as precauções apropriadas sejam tomadas para garantir que
            seu pedido seja recebido completo e oportuno.
          </p>
          <p>
            Você pode escolher a maneira a mais barata e perfeita da entrega.
            Como o sokgate permite que você compare vários métodos com empresas
            DHL ou UPS para escolher o melhor preço, seja por frete, transporte
            ou combinação
          </p>

          <h4>Em 54 países</h4>
          <p>
            Sokgate pode enviar para mais de 54 países na áfrica. Entre eles
            estão as empresas de transporte DHL e UPS.
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

          <h4>
            Escolha entre dois métodos de envio para enviar seu pedido de forma
            simples e segura:
          </h4>
          <h5>1.LCL</h5>
          <p>
            Sokgate está pronto para ajudá-lo, para que você possa entrar em
            contato com um especialista em logística para gerenciar o fluxo de
            transporte. LCL refere-se ao transporte de pequena capacidade
            marítima, economizando dinheiro para aqueles que não têm capacidade
            para encher um contêiner inteiro. O frete da empresa põe muitos bens
            de LCL junto e calcula o frete de acordo com o peso ou o tamanho do
            recipiente.
          </p>
          <h5>2.Carga completa do recipiente</h5>
          <p>
            FCL é um transporte marítimo, no qual a ordem é preenchida com
            contêineres. É a opção perfeita para grandes volumes de encomendas
            que podem ocorrer em um ou mais contentores de transporte. O
            comprador pagará pela capacidade total do recipiente.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ara'">
      <b-col>
        <div class="col">
          <h4>سياسة استرداد التكاليف</h4>
          <p>
            ولاستخدام الحق في استرداد، يجب أن يكون المنتج أو السلعة أو السلعة أو
            السلعة المستردة معيبة أو معطوبة أو خاطئة أو مزيفة/غير حقيقية أو غير
            مستوفية للشروط الأساسية المسبقة.
          </p>

          <h4>رد بسيط</h4>
          <p>
            يمكنك بسهولة إبلاغ Sokgate عن المنتجات والسلع و/أو المشاريع المستردة
            الخاصة بك عن طريق البريد الإلكتروني، وسوف نقوم بتحديث حالة استرداد
            الخاصة بك
          </p>

          <h4>ضمان الأصالة</h4>
          <p>
            يجب أن تتأكد من أن جميع الأختام والعلامات والمرفقات سليمة وأن
            المشروع معبأة في مكانها الأصلي.
          </p>
          <p>
            وستقوم شركة سوكجيت، بوصفها شركة متخصصة في شركة B2B والتجارة
            الإلكترونية، بتقديم عينات من البضائع و/أو المنتجات و/أو السلع قبل
            شحنها، مع ضمان أن يتحمل المشتري تكاليف شحن المنتجات أو المنتجات و/أو
            السلع المستردة.
          </p>

          <h4>كيفية إرجاع الطلب?</h4>
          <p>
            يمكنك الاتصال بنا عبر البريد الإلكتروني أو استرداد الأموال عبر
            الإنترنت على الخطوات التالية:
          </p>
          <p>1.تسجيل الدخول إلى حسابك واختيار طلبي</p>
          <p>2.اختر طلبك الذي تريد إرجاعه</p>
          <p>3.اختر سبب الإعادة، يرجى تأكيد أن سبب اختيارك صحيح.</p>
          <p>
            4.اختر طريقة السداد والسلع، سواء كانت DHL أو UPS أو الشحن المحلي في
            البلد الذي تشتريه.
          </p>
          <p>5.استعراض تفاصيل المبالغ المردودة وتقديمها.</p>
          <p>6.ويجب إعادة الأموال قبل مغادرة البضائع للبلد المشتري.</p>

          <h4>في جميع أنحاء أفريقيا</h4>
          <p>
            تتعهد Sokgate بتزويدك بأفضل تجربة في مجال النقل في كل خطوة من مراحل
            النقل، وكفالة اتخاذ جميع الاحتياطات المناسبة لضمان تلقي طلبك بالكامل
            وفي الوقت المناسب. تتعهد Sokgate بتزويدك بأفضل تجربة في مجال النقل
            في كل خطوة من مراحل النقل، وكفالة اتخاذ جميع الاحتياطات المناسبة
            لضمان تلقي طلبك بالكامل وفي الوقت المناسب.
          </p>
          <p>
            يمكنك اختيار أرخص طريقة تسليم مثالية. بما أن Sokgate يسمح لك بمقارنة
            العديد من الطرق مع شركة DHL أو UPS لاختيار أفضل سعر، سواء عن طريق
            الشحن أو الشحن أو الجمع
          </p>

          <h4>في 54 دولة</h4>
          <p>
            ويمكن لشركة سوكيت أن تنقل البضائع إلى أكثر من 54 بلدا في أفريقيا،
            بما في ذلك شركات النقل DHL و UPS للنقل.
          </p>

          <h4>تتبع طلبك</h4>
          <p>وتوفر Sokgate خاصية تتبع لتتبع البضائع حتى تسليم إلى الباب.</p>

          <h4>مساعد خبير</h4>
          <p>
            Sokgate دائمًا لمساعدتك، حتى تتمكن من الاتصال بخبراء اللوجستيات
            لإدارة عمليات النقل.
          </p>

          <h4>اختر طريقة بسيطة وآمنة لإرسال طلبك من واسطة نقل:</h4>
          <h5>1.منافسة صندوق</h5>
          <p>
            Sokgate دائمًا لمساعدتك، حتى تتمكن من الاتصال بخبراء اللوجستيات
            لإدارة عمليات النقل. يقصد بمصطلح "التهجئة" النقل البحري الصغير الحجم
            الذي يوفر المال للأشخاص الذين لا يملكون القدرة على ملء الحاوية
            بكاملها. وكانت رسوم الشحن التي تتقاضاها الشركة تجمع الشحنات المركبة
            المتعددة معا وتحسب أجرة النقل على أساس وزن الحاوية أو حجمها.
          </p>
          <h5>2.الشحنة كلها</h5>
          <p>
            والحقيبة بأكملها هي نوع من النقل البحري حيث تُملأ الطلبات بالحاويات.
            وهذا خيار مثالي فيما يتعلق بالطلبات الكبيرة التي قد تحدث في حاوية
            نقل واحدة أو أكثر. وسوف يدفع المشتري كامل سعة الحاوية.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'ru'">
      <b-col>
        <div class="col">
          <h4>Политика возврата денег</h4>
          <p>
            Для того чтобы использовать право на возмещение, возврат должен
            иметь производственный дефект, повреждение, повреждение, ошибка,
            подделка/недействительность или несоответствие базовым требованиям в
            отношении предварительных условий.
          </p>

          <h4>Простой возврат.</h4>
          <p>
            Вы можете сообщить sokgate по электронной почте о вашем возвратном
            товаре, товаре и/или проекте, и мы будем держать вас в курсе вашего
            статуса возмещения
          </p>

          <h4>Гарантия подлинности</h4>
          <p>
            Вы должны убедиться, что все печати, ярлыки и приложения целы, и что
            проект находится в оригинальной упаковке.
          </p>
          <p>
            В качестве профессиональной B2B и электронной коммерческой компании
            sokgate будет поставлять образцы товаров, продуктов или/или
            предметов до отправки, а также гарантирует, что за перевозку
            возвращаемых товаров, продуктов или/или предметов будет отвечать
            покупатель.
          </p>

          <h4>Как вернуть приказ?</h4>
          <p>
            Вы можете связаться с нами по электронной почте или вернуть деньги
            онлайн по следующим ступеням:
          </p>
          <p>1.Зайди на свой аккаунт и выбери мой заказ</p>
          <p>2.Выбра вы хот компенсац заказ</p>
          <p>3.Пожалуйста, подтвердите, что вы сделали правильный выбор.</p>
          <p>
            4.Выберите способ возмещения и товары, будь то DHL, UPS или местные
            расходы на доставку, которые вы покупаете.
          </p>
          <p>5.Пересмотри детали возврата и представься.</p>
          <p>
            6.Убедись, что вернул деньги до того, как товар покинет страну
            покупателя.
          </p>

          <h4>Надежный транспорт по всей африке</h4>
          <p>
            Сокгейт обещает обеспечить вам наилучший опыт транспортировки на
            каждом этапе перевозки и обеспечить все необходимые меры
            предосторожности для обеспечения полного и своевременного получения
            вашего заказа. Сокгейт обещает обеспечить вам наилучший опыт
            транспортировки на каждом этапе перевозки и обеспечить все
            необходимые меры предосторожности для обеспечения полного и
            своевременного получения вашего заказа.
          </p>
          <p>
            Вы можете выбрать самый дешевый и идеальный способ доставки.
            Поскольку sokgate позволяет вам сравнить несколько методов с DHL или
            UPS, выбирая наилучшую цену, будь то через тариф, доставку или
            комбинацию
          </p>

          <h4>В 54 странах</h4>
          <p>
            Sokgate может перевозить товары более чем в 54 страны африки,
            включая DHL и UPS транспортные компании.
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

          <h4>
            Выберите простой и безопасный способ доставки вашего заказа из двух
            путей:
          </h4>
          <h5>1.Написа ящик</h5>
          <p>
            Сокгейт готов вам помочь, поэтому вы можете связаться с экспертом по
            логистике, чтобы управлять транспортным процессом. "Ящик"-это
            небольшой морской транспорт, который экономит деньги для тех, кто не
            может заполнить целый контейнер. Транспортные расходы компании
            складывают несколько упаковок грузов вместе и рассчитывают расходы
            на перевозку в зависимости от веса или размера контейнера.
          </p>
          <h5>2.Весь ящик.</h5>
          <p>
            Целый ящик-это морской транспорт, в котором заказы должны быть
            заполнены контейнерами. Идеальный выбор для огромного количества
            заказов, которые могут произойти в одном или нескольких грузовых
            контейнерах. Покупатель заплатит за полный контейнер.
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-else-if="locale == 'per'">
      <b-col>
        <div class="col">
          <h4>Refund Policy</h4>
          <p>
            برای استفاده از حق بازگرداندن، محصولات، کالات یا / و مقاله‌هایی که
            باید بازگردانده شود باید شکست‌های تولید، آسیب، شکستگی، اشتباهی،
            دروغگویی / دروغگویی داشته باشند، یا نیازهای بنیادی از شرایط پیش‌فرض
            را پایان ندهند.
          </p>

          <h4>بازگرداندن ساده</h4>
          <p>
            شما می توانید به راحتی در مورد محصولات، محصولات و / یا عنصر‌هایتان
            با ایمیل اطلاع دهید، و ما در هر زمان وضعیت بازگرداندن شما را آگاهی
            خواهیم کرد
          </p>

          <h4>تضمین حقیقت</h4>
          <p>
            شما باید مطمئن شوید که همه مهر ها، نقاشی ها و دسترسی ها خارج هستند و
            این وسایل در بسته اصلی آنها هستند.
          </p>
          <p>
            به عنوان یک شرکت حرفه ای B2B و تجارت e-commerce، سوکگیت نمونه‌های
            کالای، محصولات یا / و مقاله پیش از فرستادن را پیش از فرستادن می‌دهد
            و تضمین می‌کند که حمل محصولات، محصولات یا / و مقاله‌های برگشته
            شده‌اند.
          </p>

          <h4>چطور دستور برگردیم?</h4>
          <p>
            می‌توانید با ایمیل یا آنلاین به دنبال قدم‌های زیر با ما تماس
            بگیرید::
          </p>
          <p>1.وارد حساب شما شوید و سفارش من را انتخاب کنید</p>
          <p>2.انتخاب سفارشی که می‌خواهید بازگردید</p>
          <p>
            3.دلیل بازگشت را انتخاب کنید. لطفا تایید کنید که دلیل انتخاب شما
            درست است.
          </p>
          <p>
            4.برگزینید روش و کالای بازگرداندن یا DHL، UPS یا فروش محلی کشوری که
            خریده‌اید.
          </p>
          <p>5.جزئیات بازگرداندن و تحویل بده.</p>
          <p>
            6.مطمئن باشيد که پول رو قبل از اينکه کالاها از کشور خريد برن
            برگردونيد
          </p>

          <h4>انتقال قابل اعتماد به همه بخش آفریقا</h4>
          <p>
            Sokgate قول می دهد که بهترین تجربه انتقال در هر مرحله از انتقال به
            شما ارائه دهد و مطمئن می شود که تمام مراقبت مناسب برای مطمئن کردن
            دستورات شما به طریق کامل و زمانی دریافت شود. Sokgate قول می دهد که
            بهترین تجربه انتقال در هر مرحله از انتقال به شما ارائه دهد و مطمئن
            می شود که تمام مراقبت مناسب برای مطمئن کردن دستورات شما به طریق کامل
            و زمانی دریافت شود.
          </p>
          <p>
            ميتوني ارزونترين و کامل ترين روش تحويل انتخاب کني چون سوکگیت به شما
            اجازه می دهد که روش‌های چندین را با DHL یا UPS مقایسه کنید تا بهترین
            قیمت را انتخاب کنید، چه با freight, shipping or combination
          </p>

          <h4>در 54 کشور</h4>
          <p>
            Sokgate می‌تواند مواد را به بیشتر از 54 کشور در آفریقا تحویل دهد،
            شامل شرکتهای انتقال DHL و UPS.
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

          <h4>راه ساده و امن انتخاب کنید تا سفارش شما را از دو روش انتقال:</h4>
          <h5>1.LCL</h5>
          <p>
            Sokgate آماده است که به شما کمک کند، بنابراین می توانید با یک متخصص
            دانشمندان شناسی تماس بگیرید تا روش انتقال را مدیریت کند. LCL refers
            to small scale maritime transport, which saves money for those who
            do not have the capacity to fill the entire container. فروش شرکت
            تجارت متعدد LCL را جمع می کند و بار را بر اساس وزن یا اندازه کنترل
            محاسبه می کند.
          </p>
          <h5>2.بار کامل کنترل</h5>
          <p>
            کنترل کامل یک نوع انتقال دریا است که در آن دستور پر از کنترل است.
            این انتخاب عالی برای دستورات بزرگ است که ممکن است در یک یا بیشتر
            کانتینر کشتی اتفاق بیفتد. خريدار پول پول کانتينر رو ميده
          </p>
        </div>
      </b-col>
    </b-row>
     <b-row v-else-if="locale == 'hi'">
      <b-col>
        <div class="col">
          <h4>पुनरावृत्ति नीति</h4>
          <p>
           पुनरावृत्ति सही प्रयोग करने के लिए उत्पादन, सामान या / और लेखों को पुनरावृत्ति करने के लिये उत्पादन के अपयश्चात होना चाहिए कि उत्पादन के अपयश्चात, न
          </p>

          <h4>साधारण पुनरावृत्ति</h4>
          <p>
            आप आसान से सोकगेट को अपने प्राप्त उत्पादन, उत्पादनों और / या वस्तुओं के बारे में सूचना कर सकते हैं, और हम आपके प्राप्त स्
          </p>

          <h4>Authenticity guarantee</h4>
          <p>
            You must ensure that all seals, labels and accessories are intact and that the items are in their original packaging.
          </p>
          <p>
            व्यवसायी B2B और e-commerce व्यवसाय के रूप में, सोकगेट भेजे से पहले सामग्री, उत्पादन या / और लेखों के नमूने प्रदान करे
          </p>

          <h4>कैसे क्रम लौटाना है?</h4>
          <p>You can contact us by email or refund online by following the steps below::</p>
          <p>1.अपने खाते में लगइन करें और मेरा क्रम चुनें</p>
          <p>2.क्रम चुनें</p>
          <p>3.लौटाने के लिए कारण चुनें. कृपया पुष्टि करें कि आप चुने हुए कारण सही है.</p>
          <p>4.पुनरावृत्ति विधि और सामान चुनें, क्या यह DHL, UPS है या आपने खरीद किया देश के स्थानीय भारी है.</p>
          <p>5.पुनरावृत्ति विवरण देखें.</p>
          <p>6.खरीद देश से निकले से पहले पैसा को लौटाने के लिए निश्चित हो जाओ।</p>

          <h4>अफ्रीका के सभी भागों के लिए विश्वासीय प्रवाहन</h4>
          <p>
            सकगेट प्रतिज्ञा देता है कि तुम्हें प्रत्येक चरण में सबसे अच्छा प्रवाह अनुभव प्रदान करने के लिए, और सुरक्षित है कि सभी उचित उपचार लिया जाता
            सकगेट प्रतिज्ञा देता है कि तुम्हें प्रत्येक चरण में सबसे अच्छा प्रवाह अनुभव प्रदान करने के लिए, और सुरक्षित है कि सभी उचित उपचार लिया जाता
          </p>
          <p>
            You can choose the cheapest and most perfect delivery method.
क्योंकि सॉकगेट आपको बहुतेरे पद्धतियों को DHL या UPS के साथ तुलना करने के लिए अनुमति देता है सबसे अच्छा मूल्य चुनें
          </p>

          <h4>54 देश में</h4>
          <p>सोक्गेट अफ्रीका में 54 से अधिक देशों में सामान्य प्रदान कर सकता है, जिसके समावेश में DHL और UPS ट्रांसपोर्ट कंपनि</p>

          <h4>अपना क्रम ट्रैक करें</h4>
          <p>सॉक्गेट ने एक ट्रैकिंग फंक्शन प्रदान किया है जब तक वे द्वार पर प्रदान किया जाएँगा.</p>

          <h4>एक्सप्रेट सहायक</h4>
          <p>सॉक्गेट तैयार है तुम्हारी मदद करने के लिए, ताकि आप एक लॉजिस्टिक विश्वासकर्ता को संपर्क कर सकते हैं जो प्रक्र</p>

          <h4>Choose a simple and safe way to ship your order from two modes of transportation:</h4>
          <h5>1.LCL</h5>
          <p>
            सॉक्गेट तैयार है तुम्हारी मदद करने के लिए, ताकि आप एक लॉजिस्टिक विश्वासकर्ता को संपर्क कर सकते हैं जो प्रक्र
LCL ने छोटे स्केल समुद्री स्थान परिवहन की है, जो उन लोगों के लिए पैसा बचता है जिनके पास पूरा कन्टेनर भरने के लिए क्ष
कंपनी फ्राइट बहुतेरे LCL मालों को एक साथ रखता है और कन्टेनर के वजन या आकार के अनुसार भार को गणना करता है.
          </p>
          <h5>2.पूरा कन्टेनर कार्गो</h5>
          <p>
           पूरा कन्टेनर एक प्रकार समुद्र स्थानान्तरण है, जिसमें अनुक्रम पात्रों से भरा जाता है।
यह बड़े आदेशों के लिए एक अच्छा चुना है जो एक या अधिक सार्वजन कंटेनर में हो सकते हैं.
खरीदार पूरा कंटेनर क्षमता के लिए भरेगा.
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
          text: this.$t("menuitems.layout.shippingRefund"),
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