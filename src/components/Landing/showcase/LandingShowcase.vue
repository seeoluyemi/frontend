<template>
  <showcase>
    <div class="ah-flex ah-justify-center ah-h-full content-wrapper">
<!--      <buy-and-sell class="mr-5 md:ah-block ah-hidden"/>-->
      <showcase-call-to-action/>
    </div>
  </showcase>
</template>

<script>
// import BuyAndSell from "@/components/Landing/showcase/BuyAndSell";
import ShowcaseCallToAction from "@/components/Landing/showcase/ShowcaseCallToAction";
import Showcase from "@/components/resuables/Showcase";

export default {
  name: "LandingShowcase",
  components: {
    Showcase,
    // BuyAndSell,
    ShowcaseCallToAction
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/mixins";
.content-wrapper {
  width: 100%;
  padding-bottom: 175px;
  height: 600px;

  @include xl {
    //width: 80%;
  }
}
</style>