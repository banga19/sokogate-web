import CryptoJS from "crypto-js";
const moment = require("moment");

export const getFileNameMd5 = (file) => {
  return new Promise(function (resolve, reject) {
    try {
      const types = file.type.split("/");
      const folder = types[0];
      const type = types[1];
      var fileReader = new FileReader();

      // Async execution
      fileReader.onload = function (e) {
        const md5 = CryptoJS.MD5(
          CryptoJS.enc.Latin1.parse(e.target.result)
        ).toString();
        md5
          ? resolve(`${folder}/${md5}.${type}`)
          : reject(new Error("md5 error"));
      };

      // Get file binary data
      fileReader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

export function jumpto(path) {
  if (path.indexOf("https://") > -1 || path.indexOf("http://") > -1) {
    window.location.href = path;
  } else if (process.env.VUE_APP_V1_HOMEPAGE_URL) {
    window.location.href = process.env.VUE_APP_V1_HOMEPAGE_URL + path;
  }
}

export function debounce(fn, delay = 200) {
  var timer;
  return function () {
    var th = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, delay);
  };
}

export function formatQuery(obj) {
  return Object.keys(obj)
    .map((key) => {
      return key + "=" + obj[key];
    })
    .join("&");
}

export function i18nImg(name) {
  return `https://oss.sokogate.com/image/${window.vm.$t(name)}`;
}

export function isEmpty(v) {
  switch (typeof v) {
    case "undefined":
      return true;
    case "string":
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0)
        return true;
      break;
    case "boolean":
      if (!v) return true;
      break;
    case "number":
      if (isNaN(v)) return true;
      break;
    case "object":
      if (null === v || v.length === 0) return true;
      for (var i in v) {
        return false;
      }
      return true;
  }
  return false;
}

// Two decimal places
export function formatToDecimal(num) {
  // Format as decimal, cents -> yuan
  const float = parseFloat(num);
  // console.log('float', float);
  if (isNaN(float)) {
    return "0.00";
  }
  return keepTwoDecimal(Math.round(num) / 100);
}

export function keepTwoDecimal(num) {
  const xsd = num.toString().split(".");
  // console.log('xsd:', xsd);
  if (xsd.length === 1) {
    return num.toString() + ".00";
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      num = num.toString() + "0";
    } else if (xsd[1].length > 2) {
      num = num.toFixed(2);
    }
    return num;
  }
}

export function formatDataTime(unix) {
  // Format timestamp to date time
  return moment.unix(unix).format("YYYY-MM-DD HH:mm:ss");
}

// Timestamp date formatting
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1,length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

export function recoverCmbNum(string, num = 1) {
  const [l, w, h] = string.split("*");
  if (l && w && h) {
    return Number(l) * Number(w) * Number(h) * num;
  } else {
    return 0;
  }
}

export function getCbmWithList(list) {
  return list
    .map((p) => {
      const sum = p.list
        .map((color) => {
          return color.specs;
        })
        .reduce((a, v) => a.concat(v), [])
        .reduce((a, v) => a + v.num, 0);
      const cbm = this.recoverCmbNum(p.volume.size, sum);
      // console.log("p.volume:", p.volume, "cbm:", cbm, "sum:", sum);
      return cbm > 0.01 ? cbm : 0.01;
    })
    .reduce((a, v) => Number(a) + Number(v), 0);
}

export function getWeightWithList(list) {
  return list
    .map((p) => {
      const sum = p.list
        .map((color) => {
          return color.specs;
        })
        .reduce((a, v) => a.concat(v), [])
        .reduce((a, v) => a + v.num, 0);
      const weight = p.weight.size * sum;
      return weight > 0.01 ? weight : 0.01;
    })
    .reduce((a, v) => Number(a) + Number(v), 0);
}

export function navto(path, query = {}) {
  window.vm.$router.push({
    path,
    query,
  });
}

export function redirecto(path, query = {}) {
  window.vm.$router.replace({
    path,
    query,
  });
}

export function navWithParams(name, params = {}) {
  if (window.vm.$store.getters.authTokenIsValid) {
    window.vm.$router.push({
      name,
      params,
    });
  } else {
    const { fullPath, name, path, query } = window.vm.$route;
    const backToRouter = JSON.stringify({
      fullPath,
      name,
      path,
      query,
    });
    localStorage.setItem("backToRouter", backToRouter);
    window.vm.$message({
      showClose: false,
      message: window.vm.$t("common.logininplease"),
      type: "error",
    });
    this.navto("/v2/login");
  }
}

export function confirm({ title, content, okText, cancelText }) {
  return window.vm.$bvModal.msgBoxConfirm(content, {
    title: title || window.vm.$t("api.message"),
    okTitle: okText || window.vm.$t("modal.ok"),
    cancelTitle: cancelText || window.vm.$t("modal.cancel"),
    centered: true,
  });
}

export function isMobile() {
  if (typeof window.orientation !== 'undefined') {
    return true
  }
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    return true
  }
  if (window.innerWidth < 768) {
    return true
  }
  return false
}