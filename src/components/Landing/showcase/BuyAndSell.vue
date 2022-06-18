<template>
  <div class="card ah-relative rounded ah-shadow ah-bg-white ah-h-full">
    <div class="buy-and-sell ah-flex ah-text-center mx-auto ah-absolute">
      <span :class="{ active: activeView === 'buy' }" class="style" :style="{ left: 0 }" @click="makeActive('buy')">
        <span>Buy</span>
      </span>
      <span :class="{ active: activeView === 'sell' }" class="style" :style="{ right: 0 }" @click="makeActive('sell')">
        <span>Sell</span>
      </span>
    </div>
    <div class="pa-4">
      <div>
        <h4>Select product</h4>
        <v-select v-model="product" outlined :items="products"/>
      </div>
      <div class="diamonds text-center ah-w-64 mx-auto">
        <v-img :src="require('../../../assets/images/diamonds.svg')" transition="scale-transition"/>
        <p>Buy {{product}} on Alaje Hub</p>
      </div>
      <div class="store-name">
        <base-input label="Store Name" v-model="storeName" dense/>
        <v-range-slider :value="range" class="mt-12">
          <template #thumb-label="{ value }">
            <p class="mb-0 ah-thumb-label">{{ value }}</p>
          </template>
        </v-range-slider>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from "@/components/resuables/BaseInput";
export default {
  name: "BuyAndSell",
  components: {BaseInput},
  data() {
    return {
      activeView: 'buy',
      product: 'Giftcard',
      products: ['Giftcard', 'Bitcoin', 'XPR'],
      storeName: '',
      range: [20, 70],
    }
  },
  methods: {
    makeActive(view) {
      this.activeView = view
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    width: 400px;
    min-width: 350px;
    height: 600px;
    z-index: 1;
    border-top: 1px solid transparent;
  }

  .buy-and-sell {
    top: -50px;
    width: 90%;
    right: 25px;
    height: 50px;

    span.style {
      width: 50%;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      padding-top: 10px;
      color: var(--v-white-base);
      background: var(--v-dense__purple-base);
      border-bottom: 1px solid var(--v-white-base);
      height: 40px;
      position: absolute;
      bottom: 0;
      transition: all .1s ease-in-out;
      cursor: pointer;

      &.active {
        background-color: var(--v-white-base);
        border-bottom: 1px solid transparent !important;
        color: var(--v-deep_purple-base) !important;
        height: 100% !important;
      }

      & > span {
        font-weight: bold;
      }
    }
  }

  .ah-thumb-label {
    color: var(--v-linear__purple2-base);
    font-weight: bold;
  }
</style>