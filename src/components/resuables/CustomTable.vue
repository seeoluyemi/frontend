<template>
  <table>
    <tr v-if="select">
      <th>{{headers[0]}}</th>
      <th></th>
      <th v-for="(header, i) in headers.slice(1)" :key="i">{{header}}</th>
    </tr>
    <tr>
      <th class="my-4" v-for="(header, i) in headers" :key="i">{{header}}</th>
    </tr>
    <tr class="py-8">
      <td v-for="(item, i) in items" :key="i">{{item}}</td>
    </tr>
  </table>
</template>

<script>
export default {
name: "CustomTable",
  props: {
    headers: Array,
    items: Array,
    select: Boolean
  }
}
</script>

<style scoped lang="scss">
  table {
    width: 100%;

    th {
      text-align: left;
    }
  }
</style>