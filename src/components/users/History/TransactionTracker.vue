<template>
  <v-stepper>
    <v-stepper-header>
      <v-stepper-step step="show">
        <template #default>
          <p>show</p>
        </template>

      </v-stepper-step>
      <v-divider/>
      <v-stepper-step step="2"/>
      <v-divider/>
      <v-stepper-step step="3"/>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
name: "TransactionTracker"
}
</script>

<style scoped>

</style>