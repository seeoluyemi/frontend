<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        hide-default-footer
        :page="page"
        :items-per-page="7"
        mobile-breakpoint="0"
        :height="500"
        @click:row="openTransactionDetails"
    >
      <template #item.date="{item}">
        {{ formatDate(item.date) }}
      </template>
      <template #item.time="{ item }">
        {{ formatTime(item.date) }}
      </template>
      <template #item.value="{ item }">
        &#8358;{{$numberToAmount(item.value).format('0,0')}}
      </template>
      <template #item.status="{ item }">
        <transaction-status :status="item.status"/>
      </template>
      <template #item.type="{ item }">
        <span :class="['type', item.type]">{{getTransactionType(item.type)}}</span>
      </template>
    </v-data-table>
    <v-pagination
        v-model="page"
        class="my-5"
        :current-page-aria-label="page.toString()"
        :color="$vuetify.theme.themes.light.linear__purple1"
        :length="getLength"
        :total-visible="6"
        circle/>
    <transaction-details :dialog="transactionDetailsModal" @close="transactionDetailsModal = false" :transaction="transactionInView"/>
  </div>
</template>

<script>
import TransactionStatus from "@/components/users/TransactionStatus";
import dateformat from "dateformat";
import TransactionDetails from "@/components/users/History/TransactionDetails";
export default {
  name: "GiftcardHistoryTable",
  components: {TransactionDetails, TransactionStatus},
  data: () => ({
    headers: [
      {
        text: 'Giftcard',
        value: 'giftcard'
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
    ],
    page: 1,
    transactionDetailsModal: false,
    transactionInView: {
      // items: []
    }
  }),
  props: {
    items: Array,
  },
  computed: {
    formatDate() {
      return (date) => dateformat(date, 'dd/mm/yy')
    },
    formatTime: () => date => dateformat(date, 'HH:MM'),
    getLength() {
      let length = this.items.length / 7
      if (this.items.length % 7 > 0) length++
      return Math.floor(length)
    },
  },
  methods: {
    getTransactionType(type) {
      return type === 'sell' ? 'Sold' : 'Bought'
    },
    openTransactionDetails(item) {
      this.transactionDetailsModal = true
      this.transactionInView = item
    }
  }
}
</script>

<style scoped lang="scss">

.type {

  &.buy {
    color: red;
  }

  &.sell {
    color: green;
  }
}

</style>