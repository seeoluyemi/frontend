<template>
  <div class="bg-btn d-flex justify-center align-center" @click="$emit('click')">
    <svg v-if="sign === 'minus'" width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3 1.72205H0.699957C0.313641 1.72205 0 1.40841 0 1.0221C0 0.63566 0.313641 0.322021 0.699957 0.322021H13.3C13.6864 0.322021 14 0.63566 14 1.0221C14 1.40841 13.6864 1.72205 13.3 1.72205Z" fill="white"/>
    </svg>
    <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0)">
        <path d="M13.3 6.3H7.70004V0.699957C7.70004 0.313641 7.3864 0 6.99996 0C6.61364 0 6.3 0.313641 6.3 0.699957V6.3H0.699957C0.313641 6.3 0 6.61364 0 6.99996C0 7.3864 0.313641 7.70004 0.699957 7.70004H6.3V13.3C6.3 13.6864 6.61364 14 6.99996 14C7.3864 14 7.70004 13.6864 7.70004 13.3V7.70004H13.3C13.6864 7.70004 14 7.3864 14 6.99996C14 6.61364 13.6864 6.3 13.3 6.3Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="14" height="14" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<script>
export default {
name: "RateDecrementIncrementButton",
  props: {
  sign: String
  }
}
</script>

<style scoped lang="scss">
.bg-btn {
  background: linear-gradient(101.54deg, #B558F9 0%, #932CFF 100%);
  border-radius: 5px;
  height: 30px;
  width: 30px;
  cursor: pointer;
}
</style>