<template>
  <div>
    <user-dashboard-top>
      <history-filter/>
    </user-dashboard-top>
    <div class="history-table px-3 px-md-10 py-8 mx-1 mx-lg-7">
      <v-card class="my-4">
        <v-card-title class="d-flex justify-space-between">
          <h5>Giftcard</h5>
          <v-btn icon @click="expandGiftcard = !expandGiftcard">
            <v-icon>mdi-chevron-{{ expandGiftcard ? "up" : "down" }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-show="expandGiftcard">
            <!--            <history-table :items="processedItems" :headers="headers"/>-->
            <giftcard-history-table :items="processedItems"/>
          </v-card-text>
        </v-expand-transition>
      </v-card>
      <v-card class="my-4">
        <v-card-title class="d-flex justify-space-between">
          <h5>Wallet</h5>
          <v-btn icon @click="expandWallet = !expandWallet">
            <v-icon>mdi-chevron-{{ expandWallet ? "up" : "down" }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-show="expandWallet">
            <!--            <history-table :items="processedItems" :headers="headers"/>-->
            <wallet-history-table :items="walletHistoryItems"/>
          </v-card-text>
        </v-expand-transition>
      </v-card>
      <v-card class="my-4">
        <v-card-title class="d-flex justify-space-between">
          <h5>Bitcoin</h5>
          <v-btn icon @click="expandBitcoin = !expandBitcoin">
            <v-icon>mdi-chevron-{{ expandBitcoin ? "up" : "down" }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-show="expandBitcoin">
            <!--            <history-table :items="processedItems" :headers="headers"/>-->
            <bitcoin-history-table :items="bitcoinHistoryItems"/>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </div>
  </div>
</template>

<script>
import UserDashboardTop from "@/components/users/UserDashboardTop";
import HistoryFilter from "@/components/users/History/HistoryFilter";
// import HistoryTable from "@/components/users/History/HistoryTable";
import {mapGetters} from "vuex";
import GiftcardHistoryTable from "@/components/users/History/GiftcardHistoryTable";
import BitcoinHistoryTable from "@/components/users/History/BitcoinHistoryTable";
import {getUserActivities, getUserBTCActivities} from "@/apis"
import handleError from "@/utils/errorHandler";
import WalletHistoryTable from "@/components/users/History/WalletHistoryTable";
import bitcoinMixin from "@/mixins/bitcoinMixin";

export default {
  name: "History",
  components: {
    WalletHistoryTable,
    BitcoinHistoryTable, GiftcardHistoryTable, HistoryFilter, UserDashboardTop
  },
  mixins: [bitcoinMixin],
  data() {
    return {
      processedItems: [],
      page: 1,
      expandGiftcard: false,
      expandBitcoin: false,
      expandWallet: false,
      bitcoinHistoryItems: [],
      walletHistoryItems: [],
      headers: [
        {
          text: 'Giftcard',
          value: 'title',
          sortable: false,
        },
        {
          text: 'Date',
          value: 'date',
          sortable: false,
        },
        {
          text: 'Value',
          value: 'value',
          sortable: false,
        }, {
          text: 'Status',
          value: 'status',
          sortable: false,
        },
        {
          text: '',
          value: 'viewMore',
          sortable: false,
        }
      ],
    }
  },
  computed: {
    ...mapGetters(['user', 'userTransactions']),
    getLength() {
      let length = this.processedItems.length / 7
      if (this.processedItems.length % 7 > 0) length++
      return Math.floor(length)
    }
  },
  watch: {
    '$route.query.filter_key': {
      handler: function (key) {
        if (key === 'all') {
          this.processedItems = this.userTransactions
          console.log(this.processedItems)
        } else {
          this.processedItems = this.userTransactions.filter(item => item.status.toLowerCase() === key)
        }
      },
      immediate: true
    }
  },
  async created() {
    try {
      let [{data: {data: {transactions}}}, {data: {data: {user_activities}}}] =
          await Promise.all([getUserBTCActivities(), getUserActivities(this.user.id, 'wallet', 100)])
      console.log(transactions, user_activities)
      user_activities = user_activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      console.log(user_activities)
      const extractActivityObject = (act, index) => {
        // console.log(act, 'activity')
        const getAmount = (act) => {
          const findAmount = arr => {
            let amount;
            arr.forEach(word => {
              word = Number(word)
              if (!isNaN(word)) amount = word
            })
            return amount
          }
          let amount;
          const words = act.activity.split(' ')
          console.log(words)
          if (act.activity.toLowerCase().includes('credit')) {
            console.log(words, "words")
            const wordIndexTwo = words[2]
            if (wordIndexTwo.toLowerCase() === 'with') {
              amount = findAmount(words)
            } else amount = wordIndexTwo.substr(4)
            if (isNaN(amount)) amount = findAmount(words)
            // if (isNaN(amount)) {
            //   // console.log(amount, 'substr is Nan')
            //   amount = words[4]
            //
            // }
            console.log(amount)
          } else {

            if (words[0].toLowerCase() === 'debited') {
              console.log({words}, "new")
              amount = words[6]
            } else {
              amount = words[4]
            }
            // if (words.map(word => word.toLowerCase()).includes("debited")) {
            //
            // }
            // console.log(act)

          }
          return this.$numberToAmount(amount).format('0,0[.]00')
        }


        const getAction = act => {
          if (act.activity.toLowerCase().includes('credit')) {
            return 'Credit'
          } else if (act.activity.toLowerCase().includes('debit')) {
            return 'Debit'
          } else {
            // console.log('nothing', act)
          }
        }


        const amount = getAmount(act)
        const action = getAction(act)
        const s_n = index + 1
        return {amount, action, s_n, date: act.created_at, time: act.created_at}
      }
      this.walletHistoryItems = user_activities
          .filter(act => !act.activity.includes('Reserved'))
          .map(extractActivityObject)
      this.bitcoinHistoryItems = this.formatTransactions(transactions)
    } catch (e) {
      handleError(e, this)
      this.$displaySnackbar(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.history-table {
  border: thin solid var(--v-button__border-base);
  border-radius: 8px;
  height: auto;
}
</style>