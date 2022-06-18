<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="ah-flex justify-space-between">
        <h4>Giftcard</h4>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="card-img">
          <v-img :src="card.image"/>
        </div>
        <div></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "GiftCardViewMoreDialog",
  props: {
    dialog: Boolean,
    card: Object
  }
}
</script>

<style scoped>

</style>