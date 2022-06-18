<template>
  <v-dialog @click:outside="$emit('close')" v-model="open" max-width="300">
    <v-card>
      <v-card-title class="ah-flex ah-justify-center">
        <h2 class="text-center">Are you sure?</h2>
      </v-card-title>
      <v-card-text>
        <p class="ah-text-red">This action, once taken, is irreversible!</p>
      </v-card-text>
      <v-card-actions class="ah-flex ah-justify-center">
        <base-button @click="$emit('close')" height="47" min-height="47" width="256" outlined :color="$vuetify.theme.themes.light.linear__purple2"><small>No</small></base-button>
        <base-button @click="$emit('go')" class="ml-2" :color="$vuetify.theme.themes.light.error" :loading="deactivating" height="47" min-height="47" outlined
                     width="256"><small>Yes</small>
        </base-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";
export default {
  name: "ConfirmationDialog",
  components: {BaseButton},
  props: {
    open: Boolean,
    deactivating: Boolean
  }
}
</script>

<style scoped>

</style>