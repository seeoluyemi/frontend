<template>
  <svg v-if="active" width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M5.3958 0H1.0208C0.457901 0 0 0.457901 0 1.0208V3.6458C0 4.2088 0.457901 4.6667 1.0208 4.6667H5.3958C5.9588 4.6667 6.4167 4.2088 6.4167 3.6458V1.0208C6.4167 0.457901 5.9588 0 5.3958 0Z"
        fill="url(#paint0_linear)"/>
    <path
        d="M5.3958 5.83325H1.0208C0.457901 5.83325 0 6.29115 0 6.85416V12.9792C0 13.5421 0.457901 14 1.0208 14H5.3958C5.9588 14 6.4167 13.5421 6.4167 12.9792V6.85416C6.4167 6.29115 5.9588 5.83325 5.3958 5.83325Z"
        fill="url(#paint1_linear)"/>
    <path
        d="M12.9794 9.33325H8.6044C8.0414 9.33325 7.5835 9.79115 7.5835 10.3542V12.9792C7.5835 13.5421 8.0414 14 8.6044 14H12.9794C13.5423 14 14.0002 13.5421 14.0002 12.9792V10.3542C14.0002 9.79115 13.5423 9.33325 12.9794 9.33325Z"
        fill="url(#paint2_linear)"/>
    <path
        d="M12.9794 0H8.6044C8.0414 0 7.5835 0.457901 7.5835 1.0208V7.1458C7.5835 7.7088 8.0414 8.1667 8.6044 8.1667H12.9794C13.5423 8.1667 14.0002 7.7088 14.0002 7.1458V1.0208C14.0002 0.457901 13.5423 0 12.9794 0V0Z"
        fill="url(#paint3_linear)"/>
    <defs>
      <linearGradient id="paint0_linear" x1="7.40168e-06" y1="4.62729e-07" x2="7.16239" y2="2.01135"
                      gradientUnits="userSpaceOnUse">
        <stop stop-color="#B558F9"/>
        <stop offset="1" stop-color="#932CFF"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="7.40168e-06" y1="5.83325" x2="7.53324" y2="7.04211"
                      gradientUnits="userSpaceOnUse">
        <stop stop-color="#B558F9"/>
        <stop offset="1" stop-color="#932CFF"/>
      </linearGradient>
      <linearGradient id="paint2_linear" x1="7.5835" y1="9.33325" x2="14.7459" y2="11.3446"
                      gradientUnits="userSpaceOnUse">
        <stop stop-color="#B558F9"/>
        <stop offset="1" stop-color="#932CFF"/>
      </linearGradient>
      <linearGradient id="paint3_linear" x1="7.5835" y1="8.09774e-07" x2="15.1167" y2="1.20886"
                      gradientUnits="userSpaceOnUse">
        <stop stop-color="#B558F9"/>
        <stop offset="1" stop-color="#932CFF"/>
      </linearGradient>
    </defs>
  </svg>
  <svg v-else width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M5.3958 0H1.0208C0.457901 0 0 0.457901 0 1.0208V3.6458C0 4.2088 0.457901 4.6667 1.0208 4.6667H5.3958C5.9588 4.6667 6.4167 4.2088 6.4167 3.6458V1.0208C6.4167 0.457901 5.9588 0 5.3958 0Z"
        fill="white"/>
    <path
        d="M5.3958 5.83325H1.0208C0.457901 5.83325 0 6.29115 0 6.85416V12.9792C0 13.5421 0.457901 14 1.0208 14H5.3958C5.9588 14 6.4167 13.5421 6.4167 12.9792V6.85416C6.4167 6.29115 5.9588 5.83325 5.3958 5.83325Z"
        fill="white"/>
    <path
        d="M12.9794 9.33325H8.6044C8.0414 9.33325 7.5835 9.79115 7.5835 10.3542V12.9792C7.5835 13.5421 8.0414 14 8.6044 14H12.9794C13.5423 14 14.0002 13.5421 14.0002 12.9792V10.3542C14.0002 9.79115 13.5423 9.33325 12.9794 9.33325Z"
        fill="white"/>
    <path
        d="M12.9794 0H8.6044C8.0414 0 7.5835 0.457901 7.5835 1.0208V7.1458C7.5835 7.7088 8.0414 8.1667 8.6044 8.1667H12.9794C13.5423 8.1667 14.0002 7.7088 14.0002 7.1458V1.0208C14.0002 0.457901 13.5423 0 12.9794 0V0Z"
        fill="white"/>
  </svg>
</template>

<script>
export default {
  name: "DashboardIcon",
  props: {
    active: Boolean,
  }
}
</script>

<style scoped>

</style>