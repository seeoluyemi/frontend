<template>
  <div>
    <user-dashboard-top balance="50000">
      <div/>
    </user-dashboard-top>
    <v-row class="px-1 px-lg-7">
      <v-col cols="12" lg="5" md="6">
        <div class="box bitcoin-rate-box">
          <div class="ah-fle ah-items-center ah-justify-between">
            <h5>Bcoin Rate</h5>
<!--            <h5 class="bitcoin-rate ah-text-green">{{ bitcoinRate }}</h5>-->
            <v-data-table disable-sort hide-default-footer :items="bitcoinRate" :headers="headers">
              <template #item.rate="{ item }">
                <span>&#8358;{{$numberToAmount(item.rate).format('0,0')}}</span>
              </template>
<!--              <template #item.action="{ item }">-->
<!--                <v-menu bottom offset-y>-->
<!--                  <template #activator="{ on, attrs }">-->
<!--                    <v-btn icon v-on="on" v-bind="attrs">-->
<!--                      <v-icon>mdi-dots-vertical</v-icon>-->
<!--                    </v-btn>-->
<!--                  </template>-->
<!--                  <v-card min-width="140">-->
<!--                    <v-list-item @click="[editBitcoinRate(item.id)]">Edit</v-list-item>-->
<!--                    <v-list-item @click="[deleteRate(item.id)]">Delete</v-list-item>-->
<!--                  </v-card>-->
<!--                </v-menu>-->
<!--              </template>-->
            </v-data-table>
          </div>
          <h2 class="btc-in-naira ah-text-3xl md:ah-text-4xl my-3 ah-inline-block">&#8358;{{ $numberToAmount(btcInNaira).format('0,0') }}</h2>
          <small class="ah-font-bold ml-2">Per BTC</small>
          <div class="ah-flex ah-items-center my-7">
            <div class="input ah-flex mr-4">
              <input v-model="btcInput" class="ah-flex-1" type="text" min=0>
              <div class="btc py-1 px-2 ah-flex ah-items-center">
                <span class="ah-font-bold">BC</span>
              </div>
            </div>
            <div class="input-conversion ah-text-center ah-flex ah-items-center ah-justify-center">
              <span>&#8358;{{ $numberToAmount(btcConvertedToNaira).format('0,0') }}</span>
            </div>
          </div>
          <div class="ah-flex my-3 ah-items-center ah-justify-end">
            <base-button :color="$vuetify.theme.themes.light.linear__purple1" @click="imageUploader = true" class="mb-3 mb-lg-0 mr-3" outlined>
              Sell Bcoin
            </base-button>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="7" md="6">
        <div class="box instructions mb-10">
          <div class="d-flex align-center justify-space-between">
            <h2>How to pay</h2>
            <v-tooltip close-delay="1500" allow-overflow top>
              <template #activator="{on, attrs}">
                <v-btn v-bind="attrs" v-on="on" icon @click="copyAddress">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </template>
              <span>{{copied ? 'Copied' : 'Copy wallet address'}}</span>
            </v-tooltip>
          </div>
          <ol style="overflow-y: auto; height: 230px">
            <li v-for="(inst, i) in instructions" :key="i" class="ah-text-sm md:ah-text-lg my-6 my-md-8" v-html="inst"></li>
          </ol>
        </div>
        <div class="box">
          <recent-activities :loading="fetchingActivities" :activities="activities"/>
        </div>
      </v-col>
    </v-row>
    <bitcoin-image-uploader :loading="loading" :image="image" @submit="submit" @file="saveImage" @close="imageUploader = false" :dialog="imageUploader"/>
  </div>
</template>

<script>
import UserDashboardTop from "@/components/users/UserDashboardTop";
import BaseButton from "@/components/resuables/BaseButton";
import RecentActivities from "@/components/users/Wallet/RecentActivities";
import {createBTCTransaction, getUserBTCActivities, uploadToAzureViaAlaje} from "@/apis";
// import {numberWithCommas, removeSeparatingCommas} from "@/utils/helpers";
import BitcoinImageUploader from "@/components/users/Bitcoin/BitcoinImageUploader";
import handleError from "@/utils/errorHandler";
import {mapActions, mapGetters, mapMutations} from "vuex";
import bitcoinMixin from "@/mixins/bitcoinMixin";

export default {
  name: "Bitcoin",
  components: {BitcoinImageUploader, RecentActivities, BaseButton, UserDashboardTop},
  mixins: [bitcoinMixin],
  data() {
    return {
      btcInput: null,
      imageUploader: false,
      fetchingBTCRate: false,
      instructions: [
        '<p>Enter the amount of Bcoin you want to sell to Alaje.</p>',
        '<p>Transfer the Bitcoin to the wallet ID <span id="wallet_address">kvxdgcjsdjsk32672djdfkfbjk36747sdhjfvhd</span></p>',
        '<p>Once the transaction has been made, click the sell bitcoin  button and upload proof of payment</p>',
        '<p>Once transaction has been confirmed, your wallet will be credited.</p>',
      ],
      btcRate: 0,
      btcInNaira: '0',
      // bitcoinRate: '+0.25%',
      loading: false,
      fetchingActivities: false,
      image: '',
      uploadImage: null,
      activities: [],
      copied: false,
      showCopyToolTip: false,
      headers: [
        {
          text: 'Min',
          value: 'min'
        },
        {
          text: 'Max',
          value: 'max'
        },
        {
          text: 'Rate',
          value: 'rate'
        },
      ],
      btcConvertedToNaira: ''
    }
  },
  computed: {
    ...mapGetters(['bitcoinRate']),
    // btcConvertedToNaira() {
    //   let output
    //   if (this.btcInput) {
    //     console.log(removeSeparatingCommas(this.btcInNaira), this.btcInput)
    //     output = this.btcInput * removeSeparatingCommas(this.btcInNaira)
    //   } else output = 0
    //   return numberWithCommas(output)
    // }
  },
  async created() {
    this.fetchingActivities = true
    this.fetchingBTCRate = true
    try {
      await this.fetchAndSaveBTCRate()
    } catch (e) {
      handleError(e, this)
      this.$displaySnackbar(e)
    }
    this.fetchingBTCRate = false
    try {
      await this.fetchAndSaveBTCActivities()
    } catch (e) {
      handleError(e, this)
      this.$displaySnackbar(e)
    }
    this.fetchingActivities = false
  },
  watch: {
    copied(copied) {
      if (copied) {
        setTimeout(() => this.copied = false, 2500)
      }
    },
    btcInput(value) {
      if (!value) {
        this.btcInNaira = '0'
        this.btcConvertedToNaira = '0'
        return
      }
      console.log(value)
      // const range = (start, end, length = (+end - +start) + 1) =>
      //     Array.from({length}, (_, i) => Number.parseFloat(start) + i)
      for (const btc of this.bitcoinRate) {
        if (value <= +btc.max && value >= +btc.min) {
          this.btcConvertedToNaira = btc.rate * value
          this.btcInNaira = btc.rate
          console.log(btc)
          this.bitcoin_rate_id = btc.id
          break
        } else {
          this.btcInNaira = '0'
          this.btcConvertedToNaira = '0'
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    saveImage(file) {
      const reader = new FileReader()
      const vueComp = this
      reader.onload = function (e) {
        vueComp.image = e.target.result
      }
      reader.readAsDataURL(file)
      this.uploadImage = file
    },
    async submit() {
      if (!this.btcInput) {
        this.$displaySnackbar('Enter the amount you wish to buy')
        return
      } else if (!this.image) {
        this.$displaySnackbar('Please, upload proof of payment.')
        return
      }
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('asset_file', this.uploadImage)
        const {data: {data: {asset}}} = await uploadToAzureViaAlaje(formData)
        await createBTCTransaction({amount: this.btcInput, image_url: asset, bitcoin_rate_id: this.bitcoin_rate_id})
        this.imageUploader = false
        this.image = ''
        this.btcInput = null
        this.setErrorOrSuccessDialog(true)
        this.setSuccess(true)
        this.setErrorOrSuccessTitle('Successfully received your order')
        this.setErrorOrSuccessMessage('We shall begin verification and notify you. Thank you.')
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.loading = false
    },
    ...mapActions(['getBitcoinRate']),
    async fetchAndSaveBTCRate() {
      // const {data: {data: {bitcoinRate: {rate}}}} = await getBitcoinRate()
      // this.btcInNaira = numberWithCommas(rate)
      await this.getBitcoinRate()
    },
    async fetchAndSaveBTCActivities() {
      const {data: {data: {transactions}}} = await getUserBTCActivities()
      this.saveBTCActivities(transactions)
    },
    saveBTCActivities(activities) {
      // this.activities = activities.map(({ bitcoin_rate_id,amount, type, created_at: time, rate: { rate }, proof, image_url }) => ({
      //   color: this.colors[Math.floor(Math.random() * this.colors.length)],
      //   amount,
      //   bitcoin_rate_id,
      //   type,
      //   action: {message: getMessage(type), amount},
      //   time,
      //   rate,
      //   proof,
      //   image_url
      // })).splice(0, 6).sort((a, b) => new Date(b.time) - new Date(a.time))
      activities = activities.splice(0, 6)
      activities = this.formatTransactions(activities, {color: true, action: true})

      this.activities = activities.sort((a, b) => new Date(b.time) - new Date(a.time))
    },
    copyAddress() {
      const wallet_address = document.querySelector('#wallet_address')
      navigator.clipboard.writeText(wallet_address.textContent)
      this.copied = true
      // this.showCopyToolTip = true
    }
  }
}
</script>

<style lang="scss" scoped>

.box {
  border: thin solid var(--v-button__border-base);
  padding: 20px;
  border-radius: 10px;
}

.btc-in-naira, .btc {
  color: var(--v-linear__purple2-base);
  height: 42px;
}

.btc {
  border-left: thin solid var(--v-button__border-base);
}

.input {
  border: thin solid var(--v-button__border-base);
  border-radius: 6px;
  width: 150px;

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=text] {
    -moz-appearance: textfield;
    outline: none;
    text-indent: 8px;
    height: 42px;
    width: 100px;
  }
}

.input-conversion {
  width: 150px;
  background: rgba(154, 159, 191, 0.25);
  height: 42px;
  border-radius: 6px;
  color: rgba(154, 159, 191, 0.75);
  font-weight: bold;
  text-align: center;
}

.instructions, .bitcoin-rate-box {
  height: 306px;
}
</style>