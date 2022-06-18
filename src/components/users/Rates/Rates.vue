<template>
  <div>
    <user-dashboard-top>
      <div class="ah-w-1/2">
        <dashboard-inner-content-state-indicator :links="links" @change="route"/>
      </div>
    </user-dashboard-top>
    <div class="ah-flex ah-justify-between rates-container px-1 px-lg-7">
      <div class="select-box pa-4 px-lg-14">
        <rates-form :amount-field="amount" :rates="price_ratings_with_types" :gift-card-info="giftCardInfo" @input="getChosenRate"
                    @selectItem="selectChange"/>
      </div>
      <div class="gift__card-info pa-6">
        <h2 class="ah-font-bold mb-3">Giftcard Information</h2>
        <div>
          <!--          <p class="mb-5" v-for="(info, i) in giftCardInfo" :key="i">{{ info.name }}  : {{ info.value }}</p>-->
          <div class="rate-confetti">
            <v-img v-if="!cardImg" :src="require('../../../assets/images/confetti.svg')" alt="confetti"/>
            <v-img v-else :src="cardImg" alt="card-img"/>
          </div>
        </div>
        <div class="conversion-box mt-10">
          <h2 class="ah-font-bold mb-3 mt-5">What You'll Get</h2>
          <h3 class="my-2 amount">&#8358;{{ totalAmount }}</h3>
          <p class="ah-text-sm">Rate: &#8358;{{ rate }}/$</p>
        </div>
        <div class="d-flex justify-center"><h6 :style="{color: $vuetify.theme.themes.light.deep__purple}">Average confirmation time of 10 - 30 minutes.</h6></div>
      </div>
    </div>
  </div>
</template>

<script>
import UserDashboardTop from "@/components/users/UserDashboardTop";
import DashboardInnerContentStateIndicator from "@/components/resuables/DashboardInnerContentStateIndicator";
// import BuyingRates from "@/components/users/Rates/BuyingRates";
// import SellingRates from "@/components/users/Rates/SellingRates";
import RatesForm from "@/components/users/Rates/RatesForm";
import {getAllAvailableCards, getCardRatesWithRanges, getCardTypes,} from "@/apis";
import {mapGetters, mapMutations} from "vuex";
import {numberWithCommas} from "@/utils/helpers";
import handleError from "@/utils/errorHandler";

export default {
  name: "Rates.vue",
  components: {RatesForm, DashboardInnerContentStateIndicator, UserDashboardTop},
  data() {
    return {
      total: 0,
      cardImg: '',
      links: [
        {
          label: 'Buy',
          to: {name: 'Rates', query: {key: 'buy'}}
        },
        {
          label: 'Sell',
          to: {name: 'Rates', query: {key: 'sell'}}
        }
      ],
      giftCardInfo: [
        {
          name: 'BRAND',
          value: '',
          label: 'Select Giftcard',
          options: ['Amazon', 'Apple', 'Google']
        },
        {
          name: 'GIFTCARD',
          value: '',
          label: 'Select Giftcard Type',
          options: []
        },
        {
          name: 'COUNTRY',
          value: '',
          label: 'Select Country',
          options: []
        },
        // {
        //   name: 'TYPE',
        //   value: '',
        //   label: 'Select Card Type',
        //   options: []
        // },
        // {
        //   name: 'VALUE',
        //   value: '',
        //   label: 'Enter Gift-card Value',
        //   options: ['$50', '$100', '$200']
        // }
      ],
      amount: {
        label: 'Giftcard Value',
        type: 'password',
        placeholder: 'Enter Giftcard Value',
        error: false,
        value: ''
      },
      price_ratings: [],
      price_ratings_with_types: [],
      rate: 0
    }
  },
  watch: {
    '$route.query': {
      handler: function ({key}) {
        console.log(key)
        this.giftCardInfo.map(info => info.value = '')
        console.log(this.price_ratings)
        this.price_ratings_with_types = this.price_ratings.filter(rating => rating.type === key)
      }
    }
  },
  computed: {
    ...mapGetters(['buyRate', 'sellRate']),
    currentProps() {
      return {
        giftCardInfo: this.giftCardInfo
      }
    },
    totalAmount() {
      return numberWithCommas(this.total)
    }
  },
  methods: {
    ...mapMutations(['SET_PRICE_RATINGS']),
    async selectChange(payload) {
      const {name, value} = payload
      const cardInfo = this.giftCardInfo.find(info => info.name === name)
      cardInfo.value = value
      try {
        if (name === 'BRAND') {
          const {data: {data}} = await getCardTypes(value)
          this.giftCardInfo[1].options = data.card_types
        }
        if (name === 'GIFTCARD') {
          this.cardImg = ""
          const card = this.giftCardInfo[1].options.find(option => option.id === value)
          console.log(card, value, this.giftCardInfo[1].options)
          this.cardImg = (card && card.front_image) || ""
          this.giftCardInfo[2].options = this.giftCardInfo[1].options.find(option => option.id === value).countries
        }
        if (name === 'COUNTRY') {
          const {data: {data}} = await getCardRatesWithRanges(this.giftCardInfo[0].value, this.giftCardInfo[2].value)
          const selectedTypeRatings = data.rates.find(type => type.id === this.giftCardInfo[1].value)
          console.log(data.rates, selectedTypeRatings)
          this.price_ratings = selectedTypeRatings.price_ratings.map(rating => ({
            rate: rating.rate,
            min: rating.min,
            max: rating.max,
            type: rating.type
          }))
          this.price_ratings_with_types = this.price_ratings.filter(rating => rating.type === this.$route.query.key)
          console.log(this.price_ratings)
          // this.giftCardInfo[3].options = data.rates
        }
        // if (name === 'TYPE') {
        //   console.log(this.giftCardInfo[2].value)
        //   const rate = this.giftCardInfo[2].options.find(option => option.id === this.giftCardInfo[2].value)
        //   console.log(rate.price_ratings)
        //   this.SET_PRICE_RATINGS(rate.price_ratings)
        // }

      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
    },
    route(value) {
      this.$router.push({
        name: 'Rates',
        query: {key: value}
      })
    },
    getChosenRate(amount) {
      if (!amount) {
        console.log('empty')
        this.amount.value = ''
        this.rate = 0
        this.total = 0
        return
      }
      console.log({amount})
      amount = +amount
      const ratings = this.price_ratings.filter(rating => rating.type === this.$route.query.key)
      console.log(ratings)
      if (!ratings.length) this.$displaySnackbar("Input does not match any available rate")
      for (let i = 0; i < ratings.length; i++) {
        const { min, max } = ratings[i]
        console.log({min, max, amount})
        if (min <= amount && max >= amount) {
          this.rate = this.price_ratings[i].rate
          this.total = this.rate * amount
          break
        } else {
          this.rate = 0
          this.total = 0
          this.$displaySnackbar("Input does not match any available rate")
        }
      }
    }
  },
  async created() {
    try {
      const {data: {data}} = await getAllAvailableCards()
      this.giftCardInfo[0].options = data.cards;
    } catch (e) {
      handleError(e, this)
    }
    // const { data: { data: countries } } = await getAllCountries()
    // console.log(countries)
    // this.giftCardInfo[1].options = countries.countries.reverse();
  }
}
</script>

<style lang="scss" scoped>
@use '../../../assets/styles/mixins';

.rates-container {
  flex-direction: column;

  @include mixins.sm {
    flex-direction: row;
  }

  .select-box, .gift__card-info {
    border-radius: 10px;
    border: thin solid var(--v-button__border-base);
    width: 100%;
    margin-bottom: 18px;

    @include mixins.sm {
      width: 47.5%;
      margin-bottom: 0;
    }
  }

  .rate-confetti {
    width: 150px;
  }

  .amount {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 38px;
  }
}
</style>