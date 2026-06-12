<template id="child-map">
  <div id="localtion-box"></div>
</template>

<script>
export default {
  data() {
    return {
      state: {
        point: { lng: 116.404, lat: 39.925 },
      },
    };
  },
  metaInfo: { // 局部http转https
    meta: [
      { 'http-equiv': "Content-Security-Policy", content: "upgrade-insecure-requests" },
    ],
  },
  mounted() {
    this.loadMapScript();
  },
  methods: {
    loadMapScript() {
      // 此处在所需页面引入资源就是，不用再public/index.html中引入
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.className = "map"; // 给script一个类名
      script.src =
        "https://api.map.baidu.com/getscript?v=3.0&ak=FZxZi9xKnYC3M3CQnwgcFEN0u16GlNe4";
      // 此处需要注意：申请ak时，一定要应用类别一定要选浏览器端，不能选服务端，不然地图会报ak无效
      script.onload = () => {
        // 使用script.onload，待资源加载完成，再初始化地图
        this.init();
      };
      let mapDom = document.getElementsByClassName("map");
      if (mapDom) {
        // 每次append script之前判断一下，避免重复添加script资源标签
        for (var i = 0; i < mapDom.length; i++) {
          document.body.removeChild(mapDom[i]);
        }
      }
      document.body.appendChild(script);
    },
    init() {
    //   console.log(window.BMap, 'window');
      let Bmap = window.BMap; // 注意要带window，不然会报错（注意官方api,会有改动，之前是Bmap,后面3.0版本改为了BMap,最好查文档或者打印一下window）
      var map = new Bmap.Map("localtion-box"); // allmap必须和dom上的id一直
      // var cityCtrl = new Bmap.CityListControl(); // 添加城市列表控件
      // map.addControl(cityCtrl);
      var point = new Bmap.Point(113.294154, 23.142036);
      map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别
      // 创建图文信息窗口
      var sContent = `<h4 style='margin:0 0 5px 0;'>广州哈荔亚贸易有限公司</h4>
    <p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>
    地址: 广东省广州市越秀区环市东路372号正佳东方国际广场5001房
    </p>
    <p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>
    电话：+86 020 33972585
    </p></div>`;
      var infoWindow = new Bmap.InfoWindow(sContent);
      map.openInfoWindow(infoWindow, point);
    },
  },
};
</script>


<style lang="scss" scoped>
#localtion-box {
  width: 100%;
  height: 400px;
  background: #e2e2e2;
  position: relative;
}
ul li {
  list-style: none;
}
.btn-wrap {
  z-index: 999;
  position: absolute;
  bottom: 2rem;
  margin-left: 3rem;
  padding: 1rem 1rem;
  border-radius: 0.25rem;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.btn {
  width: 130px;
  height: 30px;
  float: left;
  background-color: #fff;
  color: rgba(27, 142, 236, 1);
  font-size: 14px;
  border: 1px solid rgba(27, 142, 236, 1);
  border-radius: 5px;
  margin: 0 5px;
  text-align: center;
}
.btn:hover {
  background-color: rgba(27, 142, 236, 0.8);
  color: #fff;
}
</style>
