<template>
  <svg v-if="type === 'hamburger'" width="18" height="12" viewBox="0 0 18 12" fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z" fill="black"/>
  </svg>
</template>

<script>
export default {
  name: "Icon",
  computed: {

  },
  props: {
    type: {
      type: String,
      required: true,
    },
    active: Boolean,
    color: {
      type: String || Object
    }
  }
}
</script>

<style scoped>

</style>