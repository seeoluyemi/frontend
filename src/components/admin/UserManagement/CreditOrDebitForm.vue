<template>
  <v-dialog v-model="dialog" max-width="400" @click:outside="closeDialog">
<!--    <template #activator="{on, attrs}">-->
<!--      <v-btn v-bind="attrs" v-on="on" color="purple" class="ah-capitalize" depressed text>-->
<!--        Credit Wallet-->
<!--      </v-btn>-->
<!--    </template>-->
    <v-card>
      <v-card-title class="d-flex justify-space-between mb-4">
        <h4>{{type}} {{user.name}}'s Account</h4>
        <v-btn icon @click="closeDialog">
          <VIcon>mdi-close</VIcon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="creditWallet">
          <div class="ah-flex">
            <v-text-field v-model="amount" :color="$vuetify.theme.themes.light.linear__purple1" outlined hide-details class="mb-4 creditInput ah-flex-1" label="Amount" placeholder="Amount" type="number"/>
            <v-btn depressed disabled height="56" class="ml-2 currency">NGN</v-btn>
          </div>
          <div class="d-flex justify-center my-6">
            <base-button :loading="loading" :color="$vuetify.theme.themes.light.linear__purple1" outlined>
              {{type}}
            </base-button>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// import BaseInput from "@/components/resuables/BaseInput";
import BaseButton from "@/components/resuables/BaseButton";

export default {
  name: "CreditOrDebitForm",
  components: {BaseButton},
  data: () => ({
    // loading: false,
    amount: ''
  }),
  props: {
    user: Object,
    dialog: Boolean,
    type: String,
    loading: Boolean
  },
  mounted() {
    this.$root.$on('clearCreditWalletInput', () => {
      this.amount = ''
    })
  },
  methods: {
    creditWallet() {
      if (!this.amount) {
        this.$displaySnackbar('Empty value is not allowed.')
        return
      }
      this.$emit(this.type.toLowerCase(), this.amount)
    },
    closeDialog() {
      this.$emit('close:creditDialog')
    }
  }
}
</script>

<style scoped lang="scss">
  .currency,
  .theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background: var(--v-linear__purple1-base) !important;
    color: white !important;
  }

  .v-btn {
    text-transform: capitalize;
  }
</style>