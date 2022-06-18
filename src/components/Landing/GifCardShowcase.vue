<template>
  <div>
    <ads-section left>
      <template #image>
        <v-img :src="require('../../assets/images/transactions__preview.png')"/>
      </template>
      <template #default>
        <h2>Buy And Sell Giftcards</h2>
        <p class="mb-16">At AlajeHub, we possess robust infrastructures that verify the authenticity of gift cards and
          potential buyers on the fly, providing time-saving solutions to buying and selling parties within a trade.
          Cards are inspected and vetted before a preferred mode of settlement is agreed upon.</p>
        <base-button :color="$vuetify.theme.themes.light.linear__blue" outlined @click="$router.push({ name: 'Register' })">Get Started</base-button>
      </template>
    </ads-section>
    <ads-section right class="great-deals">
      <template #image>
        <v-img :src="require('../../assets/images/gift__card.png')"/>
      </template>
      <template #default>
        <h2>Great Deals At Popular Stores</h2>
        <p class="mb-16">Why? Because everyday is a bargain, deal, transaction and trade. Our very essence is enshrined
          in our moniker – Alaje – a dealer of many sorts. We also equip traders with honest market insights, industry
          trends and caveats that convey volatility that could potentially leave traders worse off.</p>
        <div class="button">
          <base-button @click="$router.push({ name: 'Login' })" :color="$vuetify.theme.themes.light.linear__yellow1" outlined>See All
            Stores
          </base-button>
        </div>
      </template>
    </ads-section>
    <ads-section left class="brand__trust">
      <template #default>
        <h2>You Can Trust Us</h2>
        <p>We promote the perpetuation of ease-of-doing business through our policy full of:</p>
        <v-row style="max-width: 500px;">
          <v-col cols="12" md="6" v-for="trust in trusts" :key="trust" class="ah-flex ah-items-center mt-2">
            <svg class="mr-1" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="13" fill="#46CC8D" fill-opacity="0.4"/>
              <circle cx="12.9335" cy="12.9335" r="8.41177" fill="#46CC8D" fill-opacity="0.4"/>
              <path
                  d="M16.3638 10.174L11.5719 14.9659L9.68405 13.0781L9.04346 13.7187L11.5719 16.2471L17.0044 10.8145L16.3638 10.174Z"
                  fill="white"/>
            </svg>
            <small class="ah-text-left">{{ trust }}</small>
          </v-col>
        </v-row>
        <p>which we regard as non-proprietary but essential to every party inching to enter our trade on our platforms.</p>
        <base-button @click="$router.push({ name: 'About' })" class="mt-8" width="180" max-width="180" :color="$vuetify.theme.themes.light.linear__green1"
                     outlined>Read More
        </base-button>
      </template>
      <template #image>
        <v-img :src="require('../../assets/images/base.png')"/>
      </template>
    </ads-section>
  </div>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";
import AdsSection from "@/components/Landing/AdsSection";

export default {
  name: "GifCardShowcase",
  components: {AdsSection, BaseButton},
  data() {
    return {
      trusts: ['safe trade environments', 'market insights', 'buyer-confidence', 'precautions and guidelines', 'market stability']
    }
  }
}
</script>

<style scoped lang="scss">
@use '../../assets/styles/mixins';

.great-deals {

  @include mixins.customable(1250) {
    transform: translateY(-120px);
  }
}

.brand__trust {
  @include mixins.customable(1250) {
    transform: translateY(-200px);
  }
}

p {
  line-height: 2;
}
</style>