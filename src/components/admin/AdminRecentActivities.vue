<template>
  <div>
    <div class="ah-flex ah-flex-col sm:ah-flex-row ah-justify-between">
      <h4 class="mb-5 ah-text-2xl">{{tableTitle}}</h4>
      <div class="ah-flex ah-flex-col sm:ah-flex-row">
<!--        <v-select label="Sort by" outlined :items="[]" dense :color="$vuetify.theme.themes.light.deep__purple" class="mr-0 mr-md-3"/>-->
        <v-text-field type="search" v-model="search" label="Search" dense outlined :color="$vuetify.theme.themes.light.deep__purple" append-icon="mdi-magnify"/>
      </div>
    </div>
    <transaction-details :dialog="transactionViewDialog" :transaction="transactionInView" @close="transactionViewDialog = false"/>
    <history-table :bitcoin-table="bitcoinTable" @click:row="[transactionInView = $event, !$route.path.includes('bitcoin') ? transactionViewDialog = true : '', $emit('click:row', $event)]" :loading="loading" @view-more="$emit('view-more', $event)" :search="search" :headers="headers" :items="items"/>
  </div>
</template>

<script>
import HistoryTable from "@/components/users/History/HistoryTable";
import TransactionDetails from "@/components/users/History/TransactionDetails";
export default {
name: "AdminRecentActivities",
  components: {TransactionDetails, HistoryTable},
  data: () => ({
    search: '',
    transactionInView: null,
    transactionViewDialog: false,
  }),
  props: {
    headers: Array,
    items: Array,
    tableTitle: String,
    loading: Boolean,
    bitcoinTable: Boolean
    // search: String
  }
}
</script>

<style scoped>

</style>