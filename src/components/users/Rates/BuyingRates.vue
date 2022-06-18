<template>
  <rates-form :gift-card-info="giftCardInfo" @selectItem="emitEvent"/>
</template>

<script>
import RatesForm from "@/components/users/Rates/RatesForm";
export default {
  name: "BuyingRates",
  components: {RatesForm},
  data() {
    return {
      select: {}
    }
  },
  mounted() {
    console.log('mounts')
  },
  props: {
    giftCardInfo: Array
  },
  methods: {
    emitEvent(payload) {
      this.$emit('selectItem', payload)
    }
  }
}
</script>

<style scoped>

</style>