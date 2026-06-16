<template>
  <b-container class="merchant-settlement-page">
    <div v-title :data-title="$t('menuitems.shortcut.guarantee')">
      <Breadcrumb :items="items" />
      <b-row v-if="locale == 'zh'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate 担保</h4>
            <p>
              当您购买第三方卖家出售的物品时, Sokogate担保会保护您.它包括准时交货和您的物品状况.如果您对任何问题不满意, 您可以直接向Sokogate投诉, 我们的团队将确定您whether有资格退款.
            </p>
            <p>
              为了有资格获得Sokogate担保, 您必须首先contactSokogate团队, 并在收到第一条message后48小时内为您提供可接受的解决方案.如果您未能在48小时内与Sokogate团队达成解决方案, 您可能有资格在以下情况下获得退款: 
            </p>
            <p>
              您仍在原预计交付日期后90天内
              您的预计发货日期已过3天, 但您的物品尚未送达.
              您的物品尚未送达, 但跟踪显示已送达.
              您收到的物品损坏, 有缺陷, 与预期有重大差异.在这种情况下, 您必须根据我们的退货政策退还不需要的物品, 并且您一定没有退款 (或退款金额错误) .
              您要求更换物品, 但没有收到.在这种情况下, 您必须根据我们的退货政策退回不需要的物品.
              您有权获得的报销金额如下所示.
            </p>
            <el-table :data="tableDataZh" border style="width: 100%">
              <el-table-column prop="rfr" label="退货原因" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="产品成本">
              </el-table-column>
              <el-table-column prop="osc" label="原始运输成本">
              </el-table-column>
              <el-table-column prop="rsc" label="退货运费">
              </el-table-column>
            </el-table>
            <p>
              您对合格服务的质量不满意 由第三方卖方提供.你想退货
              您从卖家处购买, 但发生了以下情况之一: 
              卖家没有提供退货address卖家没有 提供预付款退货标签.卖方未提供全部
              在不要求退还物品的情况下退还物品.你已收取额外费用 (例如, 海关
              海外发货的授权)  您支付的价格和运费, 而卖方未支付 这些费用.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate Guarantee</h4>
            <p>
              The Sokogate Guarantee protects you when you purchase items sold
              by a third-party seller. It covers both on-time delivery and the
              condition of your items. If you are unhappy with eitherhad issues,
              you can file a complaint directly with Sokogate and our team will
              determine if you are eligible for a refund.
            </p>
            <p>
              To be eligible for Sokogate Guarantee, you must first contact the
              Sokogate team and allow 48 hours from your first message to
              provide you with an acceptable resolution. If you don't reach a
              resolution with the Sokogate team within 48 hours, you may be
              eligible for a refund if:
            </p>
            <p>
              You are still within 90 days of the original estimated delivery
              date It's been 3 days past your estimated delivery date and your
              item hasn't arrived. Your item hasn't arrived, but tracking shows
              it was delivered. The item you received was damaged, defective,
              materially different from what was expected. In this case, you
              must return the unwanted item in accordance with our return
              policies and you must not have been refunded (or the refunded
              amount was wrong). You requested a replacement item and did not
              receive it. In this case, you must have returned the unwanted item
              in accordance with our return policies. The amount of
              reimbursement to which you are entitled is shown below.
            </p>
            <el-table :data="tableDataEn" border style="width: 100%">
              <el-table-column prop="rfr" label="Reason for return" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="Product cost">
              </el-table-column>
              <el-table-column prop="osc" label="Original shipping cost">
              </el-table-column>
              <el-table-column prop="rsc" label="Return shipping cost">
              </el-table-column>
            </el-table>
            <p>
              You were not satisfied with the quality of the eligible services
              provided by the third-party seller. You wanted to return an item
              you purchased from a seller, but one of the following happened:
              The seller did not provide a return address The seller did not
              provide a prepaid return label. The seller did not offer a full
              refund for the item without requesting the return of the item. You
              have been charged additional costs (for example, by customs
              authorities for a shipment sent overseas) on top of the purchase
              price and shipping costs you paid, and the seller has not covered
              these fees.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate Garantie</h4>
            <p>
              La garantie sokogate vous protège lorsque vous achetez un article vendu par un vendeur tiers. Il comprend
              la livraison à temps et l'état de vos articles. Si vous n'êtes pas satisfait d'un problème, vous pouvez
              déposer une plainte directement auprès de sokogate et notre équipe déterminera si vous êtes admissible à
              un remboursement.
            </p>
            <p>
              Pour être éligible à la garantie sokogate, vous devez d'abord contacter l'équipe sokogate et vous fournir
              une solution acceptable dans les 48 heures suivant la réception du premier message. Si vous ne parvenez
              pas à trouver une solution avec l'équipe sokogate dans les 48 heures, vous pouvez être admissible à un
              remboursement si:
            </p>
            <p>
              Vous êtes toujours dans les 90 jours suivant la date de livraison initialement prévue
              3 jours se sont écoulés depuis votre date d'expédition estimée, mais votre article n'a pas encore été
              livré.
              Votre article n'a pas encore été livré, mais le suivi indique qu'il a été livré.
              L'article que vous avez reçu est endommagé, défectueux et diffère considérablement de ce qui était
              attendu. Dans ce cas, vous devez retourner l'article non désiré conformément à notre politique de retour
              et vous ne devez pas être remboursé (ou le montant du remboursement est incorrect).
              Vous avez demandé le remplacement de l'article et ne l'avez pas reçu. Dans ce cas, vous devez retourner
              les articles non désirés conformément à notre politique de retour.
              Le montant du remboursement auquel vous avez droit est indiqué ci - dessous.
            </p>
            <el-table :data="tableDataFra" border style="width: 100%">
              <el-table-column prop="rfr" label="Raison du retour" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="Coût du produit">
              </el-table-column>
              <el-table-column prop="osc" label="Frais de transport originaux">
              </el-table-column>
              <el-table-column prop="rsc" label="Frais de retour">
              </el-table-column>
            </el-table>
            <p>
              Votre insatisfaction de la qualité du Service qualifié est fournie par un vendeur tiers. Vous souhaitez
              retourner un produit
              Vous avez acheté auprès d'un vendeur, mais l'une des situations suivantes s'est produite:
              Le vendeur n'a pas fourni d'adresse de retour le vendeur n'a pas fourni d'étiquette de retour prépayée. Le
              vendeur ne fournit pas tout
              Retourner les articles sans demander de retour. Vous avez facturé des frais supplémentaires (par exemple,
              les douanes)
              Autorisation d'expédition à l'étranger) Le prix et les frais d'expédition que vous avez payés et que le
              vendeur n'a pas payés.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate Garantía</h4>
            <p>
              Cuando compra artículos vendidos por terceros vendedores, las
              garantías de Sokogate lo protegerán. Incluye la entrega y sus
              artículos a tiempo. Si no está satisfecho con ningún problema,
              puede quejarse directamente con Sokogate, y nuestro equipo
              determinará si es elegible para el reembolso.
            </p>
            <p>
              Para obtener la garantía de Sokogate, primero debe comunicarse con
              el equipo de Sokogate y proporcionarle soluciones aceptables
              dentro de las 48 horas posteriores a la recepción de la primera
              noticia. Si no alcanza una solución con el equipo de Sokogate
              dentro de las 48 horas, puede ser elegible para obtener un
              reembolso en las siguientes circunstancias:
            </p>
            <p>
              Todavía está dentro de los 90 días posteriores a la fecha de
              entrega original Su fecha de entrega esperada ha sido de 3 días,
              pero sus artículos aún no se han entregado. Sus artículos no se
              han entregado, pero la pantalla de seguimiento se ha entregado.
              Los elementos que recibe están dañados, defectuosos y tienen
              diferencias significativas con respecto a las expectativas. En
              este caso, debe reembolsar los elementos que no se necesitan de
              acuerdo con nuestra política de devolución, y no debe tener
              reembolso (o el error de monto de reembolso). Pides reemplazo,
              pero no recibido. En este caso, debe devolver elementos
              innecesarios según nuestra política de devolución. La cantidad de
              reembolso que ha obtenido se muestra a continuación.
            </p>
            <el-table :data="tableDataSpa" border style="width: 100%">
              <el-table-column prop="rfr" label="Razones de la devolución" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="Costo del producto">
              </el-table-column>
              <el-table-column prop="osc" label="Costos de transporte originales">
              </el-table-column>
              <el-table-column prop="rsc" label="Flete de devolución">
              </el-table-column>
            </el-table>
            <p>
              La calidad de su servicio calificado no está satisfecha con el
              vendedor de terceros. Quieres regresar Compras en el vendedor,
              pero una de las siguientes situaciones: El vendedor no proporcionó
              la dirección de devolución y el vendedor no proporcionó una
              etiqueta de devolución prepago. El vendedor no proporcionó todo
              Los elementos se reembolsan sin requerir el reembolso. Ha cobrado
              tarifas adicionales (por ejemplo, aduana Entrega en el extranjero)
              El precio y el flete que pagó, y el vendedor no pagó estas
              tarifas.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate garantia</h4>
            <p>
              A garantia Sokogate irá protegê-lo quando você comprar itens
              vendidos por vendedores terceirizados. Ele inclui a entrega no
              prazo e o status do item. Se você não estiver satisfeito com
              qualquer problema, você pode reclamar diretamente para Sokogate, e
              nossa equipe determinará se você é elegível para reembolso.
            </p>
            <p>
              Para se qualificar para a garantia Sokogate, você deve primeiro
              entrar em contato com a equipe Sokogate e fornecer uma solução
              aceitável dentro de 48 horas após receber a primeira mensagem. Se
              você não conseguir chegar a uma solução com a equipe Sokogate
              dentro de 48 horas, você pode ser elegível para um reembolso nas
              seguintes circunstâncias:
            </p>
            <p>
              Você ainda está dentro de 90 dias após a data de entrega prevista
              original Sua data de entrega prevista passou 3 dias, mas seu item
              não foi entregue. Seu item não foi entregue, mas o rastreamento
              mostra que ele foi entregue. Os itens que você recebeu estão
              danificados e defeituosos, o que é significativamente diferente do
              que você esperava. Neste caso, você deve devolver os itens
              indesejados de acordo com nossa política de devolução, e você não
              deve ter nenhum reembolso (ou valor de reembolso errado). Você
              solicitou a substituição do item, mas não o recebeu. Neste caso,
              você deve devolver os itens indesejados de acordo com nossa
              política de devolução. O montante de reembolso a que tem direito é
              o seguinte.
            </p>
            <el-table :data="tableDataPt" border style="width: 100%">
              <el-table-column prop="rfr" label="Motivo do regresso" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="Custo do produto">
              </el-table-column>
              <el-table-column prop="osc" label="Custo de envio original">
              </el-table-column>
              <el-table-column prop="rsc" label="Custo de envio de devolução">
              </el-table-column>
            </el-table>
            <p>
              Se você não estiver satisfeito com a qualidade do serviço
              qualificado, o vendedor terceirizado deve fornecê-lo. Queres
              voltar? Você compra do vendedor, mas ocorre uma das seguintes
              situações: O vendedor não forneceu um endereço de devolução. O
              vendedor não forneceu um rótulo de devolução pré-pago. O vendedor
              não forneceu todas as Devolver a mercadoria sem pedir a devolução.
              Cobrou taxas adicionais (por exemplo, alfândega Autorização de
              envio no exterior) o preço e frete que você paga, mas o vendedor
              não pagou essas taxas.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate ضمان</h4>
            <p>
              عندما تشتري العناصر التي تباع من قبل البائعين الثالثين ، ستحميك
              ضمانات Sokogate. ويشمل التسليم والعناصر الخاصة بك في الوقت المحدد.
              إذا لم تكن راضيًا عن أي مشكلة ، فيمكنك تقديم شكوى مباشرة إلى
              Sokogate ، وسيحدد فريقنا ما إذا كنت مؤهلاً لاسترداد الأموال.
            </p>
            <p>
              من أجل التأهل للحصول على ضمان Sokogate ، يجب عليك أولاً الاتصال
              بفريق Sokogate وتزويدك بحل مقبول في غضون 48 ساعة من تلقي الرسالة
              الأولى. إذا فشلت في الوصول إلى حل مع فريق Sokogate في غضون 48 ساعة
              ، فقد تكون مؤهلاً لاسترداد الأموال في الحالات التالية:
            </p>
            <p>
              ما زلت في غضون 90 يومًا بعد تاريخ التسليم الأصلي كان تاريخ التسليم
              المتوقع الخاص بك 3 أيام ، ولكن لم يتم تسليم العناصر الخاصة بك بعد.
              لم يتم تسليم العناصر الخاصة بك ، ولكن تم تسليم عرض التتبع. العناصر
              التي تتلقاها تضررت ، وتباين ، ولها اختلافات كبيرة من التوقعات. في
              هذه الحالة ، يجب عليك استرداد العناصر غير المطلوبة وفقًا لسياسة
              الإرجاع الخاصة بنا ، ويجب ألا يكون لديك أي استرداد (أو خطأ استرداد
              المبلغ). أنت تطلب الاستبدال ، ولكن لم يتم استلامها. في هذه الحالة
              ، يجب عليك إرجاع العناصر غير الضرورية بناءً على سياسة الإرجاع
              الخاصة بنا. يظهر أدناه كمية السداد التي حصلت عليها.
            </p>
            <el-table :data="tableDataAra" border style="width: 100%">
              <el-table-column prop="rfr" label="سبب العودة" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="تكلفة المنتج">
              </el-table-column>
              <el-table-column prop="osc" label="تكلفة النقل الأصلي">
              </el-table-column>
              <el-table-column prop="rsc" label="عودة الشحن">
              </el-table-column>
            </el-table>
            <p>
              أنت غير راضٍ عن جودة الخدمات المؤهلة التي يقدمها البائعون
              الخارجيون. تريد العودة اشتريت من بائع وحدث أحد الأمور التالية: لم
              يقدم البائع عنوان إرجاع لم يقدم البائع بطاقة إرجاع مدفوعة مسبقًا.
              لم يقدم البائع كل شيء قم بإرجاع عنصر دون طلب إرجاع العنصر. لقد تم
              تحصيل رسوم إضافية منك (على سبيل المثال ، الجمارك إذن للشحن
              الخارجي) أنت تدفع السعر ورسوم الشحن التي لم يدفعها البائع.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate Гарантия</h4>
            <p>
              Когда вы покупаете товары, проданные третьими продавцами, Sokogate
              гарантии защитят вас. Он включает в себя доставку и ваши товары
              вовремя. Если вы не удовлетворены какой -либо проблемой, вы можете
              напрямую жаловаться на Sokogate, и наша команда определит, имеете
              ли вы право на возврат средств.
            </p>
            <p>
              Чтобы иметь право на получение гарантии Sokogate, вы должны сначала связаться с командой Sokogate и
              предоставить вам приемлемое решение в течение 48 часов после получения первого сообщения. Если вы не
              смогли договориться с командой Sokogate в течение 48 часов, вы можете иметь право на возврат средств в
              следующих случаях:
            </p>
            <p>
              Вы все еще в течение 90 дней после предполагаемой даты доставки
              Ваша предполагаемая дата отправки прошла 3 дня, но ваш товар еще не доставлен.
              Ваш товар еще не доставлен, но отслеживание показывает, что он доставлен.
              Вещи, которые вы получаете, повреждены, неисправны и существенно отличаются от ожиданий. В этом случае вы
              должны вернуть ненужные вещи в соответствии с нашей политикой возврата, и вы должны быть уверены, что вы
              не вернули деньги (или сумма возврата неверна).
              Вы просили заменить товар, но не получили его. В этом случае вы должны вернуть ненужные товары в
              соответствии с нашей политикой возврата.
              Сумма возмещения, на которую вы имеете право, указана ниже.
            </p>
            <el-table :data="tableDataRu" border style="width: 100%">
              <el-table-column prop="rfr" label="Причины возврата" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="Стоимость продукции">
              </el-table-column>
              <el-table-column prop="osc" label="Первоначальные транспортные расходы">
              </el-table-column>
              <el-table-column prop="rsc" label="фрахт возврата">
              </el-table-column>
            </el-table>
            <p>
              Вы не удовлетворены качеством квалифицированной услуги, предоставленной сторонним продавцом. Вы хотите
              вернуть товар?
              Вы покупаете у продавца, но происходит одно из следующих событий:
              Продавец не указал адрес возврата товара а продавец не представил этикетку возврата предоплаты. Продавец
              предоставил не все
              Возвращение имущества без предъявления требования о его возврате. Вы взимаете дополнительную плату
              (например, таможня)
              Разрешение на отправку товаров за границу) Вы оплачиваете цену и фрахт, которые продавец не оплачивает.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate تضمین</h4>
            <p>
              تضمين "سوکوگويت" از شما محافظت خواهد کرد وقتي با فروشندگان سوم چيزايي خريديد شامل تحويل زمان و وضعيت وسايل
              شما هست اگر شما از هیچ مشکلی راضی نشوید، می توانید مستقیماً به سوکوگیت شکایت کنید، و تیم ما می تواند تصمیم
              بگیرد که شما حق دارید یا نه.
            </p>
            <p>
              برای تضمین سوکوگیت، اول باید با تیم سوکوگیت تماس بگیرید و در طول 48 ساعت بعد از رسیدن اولین پیغام به شما
              یک راه حل قابل قبول قرار دهید. اگر در طول ۴۸ ساعت با تیم سوکوگیت به راه حل رسیده باشید، ممکن است برای
              پاداش دادن در این شرایط برپا کنید:
            </p>
            <p>
              شما هنوز در طول ۹۰ روز بعد از تاریخ تحویل انتظار اصلی هستید
              تاریخ تحویل انتظار شما سه روز گذشته، ولی وسیله شما تحویل داده نشده.
              چيز شما تحويل نشده، ولي رديابي نشون ميده که تحويل داده شده.
              چیزهایی که به شما رسیده‌اند، آسیب و شکست خورده‌اند، که از آنچه انتظار داشته‌اید بسیار متفاوت است. در این
              مورد، شما باید وسیله‌های ناخواسته را بر اساس سیاست بازگشت ما بازگردانید، و شما باید هیچ بازگشت (یا مقدار
              برگشت اشتباهی) نداشته باشید.
              شما از جایگزینش این عنصر خواستید ولی آن را دریافت نکردید. در این مورد، شما باید وسایل غیر خواسته را بر
              اساس سیاست بازگشت ما برگردانید.
              مقدار پاداش دادن که شما حق دارید همان طور است.
            </p>
            <el-table :data="tableDataPer" border style="width: 100%">
              <el-table-column prop="rfr" label="دلایل بازگشت" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="هزینه محصول">
              </el-table-column>
              <el-table-column prop="osc" label="هزینه حمل و نقل بدوی">
              </el-table-column>
              <el-table-column prop="rsc" label="حمل بار">
              </el-table-column>
            </el-table>
            <p>
              اگر شما از کیفیت خدمت مقدس راضی نشوید، فروشنده سوم آن را بدهد. می‌خواهید برگردید
              شما از فروشنده خریدید، ولی یکی از اینها اتفاق می افته:
              فروشنده آدرس بازگشت را نداده است. فروشنده یک برچسب بازگشت پیش‌پرداخت را نداده است. فروشنده همه
              اموال رو بدون خواستن برگردون شما هزینه‌های اضافه (مثال سنت‌ها)
              اجازه دادن فرستادن غیر دریا) قیمت و باری که شما پرداخت می کنید، اما فروشنده این هزینه ها را پرداخت نکرده
              است.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col cols="12">
          <div class="col">
            <h4>Sokogate गारंटी</h4>
            <p>
              तिसऱ्या पार्टी विक्रेतांनी विकत घेतलेल्या वस्तू विकत घेतल्यावर सोकोगेट गारंटी तुम्हाला रक्षण करेल त्यामुळे
              तुमच्या वस्तुस्थितीची वेळ प्रदान व तुमची वस्तु स्थिती समाविष्ट करते. जर तुम्हाला कोणत्याही प्रश्न संतुष्ट
              नसते, तर तुम्ही सोकोगेटला सरळ प्रश्न करू शकता, आणि आमच्या समूहाने तुम्हाला पुन
            </p>
            <p>
              सोकोगेटच्या गारंटीसाठी क्वालीफिकेट करायला तुम्हाला पहिल्या सोकोगेट टीम संपर्क करावा व तुम्हाला पहिल्या
              संदेश प्राप जर तुम्ही सोकोगेट टीम मध्ये ४८ तासात समाधान पोहोचण्यास अपयशी असेल तर तुम्हाला खालील परिस्थितीत
              पुन्हा पुन्हा
            </p>
            <p>
              तुम्ही अजूनही ९० दिवसांमध्ये आहात मूलभूत प्रदान दिवसानंतर
              तुमची अपेक्षित प्रदेश दिवस ३ दिवस पासून गेली आहे, पण तुमची वस्तु पुरविली नाही.
              तुमची वस्तु पुरविली नाही, पण ट्रॅकिंग दाखवतो की ती पुरविली गेली आहे.
              तुम्ही प्राप्त केलेल्या वस्तू नाश होतात आणि निष्क्रिय होतात, जे तुम्हाला अपेक्षित अशा गोष या गोष्टी
              तुम्हाला आमच्या पुन्हा नियमशास्त्राप्रमाणे अपेक्षित वस्तू परत आणाव्या आणि तुम्हाला पुन्हा प्रत
              तुम्ही वस्तु बदलवायची विनंती केली पण ती मिळाली नाही. या गोष्टीत, आपल्या पुन्हा नियमानुसार तुम्हाला
              अपेक्षित वस्तू परत कराव्या पाहिजेत.
              तुम्हाला मिळालेल्या पुन्हा मिळालेल्या पुन्हा मिळाल्याप्रमाणेच आहे.
            </p>
            <el-table :data="tableDataHi" border style="width: 100%">
              <el-table-column prop="rfr" label="वापसी के कारण" width="180">
              </el-table-column>
              <el-table-column prop="pc" label="उत्पाद लागत">
              </el-table-column>
              <el-table-column prop="osc" label="आदिम परिवहन लागत">
              </el-table-column>
              <el-table-column prop="rsc" label="वापसी भाड़ा">
              </el-table-column>
            </el-table>
            <p>
              जर तुम्हाला विक्रीय सेवेच्या गुणवत्तेने पूर्ण नाही तर तिसऱ्या विक्रीयाने त्याला द्यावे. तुम्हाला परत
              करायचे आहे काय
              तुम्ही विक्रेतापासून विकत घेता, पण खालील एकाच घडतो.
              विक्रेताने पुन्हा पत्ता प्रदान केला नाही. विक्रेताने पुन्हा प्रतिक्रिया प्रतिक्रिया लेबल प् विक्रेताने
              सर्व पुरविले नाही
              परत मागण्यास विना वस्तू परत करा. तुम्ही अतिरिक्त फीज चार्ज केले आहेत (उदाहरणार्थ
              विक्रेतीच्या प्रवेशाची अधिकार) तुम्ही किंमत व भारी देता, पण विक्रेतीने या भारांना किंमत दिली नाही.
            </p>
          </div>
        </b-col>
        <!-- <b-col cols="12" md="5">
          <div class="col">
            <img class="img-1" src="HTTPS://oss.sokogate.com/image/f85eac39d68304936783a5ebe3c96881,png" loading="lazy" />
          </div>
        </b-col> -->
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
          text: this.$t("menuitems.shortcut.guarantee"),
          active: true,
        },
      ],
      tableDataZh: [
        {
          rfr: "项目损坏, 有缺陷或与您订购的有实质性差异",
          pc: "是",
          osc: "是",
          rsc: "是",
        },
        {
          rfr: "任何其他原因 (重新进货费用可从总退款中扣除)",
          pc: "是",
          osc: "是",
          rsc: "否",
        },
        {
          rfr: "任何其他原因 (如服装, 鞋子, 珠宝和手表)",
          pc: "是",
          osc: "是",
          rsc: "是(如果符合时尚物品退货政策)",
        },
      ],
      tableDataEn: [
        {
          rfr: "Item was damaged, defective, or materially different from what you ordered",
          pc: "Yes",
          osc: "Yes",
          rsc: "Yes",
        },
        {
          rfr: "Any other reason (restocking fees may be deducted from the total refund)",
          pc: "Yes",
          osc: "Yes",
          rsc: "No",
        },
        {
          rfr: "Any other reason (if Clothing, Shoes, Jewelry & Watches)",
          pc: "Yes",
          osc: "Yes",
          rsc: "Yes(if in line with return policies on Returns on Fashion Items)",
        },
      ],
      tableDataFra: [
        {
          rfr: "Article endommagé, défectueux ou substantiellement différent de ce que vous avez commandé",
          pc: "C'est exact.",
          osc: "C'est exact.",
          rsc: "C'est exact.",
        },
        {
          rfr: "Toute autre raison (les frais de restockage peuvent être déduits du remboursement total)",
          pc: "C'est exact.",
          osc: "C'est exact.",
          rsc: "Non",
        },
        {
          rfr: "Toute autre raison (vêtements, chaussures, bijoux et montres)",
          pc: "C'est exact.",
          osc: "C'est exact.",
          rsc: "Oui (si conforme à la politique de retour des articles de mode)",
        },
      ],
      tableDataSpa: [
        {
          rfr: "El proyecto está dañado, defectuoso o sustancialmente diferente de lo que usted ordenó",
          pc: "Sí.",
          osc: "Sí.",
          rsc: "Sí.",
        },
        {
          rfr: "Cualquier otra razón (la tarifa de reabastecimiento se puede deducir del reembolso total)",
          pc: "Sí.",
          osc: "Sí.",
          rsc: "No, No.",
        },
        {
          rfr: "Cualquier otra razón (como ropa, zapatos, joyas y relojes)",
          pc: "Sí.",
          osc: "Sí.",
          rsc: "Sí.(Si se ajusta a la política de devolución de artículos de moda)",
        },
      ],
      tableDataPt: [
        {
          rfr: "Item foi danificado, defeituoso, ou materialmente diferente do que você pediu",
          pc: "Sim",
          osc: "Sim",
          rsc: "Sim",
        },
        {
          rfr: "Qualquer outro motivo (taxas de reabastecimento podem ser deduzidas do reembolso total)",
          pc: "Sim",
          osc: "Sim",
          rsc: "NÃO",
        },
        {
          rfr: "Qualquer outro motivo (se roupas, sapatos, jóias e relógios)",
          pc: "Sim",
          osc: "Sim",
          rsc: "Sim(se estiver em linha com as políticas de devolução em Devoluções em Itens de Moda)",
        },
      ],
      tableDataAra: [
        {
          rfr: "البنود التالفة ، معيبة ، أو تختلف ماديا عن تلك التي طلبتها",
          pc: "حق .",
          osc: "حق .",
          rsc: "حق .",
        },
        {
          rfr: "أي سبب آخر ( رسوم إعادة الشراء يمكن خصمها من مجموع المبالغ المستردة )",
          pc: "حق .",
          osc: "حق .",
          rsc: "لا .",
        },
        {
          rfr: "أي سبب آخر ( مثل الملابس والأحذية والمجوهرات والساعات )",
          pc: "حق .",
          osc: "حق .",
          rsc: "نعم ( إذا كان يتوافق مع سياسة العودة أزياء البنود )",
        },
      ],
      tableDataRu: [
        {
          rfr: "Повреждение, дефект или существенная разница с вашим заказом",
          pc: "Да.",
          osc: "Да.",
          rsc: "Да.",
        },
        {
          rfr: "Любая другая причина (расходы на повторную поставку могут быть вычтены из общей суммы возмещения)",
          pc: "Да.",
          osc: "Да.",
          rsc: "Нет!",
        },
        {
          rfr: "Любая другая причина (например, одежда, обувь, ювелирные изделия и часы)",
          pc: "Да.",
          osc: "Да.",
          rsc: "Да.(При условии соблюдения правил возврата товаров)",
        },
      ],
      tableDataPer: [
        {
          rfr: "موضوع آسیب زده شده، شکست خورده یا موجود متفاوت از آنچه دستور دادید",
          pc: "بله",
          osc: "بله",
          rsc: "بله",
        },
        {
          rfr: "هر دلیل دیگری (پاداش بازگشت ممکن است از جمله پاداش بازگشت برداشته شود)",
          pc: "بله",
          osc: "بله",
          rsc: "نه",
        },
        {
          rfr: "هر دلیل دیگری",
          pc: "بله",
          osc: "بله",
          rsc: "بله (اگر مطابق با سیاست بازگشت موارد مد باشد)",
        },
      ],
      tableDataHi: [
        {
          rfr: "तुम्ही आज्ञा केलेल्या गोष्टीपेक्षा, निष्क्रिय किंवा प्रकारच्या वेगळ्या गोष्टीपेक्ष",
          pc: "होय",
          osc: "होय",
          rsc: "होय",
        },
        {
          rfr: "इतर कारण (पुन्हा पुन्हा पुन्हा पुन्हा पुन्हा पुन्हा पुन्हा पुन्हा पुन्हा पुन्हा पुन्हा प",
          pc: "होय",
          osc: "होय",
          rsc: "नाही",
        },
        {
          rfr: "इतर कारण (क्लोशिंग, शोट, जुवेली वाचणी)",
          pc: "होय",
          osc: "होय",
          rsc: "होय(फॅशॉन घटकांवर परत आणण्याच्या नीतीच्या रेखीत राहिल्यासाठी)",
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
        max-height: 280px;
        object-fit: contain;
      }

      .img-2 {
        width: 100%;
        max-height: 400px !important;
        position: relative;
        top: -75px;
        object-fit: contain;
      }
    }
  }
}
</style>