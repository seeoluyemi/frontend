<template>
  <div>
    <user-dashboard-top :show-balance="false">
      <div>
        <h2 :class="{'ah-text-sm': wallet.disburse_account === null, 'ah-text-lg': wallet.disburse_account !== null}">Account Number: <span class="balance">{{accountNumber}}</span></h2>
      </div>
    </user-dashboard-top>
    <v-row class="px-1 px-lg-7">
      <v-col cols="12" md="6">
        <div class="wallet-balance box ah-flex ah-flex-col ah-justify-between">
          <div class="ah-flex ah-flex-wrap ah-items-normal sm:ah-items-center ah-flex-col sm:ah-flex-row sm:ah-justify-between">
            <div>
              <h5>Wallet Balance</h5>
              <p class="ah-font-bold ah-text-3xl sm:ah-text-4xl balance">&#8358;{{getBalance}}.00</p>
            </div>
            <base-button :disabled="wallet.disburse_account !== null" :loading="generating" @click="generateAccount" outlined :color="$vuetify.theme.themes.light.linear__purple1">
              Generate
            </base-button>
          </div>
          <div class="ah-flex ah-justify-end">
            <div class="buttons d-flex ah-w-full sm:ah-w-auto ah-justify-between sm:ah-justify-end">
              <base-button @click="creditDialog = true" outlined class="mb-3 mb-lg-0 mr-3" :color="$vuetify.theme.themes.light.linear__purple1">
                Fund Wallet
              </base-button>
              <base-button @click="withdrawDialog = true" outlined :color="$vuetify.theme.themes.light.linear__purple1">
                Withdraw
              </base-button>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="box pt-5 px-5">
          <recent-activities :activities="activities" :show-more="false" :loading="loading" :account-number="getWallet.disburse_account"/>
        </div>
      </v-col>
    </v-row>
    <withdraw-form @close="withdrawDialog = false" :dialog="withdrawDialog"/>
    <credit-form @close="creditDialog = false" :dialog="creditDialog"/>
    <v-dialog v-model="accountNumberDialog" max-width="400">
      <v-card class="py-6">
        <v-card-text class="d-flex flex-column justify-center align-center">
          <div class="img">
            <v-img :src="require('../../../assets/images/confetti.svg')"/>
          </div>
          <h3 class="my-4 text-center">Congratulations! You have successfully generated a virtual account that works exactly like conventional bank account number.</h3>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserDashboardTop from "@/components/users/UserDashboardTop";
import {mapGetters, mapActions, mapMutations} from "vuex";
import BaseButton from "@/components/resuables/BaseButton";
import RecentActivities from "@/components/users/Wallet/RecentActivities";
import WithdrawForm from "@/components/users/Wallet/WithdrawForm";
import CreditForm from "@/components/users/Wallet/creditForm";
import {generateVirtualAccount, getUserActivities} from "@/apis";
import handleError from "@/utils/errorHandler";
const  numeral = require('numeral');
export default {
name: "Wallet",
  components: {WithdrawForm, RecentActivities, BaseButton, UserDashboardTop, CreditForm},
  data() {
    return {
      withdrawDialog: false,
      creditDialog: false,
      accountNumberDialog: false,
      generating: false,
      loading: false,
      colors: ['purple', 'blue', 'green', 'yellow'],
      activities: []
    }
  },
  computed: {
    ...mapGetters(['wallet','user', 'balance']),
      getBalance(){
        return numeral(this.balance).format('0,0');
      },
    accountNumber() {
      if (this.wallet.disburse_account) {
        return this.wallet.disburse_account
      } else return 'Click on generate button to generate a virtual account.'
    }
  },
  methods:{
    ...mapActions(["getWallet"]),
    ...mapMutations(["setWallet"]),
    async generateAccount() {
      try {
        this.generating = true
        const { data } = generateVirtualAccount(this.user.id)
        this.setWallet(data.data.wallet)
      } catch (e) {
        console.log(e)
        handleError(e, this)
      }
      this.generating = false
    },
    getTimeElapsed(date) {
      return this.$dayjs(date).fromNow()
    },
    getActivityTYpe(activity) {
      let type;
      const words = activity.split(' ')
      if (words[0] === 'credited' || words[0].toLowerCase() === 'wallet') {
        type = 'credit'
      } else if (words[0].toLowerCase() === 'reserved') {
        type = 'reserved'
      } else {
        type = 'sales'
      }
      return type
    },
    getAmount(act) {
      let amount;
      const words = act.split(' ')
      if (words[0] === 'credited') {
        amount = words[2].substr(4)
      } else if (words[0].toLowerCase() === 'wallet') {
        console.log(words)
        amount = words[4]
      }
      return numeral(amount).format('0,0')
    },
    getActivityAction(act) {
      const debitRegex = /Debited/
      const creditRegex = /Credited/
      const getAmount = act => {
        let amount
        let activity_split = act.split(" ")
        console.log(activity_split)
        activity_split = activity_split.filter(act => act !== "")
        for (let i = 0; i < activity_split.length; i++) {
          if (!isNaN(+activity_split[i])) {
            amount = activity_split[i]
            break
          }
        }
        console.log(amount)
        return amount
      }
      if (debitRegex.test(act)){
        const message = 'Debited wallet with amount'
        const amount = getAmount(act)
        return {message, amount}
      } else if (creditRegex.test(act)) {
        const message = 'Credited wallet with amount'
        const amount = getAmount(act)
        return {message, amount}
      } else if (/Account/.test(act)) {
        const message = 'Reserved virtual account'
        const amount = undefined
        return {message, amount}
      } else if (/credited/.test(act)) {
        const message = 'Credited wallet with amount'
        const amount = getAmount(act)
        return {message, amount}
      }
    }
  },


// this updates wallet amount every x seconds
  async created(){
    setInterval(async () => {
        await this.getWallet({
            userId : this.user.id
        })
    },600000)
  },
  async mounted(){
  this.loading = true
    try {
        await this.getWallet({
            userId : this.user.id
        })


      const { data: {data: { user_activities }} } = await getUserActivities(this.user.id, 'wallet', 10)
      console.log(user_activities)
      this.activities = user_activities.filter(act => act.activity_type === 'wallet').map(act => {
        return {
          type: this.getActivityTYpe(act.activity),
          amount: this.getAmount(act.activity),
          time: act.created_at,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          action: this.getActivityAction(act.activity)
        }
      }).splice(0, 6).sort((a, b) => new Date(b) - new Date(a))

    } catch (e) {
      handleError(e, this)
      console.log(e)
      this.$displaySnackbar(e)
    }
    this.loading = false
  },
}
</script>

<style scoped lang="scss">
  .box {
    border-radius: 8px;
    border: thin solid var(--v-button__border-base);
  }

  .wallet-balance {
    height: 280px;
    padding: 20px;

  }

  .img {
    width: 150px;
    height: 150px;
  }

  .balance {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>