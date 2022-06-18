<template>
  <div class="greeting ah-flex flex-wrap ah-justify-between ah-flex-row ah-items-center lg:ah-items-center px-1 px-lg-7 my-10">
    <slot></slot>
    <wallet-balance v-if="showBalance" :balance="balance"/>
  </div>
</template>

<script>
import WalletBalance from "@/components/users/WalletBalance";
export default {
name: "UserDashboardTop",
  components: {
    WalletBalance
  },
  props: {
    balance: [String, Number],
    showBalance: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>

</style>