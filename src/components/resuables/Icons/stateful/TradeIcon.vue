<template>
  <svg v-if="active" width="20" height="20" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.125 0.1875H0.875C0.392875 0.1875 0 0.580375 0 1.0625V8.9375C0 9.4205 0.392875 9.8125 0.875 9.8125H13.125C13.608 9.8125 14 9.4205 14 8.9375V1.0625C14 0.580375 13.608 0.1875 13.125 0.1875Z" fill="url(#paint0_linear)"/>
    <defs>
      <linearGradient id="paint0_linear" x1="1.6149e-05" y1="0.187501" x2="15.4921" y2="4.78972" gradientUnits="userSpaceOnUse">
        <stop stop-color="#B558F9"/>
        <stop offset="1" stop-color="#932CFF"/>
      </linearGradient>
    </defs>
  </svg>
  <svg v-else width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.125 2.1875H0.875C0.392875 2.1875 0 2.58038 0 3.0625V10.9375C0 11.4205 0.392875 11.8125 0.875 11.8125H13.125C13.608 11.8125 14 11.4205 14 10.9375V3.0625C14 2.58038 13.608 2.1875 13.125 2.1875Z" fill="white"/>
  </svg>
</template>

<script>
export default {
name: "TradeIcon",
  props: {
    active: Boolean
  }
}
</script>

<style scoped>

</style>