<template>
  <b-container class="page-register">
    {{ $store.state.phoneShow }}
    <div v-title :data-title="$t('register.title')">
      <b-row align-v="end" class="text-center head">
        <b-col cols="12" md="auto" class="centre logo-box">
          <img
            class="logo"
            src="HTTPS://oss.sokogate.com/image/af82b848785b079390200737ab15cdff.png"
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
    <!-- Agreement content -->
    <el-dialog
      :visible="myVisible"
      width="36%"
      @close="close"
      class="authentication"
    >
      <div class="userAgreement">
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
        <h3>1, Introduction</h3>
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
        <h4>1,1, Sokogate Purpose</h4>
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
        <h4>1.2, User Account on Sokogate</h4>
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
        <h4>1,3, Legal Agreement</h4>
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
        <h3>2, Your Responsibilities</h3>
        <ul>
          2,1, You Warrant, Undertake, and Agree that:
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
          2,2, You Warrant and Obligate that You Will Not Sell any of The
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
          1, You are not allowedtosellendangered species, including animals
          orplants that are threatened with extinction, according to the
          CITES-list. Those species are prohibited by the commercial
          international trade.http://www.cites.org/eng/disc/what.shtml
        </p>
        <p>
          2, You will not trade in specimens of speciesthat are not threatened
          with extinction but may become so, unless present of the appropriate
          permits or certificates.
        </p>
        <p>
          3, You will not sellother specimens of species thatlisted in this
          Appendix, such as Pelts, skins, internal organs, teeth, claws, shells,
          bones and other parts of endangered species or protected species, such
          as leopards, tigers, pandas, mountain zebras, etc.
        </p>
        <p>
          4, You can only trade those species under exceptional circumstancesfor
          scientific researchby the granting of both an export permit (or
          re-export certificate) and an import permit.
        </p>
        <p>
          5, Veterinary Products and Pet Medicines are not allowed for selling,
          listing, sharing on sokogate website. Thus, you are not allowed to
          sell heart worm medicines such as Sentinel, Revolution, Heart-Gard,or
          Interceptor as animals need to obtain a prescription.
        </p>
        <p>
          6, You can only sell on sokogate.com flea control products without a
          prescription, including Program, Advantage,or Top Spot.
        </p>
        <h4>B) HAZARDOUSMATERIALS, WEAPONS, FIREARMS, EXPLOSIVES</h4>
        <p>
          1,You are not allowed to sell, list, or share hazardous materialssuch
          as firearms, explosives,ammunition,military ordinance, assault
          weapons, radioactive materials, flammable gases, liquids and solids,
          or toxicsubstances on Sokogate Website.
        </p>
        <p>
          2, You obligated to not sell BB guns, air guns, black powder guns or
          muzzle-loader guns and stun guns on Sokogate Website.
        </p>
        <p>
          3, You don’t have the right to sell, list, or share (WMD) weapons of
          Mass Destruction andany instruction, processing, or assets of
          producing any kind of the weaponsor hazardousmaterials.
        </p>
        <p>
          4, You are only allowed to replica, 'look-alike', imitation firearms
          under certain circumstancesonly upon the expressed approval of
          Alibaba.com. These replica and imitation itemsmust have clear
          markingspermanently affixed to the extent required by the laws of
          applicable jurisdiction.
        </p>
        <p>
          5, The international law strictly prohibits selling, listing, or
          sharing of firearmsammunition, or any related materials. And the
          government authorities will be notified with any violation of this
          policyby Alibaba.com.
        </p>
        <h4>C) PORNOGRAPHIC MATERIALS</h4>
        <p>
          1, You have not to list, share, or sell pornographic materials on
          Sokogate Website. As SOKOGATE.com follows guidelines accepted in the
          PRC. Thus, these pornographic materialsare difficult to define because
          it’sviolated laws in many countries.
        </p>
        <p>
          2, Sokogate.com prevents to sell or share items depicting
          bestialityrape sex, incest, or sex with graphic violence or
          degradation.
        </p>
        <h4>D) POLICE-RELATED ITEMS</h4>
        <p>
          1,You agreed not to listor sell police-related items on sokogate.com,
          including law enforcement badges, official law enforcement equipment
          from any public entity, or badges issued by the government of any
          country.
        </p>
        <p>
          2, You can only list, share, sell police-related items if the police
          badges are clearly not official such as plastic, cartoon, or mini
          badges.
        </p>
        <p>
          3, You can only sell authorized general souvenir itemssuch as hats,
          mugs, pins, pens, buttons, cuff links, T-shirts, money clips that do
          not resemble badges.
        </p>
        <p>
          4, Historical badgesat least 75 years oldissued by a now-defunct
          organization are allowed to sell on Sokogate.com.
        </p>
        <p>
          5, Sokogate.com allow you to sell police uniforms that obsolete and in
          no way resemble current issue police uniforms.
        </p>
        <h4>E) ARTIFACTS ITEMS</h4>
        <p>
          1, You have not to list, share, or sell pornographic materials on
          Sokogate Website. As SOKOGATE.com follows guidelines accepted in the
          PRC. Thus, these pornographic materialsare difficult to define because
          it’sviolated laws in many countries.
        </p>
        <p>
          2,Don’tlist or sell gold, silver and other precious metal. (Jewelry
          not included)
        </p>
        <h4>F) HUMAN PARTS</h4>
        <p>
          1, Sokogate.com prevents to sell, list, share artifacts, cultural
          relics, historical grave markers, or related items are protected under
          PRC law.
        </p>
        <p>
          2, Sokogate.com prevents to sell or share items depicting
          bestialityrape sex, incest, or sex with graphic violence or
          degradation.
        </p>

        <h4>G) ACADEMIC SOFTWARE</h4>
        <p>
          1, Sokogate will not allow you to list any academic software unless
          you areauthorized on the website.
        </p>
        <p>
          2, You have to declare in the description of the products or items
          that you represent an authorized educational reseller or an
          educational institution on sokogate website.
        </p>
        <p>
          3, Sokogate.com has the right to delete the academic items that
          violatingsokogate’s academic software policy before publication.
        </p>
        <p>
          4, Sokogate.com prohibits to list, share, or sell OEM or Bundled
          copies of software on the website unless you are selling it with
          computer hardware.
        </p>
        <p>
          5, Sokogate website supports the Original Equipment Manufacturer
          (OEM)or bundled software that is software that is obtained as part of
          the purchase of a new computer. Thus, you are not allowed to resell
          the software without the computer,according to OEM software licenses.
        </p>

        <h4>H) TRANSIT-RELATED PRODUCTS</h4>
        <p>
          1, You are not allowed to sell, list, or share uniforms, baggage,
          manuals or other materials that related to airlines, public
          transportation industries, flight attendant's, mass transit train,
          subway related, or airport service personnel.
        </p>
        <p>
          2, You can only sell old, vintage clothing related to the above
          industries with items description that declare the items is obsolete
          and at least 10 years old.
        </p>
        <h4>I) TICKETS, INVOICES, AND LOTTERY</h4>
        <p>
          1, You are not allowed to list any item until you have reviewed a
          relevant contracts or agreements, and are confident you can legally
          sell it on Sokogate.
        </p>
        <p>
          2, You have to read the Airline tickets terms that may limit your
          ability to sell that item on sokogate.com.Also, you have to make sure
          that you didn’t signed a separate contract restricting your ability to
          market the product before posting it on Sokogate Website.
        </p>
        <p>
          3, You will not be able to sell any form of invoices on Sokogate.com
          such as value-added invoice.
        </p>
        <p>
          4, You agreed that you will not sell lottery tickets on sokogate
          website.
        </p>
        <p>
          5, You have the right to resell entertainment events tickets,
          including sporting events or concerts on Sokogate Website. However,
          you agreed that you’re the only one who responsible for not violating
          anyapplicable law.
        </p>

        <h4>J) CURRENCY, SECURITIES, AND CREDIT CARDS</h4>
        <p>
          1, You understand that sokogate.com prohibits the sell of counterfeit
          currency and stamps, including coins, bank notes, bonds, money, as
          well as the producing machine for those illegal securities.
        </p>
        <p>
          2, You agreed to not sell or list on sokogate.com financial services,
          including property inherited, money transfer, bank guarantee,gold,
          Letter of Credit, fund, loan, fundraising, or stocks.
        </p>
        <p>
          3, You are not allowed to sell or list stocks, bonds,or investment
          interests in any entity or property, according to the law that
          regulates the selling of stocks or other security interests.
        </p>
        <p>
          4, You can only sell the replica securities, including coins, bank
          notes, and money, however, you have to declare that it’s replica in a
          word file and the description of the items.
        </p>
        <p>
          5, You are only allowed to sell, post, list the expired credit cards
          for at least 10 years on Sokogate website. Considering the recently
          expired credit or debit cards, you will not be able to sell or list
          any of them on sokogate.com to avoid privacy concerns.
        </p>
        <p>
          6, You also can sell on sokogate.com business-related items, which are
          notsecurities, such as the assets of a busines, inventory, lease, or
          goods, as well as Turn-key businesses, including vending machines,
          windshield repair kits, or breathalyzer machines.
        </p>
        <p>
          7, You are allowed to sell, list, or share business-related tools,
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
          1, You will not be able to sell counterfeit designer garment,watches,
          handbags, sunglasses, oraccessories on sokogate.com In order to
          preserve the name and reputation of the original company that sells.
        </p>
        <p>
          2, You understand that Sokogate website has the right to suspension of
          your membership in case you sell counterfeit items, products, goods.
        </p>
        <p>
          3, EX. You are not allowed to sell counterfeit Rolex Watches, if
          you’re not the original, authorized source of the products.
        </p>
        <h4>L) DRUGS PARAPHERNALIA</h4>
        <p>
          1, You understand that drugs and drug paraphernalia such as narcotics
          or steroids are not allowed to be sell on Sokogate website.
        </p>
        <p>
          2, You agreed that the controlled substance will not be listed or sell
          on Sokogate website.
        </p>
        <p>
          3, You are also not allowed to sell, list or share water pipes,
          carburetor pipes, chamber pipes, ice pipes, bongs, which are used in
          illicit substances. However, you can only sell the products that used
          with tobacco such as briar, clay, and corncobpipes.
        </p>
        <h4>M) ETHNICALLY OR RACIALLY OFFENSIVE MATERIAL</h4>
        <p>
          1, You are agreed that the ethnically offensive materials are not
          allowed to be listed on sokogate.com and if any Sokogate Website has
          the right to ban your membership.
        </p>
        <p>
          2, Sokogate.com has the right to prohibitthe Nazism promoting
          materials to be listed or shared on the site.
        </p>
        <p>
          Here at Sokogate Website, we encourage peace and equality, among all
          our members to create proper interactions between members and users.
        </p>
        <h4>N) NAMES, LICENSES, PASSPORT</h4>
        <p>
          1, You agreed to not sell, list, or share official government
          identification documents, includingbirth certificates, driver’s
          licenses, visas, passports, or fake identifications cards on Sokogate
          Website.
        </p>
        <p>
          2, You also can’t sell on sokogate.com image, likeness, name, or
          signature of another personunless the products were made or authorized
          by that person.
        </p>
        <p>
          3, Sokogate.com has the right to delete the violating posts such as
          faces, names, licenses, or any items related.
        </p>
        <h4>O) STOLEN ITEMS</h4>
        <p>
          1, Sokogate.com prohibitsviolating international law on the website,
          which is why you are not allowed to sell, list, or share a stolen
          property or any stolen items on sokogate website.
        </p>
        <p>
          2, You agreed that you will not sell stolen property, including items
          taken from private individuals or property taken without authorization
          from companies or governments.
        </p>
        <p>
          3, Users who are responsible for selling, listing, or sharing the
          stolen property that listed on sokogate.com will be subject to
          prosecution, according to sokogate’s privacy rules.
        </p>
        <p>
          4, Sokogate.com supports law enforcement efforts to recover stolen
          property. Also, our attorneys will providerecords about pending and
          past postings with anofficial request from law enforcement officials.
        </p>
        <h4>P) PRESCRIPTION DRUGS</h4>
        <p>
          1, Sokogate.com prohibits to sell, list, or share any controlled drug
          or item that requires a prescription from a licensedpractitioner
        </p>
        <p>
          2, You agreed to not sell unauthorizedmedical devices on sokogate.com
          such as ear candles.
        </p>
        <p>
          If you are uncertain to the permissibility of your items, kindly
          contact staff@sokogate.com prior posting.
        </p>
        <h4>Q) JOB POSTING OR AD POSTING</h4>
        <p>
          1, You will not list or share job posting Ads, which are can be used
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
          1, You are not allowed to sell related-items to descramble or
          facilitate the access to cable or satellite television programming
          without authorization.
        </p>
        <p>
          2, Sokogate website forbids to list, sell, or share information about
          how to descramble or gain access to cable or satellite television
          programming without authorization or payment.
        </p>
        <p>
          3, You will not be allowed to list, share, or sell Smart Card
          Programmers and Unlookers, Programmed Smart Cards, Blocking Devices,
          or Hardware or SoftwareDSS Emulators.
        </p>
        <p>
          4, Sokogate.com strictly prohibits to sell, list, share refurbished
          mobile phones, laptops and computers on the website. Sokogate.com
          policy is to prohibit any 'encouragement' of this type of activity
        </p>
        <p>
          5, You agree to not list, share, or sellspy equipment, such as
          wiretappingequipment.
        </p>
        <p>
          6, Thus, according to the sokogate.com’s privacy, you are strictly not
          allowed to sell, list, or share mailing list that contain names,
          addresses, phone numbers, fax, and other personal identifying
          information or posting present personal information of third parties.
        </p>
        <p>
          7, Also, you are not allowed to list or sellany software designed to
          send unsolicited commercial email or spam from sokogate website.
        </p>
        <h4>S) TEXTILE QUOTA, USED ITEMS</h4>
        <p>
          1, Sokogate.com strictly does not permit selling, listing, or sharing
          of textile quota on the website.
        </p>
        <p>
          2, Used items such as clothes, cosmetics or more can be listed,
          shared, or sold on sokogate.com unless it has been thoroughly cleaned,
          according to the manufacturer's instructions.
        </p>
        <p>
          3, However, you can’t sell, list, or share used underwear such as
          boxer shorts, panties, briefs, and athletic supporters.
        </p>
        <h4>T) CRUDE</h4>
        <p>
          1, If you’re located in China, then you agreed that you will not sell,
          list, share, or purchase crude oil on sokogate website.
        </p>
        <h5>
          You are welcome to contact staff@sokogate.com in case you’re worried
          about specific item you want to sell, list, or share on Sokogate
          Website,regarding toappropriateness or legality.
        </h5>

        <h3>3, Privacy</h3>
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

        <h3>4, Site Fees</h3>
        <p>
          Using certain Services on sokogate.com may be subject to payment of
          particular fees. Sokogate will prigvide notice of such Fees then in
          effect in relation to such Paid Services.If you wish to receive or use
          such Paid Services, you are required to pay all applicable Fees in
          advance.
        </p>
        <h3>5, Cancellation</h3>
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
      // Agreement content
      myVisible: false,
      // agree-to-terms checkbox
      radioCode: false,
      // form fields
      formList: [
        // individual/company registration
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
        // name
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
        // Phone number
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
        // Email
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
        // Verification code
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
        // password
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
        // confirm password
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
        // 公司address
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
        // ID card front photo
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
        // ID card back photo
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
    // 去login
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
          // 为Phone number
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
      //   // 个人注册Success
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
  background-image: url("HTTPS://oss.sokogate.com/image/49404fd02abd55e23798340c3b69f294,png");
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