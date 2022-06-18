<template>
  <label>
    <span>{{label}}</span>
  <select>
    <option value="option1">{{name.toLowerCase()}}</option>
    <option v-for="(option, i) in options" :value="option.value" :key="i">{{option.name}}</option>
  </select>
  </label>
</template>

<script>
export default {
name: "BaseSelect",
  props: {
  label: String,
    name: String,
    options: Array
  }
}
</script>

<style scoped>

</style>