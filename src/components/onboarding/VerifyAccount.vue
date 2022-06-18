<template>
  <div>
    <showcase class="mb-10">
      <div v-if="showVerificationBox" class="verify-box ah-shadow-lg mx-auto">
        <div class="form-ill mx-auto">
          <v-img :src="require('../../assets/images/keys.svg')"/>
        </div>
        <div class="ah-w-full ah-flex ah-flex-col ah-justify-center mt-8 mb-10">
          <p class="text-center ah-font-bold">Verify Your Account</p>
          <small class="text-center">Enter the OTP sent to your phone number/email</small>
        </div>
        <div class="ah-flex ah-justify-between">
          <div class="code-box" v-for="(code, index) in codes" :key="index" @click="$refs[`input${index}`][0].focus()">
            <input maxlength="1" v-model="codes[index]" :ref="`input${index}`"/>
          </div>
        </div>
        <small class="py-4" v-text="spanMsg"/>
        <div class="ah-flex ah-justify-center my-6">
          <v-btn text @click="resendLink" :loading="resendLinkLoading">
            <span class="action-text">Resend Link</span>
          </v-btn>
        </div>
<!--        <div class="ah-flex ah-justify-center my-6">-->
<!--          <v-btn text>-->
<!--            <span class="action-text">Change phone number</span>-->
<!--          </v-btn>-->
<!--        </div>-->
        <div class="ah-flex ah-justify-center my-6">
          <base-button @click="verify" :loading="loading" :color="$vuetify.theme.themes.light.linear__purple1" outlined>
            Verify Account
          </base-button>
        </div>
      </div>
      <div v-else class="success-container">
        <div class="verify-box ah-shadow-lg mx-auto">
          <div class="form-ill mx-auto">
            <v-img :src="require('../../assets/images/confetti.svg')"/>
          </div>
          <p class="text-center ah-font-bold my-10">Account Registered Successfully!</p>
          <base-button :to="{ name: 'Login' }" class="my-5" :color="$vuetify.theme.themes.light.linear__purple1" outlined>
            Go to Dashboard
          </base-button>
        </div>
      </div>
    </showcase>
    <Footer landing/>
  </div>
</template>

<script>
import Showcase from "@/components/resuables/Showcase";
import Footer from "@/components/resuables/Footer";
import BaseButton from "@/components/resuables/BaseButton";
import {resendVerificationCode, verifyAccount} from "@/apis";
export default {
  name: "VerifyAccount",
  components: {BaseButton, Footer, Showcase},
  data() {
    return {
      codes: ['', '', '', '', ''],
      loading: false,
      showVerificationBox: true,
      resendLinkLoading: false,
      spanMsg: '',
    }
  },
  created() {
    window.addEventListener('keyup', this.pasteCode)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.pasteCode)
  },
  mounted() {
    this.$refs.input0[0].focus()
  },
  methods: {
    getCode(index, event) {
      if (this.codes[index].length > 0) return
      this.codes[index] = event.target.value
    },
    async verify() {
      const $data = { otp: this.codes.join("") }
      try {
        this.loading = true
        const { data } = await verifyAccount($data)
        console.log(data)
        this.showVerificationBox = false
      } catch (e) {
        console.log(e, e.response)
        this.$displaySnackbar(e)
        this.loading = false
      }
    },
    pasteCode() {
      // this.$refs.input0[0].focus()
      navigator.clipboard.readText().then(readText => {
        console.log(readText)
        if (readText) {
          let stringArray = Array.from(readText)
          console.log(stringArray, stringArray[0])
          this.codes[0] = stringArray[0]
          this.codes[1] = stringArray[1]
          this.codes[2] = stringArray[2]
          this.codes[3] = stringArray[3]
          this.codes[4] = stringArray[4]
        }
      })
    },
    async resendLink() {
      try {
        this.resendLinkLoading = true
        const { data } = await resendVerificationCode()
        console.log(data)
        this.spanMsg = 'Verification code successfully resent!'
        setTimeout(() => this.spanMsg = '', 4000)
        this.resendLinkLoading = false
      } catch (e) {
        this.spanMsg = 'Something went wrong! Please try again.'
        setTimeout(() => this.spanMsg = '', 4000)
        this.resendLinkLoading = false
      }
    }
  },
  watch: {
    'codes': {
      handler: function (value) {
        const index = value.findIndex(v => !v.trim())
        if (index === 1) this.$refs['input1'][0].focus()
        if (index === 2) this.$refs['input2'][0].focus()
        if (index === 3) this.$refs['input3'][0].focus()
        if (index === 4) this.$refs['input4'][0].focus()
        if (value.every(v => !!v)) this.verify()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@use '../../assets/styles/mixins';

.verify-box {
  height: auto;
  width: 320px;
  padding: 25px;
  border-radius: .25em;
  background: var(--v-white-base);

  //@include mixins.sm {
  //  width: 65%;
  //}
  //
  //@include mixins.md {
  //  width: 40%;
  //}
  //
  //@include mixins.xl {
  //  width: 30%;
  //}
}

.form-ill {
  width: 40%;
}

.code-box {
  width: 48px;
  height: 50px;
  border-radius: 5px;
  border: 2px solid var(--v-button__border-base);
  padding: 0 15px;
  cursor: text;

  input {
    outline: none;
    width: 100%;
    height: 100%;
  }
}

.action-text {
  background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
  text-transform: capitalize;
}

.v-btn:hover {
    background: none !important;
}

.success-container {
  height: 600px;
}
</style>