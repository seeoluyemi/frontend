<template>
  <v-slide-x-reverse-transition>
    <v-card v-show="display" :class="{'success': success, 'error': !success}" flat
            min-width="230">
      <v-card-title>
        <v-icon :color="'white'" class="mr-3">mdi-{{ success ? 'check' : 'close' }}</v-icon>
        <small class="message">{{ message }}</small>
      </v-card-title>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
export default {
  name: "SnackbarEmbedded",
  data: () => ({
    display: false,
    success: true,
    message: '',
    timeout: 5000
  }),
  methods: {
    displaySnackbar({success, message, timeout}) {
      this.display = true
      this.success = success
      this.message = message || this.message
      this.timeout = timeout || this.timeout
      setTimeout(this.hideSnackbar, this.timeout)
    },
    hideSnackbar() {
      this.display = false
      this.message = ''
      this.timeout = 5000
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  position: fixed;
  z-index: 500;
  right: 5%;
  top: 64px;
  border-radius: 0 8px 0 8px !important;
}

.success {
  background: green;
  color: whitesmoke;
  border-color: transparent;
}

.error {
  background: #FF2E2E;
  color: whitesmoke;
}

.message {
  margin-left: 15px;
}
</style>