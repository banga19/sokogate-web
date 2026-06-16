<template>
  <b-container class="merchant-settlement-page">
    <div v-title :data-title="$t('menuitems.layout.privacypolicy')">
      <!-- <Breadcrumb :items="items" /> -->
      <b-row v-if="locale == 'cn'">
        <b-col>
          <h1>Privacy Policy</h1>
          <div>Last Updated: <strong>2023/10/14</strong></div>
          <div>Effective Date: <strong>2023/10/14</strong></div>
          <h2>Introduction</h2>
          <p>
            <i>sokogate</i> is a product provided by
            <i>Guangzhou Haliya Trading Co., Ltd.</i> (hereinafter referred to as "we"). When you use our services, we may collect and use your relevant information. We hope to inform you through this Privacy Policy on how we collect, use, store, and share this information when you use our services, as well as the access, update, control, and protection methods we provide for this information.
            This Privacy Policy is closely related to the
            <i>sokogate</i>
            services you use. Please read it carefully and make your own decisions as guided. Technical terms used in this Privacy Policy are described as simply as possible, with links to further explanations for your understanding.
          </p>
          <p>
            <strong
              >By using or continuing to use our services, you agree to our collection, use, storage, and sharing of your relevant information in accordance with this Privacy Policy.</strong
            >
          </p>
          <p>
            For any questions regarding this Privacy Policy or related matters, please contact us via
            <strong>sokogatesokogate@gmail.com</strong>.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When we or our third-party partners provide services, we may collect, store, and use the following information related to you. If you do not provide the relevant information, you may not be able to register as a user of our services or enjoy certain services we provide, or you may not be able to achieve the intended effects of the relevant services.
          </p>

          <ul>
            <li>
              <strong>Personal Information</strong
              >: relevant personal information you provide to us when registering an account or using our services, such as phone number, email, etc.
            </li>
            <li>
              <strong>Location Information</strong
              >: information about your location collected when you enable device location and use our location-based services, including:
              <ul>
                <li>
                  When you use our services on a mobile device with location capabilities, your geographic location information collected via GPS, Wi-Fi, and other methods;
                </li>
                <li>You can stop the collection of your geographic location information by turning off the location feature.</li>
              </ul>
            </li>
            <li>
              <strong>Log Information</strong
              >: information that the system may collect via cookies, identifiers, and related technologies when you use our services, including your <strong>device information</strong>, <strong>browsing information</strong>, and <strong>click information</strong>. This information is stored as log data to provide a personalized user experience and ensure service security. You can refuse or manage the use of cookies, identifiers, or related technologies via your browser settings.
            </li>
          </ul>

          <h2>2. Information Storage</h2>
          <strong>2.1 Storage Methods and Duration</strong>
          <ul>
            <li>
              We will store your information securely, including local storage (e.g., data caching via the app), databases, and server logs.
            </li>
            <li>
              In general, we will only store your personal information for as long as is necessary to achieve the service purpose or under the conditions stipulated by laws and regulations.
            </li>
          </ul>

          <strong>2.2 Geographic Location of Data Storage</strong>
          <ul>
            <li>
              We will store user personal information collected within China within Chinese territory, in accordance with legal and regulatory requirements.
            </li>
            <li>
              Currently, we do not transfer or store your personal information cross-border. If cross-border transfer or storage is required in the future, we will inform you of the purpose of information export, recipient, security guarantees, and security risks, and obtain your consent.
            </li>
          </ul>

          <strong>2.3 Notification When Products or Services Cease Operation</strong>
          <ul>
            <li>
              When our products or services cease operation, we will notify you via push notifications, announcements, etc., and delete your personal information or anonymize it within a reasonable period, unless otherwise provided by laws and regulations.
            </li>
          </ul>

          <h2>3. Information Security</h2>
          <p>
            We use various security technologies and procedures to prevent information loss, misuse, unauthorized access, or disclosure. For example, in certain services, we will use encryption technologies (e.g., SSL) to protect the personal information you provide. However, please understand that due to technical limitations and various malicious means that may exist, in the internet industry, even with all efforts to strengthen security measures, it is impossible to always guarantee 100% information security. You should understand that the system and communication network you use to access our services may encounter problems beyond our control.
          </p>

          <h2>4. How We Use Information</h2>
          <p>We may use the information collected during the provision of services to you for the following purposes:</p>
          <ul>
            <li>Provide services to you;</li>
            <li>
              When providing services, used for identity verification, customer service, security, fraud monitoring, archiving, and backup purposes, ensuring the security of the products and services we provide to you;
            </li>
            <li>Help us design new services and improve our existing services;</li>
            <li>
              Better understand how you access and use our services, thereby responding to your personalized needs, such as language settings, location settings, personalized help services and guidance, or other responses to you and other users;
            </li>
            <li>Provide you with more relevant ads instead of general ads;</li>
            <li>
              Evaluate the effectiveness of advertising and other promotional activities in our services, and improve them;
            </li>
            <li>Software certification or managing software upgrades;</li>
            <li>Allow you to participate in surveys about our products and services.</li>
          </ul>

          <h2>5. Information Sharing</h2>
          <p>
            Currently, we will not proactively share or transfer your personal information to third parties. If there are other circumstances where your personal information is shared or transferred, or you need us to share or transfer your personal information to third parties, we will obtain your explicit consent, either directly or through confirmation by the third party.
          </p>
          <p>
            For purposes of advertising delivery, evaluation, optimization of advertising effectiveness, etc., we need to share some of your data with third-party partners such as advertisers and their agents, and require them to strictly comply with our data privacy protection measures and requirements, including but not limited to processing in accordance with data protection agreements, commitment letters, and related data processing policies, avoiding personal identity identification, and protecting privacy security.
          </p>
          <p>
            We will not share information with partners that can be used to identify your personal identity (such as your name or email address) unless you explicitly authorize it.
          </p>
          <p>
            We will not publicly disclose the collected personal information. If disclosure is necessary, we will inform you of the purpose of the disclosure, the type of information disclosed, and the sensitive information that may be involved, and obtain your explicit consent.
          </p>
          <p>
            As our business continues to develop, we may engage in transactions such as mergers, acquisitions, and asset transfers. We will inform you of the relevant circumstances and continue to protect your personal information in accordance with laws and regulations and at a standard no lower than that required by this Privacy Policy, or require the new controller to continue protecting your personal information.
          </p>
          <p>
            In addition, according to relevant laws, regulations, and national standards, in the following circumstances, we may share, transfer, or publicly disclose personal information without your prior authorization and consent:
          </p>
          <ul>
            <li>Related to national security and defense security;</li>
            <li>Related to public security, public health, and major public interests;</li>
            <li>Related to criminal investigation, prosecution, trial, and execution of judgments;</li>
            <li>
              Necessary to protect the life or property of the personal information subject or other individuals, but it is difficult to obtain the consent of the individual;
            </li>
            <li>The personal information subject publicly discloses personal information on their own;</li>
            <li>
              Personal information collected from lawfully publicly disclosed information, such as from legitimate news reports, government information disclosure, and other channels.
            </li>
          </ul>

          <h2>6. Your Rights</h2>
          <p>
            During your use of our services, we may provide corresponding operation settings depending on the specific product, so that you can query, delete, correct, or recall your relevant personal information. You can refer to the corresponding specific guidelines to operate. In addition, we have also established complaint and reporting channels, and your opinions will be dealt with promptly. If you cannot exercise your rights as a personal information subject through the above channels and methods, you can submit your request through the contact methods provided in this Privacy Policy, and we will provide feedback in accordance with laws and regulations.
          </p>
          <p>
            When you decide to no longer use our products or services, you can request to cancel your account. After cancellation, unless otherwise provided by laws and regulations, we will delete or anonymize your personal information.
          </p>

          <h2>7. Modifications</h2>
          <p>
            We may revise the terms of this Privacy Policy from time to time. When changes occur, we will remind you of the new Privacy Policy during version updates and inform you of the effective date. Please carefully read the modified Privacy Policy content. <strong
              >If you continue to use our services, it means you agree to our processing of your personal information in accordance with the updated Privacy Policy.</strong
            >
          </p>

          <h2>8. Protection of Minors</h2>
          <p>
            We encourage parents or guardians to guide minors under the age of 18 to use our services. We recommend that minors encourage their parents or guardians to read this Privacy Policy, and recommend that minors seek the consent and guidance of their parents or guardians before submitting personal information.
            © 2020-2026 ultimo trading co limited or its affiliates.</p>
            
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 16px;">HTTPS://ultimotradingltd.co.ke/</a>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'en'">
        <b-col style="margin-top:30px">
          <h1>Privacy & Policy</h1>
          <div>Effective Date: September 25,2023</div>
          <div>Introduction and Overview</div>
          <p>
            <i
              >This Privacy Policy ("Policy" ) explains how your personal
              information is collected, used, shared, and processed when you
              access this website, at your location.SOKOGATE.com (the "Site" ),
              our mobile application (the"App" ), or use other services provided
              by Ultimo trading co., limited , including any written,
              electronic, and oral communications, online or offline, and
              purchases performed (collectively, the "Services" ) as well as the
              rights and choices you have associated with that information. The
              Policy also describes your rights regarding your personal data and
              explains how you can contact us to learn more about our data
              practices or to exercise your rights.</i
            >
            <i
              >The Site and the App are provided by Ultimo trading co., limited
              is responsible for collecting, processing, and protecting your
              personal data. In this Policy, the
            </i>
          </p>
          <p>
            <strong
              >terms“sokogate,”“Company,”“we,"“us,” and “our”refer to Ultimo
              trading co., limited. Please read our Terms and Conditions and
              this Policy before accessing or using our Services. If you cannot
              agree with this Policy or the Terms and Conditions, please do not
              access or use our Services.</strong
            >
          </p>
          <p>
            <b>Policy Modification:</b
            ><i
              >“SOKOGATE” may change this Policy from time to time, to reflect
              how we process your data, and if we make changes, we will revise
              the effective date or last modified date at the top of this
              Policy. If we make changes that materially affect your privacy
              rights, we will attempt to provide advanced notice (including via
              real- or near real-time disclosures) or otherwise via the Site, or
              by some other means of contact so that you have a reasonable
              opportunity to review the changes before you continue to use the
              Site or the Services.</i
            >.
          </p>

          <b
            >If you do not agree with the modified Policy, please stop using the
            Site, or the Services.</b
          >
          <h4>CONTENTS</h4>
          <h4>1, How We Collect and Use Your Personal Data</h4>
          <div>
            We respect the privacy of the visitors to our digital properties and
            the users of our products and Services, and we are committed to
            protecting it through our compliance with this Policy. We collect
            personal information when you use our Services.
          </div>
          <div>
            Personal information is any information that identifies or makes an
            individual identifiable. The definition of personal information
            (used interchangeably in this Privacy Policy with the term "personal
            data") depends on where you are a resident.
          </div>
          <div>
            Personal Information does not include data that has been effectively
            irreversibly anonymized or aggregated so that it can no longer
            enable us or others, whether in combination with other information
            or otherwise, to identify an individual.
          </div>
          <div>
            Your personal data is collected and used by us to support a range of
            different business purposes. The purposes and types of information
            we collect are listed in the chart below and should be understood to
            include uses of your personal data that are compatible with the
            purposes listed.
          </div>
          <table>
            <tr>
              <th>Purpose</th>
              <td>The Personal Data We Collect</td>
            </tr>
            <tr>
              <td>
                To create an account with us, to manage your account, and to
                provide you with our Services;
              </td>

              <td>
                <div>
                  1,Contact information, including email address and password,
                  to register with our Site or App;
                </div>
                <div>
                  2,Profile data, including your style preference, if you
                  voluntarily choose to provide it for personalization purposes.
                </div>
              </td>
            </tr>
            <tr>
              <th>To fulfill or process orders;</th>
              <td>
                <div>
                  1,Identity and contact information such as name, phone number,
                  and shipping address, as well as financial information or
                  payment account information, for delivery, returns, refund,
                  sales tax determinations, and payment operations.
                </div>
                <div>
                  2,Transaction details, such as return and refund details, gift
                  card number, and order history, in our Services, in order to
                  fulfill basic functions, including processing your payment and
                  return requests, and keeping you informed of the order status
                  and shipping logistics
                </div>
                <div>
                  3,Location data at an IP address-based level, to tailor your
                  experience in terms of displaying the appropriate local
                  website, language, or user experience.
                </div>
              </td>
            </tr>
            <tr>
              <th>
                To provide customer service and support, or to provide you with
                service-related communications;
              </th>
              <td>
                <div>
                  1,Your communication history with us via various channels,
                  such as email, phone, social media, mail, instant chat, and
                  our customer service platform, to respond to your requests, as
                  well as to keep you updated about your account and the
                  Services
                </div>
                <div>
                  2,Photographs you upload to our Services in accordance with
                  our Terms and Conditions, to provide product advice, and to
                  allow you to voluntarily show other potential customers what
                  items may look like when purchased or worn
                </div>
              </td>
            </tr>
            <tr>
              <th>
                To undertake marketing, advertising or other promotional
                activities;
              </th>
              <td>
                <div>
                  1,Contact information, such as phone number and email address,
                  for telemarketing and email marketing purposes.
                </div>
                <div>
                  2,Non-directly identifiable device identifiers, operating
                  system information, to direct and measure the effectiveness of
                  the advertising we offer.
                </div>
                <div>
                  3,Data about how you engage with our Services, such as
                  browsing, adding to your shopping cart, saving items, placing
                  an order, and returns) for market research, statistical
                  analysis, and the display of personalized advertising based on
                  your activity on our site and inferred interests.
                </div>
                <div>
                  4,Contact and identity information, such as name, email
                  address, and phone number, when you voluntarily enter into a
                  competition, market survey, event, or other marketing
                  campaigns organized by us.
                </div>
                <div>
                  5,To share your personal data with third-party service
                  providers to advertise our Services and/or products on our
                  Site
                </div>
              </td>
            </tr>
            <tr>
              <th>
                To improve our product or service, or for personalization;
              </th>
              <td>
                <div>
                  1,Collect your device information, and usage data on our Site
                  or App for fault analysis, troubleshooting, and system
                  maintenance, as well as setting default options for you, such
                  as language and currency.
                </div>
                <div>
                  2,When you optionally provide such information, we may collect
                  general personal data that cannot identify you, such as body
                  shape, personal height, chest/waist/hip circumference, and
                  weight. For example, this information may be used by us to
                  recommend clothing sizes or styles, personalization, or to
                  provide fit prediction services for you.
                </div>
                <div>
                  3,To share your personal data within and across our corporate
                  organization for our business needs and personalization.
                </div>
                <div>
                  4,Collection of your "like" records and votes when prompted as
                  to your preference between two items, to provide preference
                  setting options.
                </div>
                <div>
                  5,The display of information you choose to post on public
                  areas of the Services, for example a customer review.
                </div>
              </td>
            </tr>
            <tr>
              <th>
                To prevent and investigate fraud and other illegal activities;
              </th>
              <td>
                <div>
                  1,Information automatically collected through the Services,
                  such as browser type, device information, operating system,
                  and account setting information for fraud prevention and
                  detection and credit risk reduction.
                </div>
                <div>2,Log-in data for risk control and fraud reporting.</div>
                <div>3,Billing address to verify payment information.</div>
              </td>
            </tr>
            <tr>
              <th>To comply with legal or compliance requirements;</th>
              <td>
                <div>
                  1,Identity information, such as ID- or passport-related
                  information, for customs clearance purposes.
                </div>
                <div>
                  Transaction history and certain identifying information to
                  handle and resolve legal disputes, for regulatory
                  investigations purposes, and to comply with lawful requests
                  from a competent law enforcement agency or court.
                </div>
              </td>
            </tr>
            <tr>
              <th>Other Purposes.</th>
              <td>
                <div>
                  We may use your information for any other purpose disclosed to
                  you prior to you providing us your personal information or
                  which is reasonably necessary to provide the Services or other
                  related products and/or services requested, with your
                  permission or upon your direction.
                </div>
              </td>
            </tr>
          </table>
          <div>
            Please note: When communicating with us by email or through forms on
            our Services, or when you publicly share content through our
            Services, we ask that you please do not send us any sensitive
            information pertaining to yourself or to others. We do not collect
            or store sensitive information or special categories of information.
          </div>
          <h2>2, Sharing_Your Personal Data</h2>
          <div>
            We may disclose and share your personal information with the parties
            as described below.
          </div>
          <div>
            Within Our Corporate Organization . The Company is a part of a
            corporate organization that has several legal entities, business
            processes, management structures, and technical systems. We may
            share your personal information with our related group companies
            and, in some cases, other affiliates of our corporate group for
            business maintenance and personalization continuity purposes, for
            instance, so that you may enjoy a personalized user experience
            across our digital properties, to provide you with the Services, or
            to take actions based on your requests or preferences
          </div>
          <div>
            Third Party Sellers . Where a third-party seller sells its’ products
            on the platform and the third-party seller will ship the products to
            you directly, we may share your personal data (name, address, and
            telephone number) with them so that they may fulfill your order and
            provide your personal data to a shipping logistics provider in order
            to ship the products to you.
          </div>
          <div>
            Service Providers . We may provide access to or share your personal
            information with the following types of third-party service
            providers as set out in the table below:
          </div>
          <table>
            <tr>
              <th>
                <div>Supplier/Service</div>
                <div>Provider/Processor</div>
              </th>
              <td>Services Offered</td>
            </tr>
            <tr>
              <th>IT system and software service provider</th>
              <td>
                Website hosting services (including cloud storage), mobile app
                or software optimization services, customer relationship
                management software, email service providers, or system
                maintenance services.
              </td>
            </tr>
            <tr>
              <th>Payment service provider</th>
              <td>Third-party payment processing services.</td>
            </tr>
            <tr>
              <th>Marketing and advertising services</th>
              <td>
                Assistance in reaching potential new customers across multiple
                communications channels or sharing with affiliated companies
                that promote our products on their websites.
              </td>
            </tr>
            <tr>
              <th>Order fulfillment service provider</th>
              <td>
                Provision of logistics, warehousing, and distribution services,
                return and exchange services, and order status notification
                services for your purchased items.
              </td>
            </tr>
            <tr>
              <th>Customer service provider</th>
              <td>Assistance with customer services and support.</td>
            </tr>
            <tr>
              <th>
                Fraud prevention and information security service provider
              </th>
              <td>
                Identity verification, fraud prevention, or credit risk
                reduction services to protect our Site/App and our business.
              </td>
            </tr>
            <tr>
              <th>Other Service providers selected by you</th>
              <td>
                Other third parties, such as size recommendations and fit
                prediction services providers if you have chosen to help us
                provide you with product recommendations.
              </td>
            </tr>
          </table>
          <div>
            purposes for which it was provided to them and to the extent
            necessary for such purposes, in accordance with our written
            instructions.
          </div>
          <div>
            To Maintain Legal and Regulatory Compliance . We have the right to
            disclose your personal information as required by law, or when we
            believe that disclosure is necessary to protect our rights and/or
            comply with a judicial proceeding, court order, request from a
            regulator or any other legal process served on us. We also may
            disclose your information where we reasonably believe that the
            disclosure is necessary to enforce our agreements or policies, or if
            we believe that disclosure will help us protect the rights,
            property, or safety of the Company or our customers.
          </div>
          <div>
            Co-Branded Services and Features . Portions of our Services may be
            offered as part of co-branded services and features. We will share
            your personal information with our co-branded partners based on your
            voluntary use of or participation in a co-branded service or
            feature. The co-branded partners will be identified on the
            co-branded feature or service, along with an applicable co-branded
            partner's privacy policy. Use of your personal information by a
            co-branded partner will be subject to a co-branded partner’s privacy
            policy. If you wish to opt-out of a co-branded partner’s future use
            of your personal information, you will need to contact the
            co-branded partner directly
          </div>
          <div>
            Consent . We may disclose your personal information for any purpose
            with your consent.
          </div>
          <div>
            Corporate Transactions . We may disclose personal
            information—including account information, Wallet balance or points
            information—to a buyer, prospective buyer, corporate affiliate, or
            other successors in the event of a merger, divestiture,
            restructuring, reorganization, dissolution, or sale or transfer of
            some or all of our assets, whether as a going concern or as part of
            bankruptcy, liquidation, or similar proceeding in which personal
            information held by us about our Services users is among the assets
            transferred. You acknowledge and agree to our assignment or transfer
            of rights to your personal information. Please note that we may
            disclose, without restriction, aggregated or anonymized information
            about the users of our Services, which is information that does not
            identify any specific individual.
          </div>
          <h2>3, Security Precautions</h2>
          <div>
            We maintain reasonable physical, electronic, and procedural
            safeguards designed to guard your personal data from unauthorized
            processing, use or disclosure. Our security measures include
            industry-standard physical, technical, and administrative measures
            to prevent unauthorized access to or disclosure of your information.
          </div>
          <div>
            The Internet is not an absolutely secure environment, and we cannot
            guarantee that your personal data will be secure. We therefore
            strongly recommend that you use a secure method and use a complex
            password to help us ensure the security of your account. We also
            strongly advise that you neither share your password with others nor
            re-use passwords on our Services that you use on other sites or
            apps, as doing so increases the likelihood of your being the victim
            of a credential stuffing attack or other malicious cyber behavior.
            If you feel that the security of your account or personal data has
            been compromised, please immediately contact us at our dedicated
            Privacy Center or as otherwise described in the "Contact Us" section
            below.
          </div>
          <h2>4,Your Rights</h2>
          <div>
            <b>
              4,1 Access, Correction, and Deletion of your Personal Information.
            </b>
            You have the right to access, correct, or delete the personal
            information that we collect. To protect the privacy and the security
            of your personal information, we may request data from you to enable
            us to confirm your identity and right to access such data, as well
            as to search for and provide you with the personal data we maintain.
            There are instances where applicable laws or regulatory requirements
            allow or require us to refuse to provide or delete some or all of
            the personal information that we maintain. To exercise your rights,
            you may make updates within your customer account on the Site or
            App, or you may contact us at our dedicated Privacy Center. We may
            not accommodate a request to delete or change information if we
            believe the change would violate any law or legal requirement or
            cause the information to be incorrect.
          </div>
          <div>
            <b> 4,2 Unsubscribe from Our Marketing Communications </b>
            If you do not want us to use your email account to send you
            marketing emails or non-transactional promotional materials, please
            directly click on the unsubscribe link at the bottom of any of our
            email messages to you or contact us at our dedicated Privacy Center
            .
          </div>
          <div>
            <b> 4,3 Lodging Complaints. </b>
            If you believe we have infringed or violated your privacy rights,
            please contact us at our dedicated Privacy Center so that we may
            attempt to resolve any issues to your satisfaction.
          </div>
          <div>
            <b> 4,4 Right to Opt-Out of Selling </b>
            Residents of certain states, such as California and Virginia, have
            the right to opt-out of having their personal information sold. We
            do not sell your personal information as that term is generally
            understood but we recognize that certain privacy laws may define
            “sale” or "personal information" in such a way that making
            identifiers linked to you available to limited third parties for a
            benefit may be considered a"sale." In the previous 12 months, we may
            have shared identifiers and inferences about you with our partners,
            third parties, and affiliates in such a way that, under such privacy
            laws, may be interpreted as “selling.” If your state allows you to
            opt-out from such “sales,” you may exercise your opt-out right by
            clicking the"Manage Cookies" link in our Site footer to load a
            consent tool that will allow you to opt-out of the cookies on our
            Site.
          </div>
          <h2>5,Retention</h2>
          <div>
            We will retain your personal data, including any correspondence you
            have with us only for as long as is necessary for the purposes set
            out in this Policy, including retaining Personal Data to comply with
            our legal obligations, to resolve disputes, for information security
            purposes, and to enforce our legal rights, terms, and policies.
          </div>
          <h2>6,Third-Party Websites</h2>
          <div>
            Our App or Site may contain links to third-party sites. This Policy
            does not apply to those third-party sites. We recommend that you
            read the privacy statements of any other sites that you visit as we
            are not responsible for the privacy practices of those sites.
          </div>
          <h2>7,Children</h2>
          <div>
            Our Services are not directed to, and we do not knowingly collect
            personal information from, children under the age of 16 or minors(as
            defined by applicable national laws). If you are a minor, please do
            not attempt to fill out our forms or send any personal information
            about yourself to us. If a minor has provided us with personal
            information without parental or guardian consent, the parent or
            guardian should contact us immediately to remove the relevant
            personal information and unsubscribe the minor.
          </div>
          <div>
            If we become aware that a minor has provided us with personal
            information, we will take steps to promptly delete such information
            from our files. As described further in our Terms and Conditions ,
            please do not upload photographs showing other people, in particular
            if they are minors.
          </div>
          <h2>8.Transfer of Your Personal Data</h2>
          <div>
            This Privacy Policy only applies to SOKOGATE’S users. If you are a
            resident of a country, please see the applicable SOKOGATE Privacy
            Policy and Terms of Use that is specific to your jurisdiction, which
            is generally available on the local version of the App or Site.
            Please note as well that when you use our Services, your personal
            data may be accessed or transferred outside of your country. Such
            countries may have data protection laws that are less protective
            than the laws of the jurisdiction in which you reside. For these
            transfers, we rely on appropriate safeguards as permitted under
            applicable law and standards. If you do not want your information
            transferred to,
          </div>
          <div>
            processed, accessed, or maintained outside of your country , you
            should immediately stop accessing or using the Services.
          </div>
          <h2>9.Contact Us</h2>
          <div>
            If you have questions or concerns regarding any information in this
            Privacy Policy, please contact us at our dedicated Privacy. Center.
          </div>
          <div>
            Our Privacy Office can be contacted via the email address below or
            via our postal address:
          </div>
          <div>SOKOGATE Privacy Office</div>
          <div>P.O BOX 13000 tom mboya st</div>
          <div>Email: info@sokogate.com</div>
          <div>© 2020-2026 ultimo trading co limited or its affiliates.</div>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a></b-col
        >
      </b-row>
      <b-row v-else-if="locale == 'fra'">
        <b-col>
          <div class="col">
            <p>
              Afin de répondre aux besoins de confidentialité des utilisateurs
              et/ou des visiteurs qui utilisent sokogate.com, sokogate.com
              applique cette politique de confidentialité pour vous montrer
              comment sokogate.com recueille, utilise, partage et fait usage de
              vos informations personnelles, ainsi que pour décrire vos droits
              sur ces informations personnelles. Cette politique de
              confidentialité s’applique à tous les utilisateurs, membres et
              services de sokgate. Cependant, vous pouvez simplement visiter
              notre site sans nous fournir aucune information personnelle
            </p>
            <p>
              Afin de répondre aux besoins de confidentialité des utilisateurs
              et/ou des visiteurs utilisant sokogate.com, sokgate, veuillez lire
              explicitement cette politique de confidentialité avant d’utiliser
              sokogate.com, sokgate services et assurez-vous que vous comprenez
              pleinement nos pratiques concernant vos informations personnelles.
            </p>
            <p>
              Si vous avez des questions concernant cette politique de
              confidentialité, n’hésitez pas à contacter staff@sokogate.com. En
              accédant et/ou en utilisant sokogate.com, vous reconnaissez avoir
              pris connaissance de cette politique de confidentialité
            </p>

            <h4>Boostez votre entreprise avec sokgate e-commerce</h4>
            <p>
              Sokogate met à la disposition de votre entreprise un magasin en
              ligne complet pour présenter vos produits et services le plus
              facilement possible, sans aucune compétence en codage ou en
              design.
            </p>
            <p>
              Commencez à vendre Sokogate aujourd’hui! Voici quelques conseils
              pour configurer et gérer votre magasin sur sokogate:.
            </p>

            <h4>1, Renseignements personnels que nous recueillons</h4>
            <p>
              Afin de devenir un utilisateur ou un membre de sokogate.com et
              d’utiliser ou d’acheter les services, nous devons recueillir des
              informations personnelles relatives à des personnes ou des
              représentants d’organisations commerciales. Ces informations
              personnelles comprennent votre nom, votre adresse e-mail, votre
              numéro de téléphone portable, votre pays, vos informations de
              paiement et votre adresse de contact. Nous pouvons également
              collecter des informations personnelles utilisées de manière
              agrégée, telles que les activités de navigation et de clickstream
              des utilisateurs sur les services, y compris les adresses IP de
              protocole internet, les modèles de navigation, les modèles
              d’achat. Nous pouvons recueillir des informations sur l’achat ou
              l’utilisation de nos produits et services, tels que les types de
              services, les informations sur les prix et tout enregistrement de
              plaintes commerciales.
            </p>

            <h4>
              2, Raisons pour lesquelles les renseignements personnels sont
              recueillis
            </h4>
            <p>
              Nous recueillons et utilisons vos informations personnelles pour
              les raisons suivantes:
            </p>
            <p>2,1, Fournir les services sokgate;</p>
            <p>
              2,2, Développer et améliorer nos services en fonction des
              préférences générales ou personnelles et de l’expérience des
              utilisateurs;
            </p>
            <p>
              2,3, Développer et améliorer nos services en fonction des
              préférences générales ou personnelles et de l’expérience des
              utilisateurs;
            </p>
            <p>
              2,4, Traiter les achats et/ou les abonnements de nos utilisateurs
              sur les marchés internationaux;
            </p>
            <p>
              2.5, fournir des notifications générales liées au service et des
              messages promotionnels à nos utilisateurs, en fonction de leur
              historique, afin d’améliorer nos produits et services;
            </p>
            <p>
              2,6, Se conformer aux lois et règlements applicables ou aux
              procédures légales.
            </p>
            <p>
              2,7, Pour analyser nos activités marketing et fournir certains
              concours, événements et promotions.
            </p>
            <p>2,8. Vous fournir une assistance professionnelle;</p>
            <p>
              2,9. Renforcer la sécurité des données, la prévention de la fraude
              et la détection et la vérification des activités indésirables; et
            </p>
            <p>
              2,10. Établir des statistiques globales et publier toute
              information nécessaire pour fournir et améliorer nos services;
            </p>
            <p>
              Notre utilisation de vos renseignements personnels est nécessaire
              pour soutenir des fins commerciales, y compris, mais sans s’y
              limiter, des avis, des enquêtes, des rappels de produits, des
              communications connexes et d’autres matériaux de marketing et de
              promotion, à condition que cela soit fait de manière
              proportionnelle et respectueuse de votre droit à la vie privée.
            </p>

            <h4>3, Informations personnelles que nous partageons</h4>
            <p>
              3.1, Sokgate peut partager ou permettre l’accès à vos informations
              personnelles pour les fournisseurs de services, Qui a le devoir de
              confidentialité et d’article peut uniquement être obtenu à partir
              de vos données personnelles, aux fins suivantes au lieu de leur
              objet: tiers vos informations personnelles peuvent être utilisées
              pour fournir des services à la clientèle, sur des actions de
              promotion des produits et des services, un contrôle des risques,
              de prévention de la fraude et de respect de la loi, la facturation
              et le paiement des services de traitement de distribution du
              courrier électronique, Et optimisez les performances, les données
              et les services marketing. Les renseignements personnels qui
              seront partagés comprennent le nom, l’adresse postale, l’adresse
              de protocole internet, l’adresse de courriel, le nom de compte ou
              d’autres renseignements commerciaux identifiants similaires.
            </p>
            <p>
              3,2, Filiales et sociétés affiliées de sokgate: nous pouvons
              partager vos informations personnelles au sein de notre famille de
              sociétés aux fins décrites dans la section «2» de cette politique
              de confidentialité. Nous pouvons partager vos informations
              personnelles afin de vous fournir commodité et services.
            </p>
            <p>
              3,3, Sokgate peut partager vos informations personnelles avec des
              tiers afin de fournir des données agrégées et anonymes, mais ces
              informations personnelles ne vous identifient pas personnellement.
            </p>
            <p>
              3,4, Sokgate peut également partager vos informations personnelles
              avec des tiers à d’autres fins, selon d’autres instructions de
              votre part ou avec votre approbation expresse.
            </p>
            <p>
              3,5, Sokgate peut autoriser l’accès à vos informations
              personnelles sur la base d’une exigence légale (telle qu’une
              citation à comparaître, une procédure judiciaire, un mandat de
              perquisition ou une ordonnance du tribunal), ou avec ou sans
              préavis, conformément aux lois applicables.
            </p>

            <h4>4, Informations personnelles que nous stockons</h4>
            <p>
              Les informations personnelles peuvent être stockées dans des
              centres de données et transférées vers des juridictions étrangères
              afin de fournir nos services, y compris pour fournir un service à
              la clientèle, effectuer des contrôles des risques, se protéger
              contre la fraude et les procédures de conformité légale, vous
              contacter pour des questions promotionnelles et effectuer des
              services de traitement des paiements.
            </p>
            <p>
              Certification privacy shield :sokogate a été certifié eu-us
              privacy shield. Cadre privacy shield et suisse-usa. Cadre de
              protection de la vie privée. Conformément aux principes du
              bouclier de confidentialité, sokogate.com s’engage à résoudre les
              plaintes concernant notre collecte ou l’utilisation de vos
              informations personnelles.
            </p>

            <h4>5, Vos droits concernant vos informations personnelles</h4>
            <p>
              Sokogate vous permet de demander l’accès à vos informations
              personnelles pour mettre à jour, modifier, supprimer ou limiter
              l’utilisation de vos informations personnelles. Avant de répondre
              à votre demande, nous pouvons vous demander de fournir des
              informations supplémentaires et de confirmer votre identité pour
              des raisons de sécurité.
            </p>
            <p>
              Si vous avez besoin d’une liste des renseignements personnels que
              nous divulguons à des tiers à des fins de marketing direct, vous
              pouvez envoyer un courriel à tostaff@sokogate.com et nous ferons
              des efforts raisonnables pour répondre à votre demande dans un
              délai raisonnable.
            </p>

            <h4>6, Nous utilisons des Cookies</h4>
            <p>
              Les «Cookies» sont de petites quantités de données envoyées à
              votre navigateur et stockées sur votre appareil uniquement lorsque
              vous utilisez et/ou visitez le site web sokgate. En utilisant
              et/ou en accédant aux sites et services sokgate et en acceptant
              les cookies, vous consentez au stockage de cookies sur votre
              appareil. Nous et nos fournisseurs de services tiers utilisons des
              cookies et d’autres technologies similaires pour stocker des
              informations spécifiques vous concernant, suivre votre nombre de
              visites sur sokogate.com, identifier les services spécifiques que
              vous utilisez, aider nos partenaires à suivre le nombre de visites
              des utilisateurs, aider à cibler les publicités en fonction des
              intérêts des utilisateurs, Ainsi que pour faciliter votre accès à
              tout service associé, fournir nos services et assurer leur bonne
              exécution.
            </p>

            <h4>7, La sécurité</h4>
            <p>
              Sokogate.com a pris des mesures de sécurité conçues pour protéger
              les informations personnelles et les informations de paiement que
              vous partagez avec nous. Les informations de paiement sensibles,
              la transmission de données personnelles et l’adoption de
              l’identité sont protégées par le standard de l’industrie Secure
              Socket Layer (SSL) contre les failles de sécurité et les accès non
              autorisés.
            </p>
            <p>
              Cependant, malgré nos mesures et nos efforts, sokogate.com ne peut
              pas garantir la protection et la sécurité absolues de vos
              informations personnelles ou de toute autre information que vous
              téléchargez. Nous vous encourageons donc à définir un mot de passe
              fort pour votre compte utilisateur sur sokogate.com et à ne pas
              nous fournir d’informations personnelles sensibles.
            </p>

            <h4>8. Mise à jour de la politique de confidentialité</h4>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité,
              conformément aux exigences de la loi applicable, afin de refléter
              les changements apportés à nos pratiques de collecte,
              d’utilisation et de stockage des renseignements personnels. Par
              conséquent, si nous apportons des modifications à cette politique
              de confidentialité, nous vous informerons de tout changement avant
              le changement par e-mail ou par notification sur le site web
              sokogate. Nous vous encourageons à consulter régulièrement cette
              page pour obtenir les dernières informations sur notre politique
              de confidentialité. La politique de confidentialité s’applique à
              toutes les informations personnelles que nous détenons à votre
              sujet en relation avec notre site web.
            </p>

            <h4>9. Nous contacter</h4>
            <p>
              Si vous avez des demandes ou des questions concernant cette
              politique de confidentialité, ou si vous souhaitez exercer l’un
              des droits susmentionnés ou d’autres, n’hésitez pas à contacter
              notre responsable de la protection des données à
              stuff@sokogate.com. Nous vous assurons que nous réglerons toute
              plainte relative à vos renseignements personnels conformément à la
              présente politique de confidentialité.
              © 2020-2026 ultimo trading co limited or its affiliates.
            </p>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'spa'">
        <b-col>
          <div class="col">
            <p>
              Para satisfacer las necesidades de privacidad de los usuarios y/o
              visitantes que utilizan sokogate.com, sokogate.com aplica esta
              política de privacidad para mostrarle cómo sokogate.com recopila,
              utiliza, comparte y hace uso de su información personal, así como
              para describir sus derechos con respecto a esa información
              personal. Esta política de privacidad se aplica a todos los
              usuarios, miembros y servicios de sokgate. Sin embargo, solo puede
              visitar nuestro sitio web sin proporcionarnos ninguna información
              personal
            </p>
            <p>
              Para satisfacer las necesidades de privacidad de los usuarios y/o
              visitantes que utilizan sokogate.com, sokgate, lea esta política
              de privacidad explícitamente antes de usar sokogate.com, servicios
              de sokgate y asegúrese de entender completamente nuestras
              prácticas con respecto a su información personal.
            </p>
            <p>
              Si tiene alguna pregunta sobre esta política de privacidad, puede
              ponerse en contacto con staff@sokogate.com. Al acceder y/o usar
              sokogate.com, usted reconoce que ha leído esta política de
              privacidad
            </p>

            <h4>Impulse su negocio con sokgate ecommerce</h4>
            <p>
              Sokogate ofrece a su negocio una tienda online completa para
              mostrar sus productos y servicios de la manera más fácil posible,
              sin ninguna habilidad de codificación o diseño.
            </p>
            <p>
              ¡Comience a vender Sokogate hoy! Aquí hay consejos sobre cómo
              configurar y ejecutar su tienda en sokogate:
            </p>

            <h4>1, Información personal que recopilamos</h4>
            <p>
              Para convertirse en un usuario o miembro de sokogate.com y usar o
              comprar los servicios, debemos recopilar información personal
              relacionada con individuos o representantes de organizaciones
              comerciales. Esta información personal incluye su nombre,
              dirección de correo electrónico, número de teléfono móvil, país,
              información de pago y dirección de contacto. También podemos
              recopilar información personal que se utiliza de forma agregada,
              como la navegación y la actividad de clickstream del usuario en el
              servicio. Esto incluye direcciones de protocolo de internet "IP",
              patrones de navegación, patrones de compra. Podemos recopilar
              cualquier información sobre la compra o el uso de nuestros
              productos y servicios, como el tipo de servicio, información de
              precios y cualquier registro de quejas comerciales.
            </p>

            <h4>2, Razones por las que se recopila información personal</h4>
            <p>
              Recopilamos y utilizamos su información personal por las
              siguientes razones:
            </p>
            <p>2,1,Proporcionar servicios sokgate;</p>
            <p>
              2,2,Desarrollar y mejorar nuestros servicios basados en las
              preferencias y experiencias generales o personales de los
              usuarios;
            </p>
            <p>
              2,3,Desarrollar y mejorar nuestros servicios basados en las
              preferencias y experiencias generales o personales de los
              usuarios;
            </p>
            <p>
              2,4,Procesar compras y/o suscripciones de nuestros usuarios en
              mercados internacionales;
            </p>
            <p>
              2.5,Proporcionar notificaciones generales relacionadas con el
              servicio e información promocional a nuestros usuarios con el fin
              de mejorar nuestros productos y servicios, basados en el historial
              del usuario;
            </p>
            <p>
              2,6,Cumplir con cualquier ley, regulación o proceso legal
              aplicable.
            </p>
            <p>
              2,7,Analizar nuestras actividades de marketing para ofrecer
              ciertos concursos, eventos y promociones.
            </p>
            <p>2,8.Proporcionarle asistencia profesional;</p>
            <p>
              2,9.Mejorar la seguridad de la información, la prevención del
              fraude y la detección e inspección de actividades indeseables;
            </p>
            <p>
              2,10.Establecer estadísticas integradas y publicar cualquier
              información que sea necesaria para proporcionar y mejorar nuestros
              servicios;
            </p>
            <p>
              Nuestro uso de su información personal es necesario para apoyar
              fines comerciales, incluyendo, pero no limitado a, notificaciones,
              encuestas, alertas de productos, comunicaciones relacionadas y
              otros materiales de marketing y promocionales, siempre que se
              realice de una manera proporcionada y respetuosa con su derecho a
              la privacidad.
            </p>

            <h4>3,Información personal que compartimos</h4>
            <p>
              3.1,Sokgate puede compartir o permitir el acceso a su información
              personal para los proveedores de servicios, Quién es responsable
              de mantener la confidencialidad y permitir el uso de sus datos
              personales sólo para los fines especificados a continuación y no
              para sus propios fines: terceros pueden usar su información
              personal para proporcionarle servicio al cliente, contactar con
              usted sobre productos y servicios promocionales, llevar a cabo
              control de riesgos, Programas de prevención de fraude y
              cumplimiento legal, llevar a cabo servicios de procesamiento de
              facturación y pagos, supervisar la distribución de correos
              electrónicos y optimizar el rendimiento, los datos y los servicios
              de marketing. La información personal que se compartirá incluye
              nombre, dirección postal, dirección de protocolo de internet,
              dirección de correo electrónico, nombre de cuenta u otra
              información comercial identificadora similar.
            </p>
            <p>
              3,2,Subsidiarias y afiliadas de sokgate: podemos compartir su
              información personal dentro de nuestra familia de empresas para
              los fines descritos en la sección "2" de esta política de
              privacidad. Podemos compartir su información personal con el fin
              de brindarle comodidad y servicios.
            </p>
            <p>
              3,3,Sokgate puede compartir su información personal con terceros
              para proporcionar datos agregados y anónimos, pero esta
              información personal no lo identifica personalmente.
            </p>
            <p>
              3,4,Sokgate también puede compartir su información personal con
              terceros para otros fines, según sus instrucciones adicionales o
              su aprobación expresa.
            </p>
            <p>
              3,5,Sokgate puede permitir el acceso a su información personal
              según lo requiera la ley (como una citación, un proceso legal, una
              orden de registro u orden judicial), o con o sin notificación a
              usted, de acuerdo con las leyes aplicables.
            </p>

            <h4>4,Información personal que almacenamos</h4>
            <p>
              La información personal puede almacenarse en centros de datos y
              transferirse a jurisdicciones en el extranjero con el fin de
              proporcionar nuestros servicios, incluyendo la prestación de
              servicio al cliente, la realización de controles de riesgos, la
              protección contra el fraude y los procedimientos de cumplimiento
              legal, contactarlo sobre asuntos promocionales y realizar
              servicios de procesamiento de pagos.
            </p>
            <p>
              Certificación privacy shield :sokogate ha sido certificada por el
              escudo de privacidad ue-ee. Uu. Marco privacy shield y
              suizo-estadounidense. Marco de protección de privacidad. De
              acuerdo con los principios del escudo de privacidad, sokogate.com
              se compromete a resolver las quejas relacionadas con nuestra
              recopilación o uso de su información personal.
            </p>

            <h4>5, Sus derechos con respecto a su información personal</h4>
            <p>
              Sokogate le permite solicitar el acceso a su información personal
              para actualizar, modificar, eliminar o limitar el uso de su
              información personal. Antes de cumplir con su solicitud, es
              posible que le solicitemos información adicional por razones de
              seguridad y para confirmar su identidad.
            </p>
            <p>
              Si necesita una lista de la información personal que revelamos a
              terceros para fines de marketing directo, puede enviarnos un
              correo electrónico a tostaff@sokogate.com y haremos esfuerzos
              razonables para atender su solicitud dentro de un período de
              tiempo razonable.
            </p>

            <h4>6,Utilizamos Cookies para</h4>
            <p>
              Las "Cookies" son pequeñas cantidades de datos que se envían a su
              navegador y se almacenan en su dispositivo solo cuando utiliza y/o
              visita el sitio web de sokgate. Al usar y/o acceder a los sitios
              web y servicios de sokgate y aceptar cookies, usted acepta el
              almacenamiento de cookies en su dispositivo. Nosotros y nuestros
              proveedores de servicios de terceros utilizamos cookies y otras
              tecnologías similares para almacenar información específica sobre
              usted, rastrear sus visitas a sokogate.com, identificar los
              servicios específicos que utiliza, ayudar a nuestros socios a
              rastrear las visitas de los usuarios, ayudar a orientar la
              publicidad en función de los intereses de los usuarios, Así como
              facilitar su uso de cualquier servicio relacionado, proporcionar
              nuestros servicios y garantizar su correcta ejecución.
            </p>

            <h4>7,seguridad</h4>
            <p>
              Sokogate.com ha adoptado medidas de seguridad diseñadas para
              proteger la información personal e información de pago que
              comparte con nosotros. La información de pago sensible, la
              transmisión de datos personales y la adopción de la identidad
              están sujetos al estándar de la industria Secure Protección de
              Socket Layer, SSL) contra brechas de seguridad y accesos no
              autorizados.
            </p>
            <p>
              Sin embargo, a pesar de nuestras medidas y esfuerzos, sokogate.com
              no puede garantizar la protección y seguridad absoluta de su
              información personal o cualquier otra información que cargue. Por
              lo tanto, le animamos a establecer una contraseña fuerte para su
              cuenta de usuario en sokogate.com y evitar proporcionarnos
              cualquier información personal sensible.
            </p>

            <h4>8.Política de privacidad actualizada</h4>
            <p>
              Podemos actualizar esta política de privacidad según lo requiera
              la ley aplicable para reflejar los cambios en nuestras prácticas
              de recopilación, uso y almacenamiento de información personal. Por
              lo tanto, si realizamos cualquier cambio en esta política de
              privacidad, le notificaremos cualquier cambio antes de realizar el
              cambio por correo electrónico o mediante un aviso en el sitio web
              de sokogate. Le recomendamos que revise esta página regularmente
              para obtener información actualizada sobre nuestra política de
              privacidad. La política de privacidad se aplica a toda la
              información personal que tenemos sobre usted en relación con
              nuestro sitio web.
            </p>

            <h4>9. Contacta con nosotros</h4>
            <p>
              Si tiene alguna solicitud o pregunta sobre esta política de
              privacidad, o si desea ejercer los derechos mencionados
              anteriormente u otros, no dude en ponerse en contacto con nuestro
              oficial de protección de datos en stuff@sokogate.com. Le
              aseguramos que resolveremos cualquier queja relacionada con su
              información personal de acuerdo con esta política de privacidad.
              © 2020-2026 ultimo trading co limited or its affiliates.
            </p>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'pt'">
        <b-col>
          <div class="col">
            <p>
              Para atender às necessidades de privacidade dos usuários e/ou
              visitantes que usam o sokogate.com, o sokogate.com aplica esta
              política de privacidade para mostrar como o sokogate.com coleta,
              usa, compartilha e faz uso de suas informações pessoais e descreve
              seus direitos sobre essas informações pessoais. Esta política de
              privacidade aplica-se a todos os usuários, membros e serviços da
              sokgate. No entanto, você pode apenas visitar nosso site sem nos
              fornecer qualquer informação pessoal
            </p>
            <p>
              Para atender às necessidades de privacidade dos usuários e/ou
              visitantes que usam sokogate.com, sokgate, por favor, leia esta
              política de privacidade explicitamente antes de usar sokogate.com,
              serviços sokgate e certifique-se de que você entende completamente
              nossas práticas em relação às suas informações pessoais.
            </p>
            <p>
              Se você tiver alguma dúvida sobre esta política de privacidade,
              entre em contato com staff@sokogate.com. Ao acessar e/ou usar o
              sokogate.com, você reconhece que leu esta política de privacidade
            </p>

            <h4>Impulsione seu negócio com sokgate e-commerce</h4>
            <p>
              A Sokogate oferece ao seu negócio uma loja online completa para
              apresentar seus produtos e serviços o mais facilmente possível,
              sem nenhuma habilidade de codificação ou design.
            </p>
            <p>
              Comece a vender Sokogate hoje! Aqui estão algumas dicas sobre como
              configurar e executar sua loja no sokogate:
            </p>

            <h4>1,Informações pessoais que coletamos</h4>
            <p>
              Para se tornar um usuário ou membro do sokogate.com e usar ou
              comprar os serviços, devemos coletar informações pessoais
              relativas a indivíduos ou representantes de organizações
              comerciais. Essas informações pessoais incluem seu nome, endereço
              de e-mail, número de celular, país, informações de pagamento e
              endereço de contato. Também podemos coletar informações pessoais
              que são usadas de forma agregada, como atividades de navegação e
              clickstream do usuário no serviço, incluindo endereços de
              protocolo de internet "IP", padrões de navegação, padrões de
              compra. Podemos coletar qualquer informação sobre compras ou uso
              de nossos produtos e serviços, como tipo de serviço, informações
              de preços e quaisquer registros de reclamações comerciais.
            </p>

            <h4>2, Razões para a coleta de informações pessoais</h4>
            <p>
              Recolhemos e utilizamos as suas informações pessoais pelas
              seguintes razões::
            </p>
            <p>2,1,Serviço sokgate disponível;</p>
            <p>
              2,2,Desenvolver e melhorar os nossos serviços com base nas
              preferências e experiências gerais ou pessoais dos utilizadores;
            </p>
            <p>
              2,3,Desenvolver e melhorar os nossos serviços com base nas
              preferências e experiências gerais ou pessoais dos utilizadores;
            </p>
            <p>
              2,4,Processar compras e/ou assinaturas de nossos usuários em
              mercados internacionais;
            </p>
            <p>
              2.5,Fornecer aos nossos usuários notificações gerais relacionadas
              ao serviço e informações promocionais com base no histórico do
              usuário para melhorar nossos produtos e serviços;
            </p>
            <p>
              2,6,Cumprir quaisquer leis, regulamentos ou processos legais
              aplicáveis.
            </p>
            <p>
              2,7,Analisar nossas atividades de marketing para oferecer
              determinados concursos, eventos e promoções.
            </p>
            <p>2,8.Assistência especializada para você;</p>
            <p>
              2,9.Melhorar a segurança dos dados, a prevenção de fraudes e a
              identificação e verificação de atividades indesejáveis; e
            </p>
            <p>
              2,10.Para estabelecer estatísticas integradas e publicar qualquer
              informação necessária para fornecer e melhorar nossos serviços;
            </p>
            <p>
              Nosso uso de suas informações pessoais é necessário para apoiar
              fins comerciais, incluindo, mas não limitado a, notificações,
              pesquisas, alertas de produtos, comunicações relacionadas e outros
              materiais promocionais e de marketing, desde que seja
              proporcionado e respeitem seus direitos de privacidade.
            </p>

            <h4>3,Informações pessoais que compartilhamos</h4>
            <p>
              3.1,A sokgate pode compartilhar ou permitir o acesso às suas
              informações pessoais para provedores de serviços, Quem é
              responsável por manter a confidencialidade e permitir o uso de
              seus dados pessoais apenas para os fins especificados abaixo e não
              para seus próprios fins: terceiros podem usar suas informações
              pessoais para fornecer atendimento ao cliente, contatá-lo sobre
              produtos e serviços promocionais, realizar controle de risco,
              Prevenção de fraudes e procedimentos de conformidade legal,
              realização de serviços de processamento de faturamento e
              pagamento, monitoramento da distribuição de e-mails e otimização
              de desempenho, dados e serviços de marketing. As informações
              pessoais que serão compartilhadas incluem nome, endereço postal,
              endereço de protocolo de internet, endereço de e-mail, nome da
              conta ou outras informações comerciais identificadoras
              semelhantes.
            </p>
            <p>
              3,2,Subsidiárias e afiliadas da sokgate: podemos compartilhar suas
              informações pessoais dentro de nossa família de empresas para os
              fins descritos na seção "2" desta política de privacidade. Podemos
              compartilhar suas informações pessoais para fornecer conveniência
              e serviços para você.
            </p>
            <p>
              3,3,O sokgate pode compartilhar suas informações pessoais com
              terceiros para fornecer dados agregados e anônimos. No entanto,
              essas informações pessoais não o identificam pessoalmente.
            </p>
            <p>
              3,4,A sokgate também pode compartilhar suas informações pessoais
              com terceiros para outros fins, de acordo com suas instruções
              adicionais ou com sua aprovação expressa.
            </p>
            <p>
              3,5,A sokgate pode permitir o acesso às suas informações pessoais
              conforme exigido por lei (por exemplo, intimação, processo legal,
              mandado de busca ou ordem judicial), ou com ou sem aviso, de
              acordo com a lei aplicável.
            </p>

            <h4>4,Informações pessoais que armazenamos</h4>
            <p>
              As informações pessoais podem ser armazenadas em centros de dados
              e transferidas para jurisdições no exterior a fim de fornecer
              nossos serviços, incluindo a prestação de atendimento ao cliente,
              a execução de controles de risco, proteção contra fraudes e
              procedimentos de conformidade legal, contatá-lo sobre promoções e
              realizar serviços de processamento de pagamentos.
            </p>
            <p>
              Certificação privacy shield: a sokogate passou a certificação
              eu-us privacy shield. Quadro privacy shield e suíça-eua. Quadro de
              proteção de privacidade. De acordo com os princípios do escudo de
              privacidade, sokogate.com está empenhada em resolver reclamações
              relacionadas à nossa coleta ou uso de suas informações pessoais.
            </p>

            <h4>5, Seus direitos em relação às suas informações pessoais</h4>
            <p>
              Sokogate permite que você solicite acesso às suas informações
              pessoais para atualizar, modificar, excluir ou limitar o uso de
              suas informações pessoais. Antes de atender ao seu pedido,
              poderemos solicitar informações adicionais e confirmar sua
              identidade por razões de segurança.
            </p>
            <p>
              Se você precisar de uma lista de informações pessoais que
              divulgamos a terceiros para fins de marketing direto, você pode
              enviar um e-mail para tostaff@sokogate.com e faremos esforços
              razoáveis para atender ao seu pedido dentro de um período de tempo
              razoável.
            </p>

            <h4>6,Nós usamos Cookies</h4>
            <p>
              "Cookies" são pequenas quantidades de dados que são enviados para
              o seu navegador e armazenados no seu dispositivo apenas quando
              você usa e/ou visita o site sokgate. Ao usar e/ou acessar os sites
              e serviços da sokgate e aceitar cookies, você concorda com o
              armazenamento de cookies no seu dispositivo. Nós e nossos
              provedores de serviços terceirizados usamos cookies e outras
              tecnologias semelhantes para armazenar informações específicas
              sobre você, rastrear quantas vezes você visita sokogate.com,
              identificar serviços específicos que você usa, ajudar nossos
              parceiros a rastrear visitas de usuários, ajudar a direcionar
              anúncios com base nos interesses do usuário, E para facilitar o
              seu uso de quaisquer serviços relacionados, fornecer nossos
              serviços e garantir sua correta execução.
            </p>

            <h4>7,segurança</h4>
            <p>
              Sokogate.com adotou medidas de segurança projetadas para proteger
              as informações pessoais e de pagamento que você compartilha
              conosco. Informações confidenciais de pagamento, transmissão de
              dados pessoais e adoção de identidade estão sujeitas ao padrão da
              indústria Secure socket layer (Secure socket layer) Proteção de
              Socket Layer, SSL) contra falhas de segurança e acesso não
              autorizado.
            </p>
            <p>
              No entanto, apesar das nossas medidas e esforços, sokogate.com não
              pode garantir a proteção e segurança absoluta de suas informações
              pessoais ou qualquer outra informação que você carregar. Portanto,
              nós encorajamos você a definir uma senha forte para sua conta de
              usuário no sokogate.com e evitar nos fornecer qualquer informação
              pessoal sensível.
            </p>

            <h4>8.Atualização da política de privacidade</h4>
            <p>
              Podemos atualizar esta política de privacidade conforme exigido
              pela lei aplicável para refletir mudanças em nossas práticas de
              coleta, uso e armazenamento de informações pessoais. Portanto, se
              fizermos quaisquer alterações a esta política de privacidade,
              notificaremos você de quaisquer alterações por e-mail ou através
              de um aviso no site da sokogate antes das alterações. Recomendamos
              que você consulte esta página regularmente para obter informações
              atualizadas sobre nossa política de privacidade. A política de
              privacidade aplica-se a todas as informações pessoais que temos
              sobre você em relação ao nosso site.
            </p>

            <h4>9.Fale conosco fale conosco</h4>
            <p>
              Se você tiver quaisquer pedidos ou perguntas sobre esta política
              de privacidade, ou se desejar exercer os direitos acima ou outros,
              não hesite em entrar em contato com nosso diretor de proteção de
              dados em stuff@sokogate.com. Garantimos que resolveremos quaisquer
              reclamações relacionadas às suas informações pessoais de acordo
              com esta política de privacidade.
              © 2020-2026 ultimo trading co limited or its affiliates.
            </p>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ara'">
        <b-col>
          <div class="col">
            <p>
              من أجل تلبية احتياجات المستخدمين و/أو الزوار الذين يستخدمون
              Sokoggate.com من الخصوصية، تستخدم شركة Sokoggate.com تطبيق السياسة
              الخاصة بالخصوصية لبيان الكيفية التي تجمع بها Sokoggate.com
              معلوماتك الشخصية واستخدامها وتبادلها واستخدامها، فضلاً عن وصف
              حقوقك في تلك المعلومات الشخصية. وتنطبق هذه السياسة المتعلقة
              بالخصوصية على جميع المستعملين وأعضاء سوكيت وخدماتها. ومع ذلك،
              يمكنك فقط تصفح موقعنا دون تزويدنا بأي معلومات شخصية
            </p>
            <p>
              من أجل تلبية احتياجات المستخدمين و/أو الزوار من نظام سوكوغاتيت،
              يرجى قراءة سياسة الخصوصية هذه بوضوح قبل استخدام خدمة سوكوغاتيت و
              سوكوكيت، والتأكد من فهمك الكامل لممارستنا فيما يتعلق بمعلوماتك
              الشخصية.
            </p>
            <p>
              إذا كان لديك أي شك، هذه سياسة الخصوصية ترحب الاتصال
              staff@sokogate.com. من خلال زيارة و/أو استخدام Sokoggate.com،
              تعترف بأنك قرأت سياسة الخصوصية هذه
            </p>

            <h4>تعزيز عملك من خلال Sokgate التجارة الإلكترونية</h4>
            <p>
              يوفر سوكوغاتي لشركتك محلاً كاملاً على الإنترنت لعرض منتجاتك
              وخدماتك دون الحاجة إلى أي ترميز أو تصميم.
            </p>
            <p>
              ابدأ بيع سوكوكيت اليوم! وفيما يلي اقتراحات بشأن كيفية إنشاء وتشغيل
              متجرك على سوكوغاتي:
            </p>

            <h4>1,المعلومات الشخصية التي جمعناها</h4>
            <p>
              ولكي نكون مستخدمين أو أعضاء في سوكوغات.com ولكي نستخدم أو نشتري
              الخدمات، يجب علينا أن نجمع المعلومات الشخصية المتعلقة بالأفراد أو
              ممثلي المنظمات التجارية. وتشمل هذه المعلومات الشخصية اسمك وعنوان
              بريدك الإلكتروني ورقم هاتفك المحمول والبلد ومعلومات الدفع وعنوان
              الاتصال. وقد نقوم أيضا بجمع المعلومات الشخصية المجمعة، مثل التصفح
              على الخدمة وأنشطة النقر، بما في ذلك عناوين بروتوكول الإنترنت "IP"،
              ونماذج التصفح، ونماذج الشراء. وقد نجمع معلومات عن شراء أو استخدام
              منتجاتنا وخدماتنا، مثل نوع الخدمات، والأسعار، وأي سجل لشكاوى
              التجارية.
            </p>

            <h4>2, سبب جمع المعلومات الشخصية</h4>
            <p>
              الأسباب التي دفعتنا إلى جمع معلوماتك الشخصية واستخدامها هي كما
              يلي:
            </p>
            <p>2,1,تقديم خدمة Sokgate;</p>
            <p>
              2,2,تطوير وتحسين خدماتنا وفقا لتفضيلات المستعملين وخبرتهم العامة
              أو الشخصية;
            </p>
            <p>
              2,3,تطوير وتحسين خدماتنا وفقا لتفضيلات المستعملين وخبرتهم العامة
              أو الشخصية;
            </p>
            <p>
              2,4,تجهيز عمليات الشراء و/أو الاشتراك التي يقوم بها مستخدمونا في
              السوق الدولية;
            </p>
            <p>
              2.5,تزويد عملائنا بالمعلومات المتعلقة بالإخطارات والتسويق المتصلة
              بالخدمات العامة لتحسين منتجاتنا وخدماتنا، استنادا إلى السجلات
              التاريخية للمستعملين ؛
            </p>
            <p>
              2,6,التقيد بأي قوانين أو لوائح أو إجراءات قانونية واجبة التطبيق.
            </p>
            <p>
              2,7,تحليل أنشطتنا في السوق، وتوفير بعض الألعاب والمناسبات والأنشطة
              الترويجية.
            </p>
            <p>2,8.لتقديم المساعدة المهنية لك;</p>
            <p>
              2,9.تعزيز أمن المعلومات، والقدرة على منع الغش، وفرز الأنشطة غير
              المرغوب فيها والكشف عنها ؛ و
            </p>
            <p>
              2,10.وضع إحصاءات شاملة ونشر أي معلومات من أجل تقديم وتحسين
              خدماتنا;
            </p>
            <p>
              إن استخدام معلوماتك الشخصية ضروري لدعم الأغراض التجارية، بما في
              ذلك، على سبيل المثال لا الحصر، الإخطار، والتحقيق، والتذكير
              بالمنتجات، والمراسلات ذات الصلة، وغير ذلك من مواد التسويق
              والترويج، شريطة أن تتم على نحو يتناسب مع خصوصياتك.
            </p>

            <h4>3,المعلومات الشخصية التي نتشاركها</h4>
            <p>
              3.1,يمكن لـ Sokgate أن يتشارك أو يسمح له بالوصول إلى معلوماتك
              الشخصية لمقدم الخدمة، من هو المسؤول عن الحفاظ على السرية وعدم
              السماح باستخدام بياناتك الشخصية إلا للغرض المحدد، وليس لأغراضه
              الخاصة: يمكن لطرف ثالث أن يستخدم معلوماتك الشخصية من خدمة عملائك،
              والاتصال بك بشأن المنتجات والخدمات الترويجية، والسيطرة على
              المخاطر، إجراءات منع الغش والامتثال القانوني، وخدمات تجهيز
              الفواتير والمدفوعات، ومراقبة توزيع البريد الإلكتروني، وتحقيق
              المستوى الأمثل من الأداء والبيانات وخدمات التسويق. وتشمل المعلومات
              الشخصية التي سيتم تبادلها الاسم، والعنوان البريدي، وعنوان بروتوكول
              الإنترنت، وعنوان البريد الإلكتروني، واسم الحساب، أو أي معلومات
              تجارية مشابهة.
            </p>
            <p>
              3,2,شركة سوكجيت الفرعية والشركات المرتبطة بها: للأغراض المبينة في
              هذا الجزء "2" من سياسة الخصوصية هذه، قد نتبادل معلوماتك الشخصية
              داخل عائلتنا. قد نشارك معلوماتك الشخصية لتوفير التسهيلات والخدمات
              لك.
            </p>
            <p>
              3,3,قد تتبادل Sokgate معلوماتك الشخصية مع أطراف ثالثة لتوفير
              بيانات مجمّعة ومغفلة الهوية، ولكن هذه المعلومات الشخصية لا تحدد
              هويتك الشخصية.
            </p>
            <p>
              3,4,بناءً على تعليماتك الإضافية أو على موافقتك الصريحة، قد تتبادل
              Sokgate معلوماتك الشخصية مع أطراف ثالثة لأغراض أخرى.
            </p>
            <p>
              3,5,ويجوز لشركة سوكجيت أن تسمح بالوصول إلى معلوماتك الشخصية وفقاً
              للمتطلبات القانونية (مثل أوامر الحضور أو الإجراءات القانونية أو
              أوامر التفتيش أو أوامر المحكمة) أو في حالة إبلاغك أو عدم إبلاغك،
              وفقاً للقانون المنطبق.
            </p>

            <h4>4,نحن نخزن المعلومات الشخصية</h4>
            <p>
              من أجل تقديم خدماتنا، بما في ذلك تقديم خدمات العملاء، ومراقبة
              المخاطر، ومنع الغش، وإجراءات الامتثال القانوني، والاتصال بك بشأن
              التسويق، وخدمات تجهيز المدفوعات، قد تخزن المعلومات الشخصية في مركز
              البيانات وتُنقل إلى الولايات القضائية فيما وراء البحار.
            </p>
            <p>
              شهادة درع الخصوصية: حصل سوكوكيت على شهادة درع الخصوصية بين الاتحاد
              الأوروبي والولايات المتحدة. إطار درع الخصوصية و سويسرا -الولايات
              المتحدة. إطار حماية الخصوصية. وبموجب مبدأ حماية الخصوصية، تتعهد
              سوكوغات.com بتسوية الشكاوى المتعلقة بجمع أو استخدام معلوماتك
              الشخصية.
            </p>

            <h4>5, بخصوص معلوماتك الشخصية</h4>
            <p>
              يسمح لك Sokogate بطلب الوصول إلى معلوماتك الشخصية لتحديث أو تعديل
              أو حذف أو تقييد استخدام معلوماتك الشخصية. قبل تلبية طلبك، قد نطلب
              منك، لأسباب أمنية، تقديم معلومات إضافية والتحقق من هويتك.
            </p>
            <p>
              إذا كنت بحاجة إلى كشفت نحن عرضت لأغراض التسويق المباشر طرف ثالث
              معلوماتك الشخصية قائمة، يمكنك إرسال البريد إلى
              tostaff@sokogate.com، ونحن، في غضون فترة زمنية معقولة لاتخاذ بذل
              جهد معقول.
            </p>

            <h4>6,نحن نستخدم ملفات تعريف الارتباط</h4>
            <p>
              "ملفات تعريف الارتباط" هي كمية صغيرة من البيانات التي ترسل إلى
              متصفح الخاص بك وتخزن في جهازك فقط إذا كنت تستخدم و/أو تزور موقع
              Sokgate. من خلال استخدام أو/أو زيارة مواقع Sokgate وخدماتها وتلقي
              ملفات تعريف الارتباط، توافق على تخزين ملفات تعريف الارتباط على
              جهازك. نحن نحن والأطراف الثالثة التي تقدم خدماتنا تستخدم ملفات
              تعريف الارتباط وغيرها من التكنولوجيات المماثلة لتخزين المعلومات
              الخاصة بك، وتتبع عدد الزيارات التي تقوم بها إلى Sokoggate.com،
              وتحديد الخدمات الخاصة التي تستخدمها، ومساعدة شركائنا في تتبع عدد
              الزيارات التي يقوم بها المستخدمون، والمساعدة في تحديد المواقع حسب
              اهتمامات المستخدمين، وتيسير وصولك إلى أي خدمة ذات صلة، وتقديم
              خدماتنا وضمان تنفيذها بشكل صحيح.
            </p>

            <h4>7,الأمن</h4>
            <p>
              سوكوغات.com اتخذت تدابير أمنية لحماية المعلومات الشخصية ومعلومات
              الدفع التي تتشاطرها معنا. وتخضع المعلومات الحساسة المتعلقة
              بالمدفوعات، ونقل البيانات الشخصية، واعتماد الهوية لطبقات مقابس
              الرفالات (Secure Socket Layer، SSL) توفير الحماية من الثغرات
              الأمنية والزيارات غير المأذون بها.
            </p>
            <p>
              ومع ذلك، وعلى الرغم من التدابير والجهود التي اتخذناها، فإن
              Sokoggate.com لا تضمن الحماية والأمن المطلقين لمعلوماتك الشخصية أو
              أي معلومات أخرى قمت بتحميلها. لذلك، نشجعك على وضع كلمة مرور قوية
              على حساب المستخدم الخاص بك على Sokoggate.com وتجنب تزويدنا بأي
              معلومات شخصية حساسة.
            </p>

            <h4>8.تحديث سياسة الخصوصية</h4>
            <p>
              وقد نقوم بتحديث هذه السياسة المتعلقة بالخصوصية بحيث تعكس التغييرات
              التي طرأت على ممارستنا في جمع المعلومات الشخصية واستخدامها
              وتخزينها، وفقاً لمتطلبات القانون الواجب التطبيق. وبالتالي، إذا
              أدخلنا أي تغيير على سياسة الخصوصية، فإننا نبلغكم بأي تغيير قبل
              إجراء التغيير عن طريق البريد الإلكتروني أو موقع سوكوغاتي. ونشجعكم
              على الاطلاع على هذه الصفحة بانتظام للحصول على أحدث المعلومات عن
              سياساتنا المتعلقة بالخصوصية. تنطبق سياسة الخصوصية على جميع
              المعلومات الشخصية التي لدينا عن موقعنا على الإنترنت.
            </p>

            <h4>9.اتصل بنا</h4>
            <p>
              إذا كانت هناك مشكلة لأية ادعاءات أو قدمتموه إلى سياسة الخصوصية، أو
              يرغب في ممارسة أو غيرها من الحقوق المذكورة أعلاه، لا تترددوا في
              الاتصال نحن من حماية البيانات stuff@sokogate.com. ونؤكد لكم أننا
              سنحسم أي شكاوى تتعلق بمعلوماتكم الشخصية وفقاً لسياسة الخصوصية هذه.
              © 2020-2026 ultimo trading co limited or its affiliates.
            </p>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'ru'">
        <b-col>
          <div class="col">
            <p>
              Чтобы удовлетворить требования пользователей и/или посетителей
              sokogate.com, sokogate.com применяет свою политику
              конфиденциальности, чтобы показать вам, как sokogate.com собирает,
              использует, делится и использует вашу личную информацию, а также
              описывает ваше право на эту информацию. Эта политика
              конфиденциальности применима ко всем пользователям, членам и
              услугам в сокгейт. Однако, вы можете зайти на наш сайт и не давать
              нам никакой личной информации
            </p>
            <p>
              Для удовлетворения потребностей пользователей и/или посетителей
              sokogate.com, sokgate.com, прежде чем использовать сервис
              sokogate.com, sokgate, пожалуйста, прочтите эту политику
              конфиденциальности и убедитесь, что вы полностью понимаете наш
              подход к вашей личной информации.
            </p>
            <p>
              Если у вас есть какие-либо вопросы по поводу политики
              конфиденциальности в данном случае, вы можете обратиться к
              стафф@sokogate.com. С помощью доступа или/и использования
              sokogate.com вы признаёте, что прочитали политику
              конфиденциальности бена
            </p>

            <h4>Продвигать свой бизнес через sokgate electronics</h4>
            <p>
              Sokogate предоставляет вашему предприятию полный онлайн-магазин,
              чтобы максимально легко продемонстрировать вашу продукцию и услуги
              без каких-либо закодированных или дизайновых навыков.
            </p>
            <p>
              Начинаем продавать сокогейт сегодня! Вот вам совет, как основать и
              управлять вашим магазином на сокогейт:
            </p>

            <h4>1,Личная информация, которую мы собрали</h4>
            <p>
              Для того чтобы стать пользователем или членом sokogate.com и
              использовать или покупать услуги, мы должны собрать личную
              информацию, связанную с представителями отдельных лиц или
              коммерческих организаций. Эти личные данные включают ваше имя,
              адрес электронной почты, номер мобильного телефона, номер
              телефона, номер телефона, платежную информацию и контактный адрес.
              Мы также можем собрать личную информацию, используемую в общих
              чертах, например, о Том, что пользователи используют в сервисах
              для просмотра и кликов, включая IP-адреса интернет-протоколов,
              шаблоны просмотра, модели покупок. Мы можем собрать любую
              информацию о покупке или использовании наших продуктов и услуг,
              таких как тип услуг, информация о ценах и записи торговых жалоб.
            </p>

            <h4>2, Причина сбора личной информации</h4>
            <p>Вот почему мы собираем и используем вашу личную информацию:</p>
            <p>2,1,Предлагает услуги sokgate;</p>
            <p>
              2,2,Развивать и улучшать наши услуги в зависимости от общих или
              личных предпочтений и опыта пользователей;
            </p>
            <p>
              2,3,Развивать и улучшать наши услуги в зависимости от общих или
              личных предпочтений и опыта пользователей;
            </p>
            <p>
              2,4,Обработа пользовател быт на международн рынк покупк и/ил
              подписк;
            </p>
            <p>
              2.5,Согласно истории пользователей, мы предоставляем нашим
              пользователям уведомления и пропагандистскую информацию,
              относящиеся к общим услугам, для улучшения наших продуктов и
              услуг;
            </p>
            <p>
              2,6,Соблюдайте все соответствующие правовые правила или правовые
              процедуры.
            </p>
            <p>
              2,7,Анализируя нашу рыночную деятельность, мы предлагаем
              определенные соревнования, мероприятия и рекламные кампании.
            </p>
            <p>2,8.Оказываю вам профессиональную помощь;</p>
            <p>
              2,9.Укреплять информационную безопасность агентства, предотвращать
              мошенничество, а также проверку и проверку неблагоприятной
              деятельности; и
            </p>
            <p>
              2,10.Создание интегрированной статистики и публикация любой
              информации для обеспечения и улучшения наших услуг;
            </p>
            <p>
              Наше использование вашей личной информации необходимо для
              поддержки бизнес-целей, в Том числе уведомлений, расследований,
              напоминаний о продуктах, связанных с ними коммуникациях и других
              маркетинговых и рекламных материалов, при условии, что они будут
              осуществляться соответствующим образом и уважать ваше право на
              частную жизнь.
            </p>

            <h4>3,Личная информация, которую мы делим</h4>
            <p>
              3.1,Sokgate может поделиться или предоставить доступ к вашей
              личной информации провайдеру службы, Тот, кто несет
              ответственность за конфиденциальность и позволяет использовать ваш
              профиль только для целей, указанных ниже, а не для своих: третья
              сторона может использовать вашу личную информацию, чтобы
              обеспечить вас услугами клиента, связаться с вами по поводу
              продвижения продукции и услуг, осуществлять контроль за рисками,
              Меры по предотвращению мошенничества и правовая регулировка,
              услуги по обработке и оплате, мониторинг распространения
              электронных писем и оптимизация производительности, данных и
              маркетинговых услуг. К личной информации, которая будет
              использована, будут относиться имена, почтовые адреса, адреса
              интернет-протоколов, адреса электронной почты, имена аккаунтов или
              другие подобные коммерческие данные идентификатора.
            </p>
            <p>
              3,2,Дочерняя компания sokgate и связанная с ней компания: для
              целей, указанных в разделе 2 настоящей политики
              конфиденциальности, мы можем поделиться вашей личной информацией
              внутри нашей корпоративной семьи. Мы могли бы поделиться вашей
              личной информацией, чтобы обеспечить вас удобствами и услугами.
            </p>
            <p>
              3,3,Sokgate может поделиться вашей личной информацией с третьей
              стороной, чтобы предоставить сводки и анонимные данные, но эта
              личная информация не может идентифицировать вас.
            </p>
            <p>
              3,4,Сокгейт также может делиться вашей личной информацией с
              третьей стороны в других целях в соответствии с вашими дальнейшими
              инструкциями или с вашим ясным одобрением.
            </p>
            <p>
              3,5,Сокгейт может получить доступ к вашей личной информации в
              соответствии с законом (например, повесткой в суд, судебным
              процессом, ордером или судебным ордером) или в случае уведомления
              или неуведомления в соответствии с применимым законом.
            </p>

            <h4>4,Личные данные, которые мы храним</h4>
            <p>
              В целях предоставления наших услуг, включая предоставление услуг
              по обслуживанию клиентов, обеспечение контроля над риском,
              предотвращение мошенничества и правовых процедур, связь с вами по
              вопросам продвижения, а также услуги по обработке платежей, личная
              информация может храниться в центре данных и передаваться в
              зарубежные юрисдикции.
            </p>
            <p>
              Sokogate был сертифицирован европейским — американским щитом
              конфиденциальности. Рама для защиты частной жизни и
              швейцарско-американская. Фреймворк для защиты конфиденциальности.
              В соответствии с принципами защиты частной жизни, sokogate.com
              обещает разрешить жалобы на сбор или использование вашей личной
              информации.
            </p>

            <h4>5, Право на личную информацию</h4>
            <p>
              Sokogate позволяет запрашивать доступ к вашей личной информации
              для обновления, модификации, удаления или ограничения
              использования вашей личной информации. Прежде чем удовлетворить
              ваши требования, в целях безопасности, мы можем попросить вас
              предоставить дополнительную информацию и подтвердить вашу
              личность.
            </p>
            <p>
              Если вам нужен список личной информации, которую мы раскрываем
              третьей стороне для прямых маркетинговых целей, вы можете
              отправить имейлы на tostaff@sokogate.com, и мы приложим разумные
              усилия для того, чтобы удовлетворить ваши требования в течение
              разумного времени.
            </p>

            <h4>6,Мы используем куки</h4>
            <p>
              "Cookies" — это небольшое количество данных, отправленных в
              браузер и хранящихся на вашем оборудовании, только если вы
              используете или/или заходите на сайт sokgate. Используя или/и
              посещая сайты и услуги sokgate, а также получая cookies, вы
              соглашаетесь хранить cookies на вашем оборудовании. Мы и наши
              провайдеры услуг третьей стороны используем куки и другие подобные
              технологии для хранения вашей информации, отслеживая количество
              ваших посещений на sokogate.com, выявляя конкретные услуги,
              которые вы используете, помогая нашим партнерам отслеживать
              количество посещений пользователей, помогая найти рекламу в
              зависимости от интересов пользователей, А также удобно
              использовать любые соответствующие услуги, предоставлять наши
              услуги и гарантировать, что они будут надлежащим образом
              выполнены.
            </p>

            <h4>7,безопасн</h4>
            <p>
              Sokogate.com предприняла меры безопасности, направленные на защиту
              личной информации и платежной информации, которой вы делитесь с
              нами. Конфиденциальная информация о платежах, передача личных
              данных и принятие личных данных находятся на стандартном уровне в
              промышленности уровне доступа к презервативам (Secure) Socket
              Layer, SSL) защита от взлома системы безопасности и
              несанкционированного доступа.
            </p>
            <p>
              Однако, несмотря на наши меры и усилия, sokogate.com не может
              гарантировать абсолютную защиту и безопасность вашей личной
              информации или любой другой информации, которую вы загрузите.
              Поэтому мы призываем вас установить сильные пароли на ваш аккаунт
              пользователя на sokogate.com и избегать предоставления нам
              конфиденциальной личной информации.
            </p>

            <h4>8.Обновить политику конфиденциальности</h4>
            <p>
              Мы можем обновить эту политику конфиденциальности в соответствии с
              требованиями применимого закона, чтобы отразить изменения в нашей
              личной информации, использовании и хранении. Таким образом, если
              мы внесем какие-либо изменения в нашу политику конфиденциальности,
              мы будем информировать вас о любых изменениях до того, как мы их
              изменим, через электронную почту или через сайт sokogate. Мы
              призываем вас регулярно проверять эту страницу для получения новой
              информации о нашей политике конфиденциальности. Политика
              конфиденциальности применима ко всей личной информации, которая у
              нас есть о вас на нашем сайте.
            </p>

            <h4>9.Свяжись с нами.</h4>
            <p>
              Если у вас есть какие-либо требования или вопросы к настоящей
              политике конфиденциальности или желание воспользоваться
              вышеуказанными или другими правами, пожалуйста, обращайтесь к
              нашему офицеру по защите данных stuff@sokogate.com. Мы заверяем
              вас, что мы будем принимать любые жалобы, связанные с вашей личной
              информацией, в соответствии с политикой конфиденциальности бена.
              © 2020-2026 ultimo trading co limited or its affiliates.
            </p>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'per'">
        <b-col>
          <div class="col">
            <p>
              برای ملاقات به نیازهای خصوصی کاربران و / یا ملاقات‌کنندگان با
              استفاده از sokogate.com، sokogate.com این سیاست خصوصی را برای نشان
              دادن به شما sokogate می‌دهد چطور جمع، استفاده، شریک و استفاده از
              اطلاعات شخصی خود باشید و حقوق خود را به اطلاعات شخصی توصیف کنید.
              این سیاست خصوصی برای تمام کاربران، اعضا و خدمات سوکگیت است. با این
              حال، شما فقط می توانید وب سایت ما را بدون هیچ اطلاعاتی شخصی به ما
              بدهید
            </p>
            <p>
              برای ملاقات به نیازهای خصوصی کاربران و / یا ملاقات کنندگان با
              استفاده از sokogate.com و sokgate COM، خدمت سوکگيت، لطفاً اين
              سياست خصوصي رو روشن بخون و مطمئن شويد که تمرين ما رو در اطلاعات
              شخصي خودتون کاملا درک کنيد.
            </p>
            <p>
              اگر سوالی در مورد این سیاست خصوصی دارید، لطفاً تماس بگیرید
              staff@sokogate.com . با ملاقات یا / و استفاده از sokogate.com، شما
              اعتراف می کنید که شما این سیاست خصوصی را خوندید
            </p>

            <h4>تجارتت رو از سوکگيت تجارت E پيشنهاد بده</h4>
            <p>
              Sokogate تجارت شما را با یک فروشگاه کامل آنلاین می‌دهد تا محصولات
              و خدمات شما را به اندازه‌ی آسانی که ممکن است بدون هیچ مهارت کودیک
              یا طراحی نشان دهد.
            </p>
            <p>
              امروز شروع به فروش سوکوگات این چند پیشنهاد در مورد چگونه ساختن و
              اجرای فروشگاه شما در سوکوگات است:
            </p>

            <h4>1,اطلاعات شخصی که ما جمع می کنیم</h4>
            <p>
              برای تبدیل به سوکوگات کم و استفاده از خدمات یا خرید، ما باید
              اطلاعات شخصی که مربوط به فردی یا نماینده های سازمان تجاری هستند را
              جمع کنیم. این اطلاعات شخصی شامل نام شما ، آدرس ایمیل ، شماره تلفن
              موبایل ، کشور ، اطلاعات پرداخت و آدرس ارتباط است. می‌توانیم
              اطلاعات شخصی که استفاده می‌شود را جمع کنیم و جمع کنیم، مانند بررسی
              کاربران و فعالیت‌های سیستم در خدمت کلیک کنیم، شامل آدرس اینترنت
              Protocol "IP"، حالت بررسی و خرید. ما می توانیم اطلاعات درباره
              خریدن یا استفاده از محصولات و خدمات خود را جمع کنیم، مثل نوع
              خدمات، اطلاعات قیمت و هر گزارش شکایت تجاری.
            </p>

            <h4>2, دلایل جمع اطلاعات شخصی</h4>
            <p>
              ما اطلاعات شخصی شما را برای دلایل زیر جمع می کنیم و استفاده می
              کنیم::
            </p>
            <p>2,1,Name;</p>
            <p>
              2,2,توسعه و تحصیل خدمات ما را بر اساس ترجیح‌های عمومی یا شخصی و
              تجربه‌های کاربر توسعه دهید;
            </p>
            <p>
              2,3,توسعه و تحصیل خدمات ما را بر اساس ترجیح‌های عمومی یا شخصی و
              تجربه‌های کاربر توسعه دهید;
            </p>
            <p>2,4,خریدن و / یا تبلیغات کاربران ما در بازار بین المللی;</p>
            <p>
              2.5,طبق تاریخ کاربر، کاربران ما را با اطلاعات عمومی و اطلاعات
              ترفیع برای بهترین تولید محصولات و خدمات ما ارائه می دهد;
            </p>
            <p>2,6,با هر قانون، قانون یا روش قانونی مواجه بشه.</p>
            <p>
              2,7,فعاليت بازارينگ ما رو تحليل کنيد و مسابقه‌ها، اتفاقات و
              ترفيع‌ها رو تحليل کنيد.
            </p>
            <p>2,8.به شما کمک حرفه ای دادم;</p>
            <p>
              2,9.امنیت داده‌های وزارت، توانایی جلوگیری از خیانت و تحقیق و بررسی
              فعالیت‌های ناپسندیده و
            </p>
            <p>
              2,10.Establish comprehensive statistics and publish any
              information to provide and improve our services;
            </p>
            <p>
              استفاده از اطلاعات شخصی شما نیاز است برای حمایت به هدف تجارت، شامل
              این است که نه محدود به یادآوری، تحقیقات، یادآوری محصولات، ارتباطات
              مربوط به تمامی بازاری و دیگر مواد ترفیع و ترفیع، با وجود این که
              این کار به طریقی که با خصوصیت شما ارتباط دارد و به احترام
            </p>

            <h4>3,اطلاعات شخصی که</h4>
            <p>
              3.1,Sokgate ممکنه دسترسی به اطلاعات شخصی شما برای پردازگاران خدمات
              شریک شود یا اجازه دهد، کسانی که مسئولیت محرمانه نگه دارند و تنها
              اجازه دهند استفاده از اطلاعات شخصی شما برای هدف‌های مشخص‌شده، نه
              برای هدف خودشان: سومین گروه می‌توانند از اطلاعات شخصی شما استفاده
              کنند تا خدمت مشتری را به شما بدهند، در مورد محصولات و خدمات ترفیع
              با شما تماس بگیرند و کنترل خطر پرونده‌های پیشگیری از فریب و تعافی
              قانونی، خدمات پرداخت حساب و پرداخت، توزیع ایمیل، و عملکرد، داده‌ها
              و خدمات بازاری optimization. اطلاعات شخصی که باید مشترک شوند شامل
              نام ، آدرس پست ، آدرس پروتکل اینترنت ، آدرس ایمیل ، نام حساب ، یا
              اطلاعات تجارت مشابه‌ای است.
            </p>
            <p>
              3,2,دفترهای سوکگات و ارتباطات: برای هدف توصیف در بخش 2 از این
              سیاست خصوصی ممکن است اطلاعات شخصی شما را در خانواده شرکت خود شریک
              کنیم. ما ممکنه اطلاعات شخصي شما رو براي اطلاعات راحتي و خدمات
              براتون تقسيم کنيم
            </p>
            <p>
              3,3,Sokgate می‌تواند اطلاعات شخصی خود را با سوم فرقه‌ها به تقسیم
              دهد تا اطلاعات جمع و نام‌نام را بدهید، ولی این اطلاعات شخصی شما را
              شخصا نمی‌تواند شناسایی کند.
            </p>
            <p>
              3,4,طبق دستورات اضافه‌ای یا تصمیم مشخص شما، سوکگیت می‌تواند
              اطلاعات شخصی خود را برای هدف‌های دیگر با حزب‌های سوم شریک کنید.
            </p>
            <p>
              3,5,Sokgate می‌تواند به اطلاعات شخصی شما اجازه دهد که با نیازهای
              قانونی دسترسی داشته باشید (مثل قانون قانونی، دادگاه قانونی،
              دستورات جستجو یا دستورات دادگاهی) یا با یا بدون اطلاعات به شما
              برسد، در accordance with laws applicable.
            </p>

            <h4>4,اطلاعات شخصی که ما ذخیره می کنیم</h4>
            <p>
              برای اینکه خدمات ما را تهیه کنیم، شامل تهیه خدمات مشتری، کنترل خطر
              انجام دهیم، جلوگیری از فریب و اجرای تعافی قانونی، با شما در مسائل
              ترفیع، و اجرای خدمات پرداخت پرداخت، اطلاعات شخصی ممکن است در مرکز
              داده ها ذخیره شود و به حکومت های خارجی انتقال شود.
            </p>
            <p>
              برای اینکه خدمات ما را تهیه کنیم، شامل تهیه خدمات مشتری، کنترل خطر
              انجام دهیم، جلوگیری از فریب و اجرای تعافی قانونی، با شما در مسائل
              ترفیع، و اجرای خدمات پرداخت پرداخت، اطلاعات شخصی ممکن است در مرکز
              داده ها ذخیره شود و به حکومت های خارجی انتقال شود. گواهی محافظت
              خصوصی: سوکوگات گواهی محافظت خصوصی اروپا و آمریکا را گذاشته است.
              چهارچوب محافظت خصوصی و سوئیس ایالات متحده. چهارچوب محافظت خصوصي بر
              اساس اصل محافظت خصوصی، sokogate.com تعهد شده که شکایت در مورد جمع
              یا استفاده از اطلاعات شخصی شما را حل کند.
            </p>

            <h4>5, درست به اطلاعات شخصی شما</h4>
            <p>
              Sokogate به شما اجازه می‌دهد که دسترسی به اطلاعات شخصی خود را
              درخواست کنید تا از استفاده از اطلاعات شخصی خودتان آغاز، تغییر، حذف
              یا محدود کنید. قبل از اينکه لازمات شما رو پيدا کنيم، به دلايل
              امنيتي، ممکنه از شما بخوايم اطلاعات اضافي بديد و هويت شما رو تاييد
              کنيم.
            </p>
            <p>
              اگر شما به فهرست اطلاعات شخصی نیاز دارید که ما برای هدف بازار
              مستقیم به سوم حزب اعلام می کنیم، می توانید یک ایمیل به
              tostaff@sokogate.com ما در طول زمان منطقي براي نيازهاي شما تلاش
              منطقي ميکنيم
            </p>

            <h4>6,ما از کیکی استفاده می کنیم</h4>
            <p>
              "کوکیها" تعداد کوچک داده‌ای است که به بررسی شما فرستاده می‌شود و
              تنها وقتی استفاده می‌کنید یا / و وبسایت سایت سوکگیت را ببینید. با
              استفاده یا / و دسترسی به وب سایت سوکگیت و خدمات و پذیرفتن کوکیها،
              موافقت می کنید که کوکیها را در دستگاه خود ذخیره کنید. ما و
              پردازگاران خدمات سوم حزب ما از کیکی ها و تکنولوژی های مشابه
              استفاده می کنیم تا اطلاعات خاص شما را ذخیره کنیم و دسترسی شما به
              سوکوگات را پیدا کنیم COM، خدمات مخصوص را که استفاده می کنید
              شناسایی کنید، شریکان ما را کمک کنید تا تعداد ملاقات کاربر را
              ردیابی کند، و کمک کنید به محل منافع کاربر تبلیغات را پیدا کنید، و
              برای آسانی از استفاده از هر خدمات مربوط به شما، خدمات ما را فراهم
              کنید و به عملکرد درست آنها مطمئن کنید.
            </p>

            <h4>7,امنیت</h4>
            <p>
              Sokogate.com برای حفاظت از اطلاعات شخصی و اطلاعات پرداختی که با ما
              شریک می‌کنید، مقدار امنیتی را گرفته است. اطلاعات پرداخت حساس،
              انتقال داده های شخصی و پذیرش هویت همگی توسط طبقه ساکت امن
              استاندارد صنعتی تأثیر می کنند (امن) لایه سوکت، SSL) برای جلوگیری
              از آسیب‌های امنیت و دسترسی غیرقانونی.
            </p>
            <p>
              ولی با وجود اندازه‌های ما و تلاش‌های ما، sokogate.com نمی‌تواند
              محافظت کامل و امنیت اطلاعات شخصی شما را تضمین دهد یا اطلاعات دیگری
              را که شما بارگذاری می‌کنید. Therefore, we encourage you to set a
              strong password for your user account on sokogate.com and avoid
              providing us with any sensitive personal information.
            </p>

            <h4>8.سیاست خصوصی</h4>
            <p>
              ممکن است این سیاست خصوصی را به طور لازم توسط قانون قابل کاربردی
              برای تغییرات در مجموعه اطلاعات شخصی ما، استفاده و ذخیره کنیم.
              بنابراین، اگر ما تغییرات برای این سیاست خصوصی انجام دهیم، قبل از
              اینکه تغییرات را انجام دهیم، به شما خبر خواهیم داد. ما شما را
              تشویق می کنیم که این صفحه را معمولاً برای اخیر اطلاعات درباره
              سیاست خصوصی ما چک کنید. سیاست خصوصی بر تمام اطلاعات شخصی که در
              مورد شما داریم، تفاوت می‌کند که با وبسایت ما ارتباط دارد.
            </p>

            <h4>9.با ما تماس بگیرید</h4>
            <p>
              اگر شما در مورد این سیاست خصوصی نیازی یا سوال دارید، یا می خواهید
              حقوق بالا یا دیگر را تمرین کنید، لطفاً آزاد باشید که با افسر
              محافظت اطلاعات ما تماس بگیرید stuff@sokogate.com . ما شما را مطمئن
              می‌کنیم که ما هر شکایتی که مربوط به اطلاعات شخصی شما هست در مقابل
              این سیاست خصوصی حل خواهیم کرد.
              © 2020-2026 ultimo trading co limited or its affiliates.
            </p>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="locale == 'hi'">
        <b-col>
          <div class="col">
            <p>
              sokogate.com के प्रयोग करने के लिए प्रयोक्ता और / या भ्रमण
              करनेवालों की निजीविकता की जरूरतों को पूरा करने के लिए,
              sokogate.com ने इस निजीवित पालिस अपनी व्यक्तिगत जानकारी को कैसे
              जमा करें, इस्तेमाल करें, साझा करें, और इस्तेमाल करें, और निजी
              जानकारी के लिए अपने अधिका यह निजीवित पालिसी सभी उपयोक्ता, सदस्य और
              सेवा के लिए लागू है. हालाँकि आप केवल हमारे वेबसाइट को ब्राउज कर
              सकते हैं, किसी व्यक्तिगत जानकारी के साथ
            </p>
            <p>
              sokogate.com और sokgate के प्रयोग कर रहे हैं उपयोक्ता और / या
              भ्रमण करनेवालों की निजीविकता की आवश्यकता पूरी करने के लिए कॉम,
              सॉकगेट सेवा, कृपया इस निजीवित पालिसी स्पष्ट रूप से पढ़ो और
              सुनिश्चित करो कि आप अपने व्यक्तिगत जानकारी में
            </p>
            <p>
              यदि आपके पास इस निजीवित नीति के बारे में कोई प्रश्न है, कृपया
              संपर्क करें staff@sokogate.com . जाने या / और sokogate.com के
              प्रयोग के द्वारा, आप समझते हैं कि आप इस निजीवित पालिसी को पढ़ते
              हैं
            </p>

            <h4>सॉक्गेट ईव्यापार के द्वारा अपना व्यापार प्रकट करें</h4>
            <p>
              सोकोगेट अपने व्यवसाय को पूरा ऑनलाइन दुकान देता है कि अपने उत्पादन
              और सेवा को कोडिंग या डिजाइन क्षमता के बिना किसी आसा
            </p>
            <p>
              आज सोकोगाट विक्री करना शुरू करें! यहाँ कुछ सुझावें हैं कि अपने
              दुकान कैसे बनाना और चलाना है:
            </p>

            <h4>1,व्यक्तिगत जानकारी</h4>
            <p>
              In order to become sokogate कॉम व्यवसाय संस्थाओं के संबंधित
              व्यक्तियों के संबंधित व्यक्तियों के संबंधित व्यक्तिगत जानकारी जमा
              करना इन व्यक्तिगत जानकारी में आपका नाम, ईमेल पता, मोबाइल फोन नंबर,
              देश, पैसा जानकारी तथा संपर्क पता है. हम भी इस्तेमाल किया गया
              व्यक्तिगत जानकारी संग्रह कर सकते हैं, जहिना उपयोक्ता ब्राउज़िंग और
              सेवा पर स्ट्रीम क्रियाकल क्लिक कर सकते हैं, इ हम अपने उत्पादनों और
              सेवा के बारे में किसी कोई खरीद या उपयोग के बारे में जानकारी जमा कर
              सकते हैं, जैसे सेवा प्रकार, मूल्य स
            </p>

            <h4>2, व्यक्तिगत जानकारी जमा करने के लिए कारण</h4>
            <p>
              हम निम्न कारणों के लिए तुम्हारी व्यक्तिगत जानकारी एकत्रित करते हैं
              और इसे प्रयोग करते हैं::
            </p>
            <p>2,1,Name;</p>
            <p>
              2,2,उपयोक्ता के सामान्य या व्यक्तिगत प्राथमिकताओं और अनुभवों के
              अनुसार हमारे सेवा को विकास करें;
            </p>
            <p>
              2,3,उपयोक्ता के सामान्य या व्यक्तिगत प्राथमिकताओं और अनुभवों के
              अनुसार हमारे सेवा को विकास करें;
            </p>
            <p>
              2,4,अंतर्राष्ट्रीय बाजार में हमारे प्रयोक्ता के खरीद और / या
              सदस्यता को हैंडल करें;
            </p>
            <p>
              2.5,उपयोक्ता के इतिहास के अनुसार, हमारे प्रयोक्ताओं को सामान्य
              सेवा संबंधित सूचना और प्रगति सूचना दे दें;
            </p>
            <p>
              2,6,किसी लागू होने वाली नियम, नियम या व्यवस्था प्रक्रिया के साथ
              संपूर्ण है.
            </p>
            <p>
              2,7,हमारी मार्केटिंग क्रियाकलापों को विश्लेषण करें और कुछ सहभाग,
              घटनाओं और प्रगति देते हैं।
            </p>
            <p>2,8.आपको प्रोफेशनल सहायता से प्रदान करें;</p>
            <p>
              2,9.विभाग की डाटा सुरक्षा, धोखा प्रेविक्षण क्षमता और अपेक्षित
              क्रियाओं की स्क्रीनिंग और परीक्षा करें; 和
            </p>
            <p>
              2,10.सम्पूर्ण तथ्याङ्क स्थापित करें और हमारे सेवा को प्रदान करने
              और सुधार करने के लिए किसी जानकारी प्रकाशन;
            </p>
            <p>
              हमारे व्यक्तिगत जानकारी का उपयोग आपके व्यवसाय के लिए आवश्यकता है,
              कि व्यवसाय के उद्देश्यों को समर्थन करने के लिए, लेकिन नोटिस,
              संशोधन, उत्पादक याद से सीमि
            </p>

            <h4>3,व्यक्तिगत जानकारी</h4>
            <p>
              3.1,सेवा प्रदायकों के लिए सॉक्गेट आपके व्यक्तिगत जानकारी को
              साझेदारी या अनुमति दे सकता है, जिसके पास गुप्त जानकारी रखने के लिए
              है और सिर्फ अपनी व्यक्तिगत जानकारी को निम्न निर्दिष्ट उद्देश्यों
              के लिए इस्तेमाल करने के लिए अनुमति देती है, नहीं, अपने अपने हिस्
              व्यभिचार परिभाषा और व्यवस्था अनुसरण प्रक्रिया, बिलिंग और पैसा
              प्रोसेसिंग सेवा, इमेल वितरण का निरीक्षण, प्रकार्य, डाटा और मा साझा
              होने के लिए व्यक्तिगत जानकारी में नाम, पोस्ट पता, इन्टरनेट
              प्रोटोकाल पता, ईमेल पता, खाता नाम, या अन्य समान पहिचान
            </p>
            <p>
              3,2,सोक्गेट सबसीडीयरी और संबंधित हैं: इस निजीवित पालिसी के खण्ड
              "2" में वर्णन के लिए, हम अपने कंपनी परिवार में तुम्हारी व्यक्तिगत
              हम तुम्हारे लिए उपयोग और सेवा देने के लिए तुम्हारी व्यक्तिगत
              जानकारी साझा कर सकते हैं.
            </p>
            <p>
              3,3,सारांश और अनामिक डाटा देने के लिए Sokgate आपके व्यक्तिगत
              जानकारी को तीसरे पार्टी के साथ साझा कर सकता है, लेकिन यह व्यक्तिगत
              जा
            </p>
            <p>
              3,4,अपने अतिरिक्त आदेशों के अनुसार या आपकी स्पष्ट अनुमति के
              अनुसार, सोकगेट भी अपनी व्यक्तिगत जानकारी को अन्य कार्यों के ल
            </p>
            <p>
              3,5,सॉक्गेट तुम्हारी व्यक्तिगत जानकारी को व्यक्तिगत जानकारी के
              अनुसार अनुमति दे सकता है (जहिना उपपुण्स, व्यवस्थापित, खोज वारंट्स
              या कोर्ट
            </p>

            <h4>4,व्यक्तिगत जानकारी जो हम भण्डार करते हैं</h4>
            <p>
              हमारे सेवाओं को प्रदान करने के लिए, ग्राहक सेवा प्रदान करने के
              समाविष्ट, जोखिया नियंत्रण करने के लिए, भ्रष्ट और व्यवस्थापित
              प्रक्रिया कार्यों को रोकते हैं, तुम्ह
            </p>
            <p>
              प्राइवेसी शील्ड प्रमाणपत्र: सोकोगेट यूएस-यूएस-यूएस प्राइवेसी शील्ड
              प्रमाणपत्र प्राप्त कर दि निजी शील्ड फ्रेमवर्क और स्विट्जरलैंड
              यूनाइटेड स्टेट्स. निजी सुरक्षा फ्रेमवर्क. निजीवित सुरक्षा के
              प्राधान के अनुसार, sokogate.com को हमारे संग्रह या आपके व्यक्तिगत
              जानकारी के बारे में शिक्षा हल करने के ल
            </p>

            <h4>5, अपने व्यक्तिगत जानकारी के लिए दायाँ</h4>
            <p>
              सोकोगेट आपको अपनी व्यक्तिगत जानकारी को अद्यतन, परिमार्जन, मिटाना
              या सीमा करने के लिए अनुमति देता है. आपकी आवश्यकता से पहले, सुरक्षा
              कारणों के लिए, हम आपसे अतिरिक्त जानकारी प्रदान करने के लिए पूछ
              सकते हैं और आपकी पर
            </p>
            <p>
              如果您需要一份我们为直接营销目的向第三方披露的个人信息清单, 您可以send邮件至tostaff@sokogate.com, 我们将在合理的时间内为您的要求做出合理的努力.
            </p>

            <h4>6,हम कुकी उपयोग करते हैं</h4>
            <p>
              "कुकीज़" छोटे डाटा हैं जो आपके ब्राउज़र में भेजे जाते हैं और आपके
              डिवाइस में सिर्फ जब आप इस्तेमाल करते हैं या / और सॉकगेट वेबसाइ
              सॉकगेट वेबसाइट और सेवाओं और कुकी स्वीकार कर रहे हैं या / और सोकगेट
              वेबसाइट और सेवाओं को प्रयोग कर रहे हैं, आप अपने ड हम और हमारे
              तीसरे पार्टी सेवा प्रदायक कुकी और अन्य समान तकनीकों का उपयोग करें
              COM, आप इस्तेमाल करते हैं विशिष्ट सेवा को पहचान करें, आपके
              साथीदारों को उपयोक्ता भेटने की संख्या ट्रैक करने के लिए मदद करें,
              और उपय और आपको किसी संबंधित सेवा का उपयोग सुधार करने के लिए, हमारी
              सेवा प्रदान करने के लिए और उनकी सही कार्यान्व
            </p>

            <h4>7,सुरक्षा</h4>
            <p>
              Sokogate.com ने व्यक्तिगत जानकारी और पैसा जानकारी को हमारे साथ
              साझा करने के लिए सुरक्षा माप लिया है। संवेदनशील पैसा जानकारी,
              व्यक्तिगत डाटा का प्रसारित और पहचानता का प्राप्त करना सभी उद्योग
              सुरक्षित सॉकेट तह से सॉकेट तह, एसएसएल) सुरक्षा सुरक्षा सुरक्षा तथा
              अनुमोदनित पहुँच से रोकने के लिए.
            </p>
            <p>
              हालाँकि हमारे मापक और प्रयासों के बाद, sokogate.com अपने व्यक्तिगत
              जानकारी की पूरी सुरक्षा और सुरक्षा या किसी और अन्य जानकारी को आप
              अप इसलिए, हम आपको sokogate.com में अपने उपयोक्ता खाता के लिए
              शक्तिशाली पासवर्ड नियत करने के लिए प्रोत्साहित करते हैं और हमें
              किसी संवेदन
            </p>

            <h4>8.निजी नीति अद्यतन करें</h4>
            <p>
              हम इस गोपनीयता पालिसी को अद्यतन कर सकते हैं जिस तरह लागू होने वाले
              नियमशास्त्रों के द्वारा आवश्यकता है कि हमारे व्यक् इसलिए, यदि हम
              इस प्राइवेसी नीति के लिए कोई परिवर्तन करें, तो हम तुम्हें इमेल या
              सोकोगाट वेबसाइट के द्वारा किसी परिवर्तन के बा हम आपको इस पृष्ठ को
              नियमित रूप से जाँच करने के लिए हमारी निजीवित पालिसी के बारे में
              नवीन जानकारी के लिए प् व्यक्तिगत पालिसी हमारे बारे में सभी
              व्यक्तिगत जानकारी पर लागू है जो हमारे वेबसाइट से सम्बन्धित है.
            </p>

            <h4>9.हमसे संपर्क</h4>
            <p>
              यदि आपके पास इस निजीवित नीति के बारे में किसी आवश्यकता या प्रश्न
              है, या उप्पर या अन्य अधिकार का प्रयोग करना चाहते हैं, कृपया
              stuff@sokogate.com . हम तुम्हें निश्चित करेंगे कि हम इस गुप्तिगाह
              नीति के अनुसार अपने व्यक्तिगत जानकारी के साथ किसी भी शिक्षा को समा
              © 2020-2026 ultimo trading co limited or its affiliates.
            </p>
        <a href="HTTPS://ultimotradingltd.co.ke/" style="color: black;font-size: 18px;">HTTPS://ultimotradingltd.co.ke/</a>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>



<script>
// import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
//   components: { Breadcrumb },
  data() {
    return {
      items: [
        {
          text: this.$t("menuitems.home"),
          to: { name: "merchant_settlement" },
        },
        {
          text: this.$t("menuitems.layout.privacypolicy"),
          active: true,
        },
      ],
      locale: "en",
    };
  },
  computed: {
    // eslint-disable-next-line vue/no-dupe-keys
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
    .col {
      padding-bottom: 80px;
    }
  }
}
table {
  border: 1px solid #000;
  width: 100%;
  table-layout: fixed;
  th {
    width: 100px;
    height: 50px;
    border: 1px solid #000;
    text-align: center;
  }
  tr,
  td {
    width: 100px;
    height: 50px;
    border: 1px solid #000;
  }
}
colgroup col:first-child {
  width: 30%;
}
colgroup col:last-child {
  width: 70%;
}
</style>