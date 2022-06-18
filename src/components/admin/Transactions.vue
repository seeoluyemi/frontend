<template>
  <div class="box pa-6 pa-md-10">
    <admin-recent-activities :headers="headers" :items="adminAllTransactions" table-title="Recent Transactions"/>
  </div>
</template>

<script>
import AdminRecentActivities from "@/components/admin/AdminRecentActivities";
import {mapGetters, mapMutations} from "vuex";
import {adminAllTransactions} from "@/apis";

export default {
  name: "Transactions",
  components: {AdminRecentActivities},
  data: () => ({
    headers: [
      {
        text: 'Ref',
        value: 'ref'
      },
      {
        text: 'Giftcard',
        value: 'giftcard',
      },
      {
        text: 'Date',
        value: 'date'
      },
      {
        text: 'Time',
        value: 'time'
      },
      {
        text: 'User',
        value: 'user'
      },
      {
        text: 'Amount',
        value: 'value'
      },
      // {
      //   text: 'Status',
      //   value: 'status'
      // },
      {
        text: 'Type',
        value: 'type'
      },
      {
        text: 'Qty (Card)',
        value: 'totalCount'
      }
    ]
  }),
  computed: {
    ...mapGetters(['adminAllTransactions'])
  },
  async created() {
    const { data: { data: { transaction: transactions } } } = await adminAllTransactions()
    console.log(transactions)
    this.ADMIN_SET_USER_TRANSACTIONS(transactions)
  },
  methods: {
    ...mapMutations(['ADMIN_SET_USER_TRANSACTIONS'])
  }
}
</script>

<style lang="scss" scoped>

</style>