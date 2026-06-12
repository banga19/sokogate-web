<template>
  <b-container class="page-register">
    {{ $store.state.phoneShow }}
    <div v-title :data-title="$t('register.title')">
      <b-row align-v="end" class="text-center head">
        <b-col cols="12" md="auto" class="centre logo-box">
          <img
            class="logo"
            src="https://oss.sokogate.com/image/af82b848785b079390200737ab15cdff.png"
            alt=""
            @click="$router.push({ path: '/' })"
          />
        </b-col>
        <b-col cols="12" md="2" class="centre logo-box">
          {{ $t("register.title") }}&nbsp;&nbsp;<languag-switch />
        </b-col>
      </b-row>
      <div class="page-hd">
        <b-row class="register-pad">
          <b-col cols="1" md="1"></b-col>
          <b-col cols="12" md="5" class="centre">
            <b-card :title="$t('register.title')" class="register-card">
              <sui-form
                ref="form"
                :list="formList"
                :defaultdata="formData"
                @submit="submit"
                submitTitle="register.title"
                :loading="formLoading"
              />
              <p class="bd-box">
                <span class="toregiater" @click="login">
                  {{ $t("common.existing") }}
                </span>
              </p>
              <div>
                <el-checkbox
                  class="hb-checkbox"
                  v-model="radioCode"
                ></el-checkbox>
                <span class="agreement" @click="agreement">{{
                  $t("common.checkbox")
                }}</span>
              </div>
            </b-card>
          </b-col>
          <b-col>
            <el-row>
              <el-col>
                <div class="page-ft">
                  <LinkDivider :list="linkList" />
                </div>
              </el-col>
            </el-row>
          </b-col>
        </b-row>
      </div>
    </div>
    <!-- 协议内容 -->
    <el-dialog
      :visible="myVisible"
      width="36%"
      @close="close"
      class="authentication"
    >
      <div class="userAgreement" v-if="locale == 'zh'">
        <h2>Sokogate.com用户协议</h2>
        <p>
          欢迎使用Sokogate的条款和条件! 我们真的很高兴你能来。
          我们感谢您选择www.sokogate.com我们相信这些法律条款读起来会很累，所以我们试图让您的体验更愉快。
        </p>
        <p>
          以下我们列出了重要的法律条款，适用于访问或/和使用我们的网站或/和我们的服务的任何人。
          这些条款和条件是必要的，以保护您和我们，并使我们的服务可能和更愉快的每个人。
        </p>
        <p>
          另外，如果您有任何在以下文件的条款和条件中不明确的要求，欢迎联系www.sokogate.com
        </p>
        <h3>1. 介绍</h3>
        <p>
          只有在您完全同意SOKOGATE条款和条件的情况下，您才能访问或/和使用SOKOGATE服务。
          您通过使用和注册SokogateWebsite，即表示并确认您知情同意本条款、条件以及适用于使用SOKOGATEServices的任何其他条款。
        </p>
        <p>
          在您的用户帐户下发生的所有活动都由您负责。
          您提供给我们的帐户信息必须是您自己(或您的公司)的，并准确和完整。
        </p>
        <h4>1.1. Sokogate目的</h4>
        <p>
          Sokogate被认为是非洲和世界市场的领先平台之一。
          Sokogate为客户和供应商提供完美的电子商务体验，旨在让店铺用技术尽可能简单。
          我们为商业用户提供一个很好的机会，推出他们的电子商务网站，以显示高质量的可靠的产品，商品，项目在他们的用户平台sokogate.com网站。
          我们还允许买家轻松搜索，查看，购买他们想要的高端项目。
        </p>
        <h4>1.2. Sokogate的用户账号</h4>
        <p>
          为了访问或/和使用Sokogate网站的某些部分、服务和功能，您必须首先注册并创建一个用户帐户。
          在注册您的用户帐户及使用搜狗网站时，您必须提供准确及完整的资料。
          我们强烈建议您提供您自己(或您的公司)的联系方式和账单细节，包括您的有效电子邮件地址。
          用户将是唯一负责维护您的会员ID和密码的机密和安全的人。
        </p>
        <p>
          在您的用户帐户下发生的所有活动都由您负责。
          您提供给我们的帐户信息必须是您自己(或您的公司)的，并准确和完整。
        </p>
        <h4>1.3. 法律协议</h4>
        <p>
          本网站条款与条件特别适用于本网站所展示的我们的服务、产品和功能，并适用于本网站的每个访问者或用户，构成本网站与其全球关联公司及子公司之间具有约束力和可执行的法律合同。
          所以请仔细阅读。
        </p>
        <p>
          通过访问或/和使用我们的网站或/和我们的服务，您与我们签订了一项法律协议。
          因此，您表示同意这些条款，并承认您已阅读了任何可能限制您在sokogate.com上出售商品的权利的合同。
        </p>
        <h3>2. 你的责任</h3>
        <ul>
          2.1. 您保证、承诺并同意:
        </ul>
        <li>
          您将遵守有关您使用SokogateWebsite和任何相关互动或交易的所有适用法律和任何其他合同条款和条件;
        </li>
        <li>
          您是唯一对在您的用户帐号下使用sokogate.com服务负责和承担责任的人，包括访问、上传、使用或/和发布sokogate.com的任何后果;
        </li>
        <li>
          您理解sokogate.com不会就适用于您的使用或您遵守的任何法律或要求提供任何法律建议或任何建议;
        </li>
        <li>您全权负责您的用户产品和电子商务相关活动以及遵守任何适用的法律;</li>
        <li>
          如果您销售、列出、分享或张贴任何“禁止”和“限制”物品、商品和产品，Sokogate有权酌情决定暂停、禁用或删除您的用户帐户和/或任何用户产品;
        </li>
        <li>
          不得直接或间接冒充任何人或实体或在搜狗网站上提供虚假信息，或以其他方式进行任何操纵，以掩盖您的身份或您向搜狗发送的任何信息或传送的来源;
        </li>
        <h4>
          2.2.
          您保证并有义务保证您不会在以下情况下销售任何禁止和限制的物品和产品:
        </h4>
        <p>
          你是根据全国人民代表大会常务委员会颁布的《关于惩治走私犯罪分子的补充规定》第二条来理解法律的。
          用户或卖方如果出售、列出或共享下列禁售产品、物品或货物之一，将被判处最低5年徒刑，并处罚金或没收财产。
        </p>
        <h4>A) 与动物有关</h4>
        <p>
          1.根据濒临绝种野生动植物国际贸易公约的规定，你不允许出售濒危物种，包括濒临灭绝的动物或植物。
          这些物种是国际商业贸易所禁止的。",
          http://www.cites.org/eng/disc/what.shtml
        </p>
        <p>
          2.
          除非持有适当的许可证或证书，否则不得买卖未受灭绝威胁但可能会灭绝的物种标本。
        </p>
        <p>
          3.
          禁止出售本附录所列物种的其他标本，如豹子、老虎、熊猫、山地斑马等濒危物种或保护物种的毛皮、皮肤、内脏、牙齿、爪子、壳、骨等部位。
        </p>
        <p>
          4.
          只有在特殊情况下，你才能通过出口许可证(或再出口证书)和进口许可证来交易这些物种进行科学研究。
        </p>
        <p>
          5. 兽医产品和宠物药品不允许在搜狗网站上销售、上市、分享。
          因此，你不允许出售心脏蠕虫药物，如哨兵，革命，心脏加德，或拦截器，因为动物需要获得处方。
        </p>
        <p>
          6. 你只能在sokogate.com上出售无处方的跳蚤控制产品，包括Program,
          Advantage或Top Spot。
        </p>
        <h4>B)危险材料、武器、火器、爆炸物</h4>
        <p>
          1.
          您不允许在sokgate网站上出售、列出或分享危险物品，如枪支、爆炸物、弹药、军事条例、攻击性武器、放射性物质、易燃气体、液体和固体或有毒物质。
        </p>
        <p>
          2.
          您有义务不在Sokogate网站上销售BB枪、气枪、黑火药枪或前膛装弹枪和电击枪。
        </p>
        <p>
          3.
          你没有权利出售、列出或分享大规模杀伤性武器(WMD)以及生产任何武器或危险材料的任何指令、加工或资产。
        </p>
        <p>
          4.
          你只被允许在特定情况下复制“相似”的仿制枪支，但必须得到阿里巴巴的明确批准。
          这些复制品和仿制品必须有明确的标记，永久性地贴在适用管辖权的法律要求的范围内。
        </p>
        <p>
          5. 国际法严格禁止出售、上市或共享火器、弹药或任何相关材料。
          阿里巴巴将向政府主管部门通报任何违反本政策的行为。
        </p>
        <h4>C)淫秽物品</h4>
        <p>
          1. 您不得在sokgate网站上列出、分享或出售色情材料。
          SOKOGATE.com遵循中国接受的指导方针。
          因此，这些色情材料很难定义，因为它违反了许多国家的法律。
        </p>
        <p>
          2.
          Sokogate.com禁止出售或分享描述兽交、强奸、乱伦或带有暴力或堕落的图片的物品。
        </p>
        <h4>D)与警察有关的物品</h4>
        <p>
          1.
          你们同意不在sokogate.com上售卖与警察有关的物品，包括执法徽章、任何公共实体的官方执法设备或任何国家政府颁发的徽章。
        </p>
        <p>
          2.
          如果警察徽章明显不是官方的，比如塑料徽章、卡通徽章或迷你徽章，你只能列出、分享、出售与警察相关的物品。
        </p>
        <p>
          3.
          你只能出售授权的一般纪念品，如帽子、马克杯、别针、钢笔、纽扣、袖扣、t恤和不像徽章的钱夹。
        </p>
        <p>
          4.
          由一家现已倒闭的机构发行的至少有75年历史的徽章可以在Sokogate.com上出售。
        </p>
        <p>5. Sokogate.com允许你出售过时的、和现在的警服一点都不像的警服。",</p>
        <h4>E)工件的物品</h4>
        <p>
          1. 您不得在sokgate网站上列出、分享或出售色情材料。
          SOKOGATE.com遵循中国接受的指导方针。
          因此，这些色情材料很难定义，因为它违反了许多国家的法律。
        </p>
        <p>2. 不要列出或出售黄金、白银和其他贵金属。 (不包括珠宝)</p>
        <h4>F)人类的部分</h4>
        <p>
          1.
          Sokogate.com禁止出售、列出、分享文物、文物、历史墓志铭或相关受中国法律保护的物品。
        </p>
        <p>
          2.
          Sokogate.com禁止出售或分享描述兽交、强奸、乱伦或带有暴力或堕落的图片的物品。
        </p>

        <h4>G) 学术软件</h4>
        <p>1. Sokogate不会允许您列出任何学术软件，除非您在网站上获得授权。</p>
        <p>
          2.
          您必须在产品或商品描述中声明您代表的是搜罗门网站上的授权教育代理商或教育机构。
        </p>
        <p>3. 搜科网有权在发布前删除违反搜科网学术软件政策的学术内容。</p>
        <p>
          4.
          Sokogate.com禁止在网站上列出、分享或销售OEM或捆绑的软件副本，除非您将其与计算机硬件一起出售。
        </p>
        <p>
          5.
          Sokogate网站支持原始设备制造商(OEM)或捆绑软件，即购买新电脑时获得的软件。
          因此，根据OEM软件许可证，您不允许在没有计算机的情况下转售软件。
        </p>

        <h4>H) 交通相关产品</h4>
        <p>
          1.
          您不允许出售、列出或共享与航空公司、公共交通行业、空乘人员、公共交通列车、地铁相关人员或机场服务人员有关的制服、行李、手册或其他材料。
        </p>
        <p>
          2.
          你只能出售与上述行业相关的旧的、复古的服装，并且物品描述必须声明这些物品已经过时并且至少有10年的历史。
        </p>
        <h4>I) 彩票、发票和彩票</h4>
        <p>
          1.
          你不允许列出任何物品，直到你看过相关的合同或协议，并确信你可以合法地在Sokogate上出售它。
        </p>
        <p>
          2.
          你必须阅读可能限制你在sokogate.com销售该产品的机票条款，同时，你必须确保你没有签署单独的合同限制你在sokogate.com网站上销售该产品。
        </p>
        <p>3. 您不能在Sokogate.com上出售任何形式的发票，如增值发票。</p>
        <p>4. 你同意不会在sokogate网站上出售彩票。</p>
        <p>
          5. 您有权在Sokogate网站转售娱乐赛事门票，包括体育赛事或音乐会门票。
          然而，你同意你是唯一一个没有违反任何适用法律的人。
        </p>

        <h4>J) 货币、证券和信用卡</h4>
        <p>
          1.
          你知道sokogate.com禁止销售假币和邮票，包括硬币、钞票、债券、货币，以及制造这些非法证券的机器。
        </p>
        <p>
          2.
          您同意不出售或在sokogate.com上列出金融服务，包括财产继承、汇款、银行担保、黄金、信用证、基金、贷款、融资或股票。
        </p>
        <p>
          3.
          根据规范出售股票或其他证券权益的法律，您不得出售或上市股票、债券或投资任何实体或财产。
        </p>
        <p>
          4.
          您只能出售复制品证券，包括硬币、钞票和货币，但是，您必须在word文件中声明它是复制品，并说明项目。
        </p>
        <p>
          5. 你只能在Sokogate网站上出售，张贴，列出过期的信用卡至少10年。
          考虑到最近过期的信用卡或借记卡，您将不能出售或在sokogate.com上列出任何它们，以避免隐私问题。
        </p>
        <p>
          6.
          你也可以在sokogate.com上出售与商业相关的非证券类物品，如企业资产、库存、租赁或商品，以及交钥匙业务，包括自动售货机、挡风玻璃修理套件或酒精测试机。
        </p>
        <p>
          7.
          你可以出售、列出或分享与商业相关的工具，例如关于如何创业的信息、网站设计、域名、丝网印刷机、照相杯设备、名片制造商。
        </p>
        <p>
          8.
          你可以出售用于赠予目的的单股股票，只要这些股票被标记和广告为不可转让的。
        </p>
        <p>
          9.
          Sokogate.com允许你出售旧的或可收藏的股票，前提是这些股票已经被取消了。
        </p>

        <h4>K) 假冒,复制产品</h4>
        <p>
          1.
          你将不能在sokogate.com上出售假冒的设计师服装、手表、手袋、太阳镜或配饰，以保护原销售公司的名称和声誉。
        </p>
        <p>
          2.
          您明白，如果您销售假冒商品、产品、商品，搜高门网站有权暂停您的会员资格。
        </p>
        <p>3. 例:如果你不是正品，你是不允许销售假冒劳力士手表的。</p>
        <h4>L) 药物用具</h4>
        <p>
          1.
          你明白毒品和毒品用具如麻醉剂或类固醇是不允许在Sokogate网站上出售的。
        </p>
        <p>2. 您同意受控物质不会在Sokogate网站上列出或出售。</p>
        <p>
          3.
          你也不允许出售、列出或共享水管、化油器管、燃烧室管、冰管、烟枪，这些都是用于非法物质。
          然而，你只能出售与烟草有关的产品，如石南、粘土和玉米烟斗。
        </p>
        <h4>M) 具有民族或种族攻击性的材料</h4>
        <p>
          1.
          您同意在sokogate.com网站上不允许出现带有种族色彩的内容，并且任何sokogate.com网站有权禁止您的会员资格。
        </p>
        <p>2. Sokogate.com有权禁止在网站上列出或分享纳粹主义宣传材料。</p>
        <p>
          在Sokogate网站，我们鼓励和平与平等，在我们所有的会员之间创建会员和用户之间的适当互动。
        </p>
        <h4>N) 名称、执照、护照</h4>
        <p>
          1.
          您同意不在Sokogate网站上出售、列出或分享官方政府身份证件，包括出生证明、驾照、签证、护照或假身份证。
        </p>
        <p>
          2.
          你也不能在sokogate.com上出售另一个人的形象、肖像、名字或签名，除非产品是由那个人制造或授权的。
        </p>
        <p>
          3.
          Sokogate.com有权删除人脸、姓名、许可或任何相关内容等违反规定的帖子。
        </p>
        <h4>O) 偷来的物品</h4>
        <p>
          1.
          Sokogate.com禁止在网站上违反国际法，这就是为什么你不允许在sokogate网站上出售、列出或分享被盗财产或任何被盗物品。
        </p>
        <p>
          2.
          你们同意你们不会出售被盗的财产，包括从个人手中拿走的物品或未经公司或政府授权而拿走的财产。
        </p>
        <p>
          3.
          根据sokogate.com的隐私规则，负责出售、列出或分享在sokogate.com上列出的被盗财产的用户将受到起诉。
        </p>
        <p>
          4. Sokogate.com支持追回被盗财物的执法工作。
          此外，我们的律师将根据执法官员的正式要求提供未决和过去发帖的记录。
        </p>
        <h4>P) 处方药</h4>
        <p>
          1.
          Sokogate.com禁止出售、列出或分享任何需要持牌医生开具处方的受管制药物或物品
        </p>
        <p>2. 你们同意不在sokogate.com上销售未经授权的医疗设备，比如耳烛。</p>
        <p>如果您不确定您的项目的许可，请联系staff@sokogate.com之前发帖。</p>
        <h4>Q) 招聘或广告发布</h4>
        <p>
          1.
          您不会在sokgate网站上列出或分享招聘广告，这些广告可能被工厂、公司或机构用来直接招聘员工。
          如果您分享或列出招聘信息，Sokogate.com有权暂停您的账户。
        </p>
        <p>
          您不得在未经授权的情况下发布广告，例如以收集用户信息或筹集资金为目的。
        </p>
        <p>
          清单，分享，或张贴在sokogate.com应该代表的项目被出售。
          如果您的目标与sokogate.com的企业对企业商业交易的主要目的不一致，sokogate.com有权封号您的帐户。
        </p>

        <h4>R) 卫星、有线电视、移动电话等</h4>
        <p>
          1.
          在未经授权的情况下，您不得出售相关物品以破解或方便获取有线或卫星电视节目。
        </p>
        <p>
          2.
          Sokogate网站禁止在未经授权或支付的情况下列出、出售或分享有关如何破解或获取有线或卫星电视节目的信息。
        </p>
        <p>
          3.
          您将不被允许上市、共享或出售智能卡程序设计器和不看器、编程智能卡、阻塞设备或硬件或软件ss模拟器。
        </p>
        <p>
          4.
          Sokogate.com严禁在网站上出售、列出、分享翻新手机、笔记本电脑和电脑。
          Sokogate.com的政策是禁止任何“鼓励”这类活动
        </p>
        <p>5. 您同意不列出、分享或出售间谍设备，如窃听设备。</p>
        <p>
          6.
          因此，根据sokogate.com的隐私，您被严格禁止出售、列出或共享包含姓名、地址、电话号码、传真和其他个人识别信息的邮件列表，或张贴目前第三方的个人信息。
        </p>
        <p>
          7.
          此外，您不允许列出或出售任何旨在从sokogate网站发送未经请求的商业电子邮件或垃圾邮件的软件.
        </p>
        <h4>S) 纺织品配额，二手物品</h4>
        <p>1. Sokogate.com严禁在网站上出售、列出或分享纺织品配额。</p>
        <p>
          2.
          如衣服、化妆品等使用过的物品可以在sokogate.com上列出、分享或出售，除非根据制造商的说明进行彻底清洁。
        </p>
        <p>
          3.
          然而，你不能出售、列出或分享使用过的内裤，如平角短裤、内裤、三角内裤和运动支持者。
        </p>
        <h4>T) 大概的</h4>
        <p>
          1.
          如果您位于中国，那么您同意您不会在sokogate网站上出售、列出、分享或购买原油。
        </p>
        <h5>
          如果您担心在Sokogate网站上出售、列出或分享的特定物品是否合适或是否合法，欢迎联系staff@sokogate.com。
        </h5>

        <h3>3. 隐私</h3>
        <p>
          使用或/和访问SokogateServices需要或涉及提交、收集和/或使用某些个人身份或可识别信息。
          sokogate
          .com收集、访问和使用与用户有关的某些数据，包括用户通过sokogate网站和/或用户平台进行的活动或导航。
          我们鼓励您定期阅读我们的隐私和政策，以了解数据收集和使用实践的描述。
          隐私和政策
        </p>

        <h3>4. 网站的费用</h3>
        <p>
          使用sokogate.com上的某些服务可能需要支付特定的费用。
          Sokogate将有权就该等付费服务发出有关该等费用的通知。
          如果您希望接收或使用此类付费服务，您必须预先支付所有适用的费用。
        </p>
        <h3>5. 取消</h3>
        <p>
          您可以随时取消您在sokogate.com上的用户帐户。
          有关取消付费服务的更多信息，请联系staff@sokogate.com
        </p>
        <p>
          如您未能遵守搜狗网站的条款及条件或/及支付任何费用，搜狗网站有权取消或封禁您的用户帐户。
        </p>
      </div>
      <div class="userAgreement" v-else-if="locale == 'en'">
        <h2>Sokogate.com user agreement</h2>
        <p>
          Welcome to Sokogate Terms and Conditions! We are truly excited to have
          you here. We thank you for choosing www.sokogate.com We believe that
          the legal terms can be exhausting to read, so we’ve tried to make the
          experience more pleasant
        </p>
        <p>
          Below we have listed important legal terms that apply to anyone who
          visits or/and uses our website or/and our services.These terms and
          conditions are necessary in order to protect both you and us, and to
          make our services possible and more enjoyable for everyone.
        </p>
        <p>
          Also, if you have any requirementsthat not clear in theterms and
          conditions contained in the following document, you are welcome to
          contact www.sokogate.com
        </p>
        <h3>1. Introduction</h3>
        <p>
          You may visit or/and use SOKOGATEservices only if you fully agree to
          SOKOGATE Terms and conditions. By using and registering to
          SokogateWebsite, you signify and affirm your informed consent to these
          Terms, conditions, and any other Terms applicable to the use of
          SOKOGATEServices.
        </p>
        <p>
          All activities that occur under your user account are your
          responsibility. The account information you provide us must be your
          own (or your company’s) and be accurate and complete.
        </p>
        <h4>1.1. Sokogate Purpose</h4>
        <p>
          Sokogate is considered one of the leading platforms in Africa and the
          world market. Sokogate provides customers and suppliers with a
          flawless e-commerce experience, aiming to make the shop with
          technology as easy as possible. We offer a great opportunity for
          business users to launch their e-commerce site in order to display
          high-quality reliable products, goods, items on their User Platformon
          SokogateWebsite. We are also allowing buyers to easily search, look
          at, purchase their desire high-ended items.
        </p>
        <h4>1.2. User Account on Sokogate</h4>
        <p>
          In order to access or/and use certain sections, services, and features
          of the Sokogate Website, you must first register and create a user
          account. You must provide accurate and complete information when
          registering your User Account and using Sokogate Website. We strongly
          encourage you to provide your own (or your company’s) contact and
          billing details, including your valid e-mail address. The user will be
          the only oneresponsible for maintaining the confidentiality and
          security of your Member ID and password.
        </p>
        <p>
          All activities that occur under your user account are your
          responsibility. The account information you provide us must be your
          own (or your company’s) and be accurate and complete.
        </p>
        <h4>1.3. Legal Agreement</h4>
        <p>
          TheSokogate Terms and Conditions that specifically apply to our
          services, products, and features as presented on the Sokogate website
          and applicable to each visitor or user of the Sokogate
          Websiteconstitute a binding and enforceable legal contract between
          Sokogate and its affiliated companies and subsidiaries worldwide.So
          please read them carefully.
        </p>
        <p>
          By visiting or/and using our website or/and our services, you are
          entering into a legal agreementwith us. So, you signify your consent
          to these terms and you acknowledge that you have read any contracts
          you have entered that might limit your right to sell your items on
          sokogate.com.
        </p>
        <h3>2. Your Responsibilities</h3>
        <ul>
          2.1. You Warrant, Undertake, and Agree that:
        </ul>
        <li>
          You will comply with all applicable laws and any other contractual
          terms and conditions that govern your use of SokogateWebsite and any
          related interaction or transaction;
        </li>
        <li>
          You are the only one responsible and liable with respect to any of the
          uses of the sokogateservices which occur under your User Account,
          including for any consequences of accessing, uploading, using, or/and
          publishing on sokogate.com;
        </li>
        <li>
          You understand that sokogate.com does not provide any legal advice or
          any recommendation with respect to any laws or requ§irements
          applicable to your use or your compliance therewith;
        </li>
        <li>
          You are solely responsible for your User Products and E-Commerce
          related activitiesand compliance with any laws applicable thereto;
        </li>
        <li>
          Sokogate shall have the right to discretion, suspend, disable access
          to or remove your User Account and/or any User Products in case you
          are selling, listing, sharing, or posting any of The Prohibited and
          Restricted Items, Goods, and Products;
        </li>
        <li>
          Not to impersonate any person or entity or provide false information
          on the SokogateWebsite, whether directly or indirectly, or otherwise
          perform any manipulation in order to disguise your identity or the
          origin of any message or transmittal you send to Sokogate;
        </li>
        <h4>
          2.2. You Warrant and Obligate that You Will Not Sell any of The
          Prohibited and Restricted Items and Products as Follows:
        </h4>
        <p>
          You understandthelaws, according to Article II of the 'Supplementary
          Regulations on the Punishment of Criminals Who Smuggle' that
          promulgated by the Standing Committee of the National People's
          Congress. The User or Seller who willsell, list, or share one of the
          following ProhibitedProducts, Items, or Goods shall be subject to a
          minimum sentence of imprisonment of five years with a fine or
          confiscation of property.
        </p>
        <h4>A) ANIMALS-RELATED</h4>
        <p>
          1. You are not allowedtosellendangered species, including animals
          orplants that are threatened with extinction, according to the
          CITES-list. Those species are prohibited by the commercial
          international trade.http://www.cites.org/eng/disc/what.shtml
        </p>
        <p>
          2. You will not trade in specimens of speciesthat are not threatened
          with extinction but may become so, unless present of the appropriate
          permits or certificates.
        </p>
        <p>
          3. You will not sellother specimens of species thatlisted in this
          Appendix, such as Pelts, skins, internal organs, teeth, claws, shells,
          bones and other parts of endangered species or protected species, such
          as leopards, tigers, pandas, mountain zebras, etc.
        </p>
        <p>
          4. You can only trade those species under exceptional circumstancesfor
          scientific researchby the granting of both an export permit (or
          re-export certificate) and an import permit.
        </p>
        <p>
          5. Veterinary Products and Pet Medicines are not allowed for selling,
          listing, sharing on sokogate website. Thus, you are not allowed to
          sell heart worm medicines such as Sentinel, Revolution, Heart-Gard,or
          Interceptor as animals need to obtain a prescription.
        </p>
        <p>
          6. You can only sell on sokogate.com flea control products without a
          prescription, including Program, Advantage,or Top Spot.
        </p>
        <h4>B) HAZARDOUSMATERIALS, WEAPONS, FIREARMS, EXPLOSIVES</h4>
        <p>
          1.You are not allowed to sell, list, or share hazardous materialssuch
          as firearms, explosives,ammunition,military ordinance, assault
          weapons, radioactive materials, flammable gases, liquids and solids,
          or toxicsubstances on Sokogate Website.
        </p>
        <p>
          2. You obligated to not sell BB guns, air guns, black powder guns or
          muzzle-loader guns and stun guns on Sokogate Website.
        </p>
        <p>
          3. You don’t have the right to sell, list, or share (WMD) weapons of
          Mass Destruction andany instruction, processing, or assets of
          producing any kind of the weaponsor hazardousmaterials.
        </p>
        <p>
          4. You are only allowed to replica, 'look-alike', imitation firearms
          under certain circumstancesonly upon the expressed approval of
          Alibaba.com. These replica and imitation itemsmust have clear
          markingspermanently affixed to the extent required by the laws of
          applicable jurisdiction.
        </p>
        <p>
          5. The international law strictly prohibits selling, listing, or
          sharing of firearmsammunition, or any related materials. And the
          government authorities will be notified with any violation of this
          policyby Alibaba.com.
        </p>
        <h4>C) PORNOGRAPHIC MATERIALS</h4>
        <p>
          1. You have not to list, share, or sell pornographic materials on
          Sokogate Website. As SOKOGATE.com follows guidelines accepted in the
          PRC. Thus, these pornographic materialsare difficult to define because
          it’sviolated laws in many countries.
        </p>
        <p>
          2. Sokogate.com prevents to sell or share items depicting
          bestialityrape sex, incest, or sex with graphic violence or
          degradation.
        </p>
        <h4>D) POLICE-RELATED ITEMS</h4>
        <p>
          1.You agreed not to listor sell police-related items on sokogate.com,
          including law enforcement badges, official law enforcement equipment
          from any public entity, or badges issued by the government of any
          country.
        </p>
        <p>
          2. You can only list, share, sell police-related items if the police
          badges are clearly not official such as plastic, cartoon, or mini
          badges.
        </p>
        <p>
          3. You can only sell authorized general souvenir itemssuch as hats,
          mugs, pins, pens, buttons, cuff links, T-shirts, money clips that do
          not resemble badges.
        </p>
        <p>
          4. Historical badgesat least 75 years oldissued by a now-defunct
          organization are allowed to sell on Sokogate.com.
        </p>
        <p>
          5. Sokogate.com allow you to sell police uniforms that obsolete and in
          no way resemble current issue police uniforms.
        </p>
        <h4>E) ARTIFACTS ITEMS</h4>
        <p>
          1. You have not to list, share, or sell pornographic materials on
          Sokogate Website. As SOKOGATE.com follows guidelines accepted in the
          PRC. Thus, these pornographic materialsare difficult to define because
          it’sviolated laws in many countries.
        </p>
        <p>
          2.Don’tlist or sell gold, silver and other precious metal. (Jewelry
          not included)
        </p>
        <h4>F) HUMAN PARTS</h4>
        <p>
          1. Sokogate.com prevents to sell, list, share artifacts, cultural
          relics, historical grave markers, or related items are protected under
          PRC law.
        </p>
        <p>
          2. Sokogate.com prevents to sell or share items depicting
          bestialityrape sex, incest, or sex with graphic violence or
          degradation.
        </p>

        <h4>G) ACADEMIC SOFTWARE</h4>
        <p>
          1. Sokogate will not allow you to list any academic software unless
          you areauthorized on the website.
        </p>
        <p>
          2. You have to declare in the description of the products or items
          that you represent an authorized educational reseller or an
          educational institution on sokogate website.
        </p>
        <p>
          3. Sokogate.com has the right to delete the academic items that
          violatingsokogate’s academic software policy before publication.
        </p>
        <p>
          4. Sokogate.com prohibits to list, share, or sell OEM or Bundled
          copies of software on the website unless you are selling it with
          computer hardware.
        </p>
        <p>
          5. Sokogate website supports the Original Equipment Manufacturer
          (OEM)or bundled software that is software that is obtained as part of
          the purchase of a new computer. Thus, you are not allowed to resell
          the software without the computer,according to OEM software licenses.
        </p>

        <h4>H) TRANSIT-RELATED PRODUCTS</h4>
        <p>
          1. You are not allowed to sell, list, or share uniforms, baggage,
          manuals or other materials that related to airlines, public
          transportation industries, flight attendant's, mass transit train,
          subway related, or airport service personnel.
        </p>
        <p>
          2. You can only sell old, vintage clothing related to the above
          industries with items description that declare the items is obsolete
          and at least 10 years old.
        </p>
        <h4>I) TICKETS, INVOICES, AND LOTTERY</h4>
        <p>
          1. You are not allowed to list any item until you have reviewed a
          relevant contracts or agreements, and are confident you can legally
          sell it on Sokogate.
        </p>
        <p>
          2. You have to read the Airline tickets terms that may limit your
          ability to sell that item on sokogate.com.Also, you have to make sure
          that you didn’t signed a separate contract restricting your ability to
          market the product before posting it on Sokogate Website.
        </p>
        <p>
          3. You will not be able to sell any form of invoices on Sokogate.com
          such as value-added invoice.
        </p>
        <p>
          4. You agreed that you will not sell lottery tickets on sokogate
          website.
        </p>
        <p>
          5. You have the right to resell entertainment events tickets,
          including sporting events or concerts on Sokogate Website. However,
          you agreed that you’re the only one who responsible for not violating
          anyapplicable law.
        </p>

        <h4>J) CURRENCY, SECURITIES, AND CREDIT CARDS</h4>
        <p>
          1. You understand that sokogate.com prohibits the sell of counterfeit
          currency and stamps, including coins, bank notes, bonds, money, as
          well as the producing machine for those illegal securities.
        </p>
        <p>
          2. You agreed to not sell or list on sokogate.com financial services,
          including property inherited, money transfer, bank guarantee,gold,
          Letter of Credit, fund, loan, fundraising, or stocks.
        </p>
        <p>
          3. You are not allowed to sell or list stocks, bonds,or investment
          interests in any entity or property, according to the law that
          regulates the selling of stocks or other security interests.
        </p>
        <p>
          4. You can only sell the replica securities, including coins, bank
          notes, and money, however, you have to declare that it’s replica in a
          word file and the description of the items.
        </p>
        <p>
          5. You are only allowed to sell, post, list the expired credit cards
          for at least 10 years on Sokogate website. Considering the recently
          expired credit or debit cards, you will not be able to sell or list
          any of them on sokogate.com to avoid privacy concerns.
        </p>
        <p>
          6. You also can sell on sokogate.com business-related items, which are
          notsecurities, such as the assets of a busines, inventory, lease, or
          goods, as well as Turn-key businesses, including vending machines,
          windshield repair kits, or breathalyzer machines.
        </p>
        <p>
          7. You are allowed to sell, list, or share business-related tools,
          such asinformation about how to start a business,websites design,
          domain names, silk-screening machines, photo mug equipment, business
          card makers.
        </p>
        <p>
          8. You can sell single-share stock certificates marketed for gift
          purposes, provided that the certificates are marked and advertised as
          non-transferable.
        </p>
        <p>
          9. Sokogate.com allow you to sell old or collectible stock
          certificates, provided thatstock certificates are already cancelled.
        </p>

        <h4>K) COUNTERFEIT, COPIEDPRODUCTS</h4>
        <p>
          1. You will not be able to sell counterfeit designer garment,watches,
          handbags, sunglasses, oraccessories on sokogate.com In order to
          preserve the name and reputation of the original company that sells.
        </p>
        <p>
          2. You understand that Sokogate website has the right to suspension of
          your membership in case you sell counterfeit items, products, goods.
        </p>
        <p>
          3. EX. You are not allowed to sell counterfeit Rolex Watches, if
          you’re not the original, authorized source of the products.
        </p>
        <h4>L) DRUGS PARAPHERNALIA</h4>
        <p>
          1. You understand that drugs and drug paraphernalia such as narcotics
          or steroids are not allowed to be sell on Sokogate website.
        </p>
        <p>
          2. You agreed that the controlled substance will not be listed or sell
          on Sokogate website.
        </p>
        <p>
          3. You are also not allowed to sell, list or share water pipes,
          carburetor pipes, chamber pipes, ice pipes, bongs, which are used in
          illicit substances. However, you can only sell the products that used
          with tobacco such as briar, clay, and corncobpipes.
        </p>
        <h4>M) ETHNICALLY OR RACIALLY OFFENSIVE MATERIAL</h4>
        <p>
          1. You are agreed that the ethnically offensive materials are not
          allowed to be listed on sokogate.com and if any Sokogate Website has
          the right to ban your membership.
        </p>
        <p>
          2. Sokogate.com has the right to prohibitthe Nazism promoting
          materials to be listed or shared on the site.
        </p>
        <p>
          Here at Sokogate Website, we encourage peace and equality, among all
          our members to create proper interactions between members and users.
        </p>
        <h4>N) NAMES, LICENSES, PASSPORT</h4>
        <p>
          1. You agreed to not sell, list, or share official government
          identification documents, includingbirth certificates, driver’s
          licenses, visas, passports, or fake identifications cards on Sokogate
          Website.
        </p>
        <p>
          2. You also can’t sell on sokogate.com image, likeness, name, or
          signature of another personunless the products were made or authorized
          by that person.
        </p>
        <p>
          3. Sokogate.com has the right to delete the violating posts such as
          faces, names, licenses, or any items related.
        </p>
        <h4>O) STOLEN ITEMS</h4>
        <p>
          1. Sokogate.com prohibitsviolating international law on the website,
          which is why you are not allowed to sell, list, or share a stolen
          property or any stolen items on sokogate website.
        </p>
        <p>
          2. You agreed that you will not sell stolen property, including items
          taken from private individuals or property taken without authorization
          from companies or governments.
        </p>
        <p>
          3. Users who are responsible for selling, listing, or sharing the
          stolen property that listed on sokogate.com will be subject to
          prosecution, according to sokogate’s privacy rules.
        </p>
        <p>
          4. Sokogate.com supports law enforcement efforts to recover stolen
          property. Also, our attorneys will providerecords about pending and
          past postings with anofficial request from law enforcement officials.
        </p>
        <h4>P) PRESCRIPTION DRUGS</h4>
        <p>
          1. Sokogate.com prohibits to sell, list, or share any controlled drug
          or item that requires a prescription from a licensedpractitioner
        </p>
        <p>
          2. You agreed to not sell unauthorizedmedical devices on sokogate.com
          such as ear candles.
        </p>
        <p>
          If you are uncertain to the permissibility of your items, kindly
          contact staff@sokogate.com prior posting.
        </p>
        <h4>Q) JOB POSTING OR AD POSTING</h4>
        <p>
          1. You will not list or share job posting Ads, which are can be used
          by a factory, company, or institute to directly recruit employees on
          sokogate website. Sokogate.com has the right to suspense your account
          if you share or list job postings.
        </p>
        <p>
          You are not allowed to post an Ad for unauthorizedrequirements such as
          the purpose of collecting user information or raising money.
        </p>
        <p>
          Listing, sharing, or posting on sokogate.com should represent the item
          that being sold. If your objectives inconsistent with the main purpose
          of business-to-business commercial transactions that sokogate.com aim
          for, sokogate has the right to ban your account.
        </p>

        <h4>R) SATELLITE, CABLE TV, MOBILE PHONES, and OTHERS</h4>
        <p>
          1. You are not allowed to sell related-items to descramble or
          facilitate the access to cable or satellite television programming
          without authorization.
        </p>
        <p>
          2. Sokogate website forbids to list, sell, or share information about
          how to descramble or gain access to cable or satellite television
          programming without authorization or payment.
        </p>
        <p>
          3. You will not be allowed to list, share, or sell Smart Card
          Programmers and Unlookers, Programmed Smart Cards, Blocking Devices,
          or Hardware or SoftwareDSS Emulators.
        </p>
        <p>
          4. Sokogate.com strictly prohibits to sell, list, share refurbished
          mobile phones, laptops and computers on the website. Sokogate.com
          policy is to prohibit any 'encouragement' of this type of activity
        </p>
        <p>
          5. You agree to not list, share, or sellspy equipment, such as
          wiretappingequipment.
        </p>
        <p>
          6. Thus, according to the sokogate.com’s privacy, you are strictly not
          allowed to sell, list, or share mailing list that contain names,
          addresses, phone numbers, fax, and other personal identifying
          information or posting present personal information of third parties.
        </p>
        <p>
          7. Also, you are not allowed to list or sellany software designed to
          send unsolicited commercial email or spam from sokogate website.
        </p>
        <h4>S) TEXTILE QUOTA, USED ITEMS</h4>
        <p>
          1. Sokogate.com strictly does not permit selling, listing, or sharing
          of textile quota on the website.
        </p>
        <p>
          2. Used items such as clothes, cosmetics or more can be listed,
          shared, or sold on sokogate.com unless it has been thoroughly cleaned,
          according to the manufacturer's instructions.
        </p>
        <p>
          3. However, you can’t sell, list, or share used underwear such as
          boxer shorts, panties, briefs, and athletic supporters.
        </p>
        <h4>T) CRUDE</h4>
        <p>
          1. If you’re located in China, then you agreed that you will not sell,
          list, share, or purchase crude oil on sokogate website.
        </p>
        <h5>
          You are welcome to contact staff@sokogate.com in case you’re worried
          about specific item you want to sell, list, or share on Sokogate
          Website,regarding toappropriateness or legality.
        </h5>

        <h3>3. Privacy</h3>
        <p>
          Using or/and accessing SokogateServices require or involve the
          submission, collection, and/or use of certain personally identifying
          or identifiable information. Sokogate.commay collect, access, and use
          certain data pertaining to Users, including the activities or
          navigation undertaken by Users through the SokogateWebsite and/or User
          Platforms. We encourage you to read our Privacy and Policy on a
          regular basis, for a description of the data collection and use
          practices. Privacy and Policy
        </p>

        <h3>4. Site Fees</h3>
        <p>
          Using certain Services on sokogate.com may be subject to payment of
          particular fees. Sokogate will prigvide notice of such Fees then in
          effect in relation to such Paid Services.If you wish to receive or use
          such Paid Services, you are required to pay all applicable Fees in
          advance.
        </p>
        <h3>5. Cancellation</h3>
        <p>
          You can cancel your User Account on sokogate.com at any time. For more
          information about cancelingyour Paid Services, please contact
          staff@sokogate.com
        </p>
        <p>
          Sokogate.com has the right to cancel or ban your User Account in case
          your failure to comply with Sokogate Terms and Conditions or/and pay
          any fee until full payment is made.
        </p>
      </div>
    </el-dialog>
  </b-container>
</template>

<script>
import LanguagSwitch from "@/components/LanguagSwitch";
import LinkDivider from "@/components/LinkDivider";
import SuiForm from "@/components/s-ui/form";
import { Registger } from "@/utils/api";

export default {
  components: {
    LanguagSwitch,
    LinkDivider,
    SuiForm,
  },
  data() {
    return {
      // 协议内容
      myVisible: false,
      //同意条款的勾选
      radioCode: false,
      // 表单内容
      formList: [
        // 个人/公司注册
        // {
        //   type: "radio",
        //   name: "verifyStatus",
        //   rules: [{ required: true }],
        //   range: [
        //     {
        //       label: "resident.IndividualRegistration",
        //       value: 100,
        //     },
        //     {
        //       label: "resident.CompanyRegistration",
        //       value: 300,
        //     },
        //   ],
        //   // 显示个人注册时消失
        //   setHidden: [
        //     [
        //       "address",
        //       "enterpriseProfile",
        //       "enterpriseName",
        //       "businessLicenseImg",
        //       "identityCardFront",
        //       "identityCardBack",
        //       "brandLogo",
        //       "productCert",
        //       "trademarkCert",
        //     ],
        //     100,
        //     0,
        //   ],
        // },
        //名称
        {
          type: "input",
          name: "nickName",
          label: "common.name",
          rules: [
            {
              required: true,
              message: "common.namerequired",
              trigger: "blur",
            },
          ],
        },
        // 手机号
        // {
        //   type: "mobile",
        //   name: "mobile",
        //   label: "common.mobile",
        //   rules: [
        //     {
        //       required: true,
        //       message: "common.mobilerequired",
        //       trigger: "blur",
        //     },
        //     { eval: "validateGlobalMobile", trigger: "blur" },
        //   ],
        // },
        // 邮箱
        // {
        //   type: "mail",
        //   name: "email",
        //   label: "common.email",
        //   rules: [
        //     {
        //       required: true,
        //       message: "common.emailrequired",
        //       trigger: "blur",
        //     },
        //     {
        //       type: "email",
        //       message: "common.emailFormatError",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        {
          type: "phoneoremail",
          name: "phoneoremail",
          label: "common.mailorphone",
          rules: [
            {
              required: true,
              message: "common.mailorphonereq",
              trigger: "blur",
            },
          ],
        },
        // 验证码
        // {
        //   type: "code",
        //   name: "verifyCode",
        //   label: "common.verifyCode",
        //   rules: [
        //     {
        //       required: true,
        //       message: "common.verificationCodeRequired",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 密码
        {
          type: "password",
          name: "password",
          label: "common.password",
          rules: [
            {
              required: true,
              message: "common.passwordrequired",
              trigger: "blur",
            },
            { eval: "validatePass", trigger: "blur" },
          ],
        },
        // 确认密码
        // {
        //   type: "password",
        //   name: "confirmpassword",
        //   label: "common.confirmpassword",
        //   rules: [
        //     {
        //       required: true,
        //       message: "common.passwordConfirmError",
        //       trigger: "blur",
        //     },
        //     { eval: "validatePass2", trigger: "blur" },
        //   ],
        // },
        // 国家
        // {
        //   type: "country",
        //   name: "country",
        //   label: "common.country",
        //   rules: [
        //     {
        //       required: true,
        //       message: "common.countryrequired",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 公司地址
        // {
        //   type: "input",
        //   name: "address",
        //   label: "resident.address",
        //   rules: [
        //     {
        //       required: true,
        //       message: "resident.addressReq",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 公司简介
        // {
        //   type: "textarea",
        //   name: "enterpriseProfile",
        //   label: "resident.profile",
        //   rules: [
        //     {
        //       required: true,
        //       message: "resident.profileReq",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 企业名称
        // {
        //   type: "input",
        //   name: "enterpriseName",
        //   label: "resident.enterpriseName",
        //   rules: [
        //     {
        //       required: true,
        //       message: "resident.enterpriseNameReq",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 营业执照
        // {
        //   type: "uploadimagenotoken",
        //   name: "businessLicenseImg",
        //   label: "resident.businessLicenseImg",
        //   rules: [
        //     {
        //       required: true,
        //       message: "resident.businessLicenseImgReq",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 身份证正面照
        // {
        //   type: "uploadimagenotoken",
        //   name: "identityCardFront",
        //   label: "resident.identityCardFront",
        //   rules: [
        //     {
        //       required: true,
        //       message: "resident.identityCardFrontReq",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 身份证反面照
        // {
        //   type: "uploadimagenotoken",
        //   name: "identityCardBack",
        //   label: "resident.identityCardBack",
        //   rules: [
        //     {
        //       required: true,
        //       message: "resident.identityCardBackReq",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // 品牌标志
        // {
        //   type: "uploadimagenotoken",
        //   name: "brandLogo",
        //   label: "resident.brandLogo",
        // },
        // 产品证书
        // {
        //   type: "uploadimagenotoken",
        //   name: "productCert",
        //   label: "resident.productCert",
        // },
        // 商标注册证
        // {
        //   type: "uploadimagenotoken",
        //   name: "trademarkCert",
        //   label: "resident.trademarkCert",
        // },
      ],
      // 个人注册表单的参数
      formData: {
        userType: 2,
        nickName: "",
        phoneCode: "86",
        phoneoremail: "",
        role: "buyer",
        industry: "",
        companySize: "",
        interestedCategories: "",
        // country: "",
        // verifyCode: "",
        mobile: "",
        email: "",
        password: "",
        // verifyStatus: 100,
      },
      linkList: [
        {
          title: "Terms Conditions",
        },
        {
          title: "Policy for Sellers",
        },
        {
          title: "Policy for Buyers",
        },
        {
          title: "Shipping & Refund",
        },
        {
          title: "Wholesale Policy",
        },
        {
          title: "Privacy Policy",
        },
        {
          title: "Seller Login",
        },
      ],
      formLoading: false,
    };
  },
  computed: {
    locale: function () {
      return this.$i18n.locale;
    },
  },
  methods: {
    // 协议弹框
    agreement() {
      this.myVisible = true;
    },
    // 关闭弹窗
    close() {
      this.myVisible = false;
    },
    // 去登录
    login() {
      this.$router.push("/v2/login");
    },
    // 注册的表单事件
    submit(data) {
      console.log("submit:", data);
      // 公司注册表单的参数
      // const enterpriseInfo = {
      //   address: "",
      //   enterpriseProfile: "",
      //   enterpriseName: "",
      //   businessLicenseImg: "",
      //   identityCardFront: "",
      //   identityCardBack: "",
      //   brandLogo: "",
      //   productCert: "",
      //   trademarkCert: "",
      // };
      // const object = Object.entries(enterpriseInfo).reduce((a, [key]) => {
      //   if (key in data) {
      //     a[key] = data[key];
      //   }
      //   return a;
      // }, {});
      // console.log("object", object);
      if (this.radioCode !== true) {
        this.$message({
          showClose: true,
          message: this.$t("common.tick"),
          type: "error",
        });
      }
      if (this.radioCode == true) {
        if (this.$store.state.phoneoremail === 1) {
          // 为手机号
          data.mobile = data.phoneoremail;
          Registger(data)
            .then((res) => {
              console.log("registger-res:", res, res.userInfo);
              this.formLoading = false;
              const { userInfo, token, expire } = res.data;
              if (token && userInfo && userInfo.userId) {
                this.$store.commit("login", {
                  user: userInfo,
                  token,
                  expire,
                });
                this.$bvToast.toast(this.$t("register.success"), {
                  toaster: "b-toaster-top-center",
                  variant: "success",
                  appendToast: false,
                  noCloseButton: true,
                  autoHideDelay: 3000,
                });
                // this.$router.push("/v2/login");
                try {
                  const backToRouter = localStorage.getItem("backToRouter");
                  if (backToRouter) {
                    // console.log("backToRouter:", backToRouter);
                    this.$router.push(JSON.parse(backToRouter));
                    localStorage.removeItem("backToRouter");
                  } else {
                    this.$router.push("/v2/product/home");
                  }
                } catch (error) {
                  console.log("backToRouter-error:", error);
                }
              }
            })
            .catch((err) => {
              console.log("registger-err:", err);
              this.formLoading = false;
              this.$bvToast.toast(`${err.data.message}`, {
                toaster: "b-toaster-top-center",
                variant: "danger",
                appendToast: false,
                noCloseButton: true,
                autoHideDelay: 3000,
              });
            });
        } else if (this.$store.state.phoneoremail === 2) {
          data.email = data.phoneoremail;
          Registger(data)
            .then((res) => {
              console.log("registger-res:", res, res.userInfo);
              this.formLoading = false;
              const { userInfo, token, expire } = res.data;
              if (token && userInfo && userInfo.userId) {
                this.$store.commit("login", {
                  user: userInfo,
                  token,
                  expire,
                });
                this.$bvToast.toast(this.$t("register.success"), {
                  toaster: "b-toaster-top-center",
                  variant: "success",
                  appendToast: false,
                  noCloseButton: true,
                  autoHideDelay: 3000,
                });
                // this.$router.push("/v2/login");
                try {
                  const backToRouter = localStorage.getItem("backToRouter");
                  if (backToRouter) {
                    // console.log("backToRouter:", backToRouter);
                    this.$router.push(JSON.parse(backToRouter));
                    localStorage.removeItem("backToRouter");
                  } else {
                    this.$router.push("/v2/product/home");
                  }
                } catch (error) {
                  console.log("backToRouter-error:", error);
                }
              }
            })
            .catch((err) => {
              console.log("registger-err:", err);
              this.formLoading = false;
              this.$bvToast.toast(`${err.data.message}`, {
                toaster: "b-toaster-top-center",
                variant: "danger",
                appendToast: false,
                noCloseButton: true,
                autoHideDelay: 3000,
              });
            });
        }
      }

      // // 公司注册
      // if (data.verifyStatus === 300) {
      //   Registger({ ...this.formData, enterpriseInfo: object })
      //     .then((res) => {
      //       console.log("registger-res:", res);
      //       this.formLoading = false;
      //       const { userInfo, token, expire } = res.data;
      //       if (token && userInfo && userInfo.userId) {
      //         this.$store.commit("login", {
      //           user: userInfo,
      //           token,
      //           expire,
      //         });
      //         this.$bvToast.toast(this.$t("register.success"), {
      //           toaster: "b-toaster-top-center",
      //           variant: "success",
      //           appendToast: false,
      //           noCloseButton: true,
      //           autoHideDelay: 3000,
      //         });
      //         // this.$router.push("/v2/login");
      //         try {
      //           const backToRouter = localStorage.getItem("backToRouter");
      //           if (backToRouter) {
      //             // console.log("backToRouter:", backToRouter);
      //             this.$router.push(JSON.parse(backToRouter));
      //             localStorage.removeItem("backToRouter");
      //           } else {
      //             this.$router.push("/v2/product/home");
      //           }
      //         } catch (error) {
      //           console.log("backToRouter-error:", error);
      //         }
      //       }
      //     })
      //     .catch((err) => {
      //       console.log("registger-err:", err);
      //       this.formLoading = false;
      //       this.$bvToast.toast(`${err.data.message}`, {
      //         toaster: "b-toaster-top-center",
      //         variant: "danger",
      //         appendToast: false,
      //         noCloseButton: true,
      //         autoHideDelay: 3000,
      //       });
      //     });
      //   // 个人注册成功
      // } else if (data.verifyStatus === 100) {
      // }
    },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;
.page-register {
  .row,
  .row > * {
    padding: 0;
    margin: 0;
  }
}
.head {
  margin: 20px 15px;
}
.logo {
  width: 160px;
  cursor:pointer;
  &-box {
    height: 60px;
  }
}
.register-card {
  max-width: 470px;
  padding: 0 15px;
  .bd-box {
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    span {
      cursor: pointer;
      color: #ef2e22;
    }
  }
  .agreement {
    font-size: 12px;
    color: gray;
    cursor: pointer;
  }
}
.page-hd {
  padding-top: 11%;
  background-image: url("https://oss.sokogate.com/image/49404fd02abd55e23798340c3b69f294.png");
  background-size: 100%;
  background-repeat: no-repeat;
  min-height: 545px;
  .page-ft {
    text-align: center;
    padding-top: 60%;
    @include mobile {
      padding-top: 0;
    }
  }
}
.authentication {
  .el-dialog {
    height: 80vh;
    overflow-y: auto;
    word-break: normal;
    .userAgreement {
      h2 {
        text-align: center;
        margin-bottom: 20px;
      }
      h3 {
        margin-top: 20px;
      }
      h4 {
        margin-top: 20px;
      }
      p {
        margin-top: 10px;
      }
    }
  }
}
</style>