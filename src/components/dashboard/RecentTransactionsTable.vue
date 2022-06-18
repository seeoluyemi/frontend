<template>
  <div class="px-md--10 px-4 py-8">
    <div class="ah-flex mb-4 px-4 ah-justify-between ah-text-lg md:ah-text-2xl">
      <h5>Recent Transactions</h5>
      <router-link :to="{name: 'History', query: { filter_key: 'all' }}">See All</router-link>
    </div>
    <v-data-table
        :items="items"
        :headers="headers"
        :loading="loading"
        hide-default-footer
        :mobile-breakpoint="0"
    >
      <template #item.date="{item}">
        {{formatDate(item.date)}}
      </template>
      <template #item.value="{item}">
        &#8358;{{$numberToAmount(item.value).format('0,0[.]00')}}
      </template>
      <template #item.status="{ item }">
        <transaction-status :status="item.status"/>
      </template>
      <template #item.viewMore="{ item }">
        <span class="table-link">
          <router-link :to="{ name: 'RecentTransaction', query: { transaction_id: item.viewMore } }">View More</router-link>
        </span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import TransactionStatus from "@/components/users/TransactionStatus";
import dateformat from 'dateformat';

export default {
name: "RecentTransactionsTable",
  components: {TransactionStatus},
  props: {
    items: Array,
    headers: Array,
    loading: [Boolean, String]
  },
  computed: {
    formatDate() {
      return (date) => dateformat(date, 'dd/mm')
    }
  }
}
</script>

<style scoped lang="scss">
  .table-link a {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 14px;
    white-space: nowrap;
  }

  h5 {
    font-size: 1em;
    &+ a {
      background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
</style>