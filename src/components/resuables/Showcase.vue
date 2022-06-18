<template>
  <div class="showcase">
    <slot></slot>
    <div class="arrow-down" @click="scrollToBottom">
      <arrow-down-scroller v-if="landing"/>
    </div>
  </div>
</template>

<script>
import ArrowDownScroller from "@/components/resuables/Icons/ArrowDownScroller";
export default {
  name: "Showcase",
  components: {ArrowDownScroller},
  methods: {
    scrollToBottom() {
      document.querySelector('html').scrollTo(0, document.body.scrollHeight)
    }
  },
  props: {
    landing: Boolean
  }
}
</script>

<style scoped lang="scss">
@use '../../assets/styles/mixins';
  .showcase {
    width: 100vw;
    height: auto;
    background-size: cover;
    background: url("../../assets/images/showcase__bg_m.svg") no-repeat;
    padding-top: 80px;
    padding-bottom: 120px;
    position: relative;

    @include mixins.customable(376) {
      background: url("../../assets/images/showcase__bg.svg") no-repeat -100px -660px;
      background-position-x: -790px;
      background-position-y: -670px;
    }

    @include mixins.lg {
      background-position-x: -390px;
    }

    @include mixins.xl {
      //height: 708px;
      background-position-x: -90px;
    }

    .arrow-down {
      //background: purple;
      position: absolute;
      cursor: pointer;
      z-index: 1;
      right: 45%;
      bottom: 30%;
    }

  }
</style>