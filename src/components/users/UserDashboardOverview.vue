<template>
  <div class="ah-flex pa-1 pa-lg-7 dashboard-overview">
    <div class="recent-transactions ah-flex-1">
      <!--      <custom-table :headers="headers" :items="items"/>-->
      <recent-transactions-table :headers="headers" :items="recentTransactions"/>
    </div>
    <div class="ah-flex-1">
      <div class="gift__card-and-progress ah-flex ah-flex-col ah-justify-between">
        <div class="overview-img">
          <v-img :src="require('../../assets/images/dashboard__gift__card.png')"/>
        </div>
        <div class="registration-progress">
          <h5>Complete Your Registration</h5>
          <div class="ah-flex ah-items-center ah-justify-between">
            <ul>
              <li v-for="(step, index) in steps" :key="index" class="ah-flex ah-items-center my-6">
                <simple-icon v-if="step.completed" class="mr-3" type="step-check"/>
                <div class="step-uncompleted mr-3" v-else/>
                <small>{{step.label}}</small>
              </li>
            </ul>
            <div>
              <v-progress-circular rotate="-90" :size="$vuetify.breakpoint.smAndDown ? 120 : 180" :value="progress" width="10" :color="$vuetify.theme.themes.light.linear__green1">
                <span class="progress-value ah-text-4xl ah-font-bold">{{progress}}%</span>
              </v-progress-circular>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import SimpleIcon from "@/components/resuables/SimpleIcon";
import {getUserProgress} from "@/apis";
import {mapGetters} from "vuex";
import handleError from "@/utils/errorHandler";

export default {
  name: "UserDashboardOverview",
  components: {SimpleIcon, RecentTransactionsTable},
  data() {
    return {
      progress: 0,
      steps: [
        {
          id: 1,
          label: 'Verify your Email Address',
          completed: null,
          key: 'verify_email_address'
        },
        {
          id: 2,
          label: 'Add your Bank Account',
          completed: null,
          key: 'bank_details_exists'
        },
        // {
        //   id: 3,
        //   label: 'Add your BVN',
        //   completed: null,
        //   key: 'bvn_exists'
        // },
        {
          id: 4,
          label: 'Enabled 2-Factor Auth.',
          completed: null,
          key: 'multifactor_generated'
        }
      ],
      headers: [
        {
          text: 'Giftcard',
          value: 'giftcard',
          sortable: false,
        },
        {
          text: 'Date',
          value: 'date',
          sortable: false,
        },
        {
          text: 'Value',
          value: 'value',
          sortable: false,
        },
        // {
        //   text: 'Status',
        //   value: 'status',
        //   sortable: false,
        // },
        // {
        //   text: '',
        //   value: 'viewMore',
        //   sortable: false,
        // }
      ],
    }
  },
  computed: {
    ...mapGetters(['user', 'recentTransactions'])
  },
  async created() {
    try {
      const { data: { data: { user_steps } } } = this.user.user_type === 'customer' && await getUserProgress(this.user.id)
      this.progress = user_steps.average_value
      for (const [k, v] of Object.entries(user_steps)) {
        if (k !== 'bvn_exists') {
          const step = this.steps.find(step => step.key === k)
          step.completed = v
        }
      }
    }catch (e) {
      handleError(e, this)
    }
  }
}
</script>

<style scoped lang="scss">
@use "../../assets/styles/mixins";

.dashboard-overview {
  flex-direction: column;

  @include mixins.customable(1300) {
    flex-direction: row;
  }
}

.recent-transactions {
  border: 1px solid #E6E7EF;
  border-radius: 15px;
  width: 100%;

  @include mixins.customable(1300) {
    width: 45%;
  }
}

.overview-img {
  display: none;
  
  @include mixins.customable(1300) {
    display: block;
  }
}

.gift__card-and-progress {
  width: 100%;
  margin-left: auto;
  height: 100%;
  margin-top: 20px;

  @include mixins.customable(1300) {
    width: 95%;
    margin-top: 0;
  }

  h5 {
    font-size: 2.3em;
  }

  li {
    font-size: 1em;
    font-weight: 500;
  }
}

.registration-progress {
  border: 1px solid #E6E7EF;
  border-radius: 10px;
  padding: 15px 20px;
}

.step-uncompleted {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: inline-block;
}
</style>