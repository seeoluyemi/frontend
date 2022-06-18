<template>
  <div>
    <user-dashboard-top :balance="balance">
      <h3 :style="{color: $vuetify.theme.themes.light.deep__purple}" class="ah-text-2xl">{{ title }}</h3>
    </user-dashboard-top>
    <v-row class="mx-0">
      <v-col cols="12" md="4">
        <div :class="{ 'bg-ash': showAmount }" class="col-box pa-3" style="height: 500px; overflow-y: hidden">
          <select-brand v-show="!showAmount" :brands="brands" :loading="fetchingBrands" :selected-brand="selectedBrand"
                        class="mx-auto"
                        @select:brand="selectBrand"/>
          <card-purchase-overview v-if="showAmount" :selected-card-type="selectedCardType"
                                  :selected-country="selectedCountry" @edit="edit"/>
        </div>
      </v-col>
      <v-col v-if="!showAmount" cols="12" md="8" style="height: 500px">
        <div class="col-box box-row pa-3 mb-5">
          <select-giftcard :card-types="cardTypes" :fetching-types="fetchingTypes"
                           :selected-brand="selectedBrand"
                           :selected-type="selectedCardType" @select:cardType="selectCardType"/>
        </div>
        <div class="col-box box-row pa-3">
          <select-country :countries="countries" :selected-country="selectedCountry" @select:country="selectCountry"/>
        </div>
      </v-col>
      <v-col v-else cols="12" md="8">
        <div class="col-box px-4 px-md-10 py-5" style="height: 500px; overflow-y: auto">
          <div v-if="!rates.length && !price_ratings.length"
               class="d-flex ah-w-full ah-h-full justify-center ah-items-center">
            <h5 class="no-rates">Sorry, no rates have been created for this card.</h5>
          </div>
          <div v-else>
            <div v-if="$route.query.trade_type === 'sell'">
              <div class="d-flex align-center justify-space-between">
                <h3>Select Giftcard Amount</h3>
                <div>
                  <v-switch v-model="showECode" :color="$vuetify.theme.themes.light.linear__purple1" inset>
                    <template #label>
                      <h3>E-Code</h3>
                    </template>
                  </v-switch>
                </div>
              </div>
              <div>
                <card-amount-plank
                    v-for="rate in getRates" :id="rate.id" :key="rate.id" :count="rate.count"
                    :denomination="rate.denomination" :availability_count="rate.available_count" :rate="rate.rate" @decrement="decrement(rate.id, $event)"
                    @increment="increment(rate.id, $event)"
                    @upload="[storeImages(rate.id, $event)]"/>
              </div>
              <div class="my-6">
                <v-btn class="white--text text-capitalize" :color="$vuetify.theme.themes.light.deep__purple" depressed @click="addSingleCard">Add Single Card</v-btn>
                <sell-input-display
                    v-for="(card, i) in user_defined_cards"
                    :key="i"
                    :card="card"
                    @increment="[incrementSingleCard(card.id)]"
                    @decrement="[decrementSingleCard(card.id)]"
                    @file="[addSingleCardImage(card.id, $event)]"
                    @input="[getChosenRate(card.id, $event)]"
                    @delete-image="[removeImage(card.id, $event)]"
                    @delete="[removeCard(card.id)]"
                />
              </div>
            </div>
            <div v-else>
              <card-amount-plank
                  v-for="rate in getRates" :id="rate.id" :key="rate.id" :count="rate.count"
                  :denomination="rate.denomination" :availability_count="rate.available_count" :rate="rate.rate" @decrement="decrement(rate.id, $event)"
                  @increment="increment(rate.id, $event)"
                  @upload="storeImages"/>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <div class="ah-flex justify-end pr-3 my-6">
      <div v-if="!showAmount">
        <base-button v-if="$route.query.trade_type === 'buy'" :color="$vuetify.theme.themes.light.linear__purple1"
                     class="mr-3"
                     height="45"
                     min-height="45"
                     outlined
                     @click="openRequestModal">
          <small>Request card</small>
        </base-button>
        <base-button :color="$vuetify.theme.themes.light.linear__purple1"
                     :disabled="!selectedCountry.id"
                     :loading="loading"
                     height="45" min-height="45" outlined @click="openTermsAndCondition"><small>Continue</small>
        </base-button>
      </div>
      <div v-else class="d-flex align-center">
        <h3 class="mr-4">Order Total: <span
            :style="{ color: $vuetify.theme.themes.light.linear__purple1 }">&#8358;{{ computedTotal }}</span></h3>
        <base-button :color="$vuetify.theme.themes.light.linear__purple1"
                     :disabled="!total"
                     :loading="loading"
                     height="45" min-height="45" outlined @click="pay">
          <small>{{ $route.query.trade_type === 'sell' ? 'Sell' : 'Pay' }}</small>
        </base-button>
      </div>
    </div>
    <div>
    </div>
    <card-terms-and-conditions
        :dialog="termsAndConditionsDialog"
        :loading="loading"
        :terms-and-conditions="selectedCardType.terms_condition"
        @accept="continueToRate"
        @cancel="closeTermsAndConditionsDialog"
        @close="closeTermsAndConditionsDialog"/>
    <request-modal :dialog="requestModal" @close="closeRequestModal"/>
  </div>
</template>

<script>
import UserDashboardTop from "@/components/users/UserDashboardTop";
import SelectBrand from "@/components/users/Trade/SelectBrand";
import SelectCountry from "@/components/users/Trade/SelectCountry";
import SelectGiftcard from "@/components/users/Trade/SelectGiftcard";
import {mapGetters, mapMutations} from "vuex";
import BaseButton from "@/components/resuables/BaseButton";
import CardPurchaseOverview from "@/components/users/Trade/CardPurchaseOverview";
import {
  tradeGiftCard,
  getCardRates,
  uploadToAzureViaAlaje,
  getAllAvailableCards,
  getCardTypes,
  getCardRatesWithRanges
} from "@/apis";
import handleError from "@/utils/errorHandler";
import {capitalizeStr, numberWithCommas} from "@/utils/helpers";
import {v4 as uuid} from "uuid"
import CardAmountPlank from "@/components/users/Trade/CardAmountPlank";
import CardTermsAndConditions from "@/components/users/Trade/CardTermsAndConditions";
import RequestModal from "@/components/users/Trade/RequestModal";
import SellInputDisplay from "@/components/users/Trade/SellInputDisplay";

export default {
  name: "GiftCardTrade",
  data: () => ({
    disabled: true,
    showAmount: false,
    loading: false,
    showECode: false,
    description: "",
    total: 0,
    selectedCurrency: 'NGN',
    rates: [],
    fetchingBrands: false,
    errorMessage: '',
    selectedBrand: {id: null},
    brands: [],
    cardTypes: [],
    fetchingTypes: false,
    selectedCardType: {id: null},
    countries: [],
    selectedCountry: {id: null},
    images: {},
    termsAndConditionsDialog: false,
    requestModal: false,
    price_ratings: [],
    amount: 0,
    rate: 0,
    selectedPriceRating: {id: null},
    user_defined_cards: [],
  }),
  components: {
    SellInputDisplay,
    RequestModal,
    CardTermsAndConditions,
    CardAmountPlank,
    // BaseInput,
    // CardAmountPlank,
    CardPurchaseOverview,
    BaseButton,
    UserDashboardTop,
    SelectBrand,
    SelectCountry,
    SelectGiftcard,
  },
  computed: {
    ...mapGetters(['balance', 'user',]),
    computedTotal() {
      console.log(this.total)
      return numberWithCommas(this.total)
    },
    title() {
      return capitalizeStr(this.$route.query.trade_type) + ' Giftcards'
    },
    getRates() {
      let rates
      if (this.$route.query.trade_type === 'buy') {
        rates = this.rates.filter(rate => rate.type === 'buy')
      }
      if (this.$route.query.trade_type === 'sell') {
        rates = this.rates.filter(rate => rate.type === 'sell')
      }
      return rates
    }
  },
  async created() {
    this.fetchingBrands = true
    try {
      const {data: {data: {cards: brands}}} = await getAllAvailableCards()
      this.brands = brands
    } catch (e) {
      handleError(e, this)
      this.$displaySnackbar(e)
    }
    this.fetchingBrands = false
  },
  watch: {
    errorMessage() {
      setTimeout(() => this.errorMessage = '', 5000)
    },
    selectedBrand() {
      this.countries = []
      this.selectedCountry = {id: null}
      this.selectedCardType = {id: null}
    },
    user_defined_cards: {
      handler: function () {
        this.calcTotal()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessTitle', 'setSuccess', 'setErrorOrSuccessMessage']),
    openTermsAndCondition() {
      this.termsAndConditionsDialog = true
    },
    closeTermsAndConditionsDialog() {
      this.termsAndConditionsDialog = false
    },
    closeRequestModal() {
      this.requestModal = false
    },
    openRequestModal() {
      this.requestModal = true
    },
    async continueToRate() {
      const {trade_type} = this.$route.query
      this.loading = true
      try {
        if (trade_type === 'buy') {
          await this.getRatesForBuy()
        }
        if (trade_type === 'sell') {
          await this.getRatesForSell()
        }
        this.showAmount = true
      } catch (e) {
        handleError(e, this)
      }
      this.loading = false
      this.closeTermsAndConditionsDialog()
    },
    async getRatesForBuy() {
      const {data: {data: {card: rates}}} = await getCardRates(this.selectedCardType.id, this.selectedCountry.id)
      console.log(rates)
      this.rates = rates.filter(rate => rate.available_count)
      this.rates.forEach(rate => rate.count = 0)
    },
    increment(id) {
      const rate = this.rates.find(rate => rate.id === id)
      rate.count++
      this.calcTotal()
    },
    decrement(id) {
      const rate = this.rates.find(rate => rate.id === id)
      rate.count--
      this.calcTotal()
    },
    calcTotal() {
      this.total = 0
      this.rates.filter(rate => rate.count > 0).forEach(rate => {
        const amount = rate.rate * rate.denomination * rate.count
        console.log(rate.rate, rate.count, {amount, tot: this.total})
        this.total += amount
        console.log(this.total + amount)
      })
      this.total += this.user_defined_cards.reduce((acc, curr) => {
        return acc + (curr.rate * curr.amount * curr.count)
      }, 0)
    },
    storeImages(id, { files }) {
      console.log(files, id)
      const theRate = this.rates.find(rate => rate.id === id)
      console.log(theRate)
      theRate.images = files
    },
    async pay() {
      this.loading = true
      const user_id = this.user.id
      const {trade_type: type} = this.$route.query
      const items = this.rates.filter(rate => rate.count !== 0)
      let expectedData = {
        user_id,
        type
      }
      if (type === 'sell') {
        if (this.user_defined_cards.length) {
          if (this.user_defined_cards.some(card => !card.images.length)) {
            this.$displaySnackbar("Images must be uploaded")
            return this.loading = false
          }
        }
        try {
          await this.setSellTypeData(expectedData)
        } catch (e) {
          this.loading = false
          return this.$displaySnackbar(e.message)
        }
      }
      if (type === 'buy') {
        this.setBuyTypeData(expectedData, items)
      }
      console.log(expectedData)
      try {
        const {data} = await tradeGiftCard(expectedData)
        console.log(data)
        this.setErrorOrSuccessDialog(true)
        this.setSuccess(true)
        this.setErrorOrSuccessTitle(this.titleOnTransactionEnd())
        this.setErrorOrSuccessMessage(this.messageOnTransactionEnd())
        await this.$router.push({name: 'UserDashboard'})
      } catch (e) {
        console.log(e, e.response)
        this.$displaySnackbar(e)
        handleError(e, this)
      }
      this.loading = false
    },
    titleOnTransactionEnd() {
      return this.$route.query.trade_type === 'buy' ? 'Card successfully purchased' : 'We have successfully received your card, and review is underway'
    },
    messageOnTransactionEnd() {
      return this.$route.query.trade_type === 'sell' ? 'Check your history, click on the card to see tracking details.' : ''
    },
    edit() {
      this.total = 0
      this.showAmount = false
    },
    async uploadImages(imagesArray) {
      const images = []
      let isError = false
      let error;
      for (const image of imagesArray) {
        const formData = new FormData()
        formData.append('asset_file', image)
        try {
          const {data: {data: {asset}}} = await uploadToAzureViaAlaje(formData)
          images.push(asset)
        } catch (e) {
          this.$displaySnackbar(e)
          isError = true
          error = e
          break
        }
      }
      if (isError) {
        throw error
      }
      return images
    },
    async selectBrand(brand) {
      this.selectedBrand = brand
      this.fetchingTypes = true
      try {
        const {data: {data: {card_types}}} = await getCardTypes(this.selectedBrand.id)
        this.cardTypes = card_types.filter(type => (type.has_rate_buy || type.has_rate_sell) && type.is_available)
        console.log({card_types})
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.fetchingTypes = false
    },
    async selectCardType(cardType) {
      this.selectedCardType = cardType
      this.countries = this.selectedCardType.countries
    },
    selectCountry(country) {
      this.selectedCountry = country
    },
    addImage() {
      this.$refs.file_input.click()
    },
    deleteImage(image_id) {
      this.images = this.images.filter(image => image.id !== image_id)
    },
    async setSellTypeData(expectedData) {
      console.log(this.rates.filter(r => r.count))
      if (this.rates.filter(r => r.count).some(item => !item.images.length)) {
        throw new Error('Make sure to upload all cards images.')
      }
      if (this.rates.filter(r => r.count).some(item => item.images.length < item.count)) {
        throw new Error('The number of images uploaded does not match number of cards')
      }
      for (const rate of this.rates.filter(r => r.count)) {
        console.log(rate.images)
        rate.images = await this.uploadImages(rate.images.map(r => r.imageFile))
      }
      let items = this.rates.filter(r => r.count).map(rate => ({
        pricing_rate_id: rate.id,
        count: rate.count,
        image_url: rate.images,
        amount: rate.denomination,
        description: ""
      }))
      for (const item of this.user_defined_cards) {
        item.images = await this.uploadImages(item.images.map(i => i.imageFile))
      }
      console.log(items, '1')
      const user_defined = this.user_defined_cards.map(i => ({
        pricing_rate_id: i.pricing_rate_id,
        count: i.count,
        amount: i.amount,
        description: '',
        image_url: i.images
      }))
      console.log(user_defined)
      items = [...items, ...user_defined]
      console.log(items, '2')
      expectedData.items = items
    },
    setBuyTypeData(expectedData, items) {
      expectedData.items = items.map(item => ({
        count: item.count,
        card_trade_rate_id: item.id
      }))
    },
    async getRatesForSell() {
      const {data: {data: {rates}}} = await getCardRatesWithRanges(this.selectedBrand.id, this.selectedCountry.id)
      console.log(rates)
      const selectedBrandRates = rates.find(rate => rate.id === this.selectedCardType.id)
      console.log(selectedBrandRates)
      const singleValuedCards = selectedBrandRates.price_ratings.filter(c => c.single_value || c.min === c.max)
      this.rates = singleValuedCards.map(c => ({
        rate: c.rate,
        denomination: c.max,
        id: c.id,
        count: 0,
        type: 'sell',
        images: []
      }))
      this.price_ratings = selectedBrandRates.price_ratings.filter(c => !c.single_value && c.min !== c.max).map(({id, min, max, rate}) => ({id, min, max, rate}))
    },
    getChosenRate(id, amount) {
      console.log(amount)
      // this.calcTotal()
      const single_card = this.user_defined_cards.find(c => c.id === id)
      if (!amount) {
        single_card.count = 0
        return
      }
      if (!single_card.amount) single_card.count = 1
      single_card.amount = amount
      const range = (start, end, length = (end - start) + 1) =>
          Array.from({length}, (_, i) => start + i)
      const ratings = this.price_ratings.filter(rating => rating.type === this.$route.query.key)
      for (let i = 0; i < ratings.length; i++) {
        const rate_range = range(this.price_ratings[i].min, this.price_ratings[i].max)
        if (rate_range.indexOf(+amount) > -1) {
          single_card.rate = this.price_ratings[i].rate
          single_card.pricing_rate_id = this.price_ratings[i].id
          break
        } else {
          this.$displaySnackbar("There is no rate for this value")
          if (i === ratings.length - 1) single_card.rate = 0
        }
      }
    },
    addSingleCard() {
      const single_card = {
        id: uuid(),
        amount: 0,
        images: [],
        count: 0,
        rate: 0
      }
      this.user_defined_cards.push(single_card)
    },
    incrementSingleCard(id) {
      const single_card = this.user_defined_cards.find(c => c.id === id)
      single_card.count++
    },
    decrementSingleCard(id) {
      const single_card = this.user_defined_cards.find(c => c.id === id)
      single_card.count--
    },
    addSingleCardImage(id, images) {
      const single_card = this.user_defined_cards.find(c => c.id === id)
      single_card.images = [...single_card.images, ...images]
    },
    removeImage(cardId, imageId) {
      const card = this.user_defined_cards.find(c => cardId === c.id)
      card.images = card.images.filter(image => image.id !== imageId)
    },
    removeCard(id) {
      this.user_defined_cards = this.user_defined_cards.filter(c => c.id !== id)
    }
  }
}
</script>

<style lang="scss" scoped>
.col-box {
  border: thin solid var(--v-button__border-base);
  border-radius: 8px;
}

.bg-ash {
  background: #F5F5F9;
}

.no-rates {
  color: var(--v-deep__purple-base);
  font-size: 18px;
}

.box-row {
  height: 50%;
}

.add_image {
  height: 130px;
  width: 130px !important;
  background: #cccccc;
  border-radius: 4px;
  cursor: pointer;
}

.cancel__image {
  position: absolute;
  z-index: 2;
  right: -8px;
  top: -8px;

  .v-btn {
    background: #f6f6f6;
  }
}

.images_display {
  //width: 100%;
  overflow-x: auto;
  padding: 5px;
}
</style>