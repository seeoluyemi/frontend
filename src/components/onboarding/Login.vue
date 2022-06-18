<template>
  <div>
    <showcase>
      <onboarding-form class="mx-auto" :fields="fields" login @submit="login" :loading="loading" :error-message="errorMessage">
        <template #form_help>
          <div class="ah-flex ah-items-center ah-justify-between ah-w-full">
            <div>
              <label for="rememberMe" class="ah-flex ah-items-center">
                <simple-icon :type="rememberMe ? 'checked-box' : 'unchecked-box'" class="mr-3"/>
                <input type="checkbox" @change="rememberMe = !rememberMe" id="rememberMe" class="ah-hidden">
                <span class="text-no-wrap">Remember Me</span></label>
            </div>
            <router-link to="/forgot-password" class="text-no-wrap help-link">Forgot Password</router-link>
          </div>
        </template>
      </onboarding-form>
    </showcase>
    <Footer block landing/>
  </div>
</template>

<script>
import Showcase from "@/components/resuables/Showcase";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import SimpleIcon from "@/components/resuables/SimpleIcon";
import Footer from "@/components/resuables/Footer";
import {login} from "@/apis";
import {mapMutations} from "vuex";

export default {
  name: "Login",
  components: {Footer, SimpleIcon, OnboardingForm, Showcase},
  data() {
    return {
      rememberMe: false,
      loading: false,
      fields: [
        {
          label: 'Email Address',
          type: 'email',
          placeholder: 'Email',
          error: false
        },
        {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
          error: false
        }
      ],
      errorMessage: ''
    }
  },
  watch: {
    rememberMe(rememberMe) {
      if (rememberMe) {
        this.$root.$emit('remember')
      } else {
        localStorage.removeItem('user_login')
        localStorage.setItem('remember', 'false')
      }
    },
    errorMessage(value) {
      value && setTimeout(() => {
        this.errorMessage = ''
      }, 6000)
    }
  },
  mounted() {
    const that = this
    this.$root.$on('clear_remember', function () {
      that.rememberMe = false
    })
    if (localStorage.getItem('remember') === 'true')
      this.rememberMe = true
  },
  methods: {
    ...mapMutations(['setUser', 'setLoggedIn']),
    async login(loginDetails) {
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(loginDetails.password)) {
        this.errorMessage = 'Password does not match format (Eight minimum characters, Uppercase, At least a number and a special character)';
        // return
      }
      if (loginDetails.email_address !== '' && loginDetails.password) {
        this.loading = true
        try {
          const { data } = await login({ email: loginDetails.email_address, password: loginDetails.password })
          this.loading = false
          localStorage.setItem('userData', JSON.stringify(data.data.user))
          await this.setUser(data.data.user)
          await this.setLoggedIn(true)
          if (data.data.user.user_type === 'super_admin')
            await this.$router.push({ name: 'AdminDashboard' })
          else {
            sessionStorage.setItem('userData', JSON.stringify(data.data.user))
            await this.$router.push({ name: 'UserDashboard' })
          }
        } catch (e) {
          console.log(e)
          this.loading = false
          // console.log(e.name, e.message, 'it fails', e.response)
          if (e.message === 'Network Error') {
            this.errorMessage = 'Check your internet connection!'
          } else if (e.response === undefined) {
            this.errorMessage = 'Kindly check that email and password provided is correct'
          } else {
            if (e.response.status === 401) {
              this.errorMessage = 'Invalid email or password. Please confirm your details and try again.'
            }
          }
          setTimeout(() => this.errorMessage = '', 4000)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  label {
    cursor: pointer;
  }

  .forgot {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }
</style>