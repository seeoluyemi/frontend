<template>
  <v-dialog width="400">
    <template #activator="{ attrs, on }">
      <div v-bind="attrs" v-on="on">
        <slot name="activator"/>
      </div>
    </template>
    <v-card>
      <v-card-title>
        <div class="ah-flex ah-w-full ah-items-center ah-justify-between">
          <slot name="card_title"/>
          &times;
        </div>
      </v-card-title>
      <slot name="card_content"/>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
name: "DialogBox"
}
</script>

<style scoped>

</style>