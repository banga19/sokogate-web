<template>
  <div>
    <b-navbar
      class="navbar"
      :class="{ mobile: menu, targetFixed: ifFixed }"
      toggleable="lg"
      id="target"
    >
      <b-navbar-brand v-if="!menu" class="brand" href="#">
        <span class="brand-title" @click="navtoProductlist()">
          <i class="sokogate icon-a-Component44" />
          {{ $t("layout.all-categories") }}
        </span>
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
              <!-- :style="{ color: colorMap[item.categoryName] }" -->
               <div class="list-cel-title" @click="navtoProductlist(item.id)">
                 {{ categoryLabel(item.categoryName) }}
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
                      <!-- :style="{ color: colorMap[subItem.categoryName] }" -->
                       <b-button
                         class="list-cel-nav-item text-decoration-none"
                         variant="link"
                         @click="navtoProductlist(subItem.id)"
                       >
                         {{ categoryLabel(subItem.categoryName) }}
                         <i class="sokogate icon-a-Path171" />
                       </b-button>
                    </b-nav-item>
                    <b-nav-item>
                      <b-button-group class="list-cel-nav-sub">
                        <template v-for="(ssItem, ssIndex) in subItem.children">
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
                             <!-- :style="{ color: colorMap[ssItem.categoryName] }" -->
                             {{ categoryLabel(ssItem.categoryName) }}</b-button
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
      </b-navbar-brand>
      <b-navbar-nav v-else>
        <b-navbar-brand>{{ $t("layout.all-categories") }}</b-navbar-brand>
        <b-nav-item
          v-for="(item, index) in list"
          :key="index"
          href="#"
          @click="navtoProductlist(item.id)"
        >
          <i
            class="sokogate"
            :class="iconMap[item.categoryName]"
            style="padding-right: 5px; color: #000"
          />{{ item.categoryName }}</b-nav-item
        >
        <!-- :style="{ color: colorMap[item.categoryName] }" -->
      </b-navbar-nav>
      <b-navbar-nav>
        <b-navbar-brand v-if="menu">{{
          $t("layout.sokogate-menu")
        }}</b-navbar-brand>
        <b-nav-item href="#" @click="$router.push('/v2/trade-assurance')">{{
          $t("layout.trade-assurance")
        }}</b-nav-item>
        <b-nav-item href="#" @click="$router.push('/merchant-settlement')">{{
          $t("layout.sellon-sokogate")
        }}</b-nav-item>
        <!-- <b-nav-item href="#" @click="$router.push('/v2/order')">{{
          $t("layout.orders")
        }}</b-nav-item>
        <b-nav-item
          href="#"
          @click="$utils.navto('/v2/collection/collection')"
          >{{ $t("layout.wishlist") }}</b-nav-item
        > -->
        <!-- @click="$utils.jumpto(`account/personal-center`)" -->

        <!-- <b-nav-item
          href="#"
          @click="$router.push({ name: 'Personal Center' })"
          >{{ $t("layout.my-sokogate") }}</b-nav-item
        > -->
        <b-nav-item href="#" @click="$utils.navto('/v2/aboutus')">{{
          $t("common.aboutus")
        }}</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>
<script>
export default {
  props: {
    menu: {
      type: Boolean,
      value: false,
    },
    list: {
      type: Array,
      value: [],
    },
  },
  data() {
    return {
      // 是否吸顶
      ifFixed: false,
      // 目标元素与整个文档顶部间的距离
      targetTop: 0,
      // colorMap: {
      //   "Apparel & Fabrics": "red",
      //   Apparel: "red",
      //   "Apparel Design Services": "red",
      //   "Apparel Processing Services": "red",
      //   "Boy‘s Clothing": "brown",
      //   "Girl‘s Clothing": "pink",
      //   "Women‘s Clothing": "pink",
      //   "Men‘s Clothing": "brown",
      //   "Infant & Toddlers Clothing": "red",
      //   Uniforms: "brown",
      //   "Garment Accessories& Processing": "red",
      //   "Maternity Clothing": "red",
      //   Sportswear: "blue",
      //   "Stage & Dance Wear": "red",
      //   "Textile & Leather": "red",
      //   "Down & Feather": "red",
      //   Fabric: "red",
      //   Fiber: "red",
      //   Fur: "red",
      //   Leather: "brown",
      //   "Other Textiles & Leather Products": "red",
      //   "Fashion Accessories": "red",
      //   "Belt Accessories": "red",
      //   Belts: "brown",
      //   "Fashion Accessories Design Services": "red",
      //   "Fashion Accessories Processing Services": "red",
      //   "Gloves & Mittens": "red",
      //   "Hats & Caps": "brown",
      //   "Scarves & Shawls": "red",
      //   "Hair Accessories": "pink",
      //   "Ties & Accessories": "brown",
      //   "Jewelry, Eyewear, watch": "gold",
      //   Eyewear: "brown",
      //   Jewelry: "gold",
      //   Watches: "brown",
      //   "Jewelry accessories": "red",
      //   "Watch accessories & parts": "red",
      //   "Auto Parts & transportation": "brown",
      //   "Motorcycles & Scooters": "red",
      //   Containers: "red",
      //   "Bus Parts & Accessories": "red",
      //   "Auto Parts & Accessories": "brown",
      //   "Other Vehicle Parts & Accessories": "red",
      //   "Marine Parts & Accessories": "blue",
      //   "Truck Parts & Accessories": "red",
      //   "Bags, shoes &Accessories": "red",
      //   "Bags, luggage, case": "red",
      //   "Business Bags & Cases": "red",
      //   "Digital Gear & Camera Bags": "red",
      //   "Handbags & Messenger Bags": "red",
      //   "Luggage & Travel Bags": "red",
      //   "Other Luggage, Bags & Cases": "pink",
      //   "Sports & Leisure Bags": "red",
      //   Briefcases: "brown",
      //   "Cosmetic Bags & Cases": "red",
      //   "Shopping Bags": "red",
      //   Handbags: "red",
      //   Backpacks: "red",
      //   "Wallets & Holders": "brown",
      //   "shoes &accessories": "brown",
      //   "Kid shoes": "red",
      //   "outdoor Shoes": "red",
      //   "Men‘s Shoes": "brown",
      //   "Shoe Materials": "red",
      //   "Shoe Parts & Accessories": "brown",
      //   "Shoes care& service": "brown",
      //   "Women‘s Shoes": "pink",
      //   "Other Shoes": "red",
      //   "Agriculture & Food": "green",
      //   Agriculture: "green",
      //   "Agricultural Waste": "red",
      //   "Animal Products": "red",
      //   Beans: "gold",
      //   "Farm Machinery & Equipment": "red",
      //   Feed: "red",
      //   "Fresh Seafood": "coral",
      //   Fruit: "red",
      //   Grain: "gold",
      //   "Herbal Cigars & Cigarettes": "chocolate",
      //   "Mushrooms&Truffiles": "brown",
      //   "Ornamental Plants": "green",
      //   "Nut&kernel": "silver",
      //   "Other Agriculture Products": "brown",
      //   "Plant & Animal Oil": "gold",
      //   "Plant Seeds & Bulbs": "green",
      //   "Timber Raw Materials": "green",
      //   Vegetables: "green",
      //   "Food & Beverage": "red",
      //   Beverage: "red",
      //   "Baby Food": "red",
      //   "Baked Goods": "red",
      //   "Bean Products": "red",
      //   "Canned Food": "red",
      //   Confectionery: "gold",
      //   Dairy: "red",
      //   "Egg & Egg Products": "gold",
      //   "Food Ingredients": "red",
      //   "Fruit Products": "red",
      //   "Grain Products": "gold",
      //   "Honey Products": "gold",
      //   "Meat & Poultry": "red",
      //   Seafood: "red",
      //   "Seasonings & Condiments": "brown",
      //   "Snack Food": "red",
      //   "Other Food & Beverage": "red",
      //   "Instant Food": "orange",
      //   Electronics: "brown",
      //   "Consumer Electronics": "brown",
      //   "Computer Hardware & Software": "brown",
      //   "Electronics Cigarettes": "gold",
      //   "Accessories & Parts": "red",
      //   "Camera, Photo & Accessories": "brown",
      //   "Electronics Publications": "brown",
      //   "Home Audio, Video & Accessories": "red",
      //   "Mobile Phone & Accessories": "red",
      //   "Presentation Equipment": "brown",
      //   "Blockchain Miner": "brown",
      //   "Other Consumer Electronics": "red",
      //   "Portable Audio, Video & Accessories": "red",
      //   "Video Game & Accessories": "red",
      //   "Mobile Phone Parts": "red",
      //   "Earphone & Headphone": "gold",
      //   "Batteries, Charges & Power Supplies": "brown",
      //   "Radio & TV Accessories": "brown",
      //   Speaker: "gold",
      //   Television: "brown",
      //   "Household appliance": "brown",
      //   "Air Conditioning Appliances": "brown",
      //   "Cleaning Appliances": "brown",
      //   "Hand Dryers": "brown",
      //   "Home Appliance Parts": "brown",
      //   "Home Heaters": "brown",
      //   "Kitchen Appliances": "brown",
      //   "Laundry Appliances": "brown",
      //   "Other Home Appliances": "brown",
      //   "Refrigerators & Freezers": "brown",
      //   "Water Heaters": "brown",
      //   "Water Treatment Appliances": "blue",
      //   "Wet Towel Dispensers": "brown",
      //   "Vacuum Cleaners& Floor Care": "brown",
      //   "Security & Protection": "green",
      //   "Locks & Keys": "gold",
      //   "Personal Protective Equipment": "green",
      //   "Access Control Systems & Products": "red",
      //   "CCTV Products": "red",
      //   "Firefighting Supplies": "red",
      //   "Other Security & Protection Products": "red",
      //   "Roadway Safety": "red",
      //   "Water Safety Products": "blue",
      //   "Health & personal care": "red",
      //   "health & medical": "red",
      //   "Health Care Products": "red",
      //   "Medical Devices": "red",
      //   Medicine: "red",
      //   "Sex Products": "red",
      //   "Other Health& Medical": "red",
      //   "personal care": "red",
      //   "Baby Care": "red",
      //   "Bath Supplies": "red",
      //   "Beauty Equipment": "red",
      //   "Breast Care": "red",
      //   "Feminine Hygiene": "red",
      //   "Fragrance & Deodorant": "red",
      //   "Hair Care": "brown",
      //   "Hair Extensions & Wigs": "brown",
      //   "Hair Salon Equipment": "red",
      //   Makeup: "pink",
      //   "Makeup Tools": "red",
      //   "Men Care": "brown",
      //   "Nail Supplies": "red",
      //   "Oral Hygiene": "red",
      //   "Other Beauty & Personal Care Products": "red",
      //   "Sanitary Paper": "brown",
      //   "Shaving & Hair Removal": "red",
      //   "Skin Care": "red",
      //   "Skin Care Tool": "red",
      //   "Electronics Equipment & Supply": "brown",
      //   "Solar Energy Products": "gold",
      //   Batteries: "green",
      //   "Electrical Instruments": "green",
      //   "Connectors & Terminals": "brown",
      //   "Industrial Controls": "red",
      //   Motors: "red",
      //   "Electrical Supplies": "green",
      //   Generators: "red",
      //   "Professional Audio, Video & Lighting": "red",
      //   Switches: "red",
      //   "Sports, Gifts &Toys": "red",
      //   "Sports & Entertainment": "red",
      //   "Fitness & Body Building": "red",
      //   Gambling: "brown",
      //   "Other Sports & Entertainment Products": "red",
      //   "Outdoor Sports": "red",
      //   "Indoor Sports": "red",
      //   "Sports Safety": "red",
      //   "Racquet Sport": "pink",
      //   "Swimming & Diving": "blue",
      //   Gifts: "red",
      //   Crafts: "red",
      //   "Arts & Crafts Stocks": "red",
      //   "Cross Stitch": "gold",
      //   "Festive & Party Supplies": "pink",
      //   "Flags, Banners & Accessories": "red",
      //   "Gift Sets": "red",
      //   toys: "brown",
      //   Dolls: "brown",
      //   "Educational Toys": "brown",
      //   "Electronics Toys": "brown",
      //   "Glass Marbles": "red",
      //   "Inflatable Toys": "pink",
      //   "Light-Up Toys": "gold",
      //   "Outdoor Toys & Structures": "red",
      //   "Plastic Toys": "red",
      //   "other toys": "red",
      //   "Machinery & Parts": "brown",
      //   "Apparel & Textile Manufacturing Equipment": "brown",
      //   "Electronics Manufacturing Equipment": "red",
      //   "Environmental Equipment": "green",
      //   "Hardware Industry Tooling & Services": "gold",
      //   "Industrial Machinery": "brown",
      //   "Industrial Measuring, Testing & Inspection Equipment": "brown",
      //   "Industrial Printing & Packaging Supplies": "red",
      //   "Industrial Safety & Law Enforcement Equipment": "red",
      //   "Industrial Supplies": "red",
      //   "Manufacturing Equipment": "red",
      //   "Material Handling & Construction Machinery": "red",
      //   "Home ，Lights & Construction": "red",
      //   home: "brown",
      //   "Bathroom Products": "red",
      //   "Garden Supplies": "red",
      //   "Home Decor": "red",
      //   "Home Storage & Organization": "red",
      //   "Household Sundries": "red",
      //   "Kitchen & Tableware": "brown",
      //   "Pet Products": "pink",
      //   "Baby Supplies & Products": "red",
      //   "Rain Gear": "blue",
      //   "Children Furniture": "brown",
      //   "Commercial Furniture": "brown",
      //   "Folding Furniture": "brown",
      //   "Other Furniture": "brown",
      //   "Light & Lighting": "tan",
      //   "Indoor Lighting": "tan",
      //   "Lighting Accessories": "tan",
      //   "Lighting Bulbs & Tubes": "tan",
      //   "Other Lights & Lighting Products": "tan",
      //   "Outdoor Lighting": "tan",
      //   "Professional Lighting": "tan",
      //   Construction: "red",
      //   "Aluminum Composite Panels": "red",
      //   "Balustrades & Handrails": "brown",
      //   Bathroom: "brown",
      //   "Building Glass": "blue",
      //   Ceilings: "red",
      //   "Corner Guards": "red",
      //   "Countertops, Vanity Tops & Table Tops": "brown",
      //   "Curtain Walls & Accessories": "red",
      //   "Decorative Films": "red",
      //   "Door & Window Accessories": "red",
      //   "Other constructions": "brown",
      //   "Packaging & Office& Business ": "red",
      //   Packaging: "brown ",
      //   "Chemical Packaging": "brown",
      //   "Composite Packaging Materials": "brown",
      //   "Cosmetics Packaging": "brown",
      //   "Electronics Packaging": "brown",
      //   "Food Packaging": "brown",
      //   "Gift Packaging": "brown",
      //   "Other Packaging Applications": "brown",
      //   "office& school Supplies": "brown",
      //   "Art Supplies": "red",
      //   "Badge Holder & Accessories": "red",
      //   "Board Eraser": "red",
      //   "Book Cover": "red",
      //   Books: "red",
      //   Calculator: "pink",
      //   Calendar: "gold",
      //   Clipboard: "red",
      //   "Correction Supplies": "red",
      //   "Desk Organizer": "brown",
      //   "Drafting Supplies": "red",
      //   Easels: "red",
      //   "Educational Supplies": "red",
      //   "Filing Products": "red",
      //   "Letter Pad / Paper": "red",
      //   Magazines: "red",
      //   Map: "red",
      //   "Notebooks & Writing Pads": "brown",
      //   "Office Adhesives & Tapes": "bisque",
      //   "Service Equipment": "brown",
      //   "Advertising Equipment": "red",
      //   "Cargo & Storage Equipment": "red",
      //   "Commercial Laundry Equipment": "red",
      //   "Financial Equipment": "red",
      //   "Funeral Supplies": "red",
      //   "Other Service Equipment": "red",
      //   "Restaurant & Hotel Supplies": "red",
      //   "Store & Supermarket Supplies": "red",
      //   "Recycled Prodcuts& Environment Friendly": "green",
      //   "Recycled Products": "brown",
      //   "Recycled Projects": "green",
      //   "Recycled Plastic": "green",
      //   "Recycled Rubber": "green",
      //   "Environment Friendly": "green",
      //   "Environment-Friendly Products": "brown",
      //   "Environment-Friendly Projects": "brown",
      //   "Home,Lights & Construction": "tan",
      //   "Packaging & Office& Business": "brown",
      //   "Recycled Prodcuts& Environment- Friendly": "green",
      // },
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
        "Home ，Lights & Construction": "icon-jianzhu",
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
    };
  },
  mounted() {
    window.addEventListener("scroll", this.scrolling);
    // 获取目标元素与整个文档顶部间的距离
    this.targetTop = document.querySelector("#target").offsetTop;
    // console.log(this.targetTop, "this.targetTop");
  },
  methods: {
    scrolling() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > this.targetTop - 100) {
        this.ifFixed = true;
      } else {
        this.ifFixed = false;
      }
    },
    categoryLabel(name) {
      if (!name) return ''
      const translated = this.$t(`category.${name}`)
      return translated === `category.${name}` ? name : translated
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
};
</script>




<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.targetFixed {
  // position: fixed;
  // top: 61px;
  // left: 95px;
  background-color: #fff;
  z-index: 99;
  width: 100%;
  // box-shadow: 0 8px 8px -4px #ddd;
}
.scroll-box {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  top: 110px;
  left: 80px;
  background: transparent;
  z-index: 99;
  width: 500px;
  @include mobile {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    top: 680px;
    left: 0;
  }
  .opt-btn-addcart {
    cursor: pointer;
    display: inline-block;
    width: 600px;
    height: 50px;
    line-height: 50px;
    // border-radius: 8px;
    // background-color: #ffeeee;
    background-image: linear-gradient(to right, #ff9900, #ff6600);
    border: 0;
    font-size: 16px;
    // color: #ef2e22;
    color: #fff;
    text-align: center;
    transition: 0.5s;
    margin-left: 20px;

    &:hover {
      color: #fff;
      // background-color: #d80000;
      background-image: linear-gradient(to right, #ff6600, #ff6600);
    }
    @include mobile {
      width: 130px;
    }
  }

  .opt-btn-gobuy {
    cursor: pointer;
    display: inline-block;
    width: 600px;
    height: 50px;
    line-height: 50px;
    // border-radius: 8px;
    // background-color: #ef2e22;
    background-image: linear-gradient(to right, #ff6600, #ef2e22);
    border: 0;
    font-size: 16px;
    color: #fff;
    text-align: center;
    transition: 0.5s;
    margin-left: 20px;

    &:hover {
      color: #fff;
      // background-color: #d80000;
      background-image: linear-gradient(to right, #ef2e22, #ef2e22);
    }
    @include mobile {
      width: 130px;
    }
  }
}
.navbar {
  // background-color: transparent;
  padding: 0;
  .navbar-nav {
    .nav-link {
      color: #333;
      font-weight: bold;
      &:hover {
        color: #ef2e22;
      }
    }
  }
}
.brand {
  width: 270px;
  height: 50px;
  color: #fff;
  background-color: #ef2e22;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;

  &:focus {
    color: #fff;
  }

  &-title {
    font-size: 16px;
    padding-left: 16px;
    font-weight: bold;
    .sokogate {
      margin-right: 25px;
      font-size: 18px;
    }
  }
  .list {
    top: 50px;
    left: 0;
    width: 270px;
    z-index: 333;
    min-height: 480px;
    border: 0;
    border-radius: 0;
    display: none;
    position: absolute;
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
        top: 0;
        left: 270px;
        width: 920px;
        min-height: 490px;
        position: absolute;
        background-color: #fff;
        border-top: 1px solid #dadada;
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
}
.mobile {
  .navbar-nav {
    padding: 30px;

    .navbar-brand {
      font-size: 16px;
      font-weight: bold;
      color: #000;
      padding-bottom: 15px;
    }

    .nav-link {
      font-weight: normal;
      line-height: 30px;
      padding: 0;
    }
  }
}
</style>