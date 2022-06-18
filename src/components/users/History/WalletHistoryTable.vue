<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        :mobile-breakpoint="0"
        :page.sync="page"
        hide-default-footer
        @page-count="pageCount = $event"
    >
      <template #item.date="{ item }">
        {{formatDate(item.date)}}
      </template>
      <template #item.time="{ item }">
        {{formatTime(item.date)}}
      </template>
      <template #item.amount="{ item }">
        &#8358;{{item.amount}}
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount" circle/>
  </div>
</template>

<script>
import * as dateformat from "dateformat";

export default {
  name: "WalletHistoryTable",
  data: () => ({
    pageCount: 0,
    page: 1,
    headers: [
      {
        text: 'S/N',
        value: 's_n'
      },
      {
        text: 'Amount',
        value: 'amount'
      },
      {
        text: 'Action',
        value: 'action'
      },
      {
        text: 'Date',
        value: 'date'
      },
      {
        text: 'Time',
        value: 'time'
      }
    ]
  }),
  props: {
    items: Array
  },
  computed: {
    formatDate() {
      return (date) => dateformat(date, 'dd/mm/yy')
    },
    formatTime: () => date => dateformat(date, 'HH:MM')
  },
}
</script>

<style scoped>

</style>