<template>
  <router-link :to="link" class="link">
    <div :style="style" class="pa-3 colorful-card ah-flex ah-flex-col ah-justify-between hover:ah-shadow-md">
      <div class="ah-text-right"><p class="number"></p></div>
      <p class="label mb-0 ah-text-xl lg:ah-text-2xl">{{label}}</p>
    </div>
  </router-link>
</template>
<script>
export default {
name: "ColorfulActionCard",
  computed: {
    style() {
      return {
        background: `linear-gradient(95.36deg, ${this.colors[0]} 1.64%, ${this.colors[1]} 100%)`,
        borderRadius: '16px',
        color: this.$vuetify.theme.themes.light.white
      }
    }
  },
  props: {
    square: Boolean,
    rect: Boolean,
    colors: Array,
    number: Number,
    label: String,
    link: [Object, String]
  }
}
</script>

<style scoped lang="scss">
@use "../assets/styles/mixins";
  .square {
    width: 200px;
    height: 200px;
  }

  .rect {
    width: 160px;
    height: auto;
    min-height: 170px;

    @include mixins.customable(444) {
      width: 200px;
    }

    @include mixins.customable(522) {
      width: 250px;
    }

    @include mixins.customable(1075) {
      max-width: 350px;
      width: 300px;
      height: 200px;
    }

  }

  p {
    font-weight: bold;
  }

  a.link {
    text-decoration: none;
  }

  .label {
    //font-size: 1.5em;
    max-width: 150px;
  }

  .number {
    font-size: 2em;
  }

  .colorful-card {
    min-height: 190px;
    transition: all .1s;
  }
</style>