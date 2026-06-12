<template>
  <div>
    <el-dialog :title="$t('payment.choosePay')" :visible.sync="cinetpayVisible" width="600px" :append-to-body="true"
      :close-on-click-modal="false">

      <el-tabs v-model="cinetpayTab">
        <el-tab-pane :label="$t('payment.mobileOrWallet')" name="mobileOrWallet">
          {{ $t('payment.mobileOrWalletText') }}
        </el-tab-pane>
        <el-tab-pane :label="$t('payment.letterCard')" name="letterCard">

          <el-form class="paymentForm" ref="formRef" :rules="cinetpayTab === 'letterCard' ? rules : undefined"
            :model="cinetpayFormData" label-position="top" size="small">
            <el-form-item :label="$t('payment.customer_name')" prop="customer_name">
              <el-input v-model.trim="cinetpayFormData.customer_name"
                :placeholder="$t('payment.customer_name')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_surname')" prop="customer_surname">
              <el-input v-model.trim="cinetpayFormData.customer_surname"
                :placeholder="$t('payment.customer_surname')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_phone_number')" prop="customer_phone_number">
              <el-input v-model.trim="cinetpayFormData.customer_phone_number"
                :placeholder="$t('payment.customer_phone_number')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_email')" prop="customer_email">
              <el-input v-model.trim="cinetpayFormData.customer_email"
                :placeholder="$t('payment.customer_email')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_address')" prop="customer_address">
              <el-input v-model.trim="cinetpayFormData.customer_address"
                :placeholder="$t('payment.customer_address')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_city')" prop="customer_city">
              <el-input v-model.trim="cinetpayFormData.customer_city"
                :placeholder="$t('payment.customer_city')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_country')" prop="customer_country">
              <el-input v-model.trim="cinetpayFormData.customer_country"
                :placeholder="$t('payment.customer_country')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_state')" prop="customer_state">
              <el-input v-model.trim="cinetpayFormData.customer_state"
                :placeholder="$t('payment.customer_state')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('payment.customer_zip_code')" prop="customer_zip_code">
              <el-input v-model.trim="cinetpayFormData.customer_zip_code"
                :placeholder="$t('payment.customer_zip_code')"></el-input>
            </el-form-item>
          </el-form>

        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cinetpayVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t('common.ok') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CinetpayModal',
  data() {
    return {
      cinetpayVisible: false,
      cinetpayTab: 'mobileOrWallet',
      cinetpayFormData: {
        customer_name: null,
        customer_surname: null,
        customer_phone_number: null,
        customer_email: null,
        customer_address: null,
        customer_city: null,
        customer_country: null,
        customer_state: null,
        customer_zip_code: null,
      }
    }
  },
  computed: {
    rules() {
      return {
        customer_name: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_name'),
            trigger: 'blur',
          },
        ],
        customer_surname: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_surname'),
            trigger: 'blur',
          },
        ],
        customer_phone_number: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_phone_number'),
            trigger: 'blur',
          },
        ],
        customer_email: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_email'),
            trigger: 'blur',
          },
        ],
        customer_address: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_address'),
            trigger: 'blur',
          },
        ],
        customer_city: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_city'),
            trigger: 'blur',
          },
        ],
        customer_country: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_country'),
            trigger: 'blur',
          },
        ],
        customer_state: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_state'),
            trigger: 'blur',
          },
        ],
        customer_zip_code: [
          {
            required: true,
            message: this.$t('payment.pleaseEnter') + this.$t('payment.customer_zip_code'),
            trigger: 'blur',
          },
        ],
      }
    }
  },
  methods: {
    open() {
      this.cinetpayVisible = true
    },
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.cinetpayVisible = false
          if (this.cinetpayTab === 'mobileOrWallet') {
            this.$emit('submit')
          } else {
            this.$emit('submit', { ...this.cinetpayFormData })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>