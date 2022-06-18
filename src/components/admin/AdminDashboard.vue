<template>
  <div class="px-1 px-lg-7">
    <div>
      <p class="font-weight-bold">Hi, <span>{{ user.name }}</span></p>
    </div>
    <v-row>
      <v-col v-for="(graphDatum, i) in graphData" :key="i" cols="12" lg="3" md="4" sm="6">
        <div class="graph-data mx-auto ah-flex ah-flex-col ah-justify-between pa-3">
          <h3 class="ah-font-bold">{{ graphDatum.name }}</h3>
          <div class="ah-flex ah-justify-between ah-items-end">
            <div>
              <simple-icon :type="graphDatum.growth"/>
              <div><p class="mb-0 ah-font-bold ah-text-xl">{{ graphDatum.growthRate }}</p></div>
            </div>
            <div :class="`ah-h-24 ${graphDatum.type === 'customLine' ? 'ah-flex ah-items-end ah-w-32' : 'ah-w-24'}`">
              <dashboard-overview-chart v-if="graphDatum.type !== 'customLine'" :chart-data="graphDatum.data"
                                        :options="graphDatum.options" :type="graphDatum.type"/>
              <linear-chart v-else :color="graphDatum.data.color" :progress="graphDatum.data.level"/>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <div class="box pa-4 pa-md-10 my-10">
      <admin-recent-activities :headers="headers" :items="items" table-title="Recent Purchases"/>
    </div>
    <div class="box pa-10">
      <div class="ah-flex ah-justify-between">
        <h4 class="ah-font-bold ah-text-2xl">Revenue</h4>
      </div>
      <div class="revenue mx-auto ah-relative">
        <bar-chart :chart-data="revenueData" :options="revenueOptions"/>
      </div>
    </div>
    <v-row class="my-5">
      <v-col cols="12" md="6">
        <div class="box pa-6">
          <h3 class="ah-font-bold ah-text-2xl">Top Selling Giftcards</h3>
          <div class="ah-flex ah-items-center ah-flex-col sm:ah-flex-row">
            <div class="pa-4 doughnut-chart">
              <doughnut-chart :chart-data="giftCardsData" :options="{ ...giftCardsOptions }"/>
            </div>
            <div id="doughnutLegend" class="py-4 pl-0 pl-md-8">
              <ul>
                <li v-for="(label, i) in giftCardsData.labels" :key="i" class="ah-flex ah-items-center my-8">
                  <simple-icon :type="`${label.toLowerCase()}-legend`" class="mr-4"/>
                  <span>{{ label }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="box pa-6">
          <h3 class="ah-font-bold ah-text-2xl">Top Customers</h3>
          <div v-for="(topCustomer, i) in topCustomers" :key="i" class="my-9">
            <div class="ah-flex ah-items-center ah-justify-between my-2">
              <span>{{ topCustomer.name }}</span>
              <span :style="{ color: topCustomer.color, fontWeight: 'bold' }">{{ topCustomer.level }}</span>
            </div>
            <linear-chart :color="topCustomer.color" :progress="topCustomer.level"/>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="updatePassword" max-width="400" overlay-color="rgba(0, 0, 0, .6)" persistent>
      <v-card>
        <v-card-title class="d-flex mb-4 justify-space-between">
          <h4>Update Password</h4>
          <VBtn icon @click="updatePassword = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </v-card-title>
        <v-card-subtitle>
          <p class="error--text mb-0">We recommend that you change your password to what you can easily remember or
            keep the current one safe.</p>
        </v-card-subtitle>
        <v-card-text>
          <v-form>
            <v-text-field v-model="new_password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show ? 'text' : 'password'" class="mb-3" hide-details
                          label="New Password" outlined @click:append="show = !show"/>
            <v-text-field v-model="new_password_confirmation" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show ? 'text' : 'password'" class="my-3" hide-details
                          label="Confirm Password" outlined @click:append="show = !show"/>
            <v-card-actions class="d-flex justify-center">
              <VBtn :loading="updatingPassword" :color="$vuetify.theme.themes.light.linear__purple1" depressed @click="updateAdminPassword">Update
                Password
              </VBtn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SimpleIcon from "@/components/resuables/SimpleIcon";
import DashboardOverviewChart from "@/components/admin/DashboardOverviewChart";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import LinearChart from "@/components/charts/LinearChart";
import AdminRecentActivities from "@/components/admin/AdminRecentActivities";
import {fetchAdminPermissions, updatePassword as sendPasswordUpdate} from "@/apis";

export default {
  name: "AdminDashboard",
  components: {
    AdminRecentActivities, LinearChart, DoughnutChart, BarChart, DashboardOverviewChart, SimpleIcon
  },
  data() {
    return {
      updatePassword: false,
      updatingPassword: false,
      show: false,
      new_password: '',
      new_password_confirmation: '',
      graphData: [
        {
          name: 'Trades',
          growth: 'increase',
          growthRate: '1.3%',
          data: {
            labels: ['bitcoin', 'ethereum', 'xpr', 'usd'],
            datasets: [
              {
                label: 'Trades',
                data: [24, 22, 23, 25],
                backgroundColor: this.$vuetify.theme.themes.light.linear__purple2,
              },
            ]
          },
          options: {},
          type: 'bar'
        },
        {
          name: 'Earnings',
          growth: 'decrease',
          growthRate: '2.5%',
          data: {
            labels: ['bibendum', 'tribendum', 'duobendum', 'aidebon', 'triumphant', 'travels'],
            datasets: [
              {
                label: 'Earnings',
                data: [5, 4, 6, 5, 4, 1],
                backgroundColor: '#00FF87'
              }
            ]
          },
          options: {},
          type: 'line'
        },
        {
          name: 'Customers',
          growth: 'decrease',
          growthRate: '0.3%',
          data: {
            color: 'linear-gradient(95.36deg, #F4A136 1.64%, #FCD000 100%)',
            level: '67%'
          },
          type: 'customLine'
        },
        {
          name: 'Growth',
          growth: 'increase',
          growthRate: '13%',
          data: {
            color: 'linear-gradient(95.36deg, #01CBFF 1.64%, #0193FF 100%)',
            level: '89%',
          },
          type: 'customLine'
        }
      ],
      revenueOptions: {
        responsive: true,
        maintainAspectRatio: false,
        gridLines: {
          offsetGridLines: true,
        },
      },
      revenueData: {
        labels: ['2010', '2011', '2012', '2013', '2014', '2015'],
        datasets: [
          {
            label: 'Earnings',
            data: [5, 4, 6, 5, 4, 1],
            backgroundColor: this.$vuetify.theme.themes.light.linear__purple1,
            maxBarLength: 1,
            barThickness: 6,
          }
        ],
      },
      giftCardsData: {
        labels: ['Adidas', 'Amazon', 'Ebay', 'Itunes'],
        datasets: [
          {
            label: 'Earnings',
            data: [56734567, 42345644, 65533556, 55566755],
            backgroundColor: [
              this.$vuetify.theme.themes.light.linear__purple1,
              // this.$vuetify.theme.themes.light.linear__blue,
              this.$vuetify.theme.themes.light.linear__green1,
              this.$vuetify.theme.themes.light.linear__yellow1,
              // this.$vuetify.theme.themes.light.deep__purple,
              this.$vuetify.theme.themes.light.card__blue1,
            ],
          }
        ],
      },
      giftCardsOptions: {
        legend: {
          display: false,
          position: 'right',
          labels: {
            padding: 40,
            fontSize: 20,
          }
        },
        responsive: true,
        maintainAspectRatio: true
      },
      defaultOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      },
      topCustomers: [
        {
          name: 'Ifeoluwa Akanmu',
          level: '72%',
          color: this.$vuetify.theme.themes.light.linear__purple2
        },
        {
          name: 'Ademola Kehinde',
          level: '14%',
          color: this.$vuetify.theme.themes.light.linear__purple1
        },
        {
          name: 'Mosope Coker',
          level: '69%',
          color: this.$vuetify.theme.themes.light.linear__yellow1
        },
        {
          name: 'David Ukauwa',
          level: '34%',
          color: this.$vuetify.theme.themes.light.card__blue2
        }
      ]
    }
  },
  async created() {
    if (localStorage.getItem('first_login') === 'true') {
      this.updatePassword = true
    }
    let {data: {data: {permissions}}} = await fetchAdminPermissions(this.user.id)
    permissions = permissions.map(({permission: {name}}) => name)
    localStorage.setItem('permissions', JSON.stringify(permissions))
  },
  computed: {
    ...mapGetters(['user', 'headers', 'items'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if ((vm.user.user_type !== 'super_admin' || vm.user.user_type !== 'admin') && vm.user.user_type === 'customer') {
        vm.$router.push({name: 'UserDashboard'})
      } else next()
    })
  },
  methods: {
    async updateAdminPassword() {
      const {user: {id}, new_password, new_password_confirmation} = this
      if (!new_password || !new_password_confirmation) {
        this.$displaySnackbar("Fields cannot be empty")
        return
      }
      if (new_password !== new_password_confirmation) {
        this.$displaySnackbar("Passwords do not match")
        return
      }
      this.updatingPassword = true
      try {
        const {data} = await sendPasswordUpdate(id, {new_password_confirmation, new_password})
        console.log(data)
      } catch (e) {
        this.$displaySnackbar(e)
      }
      this.updatingPassword = false
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/mixins';

.graph-data {
  width: 230px;
  height: 150px;
  border-radius: 6px;
  border: thin solid var(--v-button__border-base);
}

.box {
  border-radius: 10px;
  border: thin solid var(--v-button__border-base);
  //padding: 20px;
}


//legend styling
.doughnut-chart {
  width: 200px;
  height: 200px;

  @include mixins.sm {
    //width: 300px;
    //height: 300px;
  }
}

.revenue {
  width: 50%;
  height: auto;
}

.v-btn {
  color: white;
  text-transform: capitalize;
}
</style>