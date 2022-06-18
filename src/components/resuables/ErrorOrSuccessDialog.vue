<template>
  <v-dialog v-model="dialog" max-width="300" @click:outside="$emit('close')">
    <v-card>
      <div class="px-4 py-10 ah-flex ah-flex-col ah-items-center ah-justify-center">
        <div class="ill">
          <error-icon v-if="!success"/>
          <v-img v-else :src="require('../../assets/images/confetti.svg')"/>
        </div>
        <h2 class="text-center mt-3">{{title}}</h2>
        <p class="text-center mt-5">{{message}}</p>
        <div class="close">
          <base-button outlined :color="$vuetify.theme.themes.light.linear__purple2" height="45" @click="handleDialogClose">{{passwordUpdate ? 'Log In' : 'Close'}}</base-button>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import ErrorIcon from "@/components/resuables/Icons/ErrorIcon";
import BaseButton from "@/components/resuables/BaseButton";
export default {
  name: "ErrorOrSuccessDialog",
  components: {BaseButton, ErrorIcon},
  props: {
    dialog: Boolean,
    success: Boolean,
    title: String,
    message: String,
    passwordUpdate: Boolean
  },
  methods: {
    handleDialogClose() {
      if (this.passwordUpdate) {
        sessionStorage.removeItem('vuex')
        localStorage.removeItem('userrorerData')
        this.$emit('close')
        this.$router.push({ name: 'Login' })
      } else {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
  .ill {
    width: 70px;
  }
</style>