<template>
  <div class="backdrop" :class="{'blur': blur}" :style="{ zIndex: zIndex || 100 }" @click="$emit('click')"/>
</template>

<script>
export default {
  name: "BackDrop",
  props: {
    zIndex: [Number, String],
    blur: Boolean,
  }
}
</script>

<style scoped lang="scss">
  .backdrop {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background: rgba(0, 0, 0, .3);
  }

  .blur {
    backdrop-filter: blur(2px);
  }
</style>