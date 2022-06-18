<template>
  <div class="wallet-balance px-lg-5 text-center pa-3">
    <p class="ah-text-xs sm:ah-text-md md:ah-text-xl mb-0"><span class="ah-font-bold">Wallet Bal.:</span> &#8358;{{getBalance}}.00</p>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import numeral from "numeral";

export default {
name: "WalletBalance",
  computed: {
    ...mapGetters(['balance']),
    getBalance(){
      return numeral(this.balance).format('0,0');
    }
  }
}
</script>

<style scoped lang="scss">
@import 'src/assets/styles/mixins';
.wallet-balance {
  border-radius: 30px;
  background: var(--v-grey-base);
  height: 40px;

  @include md {
    height: 50px;
  }
}
</style>