<template>
  <div>
    <el-dialog :visible.sync="cinetpayVisible" width="600px" :append-to-body="true" :close-on-click-modal="false">

      <el-form class="paymentForm" ref="formRef" :rules="rules" :model="formData" label-position="top" size="small">
        <el-form-item :label="$t('common.mobile')" prop="phone_number" v-if="showFields.includes('phone_number')">
          <el-input v-model.trim="formData.phone_number" :placeholder="$t('common.mobile')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.email')" prop="email" v-if="showFields.includes('email')">
          <el-input v-model.trim="formData.email" :placeholder="$t('common.email')"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cinetpayVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t('common.ok') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EmailAndPhoneModal',
  data() {
    return {
      cinetpayVisible: false,
      showFields: [],
      formData: {
        phone_number: null,
        email: null,
      }
    }
  },
  computed: {
    rules() {
      return {
        phone_number: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('common.mobileMatch'),
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('common.enteremail'),
            trigger: 'blur',
          },
        ],
      }
    }
  },
  methods: {
    open(fields) {
      this.showFields = fields
      this.cinetpayVisible = true
    },
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.cinetpayVisible = false
          this.$emit('submit', { ...this.formData })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>