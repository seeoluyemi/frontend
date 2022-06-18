<template>
  <svg v-if="type === 'purple'" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.25" width="29" height="29" rx="14.5" fill="url(#paint0_linear)"/>
    <rect x="7" y="7" width="15" height="15" rx="7.5" fill="url(#paint1_linear)"/>
    <defs>
      <linearGradient id="paint0_linear" x1="3.34516e-05" y1="2.87551e-06" x2="33.5245" y2="6.84685" gradientUnits="userSpaceOnUse">
        <stop stop-color="#B558F9"/>
        <stop offset="1" stop-color="#932CFF"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="7.00002" y1="7" x2="24.3402" y2="10.5415" gradientUnits="userSpaceOnUse">
        <stop stop-color="#B558F9"/>
        <stop offset="1" stop-color="#932CFF"/>
      </linearGradient>
    </defs>
  </svg>
  <svg v-else-if="type === 'green'" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.25" width="29" height="29" rx="14.5" fill="url(#paintA_linear)"/>
    <rect x="7" y="7" width="15" height="15" rx="7.5" fill="url(#paintB_linear)"/>
    <defs>
      <linearGradient id="paintA_linear" x1="-3.78484e-07" y1="5.55319" x2="30.9269" y2="8.45361" gradientUnits="userSpaceOnUse">
        <stop stop-color="#03DA8D"/>
        <stop offset="1" stop-color="#09EFA3"/>
      </linearGradient>
      <linearGradient id="paintB_linear" x1="7" y1="9.87234" x2="22.9967" y2="11.3726" gradientUnits="userSpaceOnUse">
        <stop stop-color="#03DA8D"/>
        <stop offset="1" stop-color="#09EFA3"/>
      </linearGradient>
    </defs>
  </svg>
  <svg v-else-if="type === 'yellow'" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.25" width="29" height="29" rx="14.5" fill="url(#paintA1_linear)"/>
    <rect x="7" y="7" width="15" height="15" rx="7.5" fill="url(#paintB1_linear)"/>
    <defs>
      <linearGradient id="paintA1_linear" x1="-3.78484e-07" y1="5.55319" x2="30.9269" y2="8.45361" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F4A136"/>
        <stop offset="1" stop-color="#FCD000"/>
      </linearGradient>
      <linearGradient id="paintB1_linear" x1="7" y1="9.87234" x2="22.9967" y2="11.3726" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F4A136"/>
        <stop offset="1" stop-color="#FCD000"/>
      </linearGradient>
    </defs>
  </svg>
  <svg v-else-if="type === 'blue'" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.25" width="29" height="29" rx="14.5" fill="url(#paintA2_linear)"/>
    <rect x="7" y="7" width="15" height="15" rx="7.5" fill="url(#paintB2_linear)"/>
    <defs>
      <linearGradient id="paintA2_linear" x1="-3.78484e-07" y1="5.55319" x2="30.9269" y2="8.45361" gradientUnits="userSpaceOnUse">
        <stop stop-color="#01CBFF"/>
        <stop offset="1" stop-color="#0193FF"/>
      </linearGradient>
      <linearGradient id="paintB2_linear" x1="7" y1="9.87234" x2="22.9967" y2="11.3726" gradientUnits="userSpaceOnUse">
        <stop stop-color="#01CBFF"/>
        <stop offset="1" stop-color="#0193FF"/>
      </linearGradient>
    </defs>
  </svg>
</template>

<script>
export default {
name: "TimelineItemIcon",
  props: {
    type: String
  }
}
</script>

<style scoped>

</style>