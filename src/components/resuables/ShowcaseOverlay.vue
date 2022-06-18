<template>
  <div class="ah-flex ah-justify-center">
    <div class="showcase" ref="showcase"/>
    <div class="content py-16" ref="content">
      <slot/>
    </div>
  </div>

</template>

<script>
export default {
  name: "ShowcaseOverlay",
  mounted() {
    this.adjustShowcaseHeight()
  },
  created() {
    window.addEventListener('resize', this.adjustShowcaseHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.adjustShowcaseHeight)
  },
  methods: {
    adjustShowcaseHeight() {
      this.$refs.showcase.style.height = this.$refs.content.clientHeight +'px'
    }
  },
  watch: {
    $route() {
      this.adjustShowcaseHeight()
    }
  }
}
</script>

<style scoped lang="scss">
@use '../../assets/styles/mixins';

.showcase {
  width: 100vw;
  //min-height: 100vh;
  //height: 1200px;
  background-size: cover;
  //padding-top: 80px;
  padding-bottom: 120px;
  position: relative;
  opacity: .5;
  //background: transparent;

  @include mixins.md {
    height: 760px;
  }

  &:before {
    position: absolute;
    content: '';
    height: 100%;
    width: 100%;
    z-index: -1;
    background: url("../../assets/images/showcase__bg_m.svg") no-repeat;

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
  }
}

.content {
  position: absolute;
  /*transform: translateY(-1000px);*/
  padding: 1rem 2rem;
  min-width: 350px;
  max-width: 1024px;
  width: 70%;
  margin: 0 auto;

  h2 {
    font-weight: bold;
    font-size: 3rem;
  }
  .contact__info li {
    list-style-type: '-';
    margin-left: 5px;
    padding-left: 5px;
  }

  p, li {
    font-weight: 300;
    line-height: 1.9;
  }
}

</style>