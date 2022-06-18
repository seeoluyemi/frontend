<template>
  <div class="admin-login">
    <showcase>
      <onboarding-form :fields="fields" :loading="loading" admin class="mx-auto" @submit="login">
        <template #form_help>
          <div class="ah-flex ah-items-center ah-justify-between ah-w-full">
            <div>
              <label class="ah-flex ah-items-center" for="rememberMe">
                <simple-icon :type="rememberMe ? 'checked-box' : 'unchecked-box'" class="mr-3"/>
                <input id="rememberMe" class="ah-hidden" type="checkbox" @change="rememberMe = !rememberMe">
                Remember Me
              </label>
            </div>
            <a class="help-link" href="/forgot-password">Forgot Password</a>
          </div>
        </template>
      </onboarding-form>
    </showcase>
  </div>
</template>

<script>
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import SimpleIcon from "@/components/resuables/SimpleIcon";
import {mapMutations} from "vuex";
import Showcase from "@/components/resuables/Showcase";
import {login} from "@/apis";

export default {
  name: "AdminLogin",
  components: {Showcase, SimpleIcon, OnboardingForm},
  data() {
    return {
      loading: false,
      rememberMe: false,
      fields: [
        {
          label: 'Email Address',
          type: 'email',
          placeholder: 'email'
        },
        {
          label: 'Password',
          type: 'password',
          placeholder: 'Password'
        }
      ],
    }
  },
  created() {
    if (this.$route.query.firstLogin) {
      localStorage.setItem("first_login", 'true')
    }
  },
  methods: {
    ...mapMutations(['setUser', 'setLoggedIn']),
    async login(loginDetails) {
      if (loginDetails.email_address !== '' && loginDetails.password) {
        try {
          this.loading = true
          const {data: {data: {user}}} = await login({
            email: loginDetails.email_address,
            password: loginDetails.password
          })
          this.loading = false
          localStorage.setItem('userData', JSON.stringify(user))
          this.setUser(user)
          this.setLoggedIn(true)
          if (user.user_type === 'super_admin')
            await this.$router.push({name: 'AdminDashboard'})
          else if (user.user_type === 'customer')
            await this.$router.push({name: 'UserDashboard'})
        } catch (e) {
          this.loading = false
          this.$displaySnackbar(e)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/mixins';

.admin-login {
  background: var(--v-deep__purple-base);
  min-height: 100vh;
}

.admin-showcase {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background: url("../../assets/images/showcase__bg_m.svg") no-repeat;
  padding-top: 80px;

  @include mixins.customable(376) {
    background: url("../../assets/images/showcase__bg.svg") no-repeat -100px -660px;
    background-position-x: -790px;
    background-position-y: -670px;
  }

  @include mixins.lg {
    background-position-x: -390px;
  }

  @include mixins.xl {
    //height: 708px;
    background-position-x: -90px;
  }

}
</style>