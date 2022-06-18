<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4>Edit Payment Instructions</h4>
        <VBtn icon>
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </v-card-title>
      <v-card-text>
        <v-form>
<!--          <ul>-->
<!--            <li v-for=""-->
<!--          </ul>-->
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
name: "PaymentInstructions"
}
</script>

<style scoped>

</style>