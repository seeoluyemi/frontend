<template>
  <div class="ah-flex ah-items-center">
    <router-link :to="{name: 'Home'}">
      <v-img
          :src="require('../../assets/images/brand__logo_c.svg')"
          transition="scale-transition"
          class="mr-2"
          width="60px"
      />
    </router-link>
    <h3 :class="`ah-block ${this.footer ? '' : 'md:ah-hidden'} brand__name`">Alaje Hub</h3>
  </div>
</template>

<script>
export default {
  name: "BrandLogo",
  props: {
    footer: Boolean
  }
}
</script>

<style scoped lang="scss">
.brand__name {
  color: var(--v-deep__purple-base);
  font-weight: 500;
}
</style>