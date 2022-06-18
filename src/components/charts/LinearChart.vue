<template>
  <div class="customLine">
    <div class="customLineLevel" :style="{ width: progress, background: color }"/>
  </div>
</template>

<script>
export default {
name: "LinearChart",
  props: {
    progress: [String, Number],
    color: String
  }
}
</script>

<style scoped lang="scss">
.customLine {
  width: 100%;
  height: 10px;
  border-radius: 8px;
  background: #E6E7EF;
  position: relative;

  .customLineLevel {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    border-radius: 8px;
  }
}
</style>