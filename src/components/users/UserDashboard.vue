<template>
  <div>
    <user-dashboard-top>
      <p class="ah-text-sm d-flex align-center sm:ah-text-3xl mb-0">Hi, <span class="ml-1 user-name">{{user.name}}</span></p>
    </user-dashboard-top>
    <div class="ah-flex ah-flex-wrap mb-5">
      <div v-for="(cardNav, index) in cardNavs" :key="index" class="ah-w-1/2 lg:ah-w-1/4 pa-1 pa-lg-7">
        <colorful-action-card
            :colors="cardNav.colors" :number="index + 1" :link="cardNav.link" :label="cardNav.label"
            rect/>
      </div>
    </div>
    <user-dashboard-overview/>
  </div>
</template>
<script>
import ColorfulActionCard from "@/components/ColorfulActionCard";
import {mapActions, mapGetters, mapMutations} from "vuex";
import UserDashboardOverview from "@/components/users/UserDashboardOverview";
import UserDashboardTop from "@/components/users/UserDashboardTop";
import {getUserBalance} from "@/apis";

export default {
  name: "UserDashboard",
  components: {UserDashboardTop, UserDashboardOverview, ColorfulActionCard},
  data() {
    const {light: palette} = this.$vuetify.theme.themes
    return {
      cardNavs: [
        {
          label: 'Pending Transactions',
          link: {name: 'History', query: { filter_key: 'pending' }},
          colors: [palette.card__blue1, palette.card__blue2]
        },
        {
          label: 'Successful Transactions',
          link: {name: 'History', query: { filter_key: 'successful' }},
          colors: [palette.linear__green1, palette.linear__green2]
        },
        {
          label: 'Cancelled Transactions',
          link: {name: 'History', query: { filter_key: 'cancelled' }},
          colors: [palette.linear__yellow1, palette.linear__yellow2]
        },
        {
          label: 'All transactions',
          link: {name: 'History', query: { filter_key: 'all' }},
          colors: [palette.linear__purple1, palette.linear__purple2]
        },
      ]
    }
  },
  async created() {
    const { data } = await getUserBalance(this.user.id)
    console.log(data)
    this.setWallet(data.data.wallet)
    await this.getUserTransactions(this.user.id)
    await this.fetchUser()
  },
  computed: {
    ...mapGetters(['user',]),
  },
  methods: {
    ...mapMutations(['setWallet']),
    ...mapActions(['getUserTransactions', 'fetchUser']),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.user.user_type !== 'customer' && (vm.user.user_type === 'super_admin' || vm.user.user_type === 'admin')) {
        vm.$router.push({ name: 'AdminDashboard' })
      } else next()
    })
  }
}
</script>

<style scoped lang="scss">
  p {
    margin-bottom: 0;
  }

  .greeting {
    color: var(--v-deep__purple-base);

    .user-name {
      font-weight: bold;
    }
  }
</style>