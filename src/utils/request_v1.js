import axios from "axios";
import qs from "qs";

const CancelToken = axios.CancelToken;
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 20000,
});

service.interceptors.request.use(
  (config) => {
    // 设置请求头
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    let token = localStorage.getItem("auth_token");
    if (config.auth && !token) {
      console.log('需要登录的接口，却拿不到token');
      // return new Error('Auth fail.');
      let cancel;
      config.cancelToken = new CancelToken(function executor(c) {
        // executor 函数接收一个 cancel 函数作为参数
        cancel = c;
        // console.log(c('Auth fail.'));
      })
      cancel('Auth fail.');
    }
    // console.log(config);
    config.headers["x-auth-token"] = token;
    if (
      config.url !== "https://oss-sokogate-com.oss-cn-hongkong.aliyuncs.com"
    ) {
      config.transformRequest = [
        function (data) {
          // 在请求之前对data传参进行格式转换
          data = qs.stringify(data);
          return data;
        },
      ];
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    // console.log("response:", response);
    if (response.status === 200) {
      return Promise.resolve(response.data);
      // if (response.data.errcode === 0) {
      //   return Promise.resolve(response.data);
      // } else {
      //   return Promise.reject(response.data);
      // }
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    console.log("error:", error.response);
    if (error.response.data.message === "Invalid token.") {
      // console.log('error.response.data.message:', error.response.data.message);
      window.vm.$store.commit("loginout");
      // window.vm.$message({
      //   showClose: true,
      //   message: window.vm.$t(`errmsg.notlogin`),
      //   type: "error",
      // });
    }
    return Promise.reject(error.response);
  }
);

export default service;
