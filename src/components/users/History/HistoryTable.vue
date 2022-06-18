<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        hide-default-footer
        height="400"
        :loading="loading"
        :search="search"
        :mobile-breakpoint="0"
        @click:row="onClickRow"
        :items-per-page="7"
        :page="page"
    >
      <!--    <template #header.selected @click="console.log('yeah')">-->
      <!--      <simple-icon type="checked-box"/>-->
      <!--    </template>-->
      <template #item.date="{item}">
        {{ formatDate(item.date) }}
      </template>
      <template #item.time="{item}">
        {{ formatTime(item.date) }}
      </template>
      <template #item.value="{ item }">
        &#8358;{{$numberToAmount(item.value).format('0,0')}}
      </template>
      <template #item.selected="{ item }">
        <simple-icon :type="item.selected ? 'checked-box' : 'unchecked-box'"/>
      </template>
      <template #item.status="{ item }">
        <transaction-status :status="item.status"/>
      </template>
      <template #item.amount="{ item }">
        <span>&#8358;{{item.amount}}</span>
      </template>
      <template #item.rate="{ item }">
        <span>&#8358;{{$numberToAmount(item.rate).format('0,0')}} per BC</span>
      </template>
      <template #item.viewMore="{item}">
        <td @click.stop="onViewMore(item)">
          <v-btn text small v-if="bitcoinTable" style="text-transform: capitalize;" color="purple">View more</v-btn>
          <transaction-details-dialog v-else/>
        </td>
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
  </div>
</template>

<script>
import TransactionStatus from "@/components/users/TransactionStatus";
import SimpleIcon from "@/components/resuables/SimpleIcon";
import TransactionDetailsDialog from "@/components/users/History/TransactionDetailsDialog";
import dateformat from 'dateformat'

export default {
  name: "HistoryTable",
  components: {SimpleIcon, TransactionStatus, TransactionDetailsDialog},
  data() {
    return {
      selected: [],
      page: 1
    }
  },
  methods: {
    onClickRow(item) {
      this.$emit('click:row', item)
    },
    onViewMore(item) {
      this.$emit('view-more', item)
    }
  },
  props: {
    items: Array,
    headers: Array,
    bitcoinTable: Boolean,
    search: String,
    loading: Boolean
  },
  computed: {
    formatDate() {
      return (date) => dateformat(date, 'dd/mm/yy')
    },
    formatTime() {
      return (date) => dateformat(date, 'HH:MM')
    },
    getLength() {
      let length = this.items.length / 7
      if (this.items.length % 7 > 0) length++
      return Math.floor(length)
    },
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
</style>