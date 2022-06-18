<template>
  <div>
    <showcase class="pb-4">
      <onboarding-form class="mx-auto" @submit="register" :fields="fields" :error-message="errorMessage"
                       @makeValid="toggleFieldState" @onError="toggleFieldState" sign-up :loading="loading">
        <template #form_help>
          <div class="ah-flex ah-items-center ah-justify-between ah-w-full">
            <div>
              <label for="rememberMe" class="ah-flex ah-items-center">
                <simple-icon :type="agree ? 'checked-box' : 'unchecked-box'" class="mr-3"/>
                <input type="checkbox" @change="agree = !agree" id="rememberMe" class="ah-hidden">
                <span class="ah-text">I agree to the <router-link to="/t&c" class="help-link ml-2">Terms and Conditions</router-link></span></label>
            </div>
          </div>
        </template>
      </onboarding-form>
    </showcase>
    <Footer landing block/>
  </div>
</template>

<script>
import Showcase from "@/components/resuables/Showcase";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import SimpleIcon from "@/components/resuables/SimpleIcon";
import Footer from "@/components/resuables/Footer";
import {register} from "@/apis";

export default {
  name: "Register",
  components: {Footer, SimpleIcon, OnboardingForm, Showcase},
  data() {
    return {
      agree: false,
      loading: false,
      fields: [
        {
          label: 'First Name',
          placeholder: 'John',
          error: false
        },
        {
          label: 'Last Name',
          placeholder: 'Doe',
          error: false
        },
        {
          label: 'Email Address',
          placeholder: 'Email',
          type: 'email',
          error: false
        },
        {
          label: 'Phone Number',
          placeholder: '70885646373',
          type: 'phone',
          error: false,
        },
        {
          label: 'Password',
          placeholder: 'Password',
          type: 'password',
          error: false
        },
        {
          label: 'Confirm Password',
          placeholder: 'Password',
          type: 'password',
          error: false
        }
      ],
      errorMessage: '',
    }
  },
  methods: {
    async register(data) {
      console.log('register')
      if (!this.agree) {
        this.errorMessage = 'You must agree to the terms and condition to register.'
        setTimeout(() => this.errorMessage = '', 4000)
        return
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(data.password)) {
        this.errorMessage = 'Password does not match format (Eight minimum characters, Uppercase, At least a number and a special character)'
        setTimeout(() => this.errorMessage = '', 4000)
        return
      }
      console.log(data)
      const $data = {
        email: data.email_address,
        password: data.password,
        password_confirmation: data.confirm_password,
        user_type: 'merchant',
        name: `${data.first_name} ${data.last_name}`,
        phone_number: data.phone_number,
        country_code: data.country_code
      }
      console.log($data)
      this.loading = true
      try {
        const {data} = await register($data)
        console.log(data)
        this.loading = false
        localStorage.setItem('userData', JSON.stringify(data.data.user))
        await this.$router.push({name: 'VerifyAccount'})
      } catch (e) {
        console.log(e, e.response)
        this.loading = false
        if (e.response && e.response.data && e.response.data.errors && e.response.data.errors[0].source.email === 'The email has already been taken.') {
          this.errorMessage = "Oops! It seems someone already registered with this email address"
        }
        setTimeout(() => this.errorMessage = '', 4000)
      }

    },
    toggleFieldState(payload) {
      const {label, error} = payload
      const targetedField = this.fields.find(field => field.label === label)
      targetedField.error = error
    }
  }
}
</script>

<style scoped>

</style>