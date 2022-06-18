<template>
  <div class="form-box ah-shadow mb-5">
    <div v-if="login || admin || forgotPassword || resetPassword" class="mx-auto ill-box text-center mt-10">
      <div class="form-ill mx-auto">
        <v-img :src="require('../../assets/images/keys.svg')"/>
      </div>
      <p v-if="login">Sign In</p>
      <p v-else-if="admin">Welcome Back</p>
      <p v-else-if="forgotPassword">Forgot Password</p>
      <p v-else-if="resetPassword">{{ ($route.query.update ? 'Update' : 'Reset') + ' Password' }}</p>
    </div>
    <div v-else-if="signUp" class="ill-box mx-auto text-center mt-10">
      <div class="form-ill mx-auto">
        <v-img :src="require('../../assets/images/keys.svg')"/>
      </div>
      <p>Sign Up</p>
    </div>
    <small v-if="errorMessage !== ''" class="ah-error">{{ errorMessage }}</small>
    <form id="form" class="mt-12" @submit.prevent="submit">
     <div v-for="(field, index) in fields" :key="index">
       <base-input
           v-if="field.type !== 'phone'"
           :confirmation-error="field.label === 'Confirm Password' ? confirmationError : undefined"
           :isError="field.error" :prop-value="login && field.label === 'Email Address' ? formData.email_address : ''" :label="field.label" :placeholder="field.placeholder" :type="field.type" class="mb-8"
           @input="takeInput" @valid="makeValid"/>
       <div v-else class="my-6">
         <label class="label mb-2">Phone Number</label>
         <vue-tel-input @input="[handlePhoneInput('phone_number', $event)]" @country-changed="saveCountryCode" />
       </div>
     </div>
      <div class="my-10">
        <slot name="form_help"/>
      </div>
      <div class="ah-text-center my-8">
        <base-button :color="$vuetify.theme.themes.light.linear__purple1" :loading="loading" outlined>{{ buttonText }}
        </base-button>
      </div>
      <div class="ah-text-center alt-action-box">
        <p v-if="login">Don't have an account? <span><router-link
            :to="{ name: 'Register' }">Sign Up</router-link></span></p>
        <p v-else-if="signUp">Already have an account? <span><router-link :to="{ name: 'Login' }">Sign In</router-link></span>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import BaseInput from "@/components/resuables/BaseInput";
import BaseButton from "@/components/resuables/BaseButton";

export default {
  name: "OnboardingForm",
  components: {BaseButton, BaseInput},
  data() {
    return {
      formData: {},
      mismatched: false,
      formError: false,
      // fields: {},
      confirmationError: false,
    }
  },
  mounted() {
    const that = this
    this.$root.$on('remember', function () {
      if (!that.validateForm() && Object.prototype.hasOwnProperty.call(that.formData, 'email_address')) {
        const { email_address } = that.formData
        if (!email_address) return
        console.log(email_address)
        localStorage.setItem('user_login', email_address)
        localStorage.setItem('remember', 'true')
      } else {
        // this.$root.$emit('clear_remember')
      }
    })
    const email_address = localStorage.getItem('user_login')
    if (email_address !== null &&
        email_address !== 'null' &&
        email_address !== 'undefined' &&
        email_address !== undefined) {
      this.$set(this.formData, 'email_address', email_address)
    }
  },
  watch: {
    errorMessage(message) {
      if (message !== '') {
        document.querySelector('.form-box').scrollIntoView({behavior: "smooth"})
      }
    }
  },
  computed: {
    buttonText() {
      let btnTxt;
      if (this.signUp) btnTxt = 'Sign Up'
      else if (this.login || this.admin) btnTxt = 'Sign In'
      else if (this.forgotPassword) btnTxt = 'Send Link'
      else if (this.resetPassword) btnTxt = 'Confirm'
      return btnTxt
    }
  },
  methods: {
    saveCountryCode ({ dialCode }) {
      this.$set(this.formData, 'country_code', dialCode)
    },
    handlePhoneInput (label, $event) {
      console.log(label, $event)
      this.takeInput({name: label, value: $event})
    },
    takeInput(inputPayload) {
      const {name, value} = inputPayload
      this.$set(this.formData, name, value)
    },
    submit() {
      if (this.validateForm()) return;

      this.$emit('submit', this.formData)
      console.log(this.formData)
    },
    validateForm() {
      // for registration, checks fields only for sign up
      if (this.signUp) {
        if (!Object.prototype.hasOwnProperty.call(this.formData, 'first_name') || this.formData.first_name === '')
          this.emitError('First Name')
        if (!Object.prototype.hasOwnProperty.call(this.formData, 'last_name') || this.formData.last_name === '')
          this.emitError('Last Name')
        if (!Object.prototype.hasOwnProperty.call(this.formData, 'phone_number') || this.formData.phone_number === '')
          this.emitError('Phone Number')
      }

      //checks field(s) that sign up and reset password share
      if (this.signUp || this.resetPassword) {
        if (!Object.prototype.hasOwnProperty.call(this.formData, 'confirm_password') || this.formData.confirm_password === '')
          this.emitError('Confirm Password')
      }

      // checks field that sign up and login share
      if (this.signUp || this.login) {
        if (!Object.prototype.hasOwnProperty.call(this.formData, 'password') || this.formData.password === '') {
          this.emitError('Password')
        }
      }

      // checks field that sign up, forgot password and login share
      if (this.signUp || this.forgotPassword || this.login) {
        if (!Object.prototype.hasOwnProperty.call(this.formData, 'email_address') || this.formData.email_address === '')
          this.emitError('Email Address')
      }

      if (this.resetPassword) {
        console.log('iam reset')
        if (!Object.prototype.hasOwnProperty.call(this.formData, 'new_password') || this.formData.new_password === '') {
          this.emitError('New Password')
        }
        if (this.userActive) {
          if (!Object.prototype.hasOwnProperty.call(this.formData, 'current_password') || this.formData.current_password === '') {
            this.emitError('Current Password')
          } else if (!Object.prototype.hasOwnProperty.call(this.formData, 'confirm_password') || this.formData.new_password !== this.formData.confirm_password) {
            this.emitError('Confirm Password')
          }
          console.log(this.fields)
        }
      }

      if ((Object.prototype.hasOwnProperty.call(this.formData, 'password') || Object.prototype.hasOwnProperty.call(this.formData, 'new_password')) && Object.prototype.hasOwnProperty.call(this.formData, 'confirm_password')) {
        if (this.formData.new_password) {
          if (this.formData.new_password !== this.formData.confirm_password) {
            this.confirmationError = true
          }
        } else if (this.formData.password !== this.formData.confirm_password) {
          this.confirmationError = true
        }
      }
      return this.fields.some(field => field.error === true) || this.confirmationError
    },
    makeValid(label) {
      if (label === 'Confirm Password') this.confirmationError = false
      this.$emit('makeValid', {label, error: false})
    },
    emitError(label) {
      this.$emit('onError', {label, error: true})
    }
  },
  props: {
    fields: Array,
    login: Boolean,
    signUp: Boolean,
    admin: Boolean,
    loading: Boolean,
    forgotPassword: Boolean,
    resetPassword: Boolean,
    errorMessage: String,
    userActive: Boolean
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/mixins';

.form-box {
  background: var(--v-white-base);
  height: auto;
  max-width: 320px;
  padding: 25px;
  border-radius: .25em;

  @include mixins.sm {
    max-width: 350px;
  }

  .form-ill {
    width: 40%;
  }

  .ill-box > p {
    font-weight: bold;
    color: var(--v-deep__purple-base);
    margin-top: 15px;
    font-size: 1.6em;
    white-space: nowrap;
  }

  form {
    width: 100%;

    .alt-action-box {
      a {
        background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 500;
      }
    }
  }

  .help-link {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }

  .ah-error {
    color: red;
    font-weight: bold;
  }
}

.label {
  color: var(---v-deep__purple-base);
  font-weight: 500;
}
</style>