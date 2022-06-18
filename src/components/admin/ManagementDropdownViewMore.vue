<template>
  <v-menu left bottom offset-x>
    <template #activator="{ on, attrs }">
      <span class="activator" v-on="on" v-bind="attrs">View more</span>
    </template>
    <ul class="ah-bg-white pa-6">
      <li v-for="(item, i) in item === 'card' ? cardItems : userItems" :key="i" :class="`${i === 1 ? 'ah-text-red' : 'ah-text-black'} my-1`">{{item}}</li>
    </ul>
  </v-menu>
</template>

<script>
export default {
  name: "ManagementDropdownViewMore",
  data() {
    return {
      cardItems: ['Edit', 'Deactivate Giftcard'],
      userItems: ['View Profile', 'Deactivate User']
    }
  },
  props: {
    item: String
  }
}
</script>

<style scoped lang="scss">
  span.activator {
    color: var(--v-linear__purple1-base);
    font-weight: 500;
  }

</style>