<template>
  <div class="wallet-recent-activities ah-overflow-y-hidden">
    <h4 class="mb-5 heading ah-text-2xl">Recent Activity</h4>
    <div class="d-flex justify-center">
      <v-progress-circular v-if="loading" indeterminate size="23" color="purple"/>
    </div>
    <div v-if="activities.length === 0 || loading" class="text-center"><h3>There are no activities yet.</h3></div>
    <v-timeline align-top dense v-else>
      <v-timeline-item small v-for="(activity, i) in activities" :key="i" :color="'white'">
        <template #icon>
          <timeline-item-icon :type="activity.color"/>
        </template>
        <div @click="[openMore(activity)]">
          <p v-if="activity.bitcoin_rate_id">{{activity.action.message}} <span class="key-detail" v-if="activity.action.amount">{{(activity.action.amount)}}</span> </p>
          <p v-else>{{activity.action.message}} <span class="key-detail" v-if="activity.action.amount && activity.transaction_id !== 'btc'">&#8358;{{$numberToAmount(activity.action.amount).format('0,0')}}</span></p>
          <small>{{$dayjs(activity.time).fromNow()}}</small>
        </div>
      </v-timeline-item>
    </v-timeline>

<!--    View more modal-->

<!--    <v-dialog v-model="dialog" max-width="450">-->
<!--      <v-card>-->
<!--        <v-card-title class="d-flex justify-space-between">-->
<!--          <h4>Transaction Details</h4>-->
<!--          <v-btn icon @click="dialog = false">-->
<!--            <v-icon>mdi-close</v-icon>-->
<!--          </v-btn>-->
<!--        </v-card-title>-->
<!--        <v-card-text>-->
<!--          <v-img :src="bitcoinTransaction.imageUrl" max-width="400"/>-->
<!--        </v-card-text>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
    <bitcoin-user-view-more :dialog="dialog" :item="bitcoinTransaction" @close="dialog = false"/>
  </div>
</template>

<script>
import TimelineItemIcon from "@/components/resuables/Icons/TimelineItemIcon";
import BitcoinUserViewMore from "@/components/users/History/BitcoinUserViewMore";
export default {
  name: "RecentActivities",
  components: {BitcoinUserViewMore, TimelineItemIcon},
  data: () => ({
    dialog: false,
    bitcoinTransaction: {id: null}
  }),
  props: {
    activities: Array,
    accountNumber: String,
    loading: Boolean,
    showMore: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    openMore (transaction) {
      if (!this.showMore) return
      this.bitcoinTransaction = transaction
      this.dialog = true
    }
  }
}
</script>

<style scoped lang="scss">

  .wallet-recent-activities {
    min-height: 400px;

    h3 {
      background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  p {
    margin-bottom: 0;
  }

  small {
    color: var(--v-button__border-base);
    font-weight: 500;
  }

  .key-detail {
    color: var(--v-linear__purple2-base);
    font-weight: 500;
  }

  .heading {
    margin-left: 25px;
  }
</style>