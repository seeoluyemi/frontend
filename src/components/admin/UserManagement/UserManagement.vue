<template>
  <div class="box pa-6 pa-md-10">
    <div class="ah-flex ah-flex-col sm:ah-flex-row ah-justify-between">
      <!--      <h4 class="mb-5 ah-text-2xl">All Users</h4>-->
      <dashboard-inner-content-state-indicator :links="userLinks" @change="linkChange"/>
      <div class="ah-flex ah-my-2 sm:ah-my-0 ah-flex-col sm:ah-flex-row">
        <!--        <v-select :color="$vuetify.theme.themes.light.deep__purple" :items="[]" class="mr-0 mr-md-3" dense-->
        <!--                  label="Sort by"-->
        <!--                  outlined/>-->
        <v-text-field v-model="search" :color="$vuetify.theme.themes.light.deep__purple" append-icon="mdi-magnify" dense
                      label="Search" outlined
                      type="search"/>
      </div>
    </div>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="7"
        :loading="loading"
        :mobile-breakpoint="0"
        :page="page"
        :search="search"
        height="400"
        hide-default-footer
        loading-text="Fetching users.."
        @click:row="displayUserDetails">
      <template #item.updated_at="{ item }">
        <span>{{ $dayjs(item.updated_at).fromNow() }}</span>
      </template>
      <template #item.wallet.current_balance="{ item }">
        <span>&#8358;{{ $numberToAmount(item.wallet.current_balance).format('0,0') }}</span>
      </template>
      <template #item.actions="{ item }">
        <v-btn class="ah-capitalize" color="purple" depressed text @click.stop="[creditWalletDialog(item)]">
          Credit Wallet
        </v-btn>
      </template>
    </v-data-table>
    <div class="my-2">
      <v-pagination
          v-model="page"
          :color="$vuetify.theme.themes.light.linear__purple1"
          :length="getLength"
          :total-visible="6"
          circle/>
    </div>
    <user-details :deactivating="deactivating" :dialog="openUserDetails" :reactivating="reactivating"
                  :user="user" @credit="[creditWalletDialog(user)]" @deactivate="deactivateUser"
                  @debit="[debitWalletDialog(user)]" @reactivate="reactivateUser" @close:userDetails="openUserDetails = false"/>
    <credit-or-debit-form :dialog="openTransactionDialog" :loading="transacting" :type="accountActionType" :user="user"
                          @credit="transact" @debit="transact"
                          @close:creditDialog="openTransactionDialog = false"/>
  </div>
</template>

<script>
import CreditOrDebitForm from "@/components/admin/UserManagement/CreditOrDebitForm";
import {creditUserWallet, deactivateAccount, debitUserWallet, getAllCustomers, reactivateAccount} from "@/apis";
import dateFormat from "dateformat"
import UserDetails from "@/components/admin/UserManagement/UserDetails";
import handleError from "@/utils/errorHandler";
import DashboardInnerContentStateIndicator from "@/components/resuables/DashboardInnerContentStateIndicator";

export default {
  name: "UserManagement",
  components: {DashboardInnerContentStateIndicator, UserDetails, CreditOrDebitForm,},
  data() {
    return {
      page: 1,
      loading: false,
      openUserDetails: false,
      openTransactionDialog: false,
      accountActionType: null,
      transacting: false,
      deactivating: false,
      reactivating: false,
      search: '',
      userLinks: [
        {
          to: {
            name: this.$route.name,
            params: {status: 'active'}
          },
          label: 'Active'
        },
        {
          to: {
            name: this.$route.name,
            params: {status: 'deactivated'}
          },
          label: 'Deactivated'
        }
      ],
      headers: [
        {
          text: 'Name',
          value: 'name',
          mustSort: true,
        },
        {
          text: 'Wallet Bal.',
          value: 'wallet.current_balance'
        },
        {
          text: 'Last Activity',
          value: 'updated_at'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'center'
        }
      ],
      users: [],
      user: {
        id: null,
        name: null,
        image: null,
        wallet: {
          current_balance: null,
          disburse_account: null,
        },
        email: null,
        phone_number: null,
        created_at: null
      }
    }
  },
  async created() {
    this.loading = true
    await this.fetchAllUsers()
    this.loading = false
  },
  computed: {
    getLength() {
      let length = this.items.length / 7
      if (this.items.length % 7 > 0) length++
      return Math.floor(length)
    },
    items() {
      let items = []
      const {status} = this.$route.params
      if (status === 'active') {
        items = this.users.filter(user => user.active)
      } else if (status === 'deactivated') {
        items = this.users.filter(user => !user.active)
      }
      return items
    }
  },
  methods: {
    formatDate(date) {
      return dateFormat(date, 'dd/mm/yy')
    },
    async fetchAllUsers() {
      try {
        const {data: {data: {users}}} = await getAllCustomers()
        this.users = users.filter(user => user.user_type === 'customer' && user.wallet)
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
    },
    displayUserDetails(user) {
      this.openUserDetails = true
      this.user = user
    },
    creditWalletDialog(user) {
      this.accountActionType = 'Credit'
      this.user = user
      this.openTransactionDialog = true
    },
    debitWalletDialog(user) {
      this.accountActionType = 'Debit'
      this.user = user
      this.openTransactionDialog = true
    },
    async transact(amount) {
      this.transacting = true
      try {
        console.log(this.accountActionType, this.accountActionType === 'Credit')
        if (this.accountActionType.toLowerCase() === 'credit') {
          await this.creditUserWallet(amount)
        } else if (this.accountActionType.toLowerCase() === 'debit') {
          await this.debitUserWallet(amount)
        }
        this.$root.$emit('clearCreditWalletInput')
        await this.fetchAllUsers()
        this.user = this.users.find(user => user.id === this.user.id)
        this.openTransactionDialog = false
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.transacting = false
    },
    async creditUserWallet(amount) {
      await creditUserWallet(this.user.id, {amount})
    },
    async debitUserWallet(amount) {
      await debitUserWallet(this.user.id, {amount})
    },
    async deactivateUser() {
      this.deactivating = true
      try {
        const {data} = await deactivateAccount(this.user.id)
        console.log(data)
        this.$snackbar.displaySnackbar({message: 'You have successfully deactivated this account.', success: true})
        this.openUserDetails = false
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.deactivating = false
    },
    async reactivateUser() {
      this.reactivating = true
      try {
        const {data} = await reactivateAccount(this.user.id)
        console.log(data)
        this.$snackbar.displaySnackbar({message: 'You have successfully activated this account.', success: true})
        this.openUserDetails = false
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.reactivating = false
    },
    linkChange(status) {
      this.$router.push({
        name: this.$route.name,
        params: {status}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  text-transform: capitalize;
}
</style>