<template>
  <div class="ah-text-white box px-6">
    <h1 class="h1-lead">The Most Reliable Gift Card<br/> Merchant in West Africa.</h1>
    <p>AlajeHub is a digital trading app that presents opportunities for trade of digital assets and stores-of monetary-value between potential buyers and sellers across the world. </p>
    <div class="showcase-btn">
      <base-button :color="{
        backgroundColor: $vuetify.theme.themes.light.deep__purple,
         textColor: $vuetify.theme.themes.light.white,
          borderColor: $vuetify.theme.themes.light.white,
          backgroundColorOnHover: $vuetify.theme.themes.light.white
      }" to="/register">Get Started</base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";

export default {
  name: "ShowcaseCallToAction",
  components: {BaseButton}
}
</script>

<style scoped lang="scss">
@use '../../../assets/styles/mixins';

.box {
  //max-width: 330px;
  //min-width: 330px;

  @include mixins.md {
    //max-width: 520px;
  }

  .h1-lead {
    font-size: 48px;
    font-weight: bold;

    @include mixins.md {
      font-size: 45px;
    }
  }

  & > p {
    line-height: 2;
    word-spacing: 1px;
    max-width: 600px;
  }
}

.showcase-btn {
  width: 180px;
}
</style>