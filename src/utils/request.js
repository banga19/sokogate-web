import axios from "axios";

const CancelToken = axios.CancelToken;
const service = axios.create({
  baseURL: process.env.VUE_APP_V2_API_URL,
  timeout: 60000,
});

service.interceptors.request.use(
  (config) => {
    // Set request headers
    config.headers["Content-Type"] = "application/json; charset=UTF-8";
    let token = localStorage.getItem("auth_token");
    if (config.auth && !token) {
      console.log("Auth required but no token found");
      let cancel;
      config.cancelToken = new CancelToken(function executor(c) {
        cancel = c;
        // console.log(c('Auth fail.'));
      });
      cancel("Auth fail.");
    }
    // console.log(config);
    config.headers["x-auth-token"] = token;
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
    const { config } = response
    if (config.ignoreError) {
      return response
    }
    if (response.status === 200) {
      if (response.data.errcode === 0) {
        return response.data;
      } else {
        if (response.data.errcode === 707) {
          const store = window?.vm?.$store
          const route = window?.vm?.$route
          const { fullPath, name, path, query } = route || {}
          const backToRouter = JSON.stringify({
            fullPath,
            name,
            path,
            query,
          });
          localStorage.setItem("backToRouter", backToRouter);
          if (store && store._vm && store._vm.$router) {
            store._vm.$router.replace({ path: "/v2/login" }).catch((err) => err);
          }
        }
        return Promise.reject(response.data);
      }
    } else {
      return Promise.reject(new Error(response));
    }
  },
  (error) => {
    console.log("error:", error);
    if (error.message === "Auth fail.") {
      const store = window?.vm?.$store
      const route = window?.vm?.$route
      const { fullPath, name, path, query } = route || {}
      const backToRouter = JSON.stringify({ fullPath, name, path, query });
      localStorage.setItem("backToRouter", backToRouter);
      if (store && store._vm && store._vm.$router) {
        store._vm.$router.replace({ path: "/v2/login" }).catch((err) => err);
      }
    }
    return Promise.reject(error);
  }
);

export default service;
