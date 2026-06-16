<template>
  <b-container>
    <div v-title :data-title="$t('menuitems.home')">
      <!-- {{ step }} -->
      <div class="banner-header">
        <div class="banner-list-box">
          <b-list-group class="list">
            <template v-for="(item, index) in list">
              <b-list-group-item
                :key="index"
                href="#"
                class="list-cel d-flex justify-content-between align-items-center"
              >
                <i
                  class="sokogate category-list"
                  :class="iconMap[item.categoryName]"
                />

                <div class="list-cel-title" @click="navtoProductlist(item.id)">
                  {{ $t(`category.${item.categoryName}`) }}
                </div>
                <div class="pad" :key="`pad-${index}`">
                  <template v-for="(subItem, subIndex) in item.children">
                    <b-navbar-nav
                      class="list-cel-nav"
                      small
                      :key="`sub-${subIndex}`"
                    >
                      <b-nav-item>
                        <i
                          class="sokogate"
                          :class="iconMap[subItem.categoryName]"
                        />

                        <b-button
                          class="list-cel-nav-item text-decoration-none"
                          variant="link"
                          @click="navtoProductlist(subItem.id)"
                        >
                          {{ $t(`category.${subItem.categoryName}`) }}
                          <i class="sokogate icon-a-Path171" />
                        </b-button>
                      </b-nav-item>
                      <b-nav-item>
                        <b-button-group class="list-cel-nav-sub">
                          <template
                            v-for="(ssItem, ssIndex) in subItem.children"
                          >
                            <b-button
                              :key="`ss-${ssIndex}`"
                              class="list-cel-nav-sub-item text-decoration-none"
                              variant="link"
                              @click="navtoProductlist(ssItem.id)"
                            >
                              <i
                                class="sokogate"
                                :class="iconMap[ssItem.categoryName]"
                                style="padding-right: 5px"
                              />
                              {{
                                $t(`category.${ssItem.categoryName}`)
                              }}</b-button
                            >
                          </template>
                        </b-button-group>
                      </b-nav-item>
                    </b-navbar-nav>
                  </template>
                </div>
                <i class="sokogate icon-a-Path171" />
              </b-list-group-item>
            </template>
          </b-list-group>
        </div>
        <div class="banner-img-box">
          <banner-list-main type="601" @success="step++" class="banner-box" />
        </div>
        <!-- <div class="ad-imgBox">
          <img
            src="HTTPS://oss.sokogate.com/image/1046417f510eff949a257b3de6ee34e4,png"
            alt=""
          />
        </div> -->
      </div>
      <recommList-limitby-newproduct
        :title="$t('productHome.Newproduct')"
        v-if="step > 0"
        @success="step++"
      />
      <product-recomm-list-by-category
        :title="$t('productHome.Selected Products')"
        :types="[111]"
        v-if="step > 1"
        @success="step++"
      />

      <product-recomm-list-row-line
        :title="$t('productHome.Popular products')"
        :types="[112]"
        v-if="step > 2"
        @success="step++"
      />

      <product-recomm-list-limit
        :types="[113]"
        v-if="step > 3"
        @success="step++"
      />

      <product-recomm-list-limit-by-category
        :title="$t('productHome.Best Sale')"
        :types="[114]"
        v-if="step > 4"
        @success="step++"
      />
      <banner-list
        :title="$t('productHome.You may like it')"
        type="602"
        v-if="step > 5"
        @success="step++"
      />

      <product-recomm-list-limit
        :types="[115]"
        v-if="step > 6"
        @success="step++"
      />

      <b-row>
        <!-- bgimg -->
        <!-- <b-col cols="12"> </b-col> -->
        <!-- Selected Products -->
        <!-- <b-col cols="12" class="cols">
          <home-product-carousel></home-product-carousel>
        </b-col> -->
        <!-- Popular products -->
        <!-- <b-col cols="12" class="cols">
          <p class="bd-select">{{ $t("productHome.Popular products") }}</p>
          <home-small-card-carousel></home-small-card-carousel>
        </b-col> -->
        <!-- product best sale -->
        <!-- <b-col cols="12" class="cols">
          <div class="bd-bestdeal">
            <div class="best-sale-container">
              <startend-card :list="saleList"></startend-card>
            </div>
          </div>
        </b-col> -->

        <!-- <b-col cols="12" class="cols">
          <p class="bd-select">Best Sale</p>
          <home-product-tabs-bestsale
            :list="saleList"
          ></home-product-tabs-bestsale>
        </b-col> -->
        <!-- You may like it -->
        <!-- <b-col cols="12" class="cols">
          <p class="bd-select">{{ $t("productHome.You may like it") }}</p>
          <el-carousel class="bg-carousel" arrow="always">
            <el-carousel-item
              v-for="(item, index) in likeList"
              :key="`bannerList_${index}`"
            >
              <img
                :src="item.image + '?x-oss-process=style/w1080'"
                alt=""
                class="bg-img"
                @click="$router.push({ path: '/v2/product/list' })"
              />
            </el-carousel-item>
          </el-carousel>
        </b-col> -->

        <!-- <b-col cols="12" class="cols">
          <home-product-tabs-may-like></home-product-tabs-may-like>
        </b-col> -->
        <!--Most Search Keywords  -->
        <!-- <b-col cols="12" class="cols">
          <section class="section-pt">
            <div class="search-keyword">
              <b-row class="container-full">
                <b-col cols="12" md="11">
                  <h4 class="keyword-title">
                    {{ $t("productHome.Most Search Keywords") }}
                  </h4>
                  <ul class="keyword-list">
                    <li
                      class="keyword-item"
                      :class="{ line: (index + 1) % 3 != 0 }"
                      v-for="(item, index) in keywords"
                      :key="`keywords_${index}`"
                    >
                      <span class="keywords-title">
                        {{ $t("productHome." + item.title) }}
                      </span>
                    </li>
                  </ul>
                </b-col>
                <b-col cols="12" md="1">
                  <div class="qr-img">
                    <img
                      src="HTTPS://oss.sokogate.com/image/3371223c03d9dc18945e8b346833ed38.png"
                      alt=""
                      class="img"
                    />
                    <p class="img-msg">cell phone SokoGate</p>
                  </div>
                </b-col>
              </b-row>
            </div>
          </section>
        </b-col> -->
      </b-row>
      <back-to-top />
    </div>
  </b-container>
</template>



<script>
// import SuiImage from "@/components/s-ui/media/Image";
import BackToTop from "@/components/s-ui/list/BackToTop";
// import BannerList from "@/components/BannerList";
const BannerList = () => import("@/components/BannerList");
const BannerListMain = () => import("@/components/BannerListMain");
// import ProductRecommListByCategory from "@/components/product/RecommListByCategory";
const ProductRecommListByCategory = () =>
  import("@/components/product/RecommListByCategory");
// import ProductRecommListRowLine from "@/components/product/RecommListRowLine";
const ProductRecommListRowLine = () =>
  import("@/components/product/RecommListRowLine");
// import ProductRecommListLimit from "@/components/product/RecommListLimit";
const ProductRecommListLimit = () =>
  import("@/components/product/RecommListLimit");
// import ProductRecommListLimitByCategory from "@/components/product/RecommListLimitByCategory";
const ProductRecommListLimitByCategory = () =>
  import("@/components/product/RecommListLimitByCategory");
// import RecommListLimitbyNewproduct from "@/components/product/RecommListLimitbyNewproduct";
const RecommListLimitbyNewproduct = () =>
  import("@/components/product/RecommListLimitbyNewproduct");
export default {
  data() {
    return {
      step: 0,
      iconMap: {
        "Apparel & Fabrics": "icon-shizhuangyufuzhuang-",
        Apparel: "icon-shizhuangyufuzhuang-1",
        "Apparel Design Services": "icon-gongyituzhi",
        "Apparel Processing Services": "icon-fuzhuang-fengrenji",
        "Boy‘s Clothing": "icon-nantong1",
        "Girl‘s Clothing": "icon-nvtong1",
        "Women‘s Clothing": "icon-nvzhuang",
        "Men‘s Clothing": "icon-nanzhuang",
        "Infant & Toddlers Clothing": "icon-yinger",
        Uniforms: "icon-xifu",
        "Garment Accessories& Processing": "icon-fuzhuang-fengrenji",
        "Maternity Clothing": "icon-nvzhuang",
        Sportswear: "icon-yundongfu",
        "Stage & Dance Wear": "icon-a-43-49_fuzhi-05",
        "Textile & Leather": "icon-piyi",
        "Down & Feather": "icon-yurongfu",
        Fabric: "icon-kehuishouwu-zhiwulei",
        Fiber: "icon-nanzhuang",
        Fur: "icon-piyi",
        Leather: "icon-piyi",
        "Other Textiles & Leather Products": "icon-jiake",
        "Fashion Accessories": "icon-erzhuiershizhenzhu",
        "Belt Accessories": "icon-icon-",
        Belts: "icon-fuzhuang-yaodai",
        "Fashion Accessories Design Services":
          "icon-37gongyegongcheng_mokuaisheji",
        "Fashion Accessories Processing Services": "icon-yuancailiaojiagong",
        "Gloves & Mittens": "icon-shenghuoyongpin-",
        "Hats & Caps": "icon-maozi",
        "Scarves & Shawls": "icon-weijin",
        "Hair Accessories": "icon-nvxing",
        "Ties & Accessories": "icon-lingdai",
        "Jewelry, Eyewear, watch": "icon-xianglian",
        Eyewear: "icon-yanjing1",
        Jewelry: "icon-xianglian",
        Watches: "icon-shoubiao1",
        "Jewelry accessories": "icon-erzhuiershizhenzhu",
        "Watch accessories & parts": "icon-shoubiao",
        "Auto Parts & transportation": "icon-qiche",
        "Motorcycles & Scooters": "icon-motuoche",
        Containers: "icon-baozhuang1",
        "Bus Parts & Accessories": "icon-bus",
        "Auto Parts & Accessories": "icon-fangxiangpan",
        "Other Vehicle Parts & Accessories": "icon-qiche",
        "Marine Parts & Accessories": "icon-lunchuan",
        "Truck Parts & Accessories": "icon-kache",
        "Bags, shoes &Accessories": "icon-xiexiangbao",
        "Bags, luggage, case": "icon-hanglixiang",
        "Business Bags & Cases": "icon-wenjianbao",
        "Digital Gear & Camera Bags": "icon-xiangji",
        "Handbags & Messenger Bags": "icon-a-ziyuan119",
        "Luggage & Travel Bags": "icon-hangliewaituoyunhangli",
        "Other Luggage, Bags & Cases": "icon-shoutibao-",
        "Sports & Leisure Bags": "icon-xiebaofushi",
        Briefcases: "icon-wenjianbao",
        "Cosmetic Bags & Cases": "icon-huazhuangbao",
        "Shopping Bags": "icon-shangpinshoudai",
        Handbags: "icon-xiebaofushi",
        Backpacks: "icon-shubao",
        "Wallets & Holders": "icon-qianbao_o",
        "shoes &accessories": "icon-xiezi4",
        "Kid shoes": "icon-tongxie",
        "outdoor Shoes": "icon-huwaiyundong",
        "Men‘s Shoes": "icon-xiezi1",
        "Shoe Materials": "icon-gouwuche",
        "Shoe Parts & Accessories": "icon-xiezi01",
        "Shoes care& service": "icon-caxieji",
        "Women‘s Shoes": "icon-xiezi101",
        "Other Shoes": "icon-xiezi2",
        "Agriculture & Food": "icon-nongchanpin",
        Agriculture: "icon-wheat__easyic",
        "Agricultural Waste": "icon-yancaomeiwubing",
        "Animal Products": "icon-jirou",
        Beans: "icon-dc-icon-zhongzidujiaoshou",
        "Farm Machinery & Equipment": "icon-nongji",
        Feed: "icon-yangji",
        "Fresh Seafood": "icon-shanbeihaixian",
        Fruit: "icon-shuiguo",
        Grain: "icon-wheat__easyic",
        "Herbal Cigars & Cigarettes": "icon-xiangyan",
        "Mushrooms&Truffiles": "icon-mogu",
        "Ornamental Plants": "icon-zhiwuhuapen",
        "Nut&kernel": "icon-jianguoguopu",
        "Other Agriculture Products": "icon-mogu",
        "Plant & Animal Oil": "icon-shiyongyou",
        "Plant Seeds & Bulbs": "icon-dc-icon-zhongzidujiaoshou",
        "Timber Raw Materials": "icon-a-ziyuan515",
        Vegetables: "icon-shucai",
        "Food & Beverage": "icon-a-50-62_fuzhi-13",
        Beverage: "icon-yinliao",
        "Baby Food": "icon-naiping",
        "Baked Goods": "icon-penghuashipin",
        "Bean Products": "icon-dc-icon-zhongzidujiaoshou",
        "Canned Food": "icon-guantou1",
        Confectionery: "icon-tangguo",
        Dairy: "icon-lingshiguantou",
        "Egg & Egg Products": "icon-jidan",
        "Food Ingredients": "icon-guantou",
        "Fruit Products": "icon-shuiguo",
        "Grain Products": "icon-wheat__easyic",
        "Honey Products": "icon-guantou",
        "Meat & Poultry": "icon-jirou",
        Seafood: "icon-shuichanhaixian",
        "Seasonings & Condiments": "icon-tiaoweipin",
        "Snack Food": "icon-xianqulingshi",
        "Other Food & Beverage": "icon-daican",
        "Instant Food": "icon-fangbianmian_",
        Electronics: "icon-notebook",
        "Consumer Electronics": "icon-dianzixue-1",
        "Computer Hardware & Software": "icon-dianzixue-2",
        "Electronics Cigarettes": "icon-xiangyan",
        "Accessories & Parts": "icon-tubiaozhizuomoban-116",
        "Camera, Photo & Accessories": "icon-zhaoxiangji",
        "Electronics Publications": "icon-dianziziyuandianzishu",
        "Home Audio, Video & Accessories": "icon-PMP",
        "Mobile Phone & Accessories": "icon-shouji",
        "Presentation Equipment": "icon-dianziyiqi",
        "Blockchain Miner": "icon-qukuailian",
        "Other Consumer Electronics": "icon-dianzixue-1",
        "Portable Audio, Video & Accessories": "icon-MP3",
        "Video Game & Accessories": "icon-PMP",
        "Mobile Phone Parts": "icon-shouji",
        "Earphone & Headphone": "icon-erji",
        "Batteries, Charges & Power Supplies": "icon-shouji",
        "Radio & TV Accessories": "icon-dianzixue-",
        Speaker: "icon-yangshengqi",
        Television: "icon-dianzixue-",
        "Household appliance": "icon-leijiayongdianqix",
        "Air Conditioning Appliances": "icon-kongtiao",
        "Cleaning Appliances": "icon-qingjie",
        "Hand Dryers": "icon-winfo-icon-chuanbotuli",
        "Home Appliance Parts": "icon-dianzixue-",
        "Home Heaters": "icon-yinshuiji-",
        "Kitchen Appliances": "icon-chuweidianqi",
        "Laundry Appliances": "icon-xiyiji",
        "Other Home Appliances": "icon-dianzixue-",
        "Refrigerators & Freezers": "icon-jiayongdianqi",
        "Water Heaters": "icon-yinshuiji-",
        "Water Treatment Appliances": "icon-winfo-icon-chuanbotuli",
        "Wet Towel Dispensers": "icon-winfo-icon-chuanbotuli",
        "Vacuum Cleaners& Floor Care": "icon-xichenqibeifen",
        "Security & Protection": "icon-anfangguanli",
        "Locks & Keys": "icon-yuechi",
        "Personal Protective Equipment": "icon-tubiaozhizuomoban-",
        "Access Control Systems & Products": "icon-menjin",
        "CCTV Products": "icon-dianzixue-",
        "Firefighting Supplies": "icon-miehuoqi",
        "Other Security & Protection Products": "icon-yongdiananquanfenxi",
        "Roadway Safety": "icon-zuoyedaolu",
        "Water Safety Products": "icon-winfo-icon-chuanbotuli",
        "Health & personal care": "icon-jiankang",
        "health & medical": "icon-yiliaoweisheng-",
        "Health Care Products": "icon-baojianpin",
        "Medical Devices": "icon-yiliaoxiang",
        Medicine: "icon-daican",
        "Sex Products": "icon-haixiuhaixiu",
        "Other Health& Medical": "icon-yiliaoweisheng-",
        "personal care": "icon-xingzhuang",
        "Baby Care": "icon-naiping",
        "Bath Supplies": "icon-yushi",
        "Beauty Equipment": "icon-meifashalong-2",
        "Breast Care": "icon-icon-10",
        "Feminine Hygiene": "icon-nvxing",
        "Fragrance & Deodorant": "icon-xiangshui",
        "Hair Care": "icon-meifashalong-2",
        "Hair Extensions & Wigs": "icon-meifashalong-",
        "Hair Salon Equipment": "icon-meifashalong-1",
        Makeup: "icon-xingzhuang",
        "Makeup Tools": "icon-huazhuanggongju-",
        "Men Care": "icon-nanshihuli",
        "Nail Supplies": "icon-meijia",
        "Oral Hygiene": "icon-kouqianghuli",
        "Other Beauty & Personal Care Products": "icon-shouye",
        "Sanitary Paper": "icon-weishengzhi",
        "Shaving & Hair Removal": "icon-tubiaoCSban-",
        "Skin Care": "icon-shentihuli",
        "Skin Care Tool": "icon-xingzhuang",
        "Electronics Equipment & Supply": "icon-dianzixue-1",
        "Solar Energy Products": "icon-zu",
        Batteries: "icon-dianchi",
        "Electrical Instruments": "icon-dianziyiqi",
        "Connectors & Terminals": "icon-lianjieqi",
        "Industrial Controls": "icon-gongyezujian-kaiguan",
        Motors: "icon-mada",
        "Electrical Supplies": "icon-dianlijituan",
        Generators: "icon-fadianji",
        "Professional Audio, Video & Lighting": "icon-dengguang",
        Switches: "icon-gongyezujian-kaiguan",
        "Sports, Gifts &Toys": "icon-yundonghuwaileimu",
        "Sports & Entertainment": "icon-yundonghuwaileimu",
        "Fitness & Body Building": "icon-yundong-",
        Gambling: "icon-majiangtai",
        "Other Sports & Entertainment Products": "icon-yundonghuwaileimu",
        "Outdoor Sports": "icon-yundong-1",
        "Indoor Sports": "icon-yundong-3",
        "Sports Safety": "icon-yundong-3",
        "Racquet Sport": "icon-yundong-2",
        "Swimming & Diving": "icon-yongchi",
        Gifts: "icon-lihe",
        Crafts: "icon-gongyi",
        "Arts & Crafts Stocks": "icon-gupiao",
        "Cross Stitch": "icon-cixiu",
        "Festive & Party Supplies": "icon-caideng",
        "Flags, Banners & Accessories": "icon-tuya_huaban",
        "Gift Sets": "icon-fuzhuang-waitao",
        toys: "icon-wanjuxiong",
        Dolls: "icon-wawa",
        "Educational Toys": "icon-wanjuxiong",
        "Electronics Toys": "icon-youxiyouxiji",
        "Glass Marbles": "icon-yundonghuwaileimu",
        "Inflatable Toys": "icon-qiqiu",
        "Light-Up Toys": "icon-toyCar",
        "Outdoor Toys & Structures": "icon-toyCar",
        "Plastic Toys": "icon-ertongwanju",
        "other toys": "icon-ertongwanju",
        "Machinery & Parts": "icon-tubiaozhizuomoban-116",
        "Apparel & Textile Manufacturing Equipment": "icon-fuzhuang-fengrenji",
        "Electronics Manufacturing Equipment": "icon-yiqi",
        "Environmental Equipment": "icon-zhihuihuanbao_xunjianguanli",
        "Hardware Industry Tooling & Services": "icon-wujin",
        "Industrial Machinery": "icon-jixiexingye",
        "Industrial Measuring, Testing & Inspection Equipment":
          "icon-dianziyiqi",
        "Industrial Printing & Packaging Supplies": "icon-yinshuabaozhuang",
        "Industrial Safety & Law Enforcement Equipment":
          "icon-etext2dianziwenben",
        "Industrial Supplies": "icon-yiqi",
        "Manufacturing Equipment": "icon-tubiaozhizuomoban-116",
        "Material Handling & Construction Machinery": "icon-jixiexingye",
        "Service Equipment": "icon-dianzishebei",
        "Home , Lights & Construction": "icon-jianzhu",
        home: "icon-jiaju1",
        "Bathroom Products": "icon-yushiyongpin",
        "Garden Supplies": "icon-kongzhonghuayuan",
        "Home Decor": "icon-jiaju-",
        "Home Storage & Organization": "icon-jiaju-3",
        "Household Sundries": "icon-jiaju-1",
        "Kitchen & Tableware": "icon-jiaju-4",
        "Pet Products": "icon-chongwugoupen",
        "Baby Supplies & Products": "icon-naiping",
        "Rain Gear": "icon-yuju",
        "Children Furniture": "icon-jiaju",
        "Commercial Furniture": "icon-jiaju-2",
        "Folding Furniture": "icon-jiaju-4",
        "Other Furniture": "icon-jiaju",
        "Light & Lighting": "icon-zhaoming",
        "Indoor Lighting": "icon-zhaoming1",
        "Lighting Accessories": "icon-zhaoming",
        "Lighting Bulbs & Tubes": "icon-xingzhuang1",
        "Other Lights & Lighting Products": "icon-dengguang",
        "Outdoor Lighting": "icon-zhaoming-kai",
        "Professional Lighting": "icon-taideng",
        Construction: "icon-shigong",
        "Aluminum Composite Panels": "icon-zhongban4",
        "Balustrades & Handrails": "icon-loutistairs7",
        Bathroom: "icon-yushi",
        "Building Glass": "icon-boli",
        Ceilings: "icon-diban",
        "Corner Guards": "icon-duliweishengjian",
        "Countertops, Vanity Tops & Table Tops": "icon-shuzhuangtai",
        "Curtain Walls & Accessories": "icon-24gl-bricks",
        "Decorative Films": "icon-tiezhi",
        "Door & Window Accessories": "icon-menchuang",
        "Other constructions": "icon-jianzhu",
        "Packaging & Office& Business ": "icon-bangongzhuo",
        Packaging: "icon-baozhuang1",
        "Chemical Packaging": "icon-V3",
        "Composite Packaging Materials": "icon-V1",
        "Cosmetics Packaging": "icon-xiaoxinqingfangwaibaozhuangxiangtubiao",
        "Electronics Packaging": "icon-xiaoxinqingfangwaibaozhuangxiangtubiao",
        "Food Packaging": "icon-V3",
        "Gift Packaging": "icon-lihe",
        "Other Packaging Applications": "icon-wuliaobaozhuangdan",
        "office& school Supplies": "icon-tushu",
        "Art Supplies": "icon-meishu1",
        "Badge Holder & Accessories": "icon-Name-Tag",
        "Board Eraser": "icon-baiban",
        "Book Cover": "icon-wenanfengmian",
        Books: "icon-tushu",
        Calculator: "icon-jisuanqi_o",
        Calendar: "icon-rili",
        Clipboard: "icon-clipboard",
        "Correction Supplies": "icon-winfo-icon-chuanbotuli",
        "Desk Organizer": "icon-bangongzhuo",
        "Drafting Supplies": "icon-meishu1",
        Easels: "icon-meishu",
        "Educational Supplies": "icon-wenjubangongyongpin",
        "Filing Products": "icon-jishiben",
        "Letter Pad / Paper": "icon-zhizhang4",
        Magazines: "icon-zazhiqikan",
        Map: "icon-dituleiditu",
        "Notebooks & Writing Pads": "icon-wenjubangongyongpin",
        "Office Adhesives & Tapes": "icon-jiaodai",
        "Advertising Equipment": "icon-ad",
        "Cargo & Storage Equipment": "icon-cangku_kucun_o",
        "Commercial Laundry Equipment": "icon-xiyiji",
        "Financial Equipment": "icon-gupiao",
        "Funeral Supplies": "icon-huadian-huaquan",
        "Other Service Equipment": "icon-shebeiguanli",
        "Restaurant & Hotel Supplies": "icon-jiudiancanting-",
        "Store & Supermarket Supplies": "icon-chaoshi",
        "Recycled Prodcuts& Environment Friendly": "icon-huanbao",
        "Recycled Products": "icon-kehuishouwu",
        "Recycled Projects": "icon-kehuishou-suliaolei",
        "Recycled Plastic": "icon-kehuishouwu-suliaolei",
        "Recycled Rubber": "icon-kehuishouwu-suliaolei",
        "Environment Friendly": "icon-huanbao",
        "Environment-Friendly Products": "icon-huanbaopingtai-huanbaohesuan",
        "Environment-Friendly Projects": "icon-kehuhuishouzhan",
        "Home,Lights & Construction": "icon-zhaoming1",
        "Packaging & Office& Business": "icon-bangongzhuo",
        "Recycled Prodcuts& Environment- Friendly": "icon-huanbao1",
      },
      banner: [
        {
          image: require(`../../assets/banner.png`),
          title: "SokoGate",
          text: "一个专注于connection非洲采购商与全球供应商的B2B跨境电商平台立即入驻",
          jumpContent: "HTTPS://www.sokogate.com/merchant-settlement",
        },
      ],
    };
  },
  computed: {
    list() {
      return this.$store.state.menu;
    },
  },
  methods: {
    link(res) {
      window.open(res);
    },
    navtoProductlist(id = "") {
      this.$router.push({
        path: "/v2/product/list",
        query: id.length
          ? {
              cid: id,
            }
          : {},
      });
    },
  },
  components: {
    BackToTop,
    BannerList,
    BannerListMain,
    ProductRecommListByCategory,
    ProductRecommListRowLine,
    ProductRecommListLimit,
    ProductRecommListLimitByCategory,
    RecommListLimitbyNewproduct,
    // SuiImage
  },
};
</script>


<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.banner-header {
  margin-top: 20px;
  .banner-img-box {
    // margin-left: 280px;
    @include mobile {
      margin-left: 0;
    }
  }
  .banner-list-box {
    display: none;
    // position: sticky;
    float: left;
    // top: 17%;
    .list {
      // flex-shrink: 0;
      // top: 50px;
      // left: 0;
      display: inline-block;
      width: 270px;
      // z-index: 333;
      min-height: 480px;
      border: 0;
      border-radius: 0;
      // display: none;
      // position: absolute;
      position: relative;
      background-color: rgba(0, 0, 0, 0.7);
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      padding-bottom: 10px;

      &-cel {
        color: #fff;
        font-size: 14px;
        background-color: transparent;
        transition: 0.5s;
        height: 40px;
        position: initial;

        .category-list {
          padding-right: 10px;
        }

        &-title {
          flex-grow: 1;
          white-space: normal;
        }

        .pad {
          top: 0px;
          left: 270px;
          width: 920px;
          min-height: 490px;
          position: absolute;
          background-color: #fff;
          border-top: 1px solid #dadada;
          z-index: 100;
          display: none;
        }

        &:hover {
          color: #ef2e22;
          background-color: #fff;
          .pad {
            display: block;
          }
        }

        &-nav {
          min-height: 42px;
          margin-left: 20px;
          border-bottom: 1px dashed #bcbcbc;
          &-item {
            color: #333;
            font-weight: bold;
            font-size: 12px;
            &:hover {
              color: #ef2e22;
            }
            .sokogate {
              margin-left: 5px;
              font-size: 12px;
              transform: scale(0.75);
              display: inline-block;
            }
          }

          &-sub {
            justify-content: flex-start;
            flex-wrap: wrap;

            &-item {
              flex: none;
              color: #888;
              font-size: 12px;

              &:hover {
                color: #ef2e22;
              }
            }
          }

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    &:hover {
      color: #fff;
      .list {
        display: block;
      }
    }
    .nav-link {
      color: #333;
      font-weight: bold;
      &:hover {
        color: #ef2e22;
      }
    }
    @include mobile {
      display: none;
    }
  }
}
.bg-carousel {
  background: #ff6c72;
  height: 385px;
}
.banner_content {
  position: absolute;
  left: 12%;
  top: 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 77%;
  h2 {
    font-weight: 800;
    font-size: 40px;
    color: #fff;
  }
  .banner_text {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0;
    line-height: 35px;
    margin-top: 20px;
    max-width: 350px;
  }
  .banner_btn {
    width: 150px;
    height: 45px;
    font-size: 18px;
    font-weight: 800;
    color: #ff6c72;
    background-color: #fff;
    border: none;
    border-radius: 45px;
    box-shadow: 0px 5px 7px 0px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 35px;

    &:hover {
      box-shadow: 0px 9px 7px rgba(0, 0, 0, 0.2);
      transform: translateY(-7px);
    }
  }
  .banner_img {
    width: 400px;
  }
}
@media (max-width: 767px) {
  .ad-imgBox {
    margin-top: 20px;
    @include mobile {
      margin-left: 0;
    }
  }
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  .ad-imgBox {
    margin-left: 280px;
    height: 337px;
    & img {
      width: 100%;
      height: 100%;
    }
    @include mobile {
      margin-left: 0;
    }
  }
}

@media screen and (min-width: 992px) and (max-width: 1199px) {
  .ad-imgBox {
    margin-left: 280px;
    height: 257px;
    & img {
      width: 100%;
      height: 100%;
    }
    @include mobile {
      margin-left: 0;
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1399px) {
  .ad-imgBox {
    margin-left: 280px;
    height: 197px;
    & img {
      width: 100%;
      height: 100%;
    }
    @include mobile {
      margin-left: 0;
    }
  }
}

@media screen and (min-width: 1400px) and (max-width: 1599px) {
  .ad-imgBox {
    margin-left: 280px;
    height: 137px;
    & img {
      width: 100%;
      height: 100%;
    }
    @include mobile {
      margin-left: 0;
    }
  }
}

@media screen and (min-width: 1600px) and (max-width: 1668px) {
  .ad-imgBox {
    margin-left: 280px;
    height: 70px;
    & img {
      width: 100%;
      height: 100%;
    }
    @include mobile {
      margin-left: 0;
    }
  }
}

@media screen and (min-width: 1669px) and (max-width: 1919px) {
  .ad-imgBox {
    margin-left: 280px;
    height: 70px;
    & img {
      width: 100%;
      height: 100%;
    }
    @include mobile {
      margin-left: 0;
    }
  }
}

@include largeScrenn {
  .ad-imgBox {
    margin-top: 20px;
    height: 100px;
    & img {
      width: 100%;
      height: 100%;
    }
    @include mobile {
      margin-left: 0;
    }
  }
}
</style>