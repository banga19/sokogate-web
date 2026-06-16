<template>
  <el-upload
    class="upload-oss"
    drag
    action
    :http-request="handleUpload"
    multiple
    :show-file-list="false"
    accept="image/webp, image/jpg, image/jpeg, image/png, image/gif"
  >
    <slot name="img">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("common.uploadTips") }}
        <em>{{ $t("common.uploadClick") }}</em>
      </div>
    </slot>
  </el-upload>
</template>

<script>
// import { uploadoss, renderData } from "@/utils/api_v1";
import { GetOssPolicyToken } from "@/utils/api";
import { getFileNameMd5 } from "@/utils";
export default {
  data() {
    return {
      storeId: "",
      accessid: "",
      expire: "",
      host: "",
      policy: "",
      signature: "",
    };
  },
  methods: {
    // oss签名
    getOssSignature() {
      return new Promise((resolve, reject) => {
        try {
          // console.log("getOssSignature:");
          this.ossSignatureAvailable()
            .then((res) => {
              // console.log("ossSignatureObj:", res);
              resolve(res);
            })
            .catch((err) => {
              console.log("ossSignatureObj-err:", err);
              // renderData("GET", "oss")
              //   .then((res) => {
              //     console.log("getOssSignature-res:", res);
              //     localStorage.setItem(
              //       "ossSignature",
              //       JSON.stringify(res.data)
              //     );
              //     resolve(res.data);
              //     // this.accessid = res.data.accessid;
              //     // this.expire = res.data.expire;
              //     // this.host = res.data.host;
              //     // this.policy = res.data.policy;
              //     // this.signature = res.data.signature;
              //   })
              //   .catch((error) => {
              //     reject(error);
              //   });
              GetOssPolicyToken()
                .then((res) => {
                  // console.log("GetOssPolicyToken-res", res);
                  localStorage.setItem(
                    "ossSignature",
                    JSON.stringify(res.data)
                  );
                })
                .catch((error) => {
                  console.log("GetOssPolicyToken-err", error);
                });
            });
        } catch (error) {
          reject(error);
        }
      });
    },

    ossSignatureAvailable() {
      return new Promise(function (resolve, reject) {
        // console.log("ossSignatureAvailable:");
        try {
          const ossSignatureJson = localStorage.getItem("ossSignature");
          // console.log("ossSignatureJson:", ossSignatureJson);
          if (ossSignatureJson) {
            const ossSignatureObj = JSON.parse(ossSignatureJson);
            const nowUnix = Math.round(new Date().getTime() / 1000);
            if (
              ossSignatureObj &&
              ossSignatureObj.expire &&
              ossSignatureObj.expire > nowUnix &&
              ossSignatureObj.expire - nowUnix > 60 * 60 // 有效期大于1小时
            ) {
              resolve(ossSignatureObj);
            } else {
              reject(new Error("ossSignature expired"));
            }
          } else {
            reject(new Error("empty ossSignature"));
          }
        } catch (error) {
          reject(error);
        }
      });
    },

    // upload事件.
    async handleUpload(option) {
      // console.log("getAuth-option:", option);
      const fileName = await getFileNameMd5(option.file);
      // console.log("fileName:", fileName);
      // const type = option.file.type;
      // const size = option.file.size;
      // const restype = type.substring(0, type.indexOf("/"));
      this.getOssSignature();
      // const OssSignatureObj = await this.getOssSignature();
      // console.log("OssSignatureObj:", OssSignatureObj);
      // await uploadoss("POST", OssSignatureObj.host, {
      //   key: fileName,
      //   OSSAccessKeyId: OssSignatureObj.accessid,
      //   policy: OssSignatureObj.policy,
      //   signature: OssSignatureObj.signature,
      //   success_action_status: 200,
      //   file: option.file,
      // }).then(() => {
      //   const url = `HTTPS://oss.sokogate.com/${fileName}`;
      //   console.log("handleUpload-uploadRes:", uploadRes, url);
      //   this.$emit("onsuccess", { filename: url });
      // });
      // AddOssFile({
      //   categoryId: this.storeId || "",
      //   filename: fileName,
      //   filetype: restype,
      //   size: size,
      // })
      //   .then((res) => {
      //     console.log("AddOssFile-res", res);
      const url = `HTTPS://oss.sokogate.com/${fileName}`;
      this.$emit("onsuccess", { filename: url });
      // })
      // .catch((error) => {
      //   console.log("AddOssFile-err", error);
      // });
    },
  },
};
</script>