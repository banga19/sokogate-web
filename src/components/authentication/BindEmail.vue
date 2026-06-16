<template>
  <div>
    <div v-if="bind">
      <bind-email-step :active="0"></bind-email-step>
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
        <!-- Agreement content -->
        <el-dialog
          :visible="myVisible"
          width="36%"
          @close="close"
          class="authentication"
        >
          <div class="userAgreement">
            <h2>Sokogate Customer Privacy Policy</h2>
            <p>
              Guangzhou Haliya Trading Co., Ltd. (hereinafter referred to as
              "the Company") respects and protects your privacy. Strictly abide
              by laws, regulations and regulatory provisions to provide you with
              safer and more reliable services. When you use our services, we
              will collect, store, use and provide your personal information to
              the outside world in accordance with the privacy policy
              (hereinafter referred to as "the policy"). At the same time, the
              Company will explain the following matters to you through this
              policy:
            </p>
            <h3>I,  How the Company collects personal information</h3>
            <p>
              In the process of using sokogate services, we need to collect some
              of your information in the following cases to provide you with
              services, improve our service quality, ensure your account and
              capital security, and comply with national laws, regulations and
              regulatory provisions.
            </p>
            <h4>
              1, Perform anti money laundering obligations and conduct real name
              management in accordance with laws, regulations and regulatory
              provisions
            </h4>
            <p>
              (1) When you register your sokogate account or use sokogate
              services, you need to provide your valid ID information, bank card
              information and contact information. If you do not provide the
              above information, you may not be able to register a sokogate
              account or use the sokogate service. According to relevant laws
              and regulations, you must pass multiple cross validation of basic
              identity information before using some of our services. At the
              same time, in order to verify the accuracy and completeness of the
              information you provide, the Company will check with the state
              organs, financial institutions, enterprises and institutions that
              legally retain your information; If our company needs to collect
              your information from the previous verification agency during the
              verification process, we will require the relevant verification
              agency to explain its personal information source in accordance
              with the provisions of laws and regulations, and confirm the
              legitimacy of its personal information source;
            </p>
            <p>
              (2) The Company shall prompt you to provide color photocopies or
              photos of valid identity documents in due time for the Company to
              check and keep in accordance with the Anti money Laundering and
              Anti terrorist Financing Management Measures of Payment
              Institutions and other laws, regulations and regulatory
              requirements related to anti money laundering; If you do not
              provide the above-mentioned color photocopies or photos, you may
              not be able to use some sokogate services.
            </p>
            <h4>2, Bank card receipt</h4>
            <p>
              (1) In order to use the bank card acquiring service, you need to
              provide your bank card number, name, ID card number, and reserved
              mobile phone number. The Company will verify the above information
              with the issuing bank. If you do not provide the above
              information, it may affect the receipt of funds, but it does not
              affect your use of other services provided by the Company;
            </p>
            <p>
              (2) In order to ensure the security of your account and funds,
              when you need to retrieve your password, our company needs to
              verify your identity. For this reason, you need to provide us with
              some proof materials that can identify your identity. You can
              upload your identity certificate according to the prompts on the
              relevant page.
            </p>
            <h4>3, Risk prevention</h4>
            <p>
              In order to improve the security of your use of our services and
              prevent your funds and personal information from being obtained by
              criminals, our company needs to record the type, method and
              relevant operation information of sokogate services you use, such
              as: equipment model, IP address, equipment software version
              information, equipment identification code, equipment identifier,
              location, network usage habits and other log information related
              to sokogate services. If you do not agree to provide the above
              information, you may not be able to complete the risk control
              verification.
            </p>
            <h4>
              4, According to relevant laws, regulations and national standards,
              the Company may collect and use your personal information without
              your consent under the following circumstances:
            </h4>
            <p>
              (1) Those directly related to national security and national
              defense security;
            </p>
            <p>
              (2) Those directly related to public safety, public health and
              major public interests;
            </p>
            <p>
              (3) Directly related to criminal investigation, prosecution, trial
              and execution of judgments;
            </p>
            <p>
              (4) In order to protect your or others' life, property and other
              major legitimate rights and interests, but it is difficult to
              obtain your own consent;
            </p>
            <p>
              (5) The personal information collected is disclosed to the public
              by yourself;
            </p>
            <p>
              (6) Collect personal information from legally disclosed
              information, such as legal news reports, government information
              disclosure and other channels;
            </p>
            <p>
              (7) Necessary for signing and performing the contract according to
              your requirements;
            </p>
            <p>
              (8) It is necessary to maintain the safe and stable operation of
              the provided services, such as: finding and handling the failure
              of products or services;
            </p>
            <p>(9) Other circumstances stipulated by laws and regulations.</p>
            <h4>
              5, According to the service needs, the company has the right to
              inquire, print and retain your personal information, including
              registered residence information, industrial and commercial
              information, provident fund information, litigation information,
              execution information, etc. from administrative organs,
              institutions, judicial organs, regulatory departments, China
              Internet Finance Association and other industry self regulatory
              organizations.
            </h4>
            <h3>
              II,  How the Company stores and protects personal information
            </h3>
            <p>
              1, The personal information collected and generated by the Company
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
              2, To ensure your information security, our company is committed
              to using various security technologies (TLS, SSL, anonymous
              processing, etc.) and supporting management systems to minimize
              the risk of your information being disclosed, damaged, misused,
              unauthorized access, unauthorized disclosure and change. It has
              also established relevant internal control systems, and has
              adopted the principle of least sufficient authorization for staff
              who may have access to your information; Systematically monitor
              the staff's behavior in handling your information, and constantly
              promote the staff's training on relevant laws and regulations,
              privacy and security guidelines and security awareness.
            </p>
            <p>
              3, Please be sure to keep your identity elements properly
              ["identity elements" refer to information elements used by
              sokogate to identify your identity, such as your sokogate login
              name, password, SMS verification code, phone number, mobile phone
              number, ID number and biometric information (such as fingerprint
              information, facial information)]. When you use sokogate service,
              our company will identify your identity through your identity
              elements. Once you disclose the above information, you may suffer
              losses and may have adverse legal consequences for you. If you
              find that the identity elements may or have been disclosed, please
              contact us immediately so that we can take appropriate measures in
              time to avoid or reduce related losses.
            </p>
            <h3>III,  How the Company uses personal information</h3>
            <h4>
              1, In order to comply with national laws, regulations and
              regulatory requirements, provide you with services and improve
              service quality, or ensure the security of your account and funds,
              the Company will use your information in the following situations:
            </h4>
            <p>
              (1) To achieve the purpose described in "How the Company collects
              personal information" in this policy.
            </p>
            <p>
              (2) Report to relevant departments according to laws and
              regulations or regulatory requirements.
            </p>
            <p>
              (3) Compare the accuracy of the information and verify with the
              third party. For example, verify the identity information you
              submitted to our company with the authentication service agency.
            </p>
            <p>
              (4) In order to make you know your use of our services or
              understand our services, we will send you notices of service
              status, marketing activities and other commercial electronic
              information.
            </p>
            <p>
              (5) Make comprehensive statistics, analysis or processing of your
              identity data, transaction information, etc., and use, share or
              disclose them for the purpose of sales, incentives or for the
              purpose of enabling you to have a wider social circle, so as to
              provide you with more accurate, personalized, smooth and
              convenient services, or help the Company evaluate, improve or
              design products, services and operational activities.
            </p>
            <p>(6) Prevent or prohibit illegal activities.</p>
            <p>(7) Other uses approved by you.</p>
            <h3>
              IV,  How the Company provides personal information externally
            </h3>
            <h4>1, Share</h4>
            <h5>(I) Business sharing</h5>
            <p>
              (1) In order for you to complete the transaction and achieve the
              transaction purpose, our company needs to provide your transaction
              counterpart with the transaction number and relevant payment
              information, and your transaction counterpart can view some of
              your registration information during the payment process or after
              the payment is successful;
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
              security. Among them, the targeted third-party SDKs accessed by
              the mobile application end are as follows: In order to provide you
              with [location based related] function/ Service, our product
              integrates [Gaode Map Positioning] SDK. When providing you with
              the [Positioning] function/service, [Godmap SDK] 】You need to
              collect and use your [device information, location information,
              WLAN And other sensor information], please carefully read the
              Privacy Policy of Gaode Map Open Platform.
            </p>
            <h4>(II) Complaint handling</h4>
            <p>
              1, When you complain or are complained about by others, in order
              to protect your and others' legitimate rights and interests, the
              Company may provide your name, valid certificate number, contact
              information, and complaint related content to consumer protection
              departments, regulatory authorities, or other relevant government
              agencies, in order to timely resolve the complaints and disputes,
              except for those expressly prohibited by laws and regulations.
            </p>
            <p>2, Transfer</p>
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
              (2) According to laws and regulations or mandatory administrative
              or judicial requirements;
            </p>
            <p>
              (3) In case of transfer of personal information caused by asset
              transfer, acquisition, merger, reorganization or bankruptcy
              liquidation of the Company, the Company will inform you of the
              transfer through push notice, announcement, etc.
            </p>
            <h4>3, Public disclosure</h4>
            <p>
              If public disclosure is really necessary, the Company will inform
              you of the purpose of public disclosure, the type of information
              disclosed and the sensitive information that may be involved.
            </p>
            <h4>4, Entrusted processing</h4>
            <p>
              In order to improve the efficiency of information processing,
              reduce the cost of information processing, or improve the accuracy
              of information processing, the Company may entrust competent
              affiliates or other professional organizations of the Company to
              process user information on behalf of the Company, but the Company
              will require the entrusted company to abide by strict
              confidentiality obligations and take effective confidentiality
              measures through written agreements, on-site audits, etc, It is
              prohibited to use this information for purposes not authorized by
              you.
            </p>
            <h4>
              5, According to relevant laws, regulations and national standards,
              in the following cases, the Company may legally share, transfer
              and publicly disclose your personal information without your
              consent.
            </h4>
            <p>
              (1) Those directly related to national security and national
              defense security;
            </p>
            <p>
              (2) Those directly related to public safety, public health and
              major public interests;
            </p>
            <p>
              (3) Directly related to criminal investigation, prosecution, trial
              and execution of judgments;
            </p>
            <p>
              (4) To protect your or other personal life, property and other
              major legitimate rights and interests;
            </p>
            <p>
              (5) Personal information that you have disclosed to the public;
            </p>
            <p>
              (6) Personal information collected from legally disclosed
              information, such as legal news reports, government information
              disclosure and other channels.
            </p>
            <p>(7) Other circumstances stipulated by laws and regulations;</p>
            <h3>V,  How do you access and manage your personal information</h3>
            <p>
              During your use of sokogate service, in order to facilitate your
              access and management of your personal information, our company
              has provided you with corresponding operation settings in the
              product design. You can refer to the following guidelines for
              operation.
            </p>
            <h4>1, Manage your personal information</h4>
            <p>
              (1) You can use sokogate APP logs in to sokogate account, and in
              "My": (1) Check your real name information, transaction records,
              binding bank card information, etc. For the safety of your
              personal information, your ID card number and bank account will be
              desensitized;
            </p>
            <p>
              (2) If your information is found to be incorrect, you can contact
              our customer service hotline to request correction. For the sake
              of security and identification or in accordance with laws,
              regulations and regulatory provisions, you need to pass the
              verification before you can modify your authenticated name or
              bound mobile phone number;
            </p>
            <p>(3) You can manage the bound bank card.</p>
            <h4>
              2, If you find that the company collects and uses your personal
              information in violation of laws and regulations or the agreement
              with you, you can contact the company's customer service phone and
              ask to delete the corresponding information.
            </h4>
            <h4>
              3, Despite the above agreement, according to relevant laws,
              regulations and national standards, our company may not be able to
              respond to your request under the following circumstances:
            </h4>
            <p>
              (1) Those directly related to national security and national
              defense security;
            </p>
            <p>
              (2) Those directly related to public safety, public health and
              major public interests;
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

            <h4>Ⅵ, Statement of Third Party Liability</h4>
            <p>
              Please note that your counterparty, third-party website operators
              you visit, and third-party services accessed through our company
              (such as sokogate Apps provided by a third party in the APP) and
              the third party receiving your personal information from sokogate
              may have their own privacy protection policy; When you view a web
              page created by a third party or use an application developed by a
              third party, these third parties may place their own Cookies or
              pixel tags, these Cookies or pixel labels are not controlled by
              the Company, and their use is not subject to this policy. The
              Company will make commercially reasonable efforts to require these
              subjects to take protective measures against your personal
              information, but the Company cannot guarantee that these subjects
              will take protective measures according to the requirements of the
              Company, and will not assume any responsibility for the acts and
              consequences of these subjects. If you find that there are risks
              in the web pages created by third parties or the applications
              developed by third parties, it is recommended that you terminate
              relevant operations to protect your legitimate rights and
              interests.
            </p>
            <h4>Ⅶ, Application and update of this policy</h4>
            <p>The company's sokogate services are subject to this policy.</p>
            <p>
              In case of the following major changes, the Company will timely
              update this policy
            </p>
            <p>
              (1) Changes in the basic information of the Company, such as
              changes in owners caused by mergers, acquisitions and
              restructuring;
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
              (6) The channels and mechanisms for users' inquiries and
              complaints, as well as external dispute resolution agencies and
              contact methods have changed;
            </p>
            <p>
              (7) Other changes that may have a significant impact on your
              personal information rights and interests.
            </p>
            <p>
              The Company may revise the content of this policy from time to
              time. If this policy is updated, the Company will notify you by
              APP push notification, email/SMS or announcement on sokogate
              official website. In order that you can receive the notice in
              time, we suggest that you notify our company in time when your
              contact information is updated. If you continue to use sokogate
              service after the update of this policy, it means that you have
              fully read, understood and accepted the updated policy and are
              willing to be bound by the updated policy.
            </p>
          </div>
        </el-dialog>
      </b-card>
    </div>
    <div class="audit-completed" v-else>
      <bind-email-step :active="3"></bind-email-step>
      <el-row>
        <el-col>
          <el-result
            icon="success"
            :title="$t('common.auditsucceeded')"
            :subTitle="$t('bindemail.success')"
            v-if="show"
          >
          </el-result>
          <el-result
            icon="error"
            :title="$t('common.auditfailed')"
            :subTitle="$t('common.authenticationfailed')"
            v-else
          >
          </el-result>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SuiForm from "@/components/s-ui/form";
import BindEmailStep from "@/components/authentication/BindEmailStep";
import { UpdateUserPhoneOrEmail } from "@/utils/api";
export default {
  components: { SuiForm, BindEmailStep },
  data() {
    return {
      bind: true,
      myVisible: false,
      show: true,
      formList: [
        // Email
        {
          type: "mail",
          name: "cond",
          label: "common.email",
          rules: [
            {
              required: true,
              message: "common.emailrequired",
              trigger: "blur",
            },
            {
              type: "email",
              message: "common.emailFormatError",
              trigger: "blur",
            },
          ],
        },
        // Verification code
        {
          type: "bindemail",
          name: "code",
          label: "common.verifyCode",
          rules: [
            {
              required: true,
              message: "common.verificationCodeRequired",
              trigger: "blur",
            },
          ],
        },
      ],
      formData: {
        cond: "", //Email
        code: "", //Verification code
        tType: 1,
      },
      formLoading: false,
    };
  },
  computed: {
    locale: function () {
      return this.$i18n.locale;
    },
  },
  methods: {
    // Real-name authentication agreement
    agreement() {
      this.myVisible = true;
    },
    // 关闭Real-name authentication agreement
    close() {
      this.myVisible = false;
    },
    // Real-name authentication
    submit(data) {
      console.log("submit-email", data);
      this.formLoading = true;
      UpdateUserPhoneOrEmail(data)
        .then((res) => {
          console.log("UpdateUserPhoneOrEmail-res", res);
          this.formLoading = false;
          this.bind = false;
          if (res.errcode === 0) {
            this.$bvToast.toast(this.$t("bindemail.success"), {
              toaster: "b-toaster-top-center",
              variant: "success",
              appendToast: false,
              noCloseButton: true,
              autoHideDelay: 3000,
            });
            this.$emit("onsuccess");
          }
        })
        .catch((err) => {
          console.log("UpdateUserPhoneOrEmail-err", err);
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