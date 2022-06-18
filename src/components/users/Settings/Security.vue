<template>
  <div style="max-width: 400px" class="px-1 px-lg-7 my-10">
    <v-form @submit.prevent="getOTP">
<!--      <base-input @input="setQuestion" class="my-3" dense label="Select Security Questions"/>-->
      <label>Select Security Question</label>
      <v-select :items="questions" hide-details v-model="question" outlined placeholder="Select Security Question"/>
      <base-input class="my-3" @input="setAnswer" dense label="Enter Answer"/>
      <base-input class="my-3" type="password" dense label="Enter Password" @input="setPassword"/>
      <base-button :loading="loading" :color="$vuetify.theme.themes.light.linear__purple1" outlined>Save Changes</base-button>
    </v-form>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-text class="py-6">
          <p class="text-center ah-text-2xl ah-font-bold">Verify this is you</p>
          <div class="form-ill mx-auto">
            <v-img :src="require('../../../assets/images/keys.svg')"/>
          </div>
          <div class="ah-w-full ah-flex ah-flex-col ah-justify-center mt-8 mb-10">
            <small class="text-center">Enter the OTP sent to your phone number/email</small>
          </div>
          <div class="ah-flex ah-justify-between">
            <div class="code-box" v-for="(code, index) in codes" :key="index">
              <input maxlength="1" v-model="codes[index]" :ref="`input${index}`"/>
            </div>
          </div>
          <div class="ah-flex justify-center my-6">
            <base-button :loading="addingQuestion" outlined :color="$vuetify.theme.themes.light.linear__purple1" @click="send"><small>Verify</small></base-button>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseInput from "@/components/resuables/BaseInput";
import BaseButton from "@/components/resuables/BaseButton";
import {addSecretQuestion, getSecurityQuestionOTP} from "@/apis";
import handleError from "@/utils/errorHandler";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "Security",
  components: {BaseButton, BaseInput},
  data: () => ({
    loading: false,
    dialog: false,
    questions: [
      "What primary school did you attend?",
      "What is your childhood nickname?",
      "What is your mother maiden name?",
      "What street name did you lived as a child ?",
      "What is the name of your favorite childhood friend?",
    ],
    codes: ['', '', '', '', ''],
    question: '',
    answer: '',
    password: '',
    addingQuestion: false
  }),
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapMutations(['setUser', 'setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    async getOTP() {
      this.loading = true
      try {
        await getSecurityQuestionOTP()
        this.dialog = true
      } catch (e) {
        console.log(e)
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.loading = false
    },
    setQuestion({ value }) {
      this.question = value
    },
    setAnswer({ value }) {
      this.answer = value
    },
    setPassword({ value }) {
      this.password = value
    },
    async send() {
      const OTP = this.codes.join('')
      const {question, answer, password } = this
      try {
        this.addingQuestion = true
        await addSecretQuestion(this.user.id,{question, answer, password, OTP})
        this.dialog = false
        this.setErrorOrSuccessDialog(true)
        this.setErrorOrSuccessTitle('You have successfully added your security question.')
        this.setErrorOrSuccessMessage('You\'ll be asked whenever you need to make transactions.')
        this.setSuccess(true)
      } catch (e) {
        console.log(e)
        this.$displaySnackbar(e)
      }
      this.addingQuestion = false
    }
  }
}
</script>

<style scoped lang="scss">
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

.form-ill {
  width: 40%;
}
</style>