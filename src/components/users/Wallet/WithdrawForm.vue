<template>
  <v-dialog v-model="dialog" max-width="400" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="d-flex justify-space-between"><h3>Withdraw from balance</h3><v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn> </v-card-title>
      <v-card-text>
        <div>
          <span class="error--text font-weight-bold" style="height: 16px" v-show="errorMsg">{{errorMsg}}</span>
          <base-input v-for="(field, index) in fields" :key="index" :is-error="field.error"
                      :label="field.label" :placeholder="field.placeholder" :type="field.type"
                      class="mb-4"
                      @input="takeInput"
                      @valid="makeValid"/>
          <div v-if="user.multifactor_enabled">
            <v-select :items="questions" hide-details v-model="formData.question" outlined placeholder="Question"/>
            <base-input class="my-3" @input="takeInput" dense label="Answer"/>
          </div>
          <div class="ah-w-full ah-flex ah-justify-center">
            <base-button :color="$vuetify.theme.themes.light.linear__purple1" :loading="loading" outlined
                         @click="submit">
              Withdraw
            </base-button>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseInput from "@/components/resuables/BaseInput";
import BaseButton from "@/components/resuables/BaseButton";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: "WithdrawForm",
  components: {BaseButton, BaseInput},
  data: () => ({
    formData: {
      question: ''
    },
    loading: false,
    errorMsg: '',
    fields: [
      {
        label: "Amount",
        placeholder: 'Amount',
        error: false,
        type: 'number',
      },
      {
        label: "Password",
        type: "password",
        placeholder: "Password",
        error: false,
      },
      // {
      //   label: "Narration",
      //   placeholder: "Narration",
      //   error: false
      // },
    ],
    questions: [
      "What primary school did you attend?",
      "What is your childhood nickname?",
      "What is your mother maiden name?",
      "What street name did you lived as a child?",
      "What is the name of your favorite childhood friend?",
    ],
  }),
  props: {
    dialog: Boolean
  },
  methods: {
    ...mapActions(["walletDebit"]),
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    takeInput(payload) {
      const {name, value} = payload
      this.$set(this.formData, name, value)
    },
    makeValid(label) {
      this.fields.find(field => field.label === label).error = false
    },
    async submit() {
      if (this.isNotValid()) {
        this.$displaySnackbar('Please, make sure all fields are filled.')
        return
      }
      this.loading = true
      try {
        this.formData.userId = this.user.id
        await this.walletDebit(this.formData);
        this.$emit('close', true);
        this.setErrorOrSuccessDialog(true)
        this.setErrorOrSuccessTitle('Your transaction was successful. Thank you!')
        // this.setErrorOrSuccessMessage('If you wish, you can create giftcard rate peculiar to the type just created.')
        this.setSuccess(true)
      } catch (e) {
        this.errorMsg = e.response.data.errors[0].title
        this.$displaySnackbar(e)
        setTimeout(() => this.errorMsg = '', 4000)
      }
      this.loading = false
    },
    isNotValid() {
      let error = false
      const fields = this.fields.map(field => field.label.toLowerCase())
      fields.map(field => {
        if (!this.formData[field].trim()) {
          error = true
        }
      })
      return error
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    // if (this.user.multifactor_enabled) {
    //   this.fields.push(
    //       {
    //         label: "Question",
    //         placeholder: "Question",
    //         error: false
    //       },
    //       {
    //         label: "Answer",
    //         placeholder: "Answer",
    //         error: false,
    //       }
    //   )
    // }
  }
}
</script>

<style scoped>

</style>