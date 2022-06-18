<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        :mobile-breakpoint="0"
        :page.sync="page"
        sort-by="date"
        sort-desc
        hide-default-footer
        @click:row="onRowClick"
        @page-count="pageCount = $event"
    >
      <template #item.date="{ item }">
        {{formatDate(item.date)}}
      </template>
      <template #item.time="{ item }">
        {{formatTime(item.date)}}
      </template>
      <template #item.rate="{ item }">
        &#8358;{{item.rate}}/BTC
      </template>
      <template #item.value="{ item }">
        {{item.value}}
      </template>
      <template #item.amount="{ item }">
        &#8358;{{$numberToAmount(item.amount).format('0,0[.]00')}}
      </template>
      <template #item.status="{ item }">
        <transaction-status :status="item.status"/>
      </template>
    </v-data-table>
    <v-pagination v-model="page" circle :length="pageCount"/>
    <bitcoin-user-view-more :dialog="viewMoreDialog" @close="viewMoreDialog = false" :item="bitcoinTransaction"/>
  </div>
</template>

<script>
import dateformat from "dateformat";
import TransactionStatus from "@/components/users/TransactionStatus";
import BitcoinUserViewMore from "@/components/users/History/BitcoinUserViewMore";

export default {
  name: "BitcoinHistoryTable",
  components: {BitcoinUserViewMore, TransactionStatus},
  data: () => ({
    page: 1,
    headers: [
      {
        text: 'Rate',
        value: 'rate'
      },
      {
        text: 'Value',
        value: 'value'
      },
      {
        text: 'Amount',
        value: 'amount'
      },
      {
        text: 'Status',
        value: 'status'
      },
      {
        text: 'Date',
        value: 'date'
      },
      {
        text: 'Time',
        value: 'time'
      }
    ],
    viewMoreDialog: false,
    bitcoinTransaction: {},
    pageCount: 0
  }),
  props: {
    items: Array,
  },
  computed: {
    formatDate() {
      return (date) => dateformat(date, 'dd/mm/yy')
    },
    formatTime() {
      return date => dateformat(date, 'HH:MM')
    }
  },
  methods: {
    onRowClick(item) {
      this.bitcoinTransaction = item
      this.viewMoreDialog = true
    }
  }
}
</script>

<style scoped>

</style>