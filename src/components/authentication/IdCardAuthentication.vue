<template>
  <div>
    <b-card class="real-name-authentication">
      <sui-form
        ref="form"
        :list="formList"
        :defaultdata="formData"
        @submit="submit"
        :loading="formLoading"
      />
      <div class="argeement">
        <span class="authenticationprotocol" @click="agreement">{{
          $t("common.authenticationprotocol")
        }}</span>
      </div>
      <!-- 协议内容 -->
      <el-dialog
        :visible="myVisible"
        width="36%"
        @close="close"
        class="authentication"
      >
        <div class="userAgreement" v-if="locale == 'zh'">
          <h2>sokogate客户隐私权政策</h2>
          <p>
            广州哈荔亚贸易有限公司（以下简称“本公司”）尊重并保护您的隐私。严格遵守法律法规及监管规定，为您提供更加安全、可靠的服务。
            您使用本公司的服务时，本公司将按照隐私权政策（以下简称“本政策”）收集、存储、使用及对外提供您的个人信息。同时，本公司会通过本政策向您说明如下事项:
          </p>
          <h3>一、本公司如何收集个人信息</h3>
          <p>
            在您使用sokogate服务的过程中，在以下情形中本公司需要收集您的一些信息，用以向您提供服务、提升本公司的服务质量、保障您的账户和资金安全以及符合国家法律法规及监管规定。
          </p>
          <h4>1、依据法律法规及监管规定履行反洗钱义务及进行实名制管理</h4>
          <p>
            （1）在您注册sokogate账户或使用sokogate服务时，您需提供您的有效身份证件信息、银行卡信息、联系方式。如您不提供前述信息，可能无法注册sokogate账户或无法使用sokogate服务。根据相关法律法规的规定，您需通过身份基本信息多重交叉验证后方可使用本公司的部分服务。同时，为了验证您提供信息的准确性和完整性，本公司会与合法留存您的信息的国家机关、金融机构、企事业单位进行核对；如在验证核对过程中本公司需要向前述验证机构收集您的信息，本公司会依照法律法规的规定要求相关验证机构说明其个人信息来源，并对其个人信息来源的合法性进行确认;
          </p>
          <p>
            （2）本公司需根据《支付机构反洗钱和反恐怖融资管理办法》等反洗钱相关法律法规及监管要求，提示您适时提供有效身份证件的彩色影印件或照片以供本公司核对并留存；如您不提供前述彩色影印件或照片，可能无法使用部分sokogate服务。
          </p>
          <h4>2、银行卡收单</h4>
          <p>
            （1）为了您能使用银行卡收单服务，您需提供您的银行卡卡号、姓名、身份证号码、银行预留手机号。本公司会将前述信息与发卡银行进行验证。如您不提供上述信息，可能影响资金到账情况，但不影响您使用本公司提供的其他服务；
          </p>
          <p>
            （2）为了保障您账户和资金安全，在您需找回密码时，本公司需要验证您的身份，为此您需向本公司提供一些可识别您身份的证明资料，您可根据相关页面提示上传您的身份证明。
          </p>
          <h4>3、风险防范</h4>
          <p>
            为了提高您使用本公司服务的安全性，防止您的资金、个人信息被不法分子获取，本公司需要记录您使用的sokogate服务类别、方式及相关操作信息，例如:设备型号、IP地址、设备软件版本信息、设备识别码、设备标识符、所在位置、网络使用习惯以及其他与sokogate服务相关的日志信息。如您不同意提供前述信息，可能无法完成风控验证。
          </p>
          <h4>
            4、根据相关法律法规及国家标准，在以下情形中，本公司可能会依法收集并使用您的个人信息无需征得您的同意:
          </h4>
          <p>（1）与国家安全、国防安全直接相关的；</p>
          <p>（2）与公共安全、公共卫生、重大公共利益直接相关的；</p>
          <p>（3）与犯罪侦查、起诉、审判和判决执行等直接相关的；</p>
          <p>
            （4）出于维护您或他人的生命、财产等重大合法权益但又很难得到您本人同意的；
          </p>
          <p>（5）所收集的个人信息是您自行向社会公众公开的；</p>
          <p>
            （6）从合法公开披露的信息中收集个人信息，例如:合法的新闻报道、政府信息公开等渠道；
          </p>
          <p>（7）根据您的要求签订和履行合同所必需的；</p>
          <p>
            （8）用于维护所提供的服务的安全稳定运行所必需的，例如:发现、处置产品或服务的故障；
          </p>
          <p>（9）法律法规规定的其他情形。</p>
          <h4>
            5、本公司根据服务需要，有权向行政机关、事业单位、司法机关、监管部门、中国互联网金融协会等行业自律组织查询、打印、留存您的个人信息，包括户籍信息、工商信息、公积金信息、诉讼信息、执行信息等。
          </h4>
          <h3>二、本公司如何存储和保护个人信息</h3>
          <p>
            1、本公司在中华人民共和国境内收集和产生的个人信息将存储在中华人民共和国境内。如部分产品涉及跨境业务，本公司需要向境外机构传输境内收集的相关个人信息的，本公司会按照法律法规和相关监管部门的规定执行，本公司仅在本政策所述目的所必需期间和法律法规及监管规定的时限内保存您的个人信息。
          </p>
          <p>
            2、为保障您的信息安全，本公司致力于使用各种安全技术（TLS、SSL、匿名化处理等）及配套的管理体系来尽量降低您的信息被泄露、毁损、误用、非授权访问、非授权披露和更改的风险。并建立了相关内控制度，对可能接触到您的信息的工作人员采取最小够用授权原则；对工作人员处理您的信息的行为进行系统监控，不断对工作人员培训相关法律法规及隐私安全准则和安全意识强化宣导。
          </p>
          <p>
            3、请您务必妥善保管好您的身份要素【“身份要素”是指:sokogate用于识别您身份的信息要素，例如:您的sokogate登录名、密码、短信校验码、电话号码、手机号码、证件号码及生物识别信息（例如:指纹信息、脸部信息）】。您在使用sokogate服务时，本公司会通过您的身份要素来识别您的身份。一旦您泄漏了前述信息，您可能会蒙受损失，并可能产生对您不利的法律后果。如您发现身份要素可能或已经泄露时，请您立即和本公司取得联系，以便本公司及时采取相应措施以避免或降低相关损失。
          </p>
          <h3>三、本公司如何使用个人信息</h3>
          <h4>
            1、为了遵守国家法律法规及监管要求，以及向您提供服务及提升服务质量，或保障您的账户和资金安全，本公司会在以下情形中使用您的信息:
          </h4>
          <p>（1）实现本政策中“本公司如何收集个人信息”所述目的。</p>
          <p>（2）根据法律法规或监管要求向相关部门进行报告。</p>
          <p>
            （3）比较信息的准确性，并与第三方进行验证。例如，将您向本公司提交的身份信息与身份验证的服务机构进行验证。
          </p>
          <p>
            （4）为使您知晓自己使用本公司服务的情况或了解本公司的服务，向您发送服务状态的通知、营销活动及其他商业性电子信息。
          </p>
          <p>
            （5）对您的身份数据、交易信息等进行综合统计、分析或加工，并出于销售、奖励或为了让您拥有更广泛的社交圈的需要而使用、共享或披露，以便为您提供更加准确、个性、流畅及便捷的服务，或帮助本公司评估、改善或设计产品、服务及运营活动等。
          </p>
          <p>（6）预防或禁止非法的活动。</p>
          <p>（7）经您许可的其他用途。</p>
          <h3>四、本公司如何对外提供个人信息</h3>
          <h4>1、共享</h4>
          <h5>（一）业务共享</h5>
          <p>
            （1）为了让您完成交易、实现交易目的，本公司需要向您的交易相对方提供交易号及相关支付信息，同时您的交易相对方可在付款过程中或付款成功后查看您的部分注册信息；
          </p>
          <p>
            （2）本公司产品或服务可能由第三方提供或由本公司与第三方共同提供，因此，只有共享您的信息，才能提供您需要的产品或服务。
          </p>
          <p>
            （3）事先获得您明确同意的情况或本政策约定的情况下，本公司会在法律法规允许且不违背公序良俗的范围内，依据您的授权范围与第三方共享您的信息。
          </p>
          <p>
            （4）本移动应用端为向您提供相关产品和服务，会使用合作方提供的软件工具开发包
            (SDK)及应用程序接口 (API) ，
            我们会对软件工具开发包(SDK)及应用程序接口(API)
            获取您信息的情况进行严格的安全监测，以保护数据安全。其中，本移动应用端接入的定位第三方sdk如下：
            高德 为了向您提供【基于位置的相关】功能 /
            服务，我们的产品集成了【高德地图定位】
            SDK。在向您提供【定位】功能/服务时，【高德地图SDK
            】需要收集、使用您的【设备信息、位置信息、 WLAN
            及其他传感器信息】，具体请您仔细阅读
            《高德地图开放平台隐私权政策》。
          </p>
          <h4>（二）投诉处理</h4>
          <p>
            1、当您投诉他人或被他人投诉时，为了保护您及他人的合法权益，本公司可能会将您的姓名及有效证件号码、联系方式、投诉相关内容提供给消费者权益保护部门、监管机关或其他相关政府机构，以便及时解决投诉纠纷，但法律法规明确禁止提供的除外。
          </p>
          <p>2、转让</p>
          <p>
            本公司不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外:
          </p>
          <p>（1）事先获得您的明确同意或符合本政策约定情形；</p>
          <p>（2）根据法律法规或强制性的行政或司法要求；</p>
          <p>
            （3）本公司发生资产转让、收购、兼并、重组或破产清算等导致的个人信息转让，但本公司会通过推送通知、公告等向您告知转让的情况。
          </p>
          <h4>3、公开披露</h4>
          <p>
            如确需公开披露时，本公司会向您告知公开披露的目的、披露信息的类型及可能涉及的敏感信息。
          </p>
          <h4>4、委托处理</h4>
          <p>
            为了提升信息处理效率，降低信息处理成本，或提高信息处理准确性，本公司可能会委托有能力的本公司的关联公司或其他专业机构代表本公司来处理用户信息，但本公司会通过书面协议、现场审计等方式要求受托公司遵守严格的保密义务及采取有效的保密措施，禁止其将这些信息用于未经您授权的用途。
          </p>
          <h4>
            5、根据相关法律法规及国家标准，在以下情形中，本公司可能会依法共享、转让、公开披露您的个人信息无需征得您的同意。
          </h4>
          <p>（1）与国家安全、国防安全直接相关的；</p>
          <p>（2）与公共安全、公共卫生、重大公共利益直接相关的；</p>
          <p>（3）与犯罪侦查、起诉、审判和判决执行等直接相关的；</p>
          <p>（4）出于维护您或其他个人的生命、财产等重大合法权益的；</p>
          <p>（5）您已自行向社会公众公开的个人信息；</p>
          <p>
            （6）从合法公开披露的信息中收集的个人信息，例如:合法的新闻报道、政府信息公开等渠道。
          </p>
          <p>（7）法律法规规定的其他情形；</p>
          <h3>五、您如何访问和管理自己的个人信息</h3>
          <p>
            在您使用sokogate服务期间，为了您可以更加便捷地访问和管理您的个人信息，本公司在产品设计中为您提供了相应的操作设置，您可以参考下面的指引进行操作。
          </p>
          <h4>1、管理您的个人信息</h4>
          <p>
            （1）您可通过sokogate
            APP登录sokogate账户，在“我的”:（1）查阅您的实名信息、交易记录、绑定银行卡信息等。为了您的个人信息安全，您的身份证号码和银行账户会进行脱敏展示；
          </p>
          <p>
            （2）如发现您的信息有误，您可以联系本公司的客服电话要求更正。出于安全性和身份识别的考虑或根据法律法规及监管规定，您需通过验证方可修改您已认证的姓名或已绑定的手机号码；
          </p>
          <p>（3）您可管理绑定的银行卡。</p>
          <h4>
            2、如您发现本公司收集、使用您个人信息的行为，违反了法律法规规定或违反了与您的约定，您可联系本公司的客服电话，要求删除相应的信息。
          </h4>
          <h4>
            3、尽管有上述约定，但按照相关法律法规及国家标准，在以下情形中，本公司可能无法响应您的请求:
          </h4>
          <p>（1）与国家安全、国防安全直接相关的；</p>
          <p>（2）与公共安全、公共卫生、重大公共利益直接相关的；</p>
          <p>（3）与犯罪侦查、起诉、审判和执行判决等直接相关的；</p>
          <p>（4）有充分证据表明您存在主观恶意或滥用权利的；</p>
          <p>（5）响应您的请求将导致其他个人、组织的合法权益受到严重损害的；</p>
          <p>（6）涉及商业秘密的。</p>
          <p>（7）法律法规规定的其他情形；</p>

          <h4>六、对第三方责任的声明</h4>
          <p>
            请您注意，您的交易相对方、您访问的第三方网站经营者、通过本公司接入的第三方服务（例如:sokogate
            APP中第三方提供的应用）和由sokogate处接收您的个人信息的第三方可能有自己的隐私权保护政策；当您查看第三方创建的网页或使用第三方开发的应用程序时，这些第三方可能会放置他们自己的
            Cookie或像素标签，这些
            Cookie或像素标签不受本公司的控制，且它们的使用不受本政策的约束。本公司会尽商业上的合理努力去要求这些主体对您的个人信息采取保护措施，但本公司无法保证这些主体一定会按照本公司的要求采取保护措施，亦不对这些主体的行为及后果承担任何责任。如您发现这些第三方创建的网页或第三方开发的应用程序存在风险时，建议您终止相关操作以保护您的合法权益。
          </p>
          <h4>七、本政策的适用及更新</h4>
          <p>本公司sokogate服务均适用本政策。</p>
          <p>发生下列重大变化情形时，本公司会适时对本政策进行更新</p>
          <p>
            （1）本公司的基本情况发生变化，例如:兼并、收购、重组引起的所有者变更；
          </p>
          <p>（2）收集、存储、使用个人信息的范围、目的、规则发生变化；</p>
          <p>（3）对外提供个人信息的对象、范围、目的发生变化；</p>
          <p>（4）您访问和管理个人信息的方式发生变化；</p>
          <p>（5）数据安全能力、信息安全风险发生变化；</p>
          <p>
            （6）用户询问、投诉的渠道和机制，以及外部纠纷解决机构及联络方式发生变化；
          </p>
          <p>（7）其他可能对您的个人信息权益产生重大影响的变化。</p>
          <p>
            本公司可能适时修订本政策内容，如本政策发生更新，本公司将以APP推送通知、发送邮件/短消息或者在sokogate官方网站发布公告的方式来通知您。为了您能及时接收到通知，建议您在联系方式更新时及时通知本公司。如您在本政策更新后继续使用sokogate服务，即表示您已充分阅读、理解并接受更新后的政策并愿意受更新后的政策约束。
          </p>
        </div>
        <div class="userAgreement" v-else-if="locale == 'en'">
          <h2>Sokogate Customer Privacy Policy</h2>
          <p>
            Guangzhou Haliya Trading Co., Ltd. (hereinafter referred to as "the
            Company") respects and protects your privacy. Strictly abide by
            laws, regulations and regulatory provisions to provide you with
            safer and more reliable services. When you use our services, we will
            collect, store, use and provide your personal information to the
            outside world in accordance with the privacy policy (hereinafter
            referred to as "the policy"). At the same time, the Company will
            explain the following matters to you through this policy:
          </p>
          <h3>I、 How the Company collects personal information</h3>
          <p>
            In the process of using sokogate services, we need to collect some
            of your information in the following cases to provide you with
            services, improve our service quality, ensure your account and
            capital security, and comply with national laws, regulations and
            regulatory provisions.
          </p>
          <h4>
            1. Perform anti money laundering obligations and conduct real name
            management in accordance with laws, regulations and regulatory
            provisions
          </h4>
          <p>
            (1) When you register your sokogate account or use sokogate
            services, you need to provide your valid ID information, bank card
            information and contact information. If you do not provide the above
            information, you may not be able to register a sokogate account or
            use the sokogate service. According to relevant laws and
            regulations, you must pass multiple cross validation of basic
            identity information before using some of our services. At the same
            time, in order to verify the accuracy and completeness of the
            information you provide, the Company will check with the state
            organs, financial institutions, enterprises and institutions that
            legally retain your information; If our company needs to collect
            your information from the previous verification agency during the
            verification process, we will require the relevant verification
            agency to explain its personal information source in accordance with
            the provisions of laws and regulations, and confirm the legitimacy
            of its personal information source;
          </p>
          <p>
            (2) The Company shall prompt you to provide color photocopies or
            photos of valid identity documents in due time for the Company to
            check and keep in accordance with the Anti money Laundering and Anti
            terrorist Financing Management Measures of Payment Institutions and
            other laws, regulations and regulatory requirements related to anti
            money laundering; If you do not provide the above-mentioned color
            photocopies or photos, you may not be able to use some sokogate
            services.
          </p>
          <h4>2. Bank card receipt</h4>
          <p>
            (1) In order to use the bank card acquiring service, you need to
            provide your bank card number, name, ID card number, and reserved
            mobile phone number. The Company will verify the above information
            with the issuing bank. If you do not provide the above information,
            it may affect the receipt of funds, but it does not affect your use
            of other services provided by the Company;
          </p>
          <p>
            (2) In order to ensure the security of your account and funds, when
            you need to retrieve your password, our company needs to verify your
            identity. For this reason, you need to provide us with some proof
            materials that can identify your identity. You can upload your
            identity certificate according to the prompts on the relevant page.
          </p>
          <h4>3. Risk prevention</h4>
          <p>
            In order to improve the security of your use of our services and
            prevent your funds and personal information from being obtained by
            criminals, our company needs to record the type, method and relevant
            operation information of sokogate services you use, such as:
            equipment model, IP address, equipment software version information,
            equipment identification code, equipment identifier, location,
            network usage habits and other log information related to sokogate
            services. If you do not agree to provide the above information, you
            may not be able to complete the risk control verification.
          </p>
          <h4>
            4. According to relevant laws, regulations and national standards,
            the Company may collect and use your personal information without
            your consent under the following circumstances:
          </h4>
          <p>
            (1) Those directly related to national security and national defense
            security;
          </p>
          <p>
            (2) Those directly related to public safety, public health and major
            public interests;
          </p>
          <p>
            (3) Directly related to criminal investigation, prosecution, trial
            and execution of judgments;
          </p>
          <p>
            (4) In order to protect your or others' life, property and other
            major legitimate rights and interests, but it is difficult to obtain
            your own consent;
          </p>
          <p>
            (5) The personal information collected is disclosed to the public by
            yourself;
          </p>
          <p>
            (6) Collect personal information from legally disclosed information,
            such as legal news reports, government information disclosure and
            other channels;
          </p>
          <p>
            (7) Necessary for signing and performing the contract according to
            your requirements;
          </p>
          <p>
            (8) It is necessary to maintain the safe and stable operation of the
            provided services, such as: finding and handling the failure of
            products or services;
          </p>
          <p>(9) Other circumstances stipulated by laws and regulations.</p>
          <h4>
            5. According to the service needs, the company has the right to
            inquire, print and retain your personal information, including
            registered residence information, industrial and commercial
            information, provident fund information, litigation information,
            execution information, etc. from administrative organs,
            institutions, judicial organs, regulatory departments, China
            Internet Finance Association and other industry self regulatory
            organizations.
          </h4>
          <h3>II、 How the Company stores and protects personal information</h3>
          <p>
            1. The personal information collected and generated by the Company
            in the People's Republic of China will be stored in the People's
            Republic of China. If some products involve cross-border business
            and the Company needs to transmit relevant personal information
            collected in China to overseas institutions, the Company will
            implement the provisions of laws, regulations and relevant
            regulatory authorities. The Company will only save your personal
            information during the period necessary for the purposes described
            in this policy and within the time limit prescribed by laws,
            regulations and regulatory provisions.
          </p>
          <p>
            2. To ensure your information security, our company is committed to
            using various security technologies (TLS, SSL, anonymous processing,
            etc.) and supporting management systems to minimize the risk of your
            information being disclosed, damaged, misused, unauthorized access,
            unauthorized disclosure and change. It has also established relevant
            internal control systems, and has adopted the principle of least
            sufficient authorization for staff who may have access to your
            information; Systematically monitor the staff's behavior in handling
            your information, and constantly promote the staff's training on
            relevant laws and regulations, privacy and security guidelines and
            security awareness.
          </p>
          <p>
            3. Please be sure to keep your identity elements properly ["identity
            elements" refer to information elements used by sokogate to identify
            your identity, such as your sokogate login name, password, SMS
            verification code, phone number, mobile phone number, ID number and
            biometric information (such as fingerprint information, facial
            information)]. When you use sokogate service, our company will
            identify your identity through your identity elements. Once you
            disclose the above information, you may suffer losses and may have
            adverse legal consequences for you. If you find that the identity
            elements may or have been disclosed, please contact us immediately
            so that we can take appropriate measures in time to avoid or reduce
            related losses.
          </p>
          <h3>III、 How the Company uses personal information</h3>
          <h4>
            1. In order to comply with national laws, regulations and regulatory
            requirements, provide you with services and improve service quality,
            or ensure the security of your account and funds, the Company will
            use your information in the following situations:
          </h4>
          <p>
            (1) To achieve the purpose described in "How the Company collects
            personal information" in this policy.
          </p>
          <p>
            (2) Report to relevant departments according to laws and regulations
            or regulatory requirements.
          </p>
          <p>
            (3) Compare the accuracy of the information and verify with the
            third party. For example, verify the identity information you
            submitted to our company with the authentication service agency.
          </p>
          <p>
            (4) In order to make you know your use of our services or understand
            our services, we will send you notices of service status, marketing
            activities and other commercial electronic information.
          </p>
          <p>
            (5) Make comprehensive statistics, analysis or processing of your
            identity data, transaction information, etc., and use, share or
            disclose them for the purpose of sales, incentives or for the
            purpose of enabling you to have a wider social circle, so as to
            provide you with more accurate, personalized, smooth and convenient
            services, or help the Company evaluate, improve or design products,
            services and operational activities.
          </p>
          <p>(6) Prevent or prohibit illegal activities.</p>
          <p>(7) Other uses approved by you.</p>
          <h3>IV、 How the Company provides personal information externally</h3>
          <h4>1. Share</h4>
          <h5>(I) Business sharing</h5>
          <p>
            (1) In order for you to complete the transaction and achieve the
            transaction purpose, our company needs to provide your transaction
            counterpart with the transaction number and relevant payment
            information, and your transaction counterpart can view some of your
            registration information during the payment process or after the
            payment is successful;
          </p>
          <p>
            (2) Our products or services may be provided by or jointly with a
            third party. Therefore, only by sharing your information can we
            provide the products or services you need.
          </p>
          <p>
            (3) With your explicit consent in advance or as agreed in this
            policy, the Company will share your information with a third party
            according to your authorization within the scope of laws and
            regulations and without violating public order and good customs.
          </p>
          <p>
            (4) In order to provide you with relevant products and services,
            this mobile application terminal will use the software tool
            development kit provided by the partner (SDK) and application
            program interface (API), We will provide software tool development
            kit (SDK) and application program interface (API) Get your
            information under strict security monitoring to protect data
            security. Among them, the targeted third-party SDKs accessed by the
            mobile application end are as follows: In order to provide you with
            [location based related] function/ Service, our product integrates
            [Gaode Map Positioning] SDK。 When providing you with the
            [Positioning] function/service, [Godmap SDK] 】You need to collect
            and use your [device information, location information, WLAN And
            other sensor information], please carefully read the Privacy Policy
            of Gaode Map Open Platform.
          </p>
          <h4>(II) Complaint handling</h4>
          <p>
            1. When you complain or are complained about by others, in order to
            protect your and others' legitimate rights and interests, the
            Company may provide your name, valid certificate number, contact
            information, and complaint related content to consumer protection
            departments, regulatory authorities, or other relevant government
            agencies, in order to timely resolve the complaints and disputes,
            except for those expressly prohibited by laws and regulations.
          </p>
          <p>2. Transfer</p>
          <p>
            The Company will not transfer your personal information to any
            company, organization or individual, except for the following
            circumstances:
          </p>
          <p>
            (1) Obtain your explicit consent in advance or meet the conditions
            agreed in this policy;
          </p>
          <p>
            (2) According to laws and regulations or mandatory administrative or
            judicial requirements;
          </p>
          <p>
            (3) In case of transfer of personal information caused by asset
            transfer, acquisition, merger, reorganization or bankruptcy
            liquidation of the Company, the Company will inform you of the
            transfer through push notice, announcement, etc.
          </p>
          <h4>3. Public disclosure</h4>
          <p>
            If public disclosure is really necessary, the Company will inform
            you of the purpose of public disclosure, the type of information
            disclosed and the sensitive information that may be involved.
          </p>
          <h4>4. Entrusted processing</h4>
          <p>
            In order to improve the efficiency of information processing, reduce
            the cost of information processing, or improve the accuracy of
            information processing, the Company may entrust competent affiliates
            or other professional organizations of the Company to process user
            information on behalf of the Company, but the Company will require
            the entrusted company to abide by strict confidentiality obligations
            and take effective confidentiality measures through written
            agreements, on-site audits, etc, It is prohibited to use this
            information for purposes not authorized by you.
          </p>
          <h4>
            5. According to relevant laws, regulations and national standards,
            in the following cases, the Company may legally share, transfer and
            publicly disclose your personal information without your consent.
          </h4>
          <p>
            (1) Those directly related to national security and national defense
            security;
          </p>
          <p>
            (2) Those directly related to public safety, public health and major
            public interests;
          </p>
          <p>
            (3) Directly related to criminal investigation, prosecution, trial
            and execution of judgments;
          </p>
          <p>
            (4) To protect your or other personal life, property and other major
            legitimate rights and interests;
          </p>
          <p>(5) Personal information that you have disclosed to the public;</p>
          <p>
            (6) Personal information collected from legally disclosed
            information, such as legal news reports, government information
            disclosure and other channels.
          </p>
          <p>(7) Other circumstances stipulated by laws and regulations;</p>
          <h3>V、 How do you access and manage your personal information</h3>
          <p>
            During your use of sokogate service, in order to facilitate your
            access and management of your personal information, our company has
            provided you with corresponding operation settings in the product
            design. You can refer to the following guidelines for operation.
          </p>
          <h4>1. Manage your personal information</h4>
          <p>
            (1) You can use sokogate APP logs in to sokogate account, and in
            "My": (1) Check your real name information, transaction records,
            binding bank card information, etc. For the safety of your personal
            information, your ID card number and bank account will be
            desensitized;
          </p>
          <p>
            (2) If your information is found to be incorrect, you can contact
            our customer service hotline to request correction. For the sake of
            security and identification or in accordance with laws, regulations
            and regulatory provisions, you need to pass the verification before
            you can modify your authenticated name or bound mobile phone number;
          </p>
          <p>(3) You can manage the bound bank card.</p>
          <h4>
            2. If you find that the company collects and uses your personal
            information in violation of laws and regulations or the agreement
            with you, you can contact the company's customer service phone and
            ask to delete the corresponding information.
          </h4>
          <h4>
            3. Despite the above agreement, according to relevant laws,
            regulations and national standards, our company may not be able to
            respond to your request under the following circumstances:
          </h4>
          <p>
            (1) Those directly related to national security and national defense
            security;
          </p>
          <p>
            (2) Those directly related to public safety, public health and major
            public interests;
          </p>
          <p>
            (3) Those directly related to criminal investigation, prosecution,
            trial and execution of judgments;
          </p>
          <p>
            (4) There is sufficient evidence to show that you have subjective
            malice or abuse of rights;
          </p>
          <p>
            (5) Responding to your request will cause serious damage to the
            legitimate rights and interests of other individuals and
            organizations;
          </p>
          <p>(6) Involving trade secrets;</p>
          <p>(7) Other circumstances stipulated by laws and regulations;</p>

          <h4>Ⅵ、Statement of Third Party Liability</h4>
          <p>
            Please note that your counterparty, third-party website operators
            you visit, and third-party services accessed through our company
            (such as sokogate Apps provided by a third party in the APP) and the
            third party receiving your personal information from sokogate may
            have their own privacy protection policy; When you view a web page
            created by a third party or use an application developed by a third
            party, these third parties may place their own Cookies or pixel
            tags, these Cookies or pixel labels are not controlled by the
            Company, and their use is not subject to this policy. The Company
            will make commercially reasonable efforts to require these subjects
            to take protective measures against your personal information, but
            the Company cannot guarantee that these subjects will take
            protective measures according to the requirements of the Company,
            and will not assume any responsibility for the acts and consequences
            of these subjects. If you find that there are risks in the web pages
            created by third parties or the applications developed by third
            parties, it is recommended that you terminate relevant operations to
            protect your legitimate rights and interests.
          </p>
          <h4>Ⅶ、Application and update of this policy</h4>
          <p>The company's sokogate services are subject to this policy.</p>
          <p>
            In case of the following major changes, the Company will timely
            update this policy
          </p>
          <p>
            (1) Changes in the basic information of the Company, such as changes
            in owners caused by mergers, acquisitions and restructuring;
          </p>
          <p>
            (2) The scope, purpose and rules of collecting, storing and using
            personal information have changed;
          </p>
          <p>
            (3) Changes in the object, scope and purpose of providing personal
            information externally;
          </p>
          <p>
            (4) The way you access and manage your personal information has
            changed;
          </p>
          <p>
            (5) Changes in data security capabilities and information security
            risks;
          </p>
          <p>
            (6) The channels and mechanisms for users' inquiries and complaints,
            as well as external dispute resolution agencies and contact methods
            have changed;
          </p>
          <p>
            (7) Other changes that may have a significant impact on your
            personal information rights and interests.
          </p>
          <p>
            The Company may revise the content of this policy from time to time.
            If this policy is updated, the Company will notify you by APP push
            notification, email/SMS or announcement on sokogate official
            website. In order that you can receive the notice in time, we
            suggest that you notify our company in time when your contact
            information is updated. If you continue to use sokogate service
            after the update of this policy, it means that you have fully read,
            understood and accepted the updated policy and are willing to be
            bound by the updated policy.
          </p>
        </div>
      </el-dialog>
    </b-card>
  </div>
</template>

<script>
import SuiForm from "@/components/s-ui/form";
import { Certification, GetCheckStatus } from "@/utils/api";
export default {
  components: { SuiForm },
  data() {
    return {
      myVisible: false,
      formList: [
        // 姓名
        {
          type: "input",
          name: "name",
          label: "common.fullname",
          rules: [
            {
              required: true,
              message: "common.fullnamerequired",
              trigger: "blur",
            },
          ],
        },
        // 身份证号
        {
          type: "input",
          name: "idcard",
          label: "common.idCard",
          rules: [
            {
              required: true,
              message: "common.idCardrequired",
              trigger: "blur",
            },
            {
              eval: "validateidCard",
              message: "common.idCardMatch",
              trigger: "blur",
            },
          ],
        },
        // 身份证正面照
        {
          type: "uploadimage",
          name: "idCardFront",
          label: "resident.identityCardFront",
          rules: [
            {
              required: true,
              message: "resident.identityCardFrontReq",
              trigger: "blur",
            },
          ],
        },
        // 身份证反面照
        {
          type: "uploadimage",
          name: "idCardBack",
          label: "resident.identityCardBack",
          rules: [
            {
              required: true,
              message: "resident.identityCardBackReq",
              trigger: "blur",
            },
          ],
        },
      ],
      formData: {
        name: "",
        idcard: "",
        idCardFront: "",
        idCardBack: "",
      },
      formLoading: false,
    };
  },
  computed: {
    locale: function () {
      return this.$i18n.locale;
    },
  },
  created() {
    this.getCheckStatus();
  },
  methods: {
    // 获取校验状态
    getCheckStatus() {
      GetCheckStatus({ tType: 21 }).then((res) => {
        console.log("GetCheckStatus-res", res);
        if (res.data.status === 101) {
          this.$emit("onsuccess");
        }
      });
    },
    // 实名认证协议
    agreement() {
      this.myVisible = true;
    },
    // 关闭实名认证协议
    close() {
      this.myVisible = false;
    },
    // 实名认证
    submit(data) {
      console.log(data);
      this.formLoading = true;
      Certification(data)
        .then((res) => {
          console.log("IdCardCheck-res", res);
          this.formLoading = false;
          if (res.errcode === 0) {
            this.$router.push("/v2/authentication/waitingapproval");
            this.$emit("onsuccess");
            this.$bvToast.toast(this.$t("authentication.success"), {
              toaster: "b-toaster-top-center",
              variant: "success",
              appendToast: false,
              noCloseButton: true,
              autoHideDelay: 3000,
            });
          }
        })
        .catch((err) => {
          console.log("IdCardCheck-err", err);
          this.formLoading = false;
          this.$bvToast.toast(`${err.errmsg}`, {
            toaster: "b-toaster-top-center",
            variant: "danger",
            appendToast: false,
            noCloseButton: true,
            autoHideDelay: 3000,
          });
        });
    },
  },
};
</script>


<style lang="scss">
.real-name-authentication {
  margin-bottom: 20%;
  .argeement {
    .authenticationprotocol {
      float: right;
      font-size: 12px;
      cursor: pointer;
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
        h5 {
          margin-top: 20px;
        }
        p {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>