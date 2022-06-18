<template>
  <div class="px-1 px-lg-7">
    <bitcoin-rate
        :bitcoin-rate="$numberToAmount(bitcoinRate).format('0,0')"
        @add-bitcoin-rate="[openRateDialog = true, editableBitcoinRate = {id: null, min: '', max: '', rate: ''}]"
        @attemptToEdit="[openRateDialog = true, editableBitcoinRate = $event]"/>
    <div class="box pa-4 pa-md-8">
      <admin-recent-activities :headers="headers" :items="items" :loading="fetchingTransactions"
                               bitcoin-table table-title="Bitcoin Transactions" @view-more="openViewMore"
                               @click:row="openDialog"/>
    </div>
    <v-dialog v-model="openRateDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <h4>{{!!editableBitcoinRate.id ? 'Edit' : 'Add'}} Bitcoin Rate</h4>
          <v-btn icon @click="openRateDialog = false">
            <VIcon>
              mdi-close
            </VIcon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="6">
              <v-text-field :disabled="!!editableBitcoinRate.id" v-model="editableBitcoinRate.min" label="Min" outlined placeholder="Min"
                            type="number"/>
            </v-col>
            <v-col cols="6">
              <v-text-field :disabled="!!editableBitcoinRate.id" v-model="editableBitcoinRate.max" label="Max" outlined placeholder="Max"
                            type="number"/>
            </v-col>
          </v-row>
          <v-text-field v-model="editableBitcoinRate.rate" label="Bitcoin Rate" outlined placeholder="Bitcoin Rate"
                        type="number"/>
          <div class="d-flex justify-center">
            <v-btn class="text-capitalize" :color="$vuetify.theme.themes.light.linear__purple1" :loading="loading" large outlined
                   @click="editBitcoinRate">
              {{!!editableBitcoinRate.id ? 'Edit' : 'Add'}} Rate
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <bitcoin-transaction-details
        :dialog="bitcoinDialog"
        :item="bitcoin"
        @close="bitcoinDialog = false"
        @determined="[getAllTransactions(true)]"
        @viewImg="openBitcoinImgDialog"
    />
    <bitcoin-view-more :dialog="viewMoreDialog" :item="bitcoin" @close="viewMoreDialog = false"
                       @viewImg="openBitcoinImgDialog"/>
    <bitcoin-image-view :dialog="bitcoinImgDialog" :image="bitcoin.image_url" @close="bitcoinImgDialog = false"/>
  </div>
</template>

<script>
import BitcoinRate from "@/components/admin/BitcoinManagement/BitcoinRate";
import AdminRecentActivities from "@/components/admin/AdminRecentActivities";
import {mapActions, mapGetters, mapMutations} from "vuex";
import handleError from "@/utils/errorHandler";
import {createBTCRate, getAllBTCTransactions} from "@/apis";
import BitcoinTransactionDetails from "@/components/admin/BitcoinManagement/BitcoinTransactionDetails";
import BitcoinViewMore from "@/components/admin/BitcoinManagement/BitcoinViewMore";
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";

export default {
  name: "BitcoinManagement",
  components: {BitcoinImageView, BitcoinViewMore, BitcoinTransactionDetails, AdminRecentActivities, BitcoinRate},
  data() {
    return {
      openRateDialog: false,
      bitcoin: {
        id: null,
      },
      fetchingTransactions: false,
      bitcoinDialog: false,
      viewMoreDialog: false,
      bitcoinImgDialog: false,
      bitcoinRateInput: '',
      loading: false,
      items: [],
      headers: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: 'BTC',
          value: "btc"
        },
        {
          text: "Amount",
          value: "amount"
        },
        {
          text: 'Rate',
          value: 'rate'
        },
        {
          text: "Status",
          value: "status"
        },
        {
          text: "Date",
          value: "date"
        },
        {
          text: "Time",
          value: "time"
        },
        {
          text: "Actions",
          value: "viewMore"
        }
      ],
      bitcoinRateMin: '',
      bitcoinRateMax: '',
      editableBitcoinRate: {
        id: null,
        min: '',
        max: '',
        rate: ''
      }
    }
  },
  computed: {
    ...mapGetters(["bitcoinRate"])
  },
  methods: {
    ...mapActions(['getBitcoinRate']),
    ...mapMutations(['SET_BITCOIN_RATE']),
    openDialog(bitcoin) {
      this.bitcoin = bitcoin
      this.bitcoinDialog = true
    },
    async editBitcoinRate() {
      const {min, max, rate} = this.editableBitcoinRate
      if (max < min) {
        this.$displaySnackbar("The minimum value is greater than the maximum")
        return
      }
      if (!+max || !+max) {
        this.$displaySnackbar("Please enter a valid range")
        return
      }
      if (+rate < 1) {
        this.$displaySnackbar('Bitcoin rate must not be less than 1.')
        this.editableBitcoinRate.rate = ''
        return
      }
      try {
        this.loading = true
        const {data: {data: {bitcoinRate}}} = await createBTCRate({rate, min, max})
        await this.getBitcoinRate()
        this.editableBitcoinRate.rate = ''
        this.openRateDialog = false
        console.log(bitcoinRate)
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      } finally {
        this.loading = false
      }
    },
    async getAllTransactions(silent = false) {
      if (!silent) {
        this.fetchingTransactions = true
      }
      const getBTC = amount => {
        let format = '0,0[.]0'
        if (amount.toString().includes('.')) {
          const decimalPlace = amount.toString().split('.')[1].length
          for (let i = 1; i < decimalPlace; i++) format += '0'
        }
        return this.$numberToAmount(amount).format(format)
      }
      try {
        const {data: {data: {bitcoin}}} = await getAllBTCTransactions()
        const self = this
        this.items = bitcoin.map(bitcoin => ({
          amount: (function() {
            return self.$numberToAmount(bitcoin.rate.rate).format('0,0[.]00')
          })(),
          btc: getBTC(bitcoin.amount),
          name: bitcoin.user.name,
          status: bitcoin.progress,
          date: bitcoin.created_at,
          rate: bitcoin.rate.rate,
          image_url: bitcoin.image_url,
          proof_url: bitcoin.proof?.img,
          id: bitcoin.id,
          time: function () {
            const date = new Date(bitcoin.created_at)
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
          }()
        })).sort((a, b) => new Date(b.date) - new Date(a.date))
      } catch (e) {
        this.$displaySnackbar(e)
      }
      this.fetchingTransactions = false
    },
    openViewMore(bitcoin) {
      this.bitcoin = bitcoin
      this.viewMoreDialog = true
    },
    openBitcoinImgDialog() {
      this.bitcoinImgDialog = true
    }
  },
  async created() {
    try {
      const bitcoinRate = this.getBitcoinRate()
      const btcTransactions = this.getAllTransactions()
      await Promise.all([bitcoinRate, btcTransactions])
    } catch (e) {
      console.error(e, e.response)
      handleError(e, this)
      this.$displaySnackbar(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  border: thin solid var(--v-button__border-base);
  border-radius: 6px;
}
</style>