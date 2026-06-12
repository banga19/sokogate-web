<template>
  <div class="personal-box">
    <sui-form
      ref="form"
      :list="formList"
      :defaultdata="formData"
      @submit="submit"
    />
  </div>
</template>


<script>
import SuiForm from "@/components/s-ui/form";
export default {
  components: { SuiForm },
  props: {
    name: {
      type: String,
      value: "",
    },
  },
  data() {
    return {
      formList: [
        {
          type: "input",
          name: "id",
          hidden: true,
        },
        {
          type: "uploadimage",
          name: "avatar",
          label: "settings.avatar",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          name: "Nickname",
          label: "settings.nickname",
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          type: "radio",
          name: "gender",
          label: "settings.gender",
          rules: [{ required: true }],
          range: [
            {
              label: "settings.male",
              value: 1,
            },
            {
              label: "settings.female",
              value: 0,
            },
          ],
        },
      ],
      formData: {
        gender: 1,
      },
    };
  },
  methods: {
    submit(data) {
      console.log(data);
    },
  },
};
</script>



<style lang="scss" scoped>
.personal-box {
  .tips {
    font-size: 10px;
    font-weight: 400;
    color: #ef2e22;
    position: relative;
    top: -395px;
    left: 95%;
  }
}
</style>


