<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="d-flex justify-space-between my-4">
        <h3>Rate Calculator</h3>
        <v-btn icon @click="$emit('close:rate-calculator')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="createRate">
          <v-select v-model="selected" :items="items || []" :loading="fetchingCards" hide-details item-text="title"
                    item-value="id" label="Select Giftcard"
                    outlined placeholder="Select Giftcard" @change="fetchTypes"/>
          <v-select v-model="typeSelected" :items="fetchedTypes || []" :loading="fetchingTypes" class="my-4"
                    hide-details
                    item-text="title"
                    item-value="id" outlined placeholder="Select Card Type" @change="populateCountries"/>
          <v-autocomplete v-model="countrySelected" :items="countries"
                          class="my-4"
                          hide-details item-text="name" item-value="id" outlined placeholder="Select Country">
            <template #selection="{ item }">
              <div class="ah-flex ah-items-center">
                <img :alt="item.slug" :src="item.image" class="mr-2" height="30px"
                     width="30px"/> {{ item.name }}
              </div>
            </template>
            <template #item="{ item, on , attrs }">
              <div v-bind="attrs" v-on="on" class="ah-flex ah-items-center">
                <img :alt="item.slug" :src="item.image"
                     class="mr-2"
                     height="30px" width="30px"/>
                {{ item.name }}
              </div>
            </template>
          </v-autocomplete>
          <v-select v-model="rateType" :items="['Buy', 'Sell']" class="my-4" hide-details label="Enter Rate Type"
                    outlined placeholder="Enter Rate Type"/>
          <div>
            <h5>Values</h5>
            <div class="d-flex justify-space-between">
              <v-text-field v-model="min" class="mr-2" label="Min" outlined/>
              <v-text-field v-model="max" class="ml-2" label="Max" outlined/>
            </div>
          </div>
          <v-text-field v-model="rate" label="Rate" outlined type="number"/>
          <base-button :color="$vuetify.theme.themes.light.deep__purple" :loading="loading" block height="56" outlined>
            {{rateToEdit.id ? 'Update' : 'Create'}}
          </base-button>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {createRateCalculator, editRateCalculator, getAllAvailableCards, getCardTypes} from "@/apis";
import handleError from "@/utils/errorHandler";
import BaseButton from "@/components/resuables/BaseButton";
import {mapMutations} from "vuex";

export default {
  name: "RateCalculatorModal",
  components: {BaseButton},
  data: () => ({
    fetchingCards: false,
    items: [],
    selected: '',
    typeSelected: '',
    fetchedTypes: null,
    fetchingTypes: false,
    countries: [],
    loading: false,
    countrySelected: "",
    min: 0,
    max: 0,
    rate: 0,
    rateType: 'Buy'
  }),
  props: {
    dialog: Boolean,
    rateToEdit: Object
  },
  watch: {
    dialog: {
      handler: async function (value) {
        if (value) {
          try {
            this.fetchingCards = true
            const {data: {data: {cards}}} = await getAllAvailableCards()
            if (this.rateToEdit) {
              const rate = this.rateToEdit
              this.selected = rate.giftcard
              this.typeSelected = rate.type
              this.min = rate.min.replace('$', '').replace(',', '')
              this.max = rate.max.replace('$', '').replace(',', '')
              this.rate = rate.rate
              await this.fetchTypes()
            }
            console.log(this.rateToEdit.min)
            console.log(cards)
            this.items = cards
          } catch (e) {
            handleError(e, this)
          }
          this.fetchingCards = false
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', "setSuccess"]),
    populateCountries() {
      if (!this.fetchedTypes) return;
      this.countries = this.fetchedTypes.find(type => type.id === this.typeSelected).countries;
      if (this.rateToEdit.id) {
        this.countrySelected = this.rate.country
      }
    },
    async fetchTypes() {
      this.fetchingTypes = true
      try {
        const {data} = await getCardTypes(this.selected)
        this.fetchedTypes = data.data.card_types
        if (this.rateToEdit.id) {
          this.typeSelected = this.rate.cardtype
        }
      } catch (e) {
        console.log(e)
        handleError(e, this)
      }
      this.fetchingTypes = false
    },
    async createRate() {
      // @todo validate form before sending
      this.loading = true
      const data = {
        min: this.min,
        max: this.max,
        rate: this.rate,
        gift_cards_type_id: this.typeSelected,
        country_id: this.countrySelected,
        type: this.rateType
      }
      try {
        if (this.$route.name === 'RatesCalculator') {
          await editRateCalculator(data, this.rateToEdit.id)
        } else {
          await createRateCalculator(data)
        }
        this.clearForm()
        this.$emit('close:rate-calculator')
        this.setErrorOrSuccessDialog(true)
        this.setErrorOrSuccessTitle('Successfully created a rate calculator!')
        this.setSuccess(true)
      } catch (e) {
        handleError(e, this)
        console.log(e, e.response)
      }
      this.loading = false
    },
    clearForm() {
      this.selected = this.typeSelected = this.countrySelected = ''
      this.rateType = 'Buy'
      this.min = this.max = this.rate = 0
    }
  }
}
</script>

<style scoped>

</style>