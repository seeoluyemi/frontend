<template>
  <dialog-box>
    <template #activator>
      <span>View More</span>
    </template>
    <template #card_title>
      <h5>Tracking Details</h5>
    </template>
    <template #card_content>
      <transaction-tracker/>
    </template>
  </dialog-box>
</template>

<script>
import DialogBox from "@/components/resuables/DialogBox";
import TransactionTracker from "@/components/users/History/TransactionTracker";
export default {
  name: "TransactionDetailsDialog",
  components: {TransactionTracker, DialogBox}
}
</script>

<style scoped>

</style>