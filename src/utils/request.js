import axios from "axios";

const CancelToken = axios.CancelToken;
const service = axios.create({
  baseURL: process.env.VUE_APP_V2_API_URL,
  timeout: 60000,
});

/**
 * Read a cookie value by name.
 * Used by the CSRF interceptor below.
 */
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

service.interceptors.request.use(
  (config) => {
    // Set request headers
    config.headers["Content-Type"] = "application/json; charset=UTF-8";
    config.withCredentials = true; // Send HttpOnly cookies with every request

    // CSRF protection: read the csrf-token cookie (set by backend on login/register)
    // and send it as a custom header. The server compares the header to the cookie.
    const csrfToken = getCookie('csrf-token');
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }

    // If auth is required, check the store for login state
    // (Actual auth is handled server-side via HttpOnly cookie)
    if (config.auth) {
      const isLoggedIn = window?.vm?.$store?.state?.token;
      if (!isLoggedIn) {
        console.log("Auth required but user is not logged in");
        let cancel;
        config.cancelToken = new CancelToken(function executor(c) {
          cancel = c;
        });
        cancel("Auth fail.");
      }
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
