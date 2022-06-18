<template>
  <div style="max-width: 300px; overflow-y: hidden">
    <div>
      <div style="height: 40px"><span class="mb-4 font-weight-bold">Select Brand</span></div>
      <div class="ah-flex select__brand-input ah-items-center pa-2 mt-4">
        <double-state-icon class="mr-1" type="search-icon"/>
        <input id="select__brand-input" v-model="search" class="ah-flex-1" placeholder="Search" type="text">
      </div>
      <div v-if="loading" class="ah-flex ah-w-full ah-h-full py-10 ah-items-center ah-justify-center">
        <v-progress-circular :color="$vuetify.theme.themes.light.linear__purple1" indeterminate/>
      </div>
      <ul v-else>
        <li v-for="(brand, i) in filteredBrands" :key="i" :class="{ selected: selectedBrand.id === brand.id }"
            class="ah-flex ah-items-center ah-justify-between mt-3">
          <!--          <div class="ah-w-10 ah-h-10 mr-2">-->
          <!--            <v-img v-if="brand.image" :src="brand.image"/>-->
          <!--            <div v-else :style="{ background: selectedBrand.id === brand.id ? 'white' : '#932CFF', opacity: selectedBrand.id === brand.id ? 1 : .4 }"-->
          <!--                 class="ah-w-full ah-h-full no-image-brand"/>-->
          <!--          </div>-->
          <span class="ah-text-lg ah-flex-1 ah-font-bold pa-3" @click="$emit('select:brand', brand)">{{
              brand.title
            }}</span>
          <v-btn v-if="selectedBrand.id === brand.id" icon @click="cancel">
            <styled-cancel/>
          </v-btn>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DoubleStateIcon from "@/components/resuables/DoubleStateIcon";
import {mapActions, mapMutations} from "vuex";
import StyledCancel from "@/components/resuables/Icons/StyledCancel";
import handleError from "@/utils/errorHandler";

export default {
  name: "SelectBrand",
  components: {StyledCancel, DoubleStateIcon},
  data() {
    return {
      // loading: false,
      search: ''
    }
  },
  props: {
    brands: Array,
    selectedBrand: Object,
    loading: Boolean
  },
  computed: {
    filteredBrands() {
      return this.brands.filter(brand => brand.title.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  created() {
    // this.fetchBrandsInvoker()
  },
  beforeDestroy() {
    this.cancelSelectedBrand()
  },
  methods: {
    ...mapMutations(['setFetchingTypes', "cancelSelectedBrand"]),
    ...mapActions(['fetchBrands', 'setSelectedBrand']),
    async fetchBrandsInvoker() {
      this.loading = true
      try {
        await this.fetchBrands()
      } catch (e) {
        handleError(e, this)
      }
      this.loading = false
    },
    cancel() {
      this.cancelSelectedBrand()
    },
    // selectBrand(brand) {
    //
    // }
  }
}
</script>

<style lang="scss" scoped>
.select__brand-input {
  height: 45px;
  border: 2px solid var(--v-button__border-base);
  border-radius: 4px;

  input {
    border: none;
    outline: none;
    text-indent: 4px;
  }
}

li {
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s ease-in-out;
  color: var(--v-button__border-base)
}

li:hover {
  background: linear-gradient(101.54deg, rgba(181, 88, 249, 0.15) 0%, rgba(147, 44, 255, 0) 100%);
}

.selected {
  background: linear-gradient(101.54deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base)) !important;
  color: var(--v-white-base);
}

.no-image-brand {
  //height: 30px;
  //width: 30px;
  border-radius: 50%;
  //background: white;
}

ul {
  overflow-y: auto;
  height: 424px;
  padding-right: 10px;
  margin-top: 5px;

  &::-webkit-scrollbar {
    width: 10px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, .1);
    border-radius: 5px;
  }
}

.label {
  background: black;
  color: whitesmoke;
  padding: 2px;
  border-radius: 10px;
}
</style>