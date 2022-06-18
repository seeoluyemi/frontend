<template>
  <rates-form :gift-card-info="giftCardInfo"/>
</template>

<script>
import RatesForm from "@/components/users/Rates/RatesForm";
export default {
name: "SellingRates",
  components: {RatesForm},
  props: {
  giftCardInfo: Array
  }
}
</script>

<style scoped>

</style>