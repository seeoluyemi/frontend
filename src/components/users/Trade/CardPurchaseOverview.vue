<template>
  <div class="py-8" style="height: 100%">
    <div class="card__image mx-auto">
      <v-img :src="selectedCardType.front_image" height="200px" class="round-image"/>
    </div>
    <div class="text-center">
      <small class="text-center font-weight-bold mt-3">{{selectedCardType.title}}</small>
    </div>
    <div class="flag mx-auto text-center my-10">
      <v-img :src="selectedCountry.image" class="mx-auto round-image"/>
      <small class="font-weight-bold text-center">{{ selectedCountry.slug.toUpperCase() }}</small>
    </div>
    <div class="d-flex justify-center">
      <base-button :color="$vuetify.theme.themes.light.linear__purple1" height="45" min-height="45" outlined
                   @click="$emit('edit')"><small>Edit</small></base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";

export default {
  name: "CardPurchaseOverview",
  components: {BaseButton},
  props: {
    selectedCountry: Object,
    selectedCardType: Object
  }
}
</script>

<style lang="scss" scoped>
.card__image {
  width: 200px;
  //height: 40px;
  border-radius: 8px;
}

.v-img {
  border-radius: 8px;
}

.flag {
  width: 40px;
  height: 60px;
}
</style>