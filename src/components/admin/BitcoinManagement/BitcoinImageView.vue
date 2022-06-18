<template>
  <v-dialog v-model="dialog" fullscreen @keydown.esc="$emit('close')">
    <v-card>
      <v-card-title class="d-flex justify-end">
        <VBtn icon large @click="$emit('close')">
          <VIcon size="40">mdi-close</VIcon>
        </VBtn>
      </v-card-title>
      <div class="image mx-auto">
        <VImg :src="image"/>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "BitcoinImageView",
  props: {
    image: String,
    dialog: Boolean
  }
}
</script>

<style scoped lang="scss">
  .image {
    max-width: 1200px;
    height: 90vh;
    overflow-y: hidden;
  }
</style>