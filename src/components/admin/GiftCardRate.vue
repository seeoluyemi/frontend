<template>
  <v-dialog v-model="dialog" max-width="350" @click:outside="$emit('close:rate')">
    <v-card>
      <v-card-text>
        <div class="py-10">
          <div class="mb-3 d-flex justify-space-between align-center">
            <h3>Create Giftcard Rate</h3>
            <v-btn icon @click="$emit('close:rate')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-select v-model="cardSelected" class="my-4" outlined :loading="fetchingCards"
                    @change="fetchTypes"
                    hide-details
                    placeholder="Select Giftcard" :items="fetchedCards || []" item-text="title" item-value="id"/>
          <v-select v-model="typeSelected" class="my-4" outlined hide-details :loading="fetchingTypes" @change="populateCountries"
                    placeholder="Select Card Type" :items="fetchedTypes || []" item-text="title" item-value="id"/>
          <v-autocomplete v-model="countrySelected" outlined
                          hide-details
                    placeholder="Select Country" class="my-4" :items="countries" item-text="name" item-value="id">
            <template #selection="{ item }">
              <div class="ah-flex ah-items-center"><img class="mr-2" width="30px" height="30px" :src="item.image" :alt="item.slug"/> {{item.name}}</div>
            </template>
            <template #item="{ item, on , attrs }">
              <div v-on="on" class="ah-flex ah-items-center" v-bind="attrs"><img class="mr-2" width="30px" height="30px" :src="item.image" :alt="item.slug"/> {{item.name}}</div>
            </template>
          </v-autocomplete>
          <v-select label="Enter Rate Type" class="my-4" hide-details outlined placeholder="Enter Rate Type" v-model="rateType" :items="['Buy', 'Sell']"/>
          <v-checkbox v-if="rateType === 'Sell'" v-model="single_card" label="Single Card"/>
          <div v-if="rateType === 'Buy' || (rateType === 'Sell' && single_card)">
            <div>
              <base-input dense :hint-message="`Rate is in naira per dollar (N/$)`" label="Enter Card Rate" type="number" placeholder="Enter Card Rate" @input="setRate" class="mb-4"/>
            </div>
            <base-input dense label="Enter Card Value" :hint-message="`Card value is in dollar`" type="number" placeholder="Enter Card Value" @input="setDenomination" class="my-4"/>
          </div>
          <div v-else>
            <div>
              <base-input dense label="Enter Card Rate" type="number" placeholder="Enter Card Rate" @input="setRate" class="mb-4"/>
            </div>
            <div class="d-flex justify-space-between">
              <v-text-field v-model="min" class="mr-2" label="Min" outlined/>
              <v-text-field v-model="max" class="ml-2" label="Max" outlined/>
            </div>
          </div>
<!--          <input-like-upload-button v-if="rateType === 'Buy'" @file="image = $event" back/>-->
          <div class="d-flex justify-center">
            <base-button outlined :color="$vuetify.theme.themes.light.linear__purple1" :loading="loading" @click="submit">Create</base-button>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  createCardTradeRate,
  createRateCalculator,
  getAllAvailableCards,
  getCardTypes,
  // uploadToAzureViaAlaje
} from "@/apis";
import BaseInput from "@/components/resuables/BaseInput";
import BaseButton from "@/components/resuables/BaseButton";
// import handleError from "@/utils/errorHandler";
// import InputLikeUploadButton from "@/components/resuables/InputLikeUploadButton";
import {mapMutations} from "vuex";

export default {
  name: "GiftCardRate",
  components: {BaseButton, BaseInput},
  data: () => ({
    cardSelected: '',
    fetchedCards: null,
    fetchingCards: false,
    typeSelected: '',
    fetchedTypes: null,
    fetchingTypes: false,
    cardRate: '',
    countrySelected: '',
    countries: [],
    loading: false,
    denomination: '',
    rateType: 'Buy',
    image: null,
    min: '',
    max: '',
    single_card: false
  }),
  props: {
    dialog: Boolean
  },
  watch: {
    dialog: {
      handler: async function (value) {
        if (value) {
          try {
            this.fetchingCards = true
            const {data} = await getAllAvailableCards()
            this.fetchedCards = data.data.cards
          } catch (e) {
            console.log(e)
          }
          this.fetchingCards = false
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setGlobalModal']),
    async fetchTypes() {
      this.fetchingTypes = true
      try {
        const {data} = await getCardTypes(this.cardSelected)
        this.fetchedTypes = data.data.card_types
        console.log(data)
      } catch (e) {
        console.log(e)
      }
      this.fetchingTypes = false
    },
    setRate(payload) {
      this.cardRate = payload.value
    },
    setDenomination(payload) {
      this.denomination = payload.value
    },
    populateCountries() {
      if (!this.fetchedTypes) return;
      this.countries = this.fetchedTypes.find(type => type.id === this.typeSelected).countries;
    },
    async submit() {
      const {rateType} = this
      this.loading = true
      console.log(rateType)
      let card
      try {
        if (rateType === 'Sell') {
          card = await this.createSellRate()
        }
        if (rateType === 'Buy') {
          card = await this.createBuyRate()
        }
        this.$emit('addCard', card)
        this.$emit('close:rate')
        this.cardSelected = ""
        this.typeSelected = ""
        this.countrySelected = ""
        this.single_card = false
        this.min = ""
        this.max = ""
        this.denomination = ""
        this.cardRate = ""
        this.setGlobalModal({title: 'Card rate successfully created', success: true})
      } catch (e) {
        this.$displaySnackbar(e)
      } finally {
        this.loading = false
      }
    },
    async createBuyRate() {
      const $data = {
        gift_cards_type_id: this.typeSelected,
        country_id: this.countrySelected,
        denomination: this.denomination,
        rate: this.cardRate,
        current: true,
        type: this.rateType,
        // card_image: null,
        extra_config: [{verified: true}]
      }
      // const fd = new FormData()
      // fd.append('asset_file', this.image)
      // const {data: {data: {asset}}} = await uploadToAzureViaAlaje(fd)
      // $data.card_image = asset
      const {data: {data: {rate}}} = await createCardTradeRate($data)
      console.log(rate)
      return {
        id: rate.gift_card_type.id,
        selected: false,
        name: rate.gift_card_type.title,
        dollar_value: rate.denomination,
        brand: rate.gift_card.title
      }
    },
    async createSellRate() {
      console.log('trying to sell...')
      const data = {
        min: this.single_card ? this.denomination : this.min,
        max: this.single_card ? this.denomination : this.max,
        rate: this.cardRate,
        single_value: this.single_card ?? undefined,
        gift_cards_type_id: this.typeSelected,
        country_id: this.countrySelected,
        type: this.rateType,
        current: true
      }
      console.log(data)
      try {
        await createRateCalculator(data)
      } catch (e) {
        this.$displaySnackbar(e)
      }
    },
  }
}
</script>

<style scoped>

</style>