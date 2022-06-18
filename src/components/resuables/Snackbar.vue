<template>
  <v-slide-x-reverse-transition>
    <v-card v-if="snackbar.display" min-width="200" flat :class="{'success': snackbar.success, 'error': !snackbar.success}">
      <v-card-title>
        <v-icon :color="'white'" class="mr-3">mdi-{{snackbar.success ? 'check' : 'close'}}</v-icon>
        <small>{{ snackbar.message }}</small>
      </v-card-title>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Snackbar",
  computed: {
    ...mapGetters(['snackbar'])
  }
}
</script>

<style scoped lang="scss">
  .v-card {
    position: fixed;
    z-index: 500;
    right: 5%;
    top: 64px;
    border-radius: 0 8px 0 8px !important;
  }

  .success {
    background: greenyellow;
    color: whitesmoke;
  }

  .error {
    background: #FF2E2E;
    color: whitesmoke;
  }
</style>