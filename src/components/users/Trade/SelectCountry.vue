<template>
  <div>
    <h4>Select Country/Currency</h4>
    <v-fade-transition>
      <div v-if="countries.length === 0 || countries === undefined" class="ah-flex justify-center ah-flex-wrap py-6">
        <p class="font-weight-bold no-selection">Sorry, no country for this type.</p>
      </div>
      <div v-else class="ah-flex ah-flex-wrap py-6">
      <div v-for="(country, i) in countries" :key="i" :class="{ 'active-flag': country.name === selectedCountry.name }"
           class="mb-2 mr-3 flag-with-label" @click="$emit('select:country', country)">
        <div class="flag">
          <v-img :src="country.image" class="mx-auto round-image"/>
        </div>
        <div class="text-center mt-2">
          <small class="text-center font-weight-bold">{{ country.name }}</small>
        </div>
      </div>
    </div>
    </v-fade-transition>

  </div>
</template>

<script>
export default {
  name: "SelectCountry",
  props: {
    countries: Array,
    selectedCountry: Object
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  background: #F5F5F9;
}

.flag {
  width: 50px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  //opacity: .5;
}

.flag-with-label {
  opacity: .5;
}

.active-flag {
  opacity: 1 !important;
}

.no-selection {
  color: #ff2e2e;
  font-size: 18px;
}

</style>