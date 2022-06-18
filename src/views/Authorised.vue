<template>
  <div class="dashboard-base">
    <the-dashboard-header @toggle="drawer = !drawer"/>
    <v-main class="pa-0">
      <div class="ah-flex dashboard-wrapper">
        <dashboard-side-nav :open="drawer" v-if="!isSmallScreen" :mobile="isSmallScreen" :navs="sideNavList"/>
        <div class="curved-bg" :style="curvedBGStyles" id="dashboard-bg">
          <div class="px-md-10 py-md-6 py-3">
            <router-view/>
            <Footer block targetId="dashboard-bg" v-if="$route.path.split('/').includes('dashboard')"/>
          </div>
        </div>
      </div>
    </v-main>

    <mobile-side-nav :navs="sideNavList" :slide-in="drawer && isSmallScreen"/>
    <back-drop :blur="true" z-index="1" @click="drawer = false" v-if="drawer && isSmallScreen"/>
  </div>
</template>

<script>
import DashboardSideNav from "@/components/dashboard/DashboardSideNav";
import {mapGetters} from "vuex";
import Footer from "@/components/resuables/Footer";
import TheDashboardHeader from "@/components/dashboard/TheDashboardHeader";
import BackDrop from "@/components/resuables/BackDrop";
import MobileSideNav from "@/components/dashboard/MobileSideNav";

export default {
  name: "Authorised",
  components: {MobileSideNav, BackDrop, TheDashboardHeader, Footer, DashboardSideNav},
  data() {
    return {
      drawer: false,
      isSmallScreen: false,
      userSideNavList: [
        {
          name: 'Dashboard',
          route: {name: 'UserDashboard'},
          icon: 'dashboard'
        },
        {
          name: 'Trade',
          route: {name: 'Trade'},
          icon: 'trade'
        },
        {
          name: 'BC',
          route: {name: 'Bitcoin'},
          icon: 'bitcoin'
        },
        {
          name: 'History',
          route: {name: 'History', query: {filter_key: 'all'}},
          icon: 'history'
        },
        {
          name: 'Rates',
          route: {name: 'Rates', query: {key: 'buy'}},
          icon: 'rates'
        },
        {
          name: 'Wallet',
          route: {name: 'Wallet'},
          icon: 'wallet'
        },
        {
          name: 'Settings',
          route: {name: 'Settings', params: {settingsState: 'profile'}},
          icon: 'settings'
        }
      ],
      adminSideNavList: [
        {
          name: 'Dashboard',
          route: {name: 'AdminDashboard'},
          // icon: 'dashboard'
        },
        {
          name: 'Transactions',
          route: {name: 'Transactions'},
          // icon: 'trade'
        },
        {
          name: 'User Management',
          route: {name: 'UserManagement', params: {status: 'active'}},
          // icon: 'bitcoin'
        },
        {
          name: 'Giftcard Management',
          route: {name: 'GiftCardManagement', params: {status: 'card'}},
          // icon: 'history'
        },
        {
          name: 'Bitcoin Management',
          route: {name: 'BitcoinManagement'},
          // icon: 'rates'
        },
        // {
        //   name: 'Merchant Management',
        //   route: {name: 'MerchantManagement'},
        //   // icon: 'wallet'
        // },
        {
          name: 'Admin Management',
          route: {name: 'AdminManagement'},
          // icon: 'settings'
        },
        // {
        //   name: 'Rates Calculator',
        //   route: {name: 'RatesCalculator'}
        // },
        {
          name: 'Requests Management',
          route: {name: 'RequestsManagement'}
        },
        {
          name: 'Edit Cards',
          route: {name: 'EditCards'}
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['user']),
    sideNavList() {
      let sideNavList;
      if (this.$route.path.split('/')[2] === 'user') sideNavList = this.userSideNavList
      else if (this.$route.path.split('/')[2]=== 'admin') sideNavList = this.adminSideNavList
      return sideNavList
    },
    curvedBGStyles() {
      return {
        // position: 'absolute',
        // right: 0,
        // left: 0,
        // top: 90
      }
    }
  },
  mounted() {
    document.querySelector('html').style.overflowY = 'hidden'
  },
  created() {
    window.addEventListener('resize', this.captureScreenSize, {passive: false})
    this.captureScreenSize()
  },
  beforeDestroy() {
    document.querySelector('html').style.overflowY = 'auto'
    window.removeEventListener('resize', this.captureScreenSize, {passive: false})
  },
  watch: {
    $route() {
      this.drawer = false
    }
  },
  methods: {
    captureScreenSize() {
      this.isSmallScreen = window.document.documentElement.clientWidth <= 767;
    }
  }
}
</script>

<style lang="scss" scoped>
@use "../assets/styles/mixins";

.v-main {
  margin-top: 87px !important;
  position: fixed;
}


.dashboard-base {
  background: var(--v-deep__purple-base);
  overflow: hidden;
  //position: relative;
  min-height: 100vh;

  .dashboard-wrapper {
    //padding-top: 90px!important;
  }

  .curved-bg {
    overflow-x: hidden;
    background: var(--v-white-base);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    height: calc(100vh - 87px) !important;
    padding: 20px 20px 100px 20px;
    overflow-y: auto;
    transition: all .1s ease-in-out;

    @include mixins.md {
      margin-left: auto;
      right: 0;
      left: 0;
      border-top-right-radius: 0;
      width: calc(100vw - 256px);

    }

    @include mixins.xl {
      padding: 20px 40px;
    }

    @include mixins.lg {
      padding: 20px 10px;
    }
  }
}

</style>