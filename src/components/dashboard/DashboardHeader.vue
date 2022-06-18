<template>
  <div class="dash-head">
    <v-app-bar height="89" :elevation="0" :color="$vuetify.theme.themes.light.deep__purple">
      <header class="dashboard-header ah-overflow-y-hidden ah-flex ah-justify-start ah-items-center py-3 px-4 px-md-16">
        <div class="ah-hidden md:ah-block brand__logo">
          <v-img :src="require('../../assets/images/brand__logo_w.svg')" transition="scale-transition"/>
        </div>
        <div class="ah-flex dashboard-header-ext">
          <div class="ah-flex ah-items-center">
            <double-state-icon :type="tabInView.toLowerCase()"/>
            <p class="ml-3 ah-text-2xl mb-0 ah-text-white">{{ tabInView }}</p>
          </div>
          <div class="ah-flex ah-justify-between ah-items-center dashboard-header-click-here">
            <router-link class="ah-hidden lg:ah-block" to="/"><small>You're almost there! Click here to finish setting up
              your account</small></router-link>
          </div>
          <div class="ah-justify-between ah-items-center user-corner ah-hidden md:ah-flex">
<!--            <double-state-icon :active="false" type="bell-icon"/>-->
<!--            <user-dropdown/>-->
            <v-menu>
              <template #activator="{ attrs, on }">
                <v-avatar :color="$vuetify.theme.themes.light.linear__purple2" v-on="on" v-bind="attrs"/>
              </template>
              <v-card>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad architecto aspernatur blanditiis cum ea fuga laboriosam perspiciatis repellendus sunt voluptatibus!</p>
              </v-card>
            </v-menu>
          </div>
          <div class="ah-flex md:ah-hidden ah-justify-center hamburger ah-items-center" @click="switchToggle">
            <simple-icon type="hamburger"/>
          </div>
        </div>
      </header>
    </v-app-bar>
  </div>
</template>

<script>
import DoubleStateIcon from "@/components/resuables/DoubleStateIcon";
import {capitalizeStr} from "@/utils/helpers";
import SimpleIcon from "@/components/resuables/SimpleIcon";
// import UserDropdown from "@/components/resuables/UserDropdown";
import {mapMutations} from "vuex";

export default {
  name: "DashboardHeader",
  components: {
    // UserDropdown,
    SimpleIcon, DoubleStateIcon},
  data() {
    return {
      windowWidth: ''
    }
  },
  created() {
    this.showNav()
    window.addEventListener('resize', this.showNav)
  },
  destroyed() {
    window.removeEventListener('resize', this.showNav)
  },
  mounted() {
    console.log('mounts')
    this.showNav()
  },
  computed: {
    tabInView() {
      return capitalizeStr(this.$route.path.split('/')[3])
    }
  },
  methods: {
    ...mapMutations(['switchToggle', 'toggleNav']),
    showNav() {
      if (this.windowWidth === '' || this.windowWidth !== window.document.documentElement.clientWidth) {
        this.windowWidth = window.document.documentElement.clientWidth
        if (window.document.documentElement.clientWidth >= 768) {
          this.toggleNav(false)
        } else {
          this.toggleNav(true)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use "../../assets/styles/mixins";

.dashboard-header {
  background: var(--v-deep__purple-base);
  max-height: 12vh;
  width: 100vw;
  border: 0;
  //position: fixed;
  z-index: 6;

  .brand__logo {
    width: 60px;
    height: 60px;
  }

  .dashboard-header-ext {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;

    @include mixins.md {
      margin-left: 171px;
      width: calc(100% - 231px);
    }

    .hamburger {
      //width: 80px;
      //height: 80px;
    }

    .user-corner {
      width: 120px;
      right: 50px;
      //height: 7vh;
    }

    .dashboard-header-click-here {
      //width: 85%;
      //
      //@include mixins.customable(1088) {
      //  width: 80%;
      //}
      //
      //@include mixins.customable(1100) {
      //  width: 80%;
      //}
      //
      //@include mixins.customable(1400) {
      //  width: 65%;
      //}


      a {
        padding: 10px 15px;
        text-decoration: none;
        color: var(--v-white-base);
        background: rgba(255, 255, 255, .05);
        border-radius: 50px;
        transition: all .1s ease-in-out;
        text-align: center;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>