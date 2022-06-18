<template>
  <div>
    <showcase>
      <onboarding-form class="mx-auto" :fields="fields" forgot-password @submit="submit" :loading="loading" :error-message="errorMessage">
        <template #form_help>
          <div class="ah-flex">
            <p>Remembered?</p><router-link class="link ml-1" :to="{ name: 'Login' }">Log in</router-link>
          </div>
        </template>
      </onboarding-form>
    </showcase>
    <Footer block/>
  </div>
</template>

<script>
import Showcase from "@/components/resuables/Showcase";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import Footer from "@/components/resuables/Footer";
import {forgotPassword} from "@/apis";
import {mapMutations} from "vuex";
export default {
  name: "ForgotPassword",
  components: {Footer, OnboardingForm, Showcase},
  data() {
    return {
      loading: false,
      fields: [
        {
          label: 'Email Address',
          type: 'email',
          placeholder: 'Email',
          error: false
        },
      ],
      errorMessage: '',
    }
  },
  methods: {
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    async submit($data) {
      console.log($data)
      try {
        this.loading = true
        const { data } = await forgotPassword({ email: $data.email_address})
        console.log(data)
        this.loading = false
        this.setErrorOrSuccessDialog(true)
        this.setSuccess(true)
        this.setErrorOrSuccessMessage('Kindly check your mail')
        this.setErrorOrSuccessTitle('Link Successfully Sent!')
      } catch (e) {
        this.loading = false
        console.log(e, e.response)
        if (e.response && e.response.data && e.response.data.errors && e.response.data.errors[0].source.email === 'The selected email is invalid.') {
          this.errorMessage = "Oops! It seems we don't have this email registered in our system."
        }
        setTimeout(() => this.errorMessage = '', 4000)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .link {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }
</style>