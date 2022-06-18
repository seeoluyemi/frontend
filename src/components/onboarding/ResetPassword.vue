<template>
  <div>
    <showcase>
      <onboarding-form class="mx-auto" :fields="fields" :user-active="user.active" @onError="toggleFieldState" @submit="resetPassword" reset-password
                       :error-message="errorMessage" :loading="loading"/>
    </showcase>
    <v-dialog v-model="dialog" max-width="300" persistent>
      <v-card>
        <v-card-text>
          <div class="ill">
            <v-img :src="require('../../assets/images/confetti.svg')"/>
          </div>
          <div>
            <h2 class="ah-title text-center">{{ user.active ? 'Password successfully updated!' : 'Password successfully changed!' }}</h2>
          </div>
          <div class="button">
            <base-button :to="{ name: 'Login' }" :color="$vuetify.theme.themes.light.linear__purple1" outlined>Log in</base-button>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Footer landing/>
  </div>
</template>

<script>
import Showcase from "@/components/resuables/Showcase";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import Footer from "@/components/resuables/Footer";
import axios from "axios";
import {baseUrl} from "@/constants";
import {mapGetters, mapMutations} from "vuex";
import {updatePassword} from "@/apis";
import BaseButton from "@/components/resuables/BaseButton";

export default {
  name: "ResetPassword",
  components: {BaseButton, Footer, OnboardingForm, Showcase},
  data: () => {
    return {
      loading: false,
      errorMessage: '',
      dialog: false,
    }
  },
  computed: {
    ...mapGetters(['user']),
    fields() {
      const fieldsOut = [
        {
          label: 'Password',
          type: 'password',
          placeholder: 'New Password',
          error: false,
        },
        {
          label: 'Confirm Password',
          type: 'password',
          placeholder: 'Confirm Password',
          error: false,
        }
      ]
      const fieldsIn = [
        {
          label: 'Current Password',
          type: 'password',
          placeholder: 'Current Password',
          error: false
        },
        {
          label: 'New Password',
          type: 'password',
          placeholder: 'New Password',
          error: false,
        },
        {
          label: 'Confirm Password',
          type: 'password',
          placeholder: 'Confirm Password',
          error: false,
        }
      ]
      if (this.user.active) {
        return fieldsIn
      } else {
        return  fieldsOut
      }
    }
  },
  methods: {
    ...mapMutations(['setLoggedIn', 'setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    async resetPassword($data) {
      // if ($data !== 2)
      //   return
      const token = this.$route.query.token
      this.loading = true
      try {
        if (this.user.active) {
          await this.updatePassword($data)
        } else {
          await this.changePassword(token, $data)
        }
        this.setErrorOrSuccessDialog(true)
        this.setErrorOrSuccessTitle(this.user.active ? 'Successfully updated your password' : 'Successfully changed your password')
        this.setErrorOrSuccessMessage('You are now logged out. Kindly login with your new password.')
        this.setSuccess(true)
        this.logout()
      } catch (e) {
        console.log(e, e.response)
        if (e.response.data.errors[0].title === 'your old password does not match your existing password') {
          this.errorMessage = 'The password provided does not match the current password'
          setTimeout(() => {this.errorMessage = ''}, 4000)
        }
        if (e.message === 'Couldn\'t update password. Try again.') {
          console.log('update ni')
        }
      }

      this.loading = false
    },
    async updatePassword(data) {
      try {
        await updatePassword(this.user.id, {
          old_password: data.current_password,
          new_password: data.new_password,
          new_password_confirmation: data.confirm_password
        })
        this.dialog = true
      } catch (e) {
        throw new Error('Couldn\'t update password. Try again.')
      }
    },
    async changePassword(token, $data) {
      try {
        await axios.put(baseUrl + "/password/reset",
            {password: $data.password, password_confirmation: $data.confirm_password},
            {headers: {Authorization: `Bearer ${token}`}})
      } catch (e) {
        console.log(e)
        throw new Error('Couldn\'t change password. Try again.')
      }
    },
    toggleFieldState(payload) {
      console.log('handle', payload)
      // const {label, error} = payload
      // console.log(payload)
      // const targetedField = this.fields.find(field => field.label === label)
      // targetedField.error = error
      // console.log(targetedField)
    },
    logout() {
      localStorage.clear()
      sessionStorage.clear()
      this.setLoggedIn(false)
      this.$router.push({name: 'Login'})
    }
  },
}
</script>

<style scoped>
 .ill {
   width: 100px;
   margin: 20px auto;
 }

 .button {
   max-width: 170px;
   margin: 0 auto;
 }

 .ah-title {
   margin: 40px 0;
   color: black;
 }
</style>