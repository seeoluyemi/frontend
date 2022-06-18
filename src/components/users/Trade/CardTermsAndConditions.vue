<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <h4>Terms and conditions</h4>
        <v-btn icon @click="emitCloseEvent">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="terms_and_conditions__text" v-html="termsAndConditions"/>
      </v-card-text>
      <v-card-actions class="d-flex">
        <v-btn @click="emitCancelEvent" depressed color="#ff2e2e">Reject</v-btn>
        <v-btn @click="emitAgreeEvent" :loading="loading" depressed color="teal">Accept</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CardTermsAndConditions",
  data: () => ({
  //
  }),
  props: {
    dialog: Boolean,
    termsAndConditions: String,
    loading: Boolean
  },
  methods: {
    emitCloseEvent() {
      this.$emit('close')
    },
    emitCancelEvent() {
      this.$emit('cancel')
    },
    emitAgreeEvent() {
      this.$emit('accept')
    }
  }
}
</script>

<style scoped lang="scss">
  .v-btn {
    color: white;
    text-transform: capitalize;
  }
</style>