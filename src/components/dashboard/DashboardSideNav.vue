<template>
<!--  <div class="side-nav-overlay" :style="{ transform: `translate(${menuToggle ? -1000 : 0}px, -1vh)` }">-->
<!--    -->
<!--  </div>-->
  <div class="side-nav" :style="sideNavStyles">
    <div ref="activeIndicator" class="active-indicator">
        <span class="curve-edge curve-edge-top">
          <span class="inner"/>
        </span>
      <span class="curve-edge curve-edge-bottom">
          <span class="inner"/>
        </span>
    </div>
    <ul :class="{ adminWidth: $route.path.split('/')[2] === 'admin', 'ptForMobile': mobile }">
      <router-link v-for="(nav, i) in navs" :key="i" v-slot="{ href, navigate }" :to="nav.route">
        <li :class="{ linkActive: nav.name.toLowerCase().split(' ').join('_') === linkActive }" class="link mb-3" @click="isScreenBelow768() && toggleNav(true)">
          <a :href="href" @click="navigate" class="ah-flex ah-items-center py-4">
            <double-state-icon :active="nav.name.toLowerCase().split(' ').join('_') === linkActive" :type="nav.icon" class="mr-3"/>
            {{ nav.name }}
          </a>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
import DoubleStateIcon from "@/components/resuables/DoubleStateIcon";
import {mapGetters, mapMutations} from "vuex";

// :style="{ width: !menuToggle && smallScreen() ? '125%' : '120%' }"

export default {
  name: "DashboardSideNav",
  components: {DoubleStateIcon},
  computed: {
    ...mapGetters(['menuToggle']),
    linkActive() {
      let route = this.$route.path.split('/')[3]
      return route.split('-').join('_')
    },
    sideNavStyles() {
      return {
        transform: `translate(${this.determineNavPosition()}, -1vh)`,
        zIndex: this.open  && this.mobile ? 4 : 'initial'
      }
    }
  },
  mounted() {
    this.slideIndicator()
  },
  watch: {
    '$route.path': 'slideIndicator'
  },
  methods: {
    ...mapMutations(['toggleNav']),
    slideIndicator() {
      const index = this.navs.findIndex(nav => nav.name.toLowerCase().split(' ').join('_') === this.linkActive)
      this.$refs.activeIndicator.style.top = this.calculatePosition(index) + 'px'
    },
    // height + margin-bottom = 68,
    calculatePosition(index) { return index * (68) + (this.isScreenBelow768() ? 40 : 70) },
    smallScreen() {
      return window.document.documentElement.clientWidth <= 768
    },
    isScreenBelow768() {
      return window.document.documentElement.clientWidth < 768
    },
    determineNavPosition() {
      let position  = 0
      const { open, mobile } = this
      if (mobile && !open) position = '-300px'
      return position
    }
  },
  props: {
    navs: Array,
    mobile: Boolean,
    open: Boolean,
  }
}
</script>

<style lang="scss" scoped>
@use "../../assets/styles/mixins";

.side-nav-overlay {
  //position: fixed;
  height: 90vh;
  width: 100vw;
  background: rgba(0, 0, 0, .2);
  transition: all .3s ease-in;
  border: 0;
  //z-index: 500;

  @include mixins.md {
    //z-index: initial;
    background: var(--v-deep__purple-base);
  }
}

.side-nav {
  width: 256px;
  background: var(--v-deep__purple-base);
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  transition: all .1s ease-in-out;
  //margin-top: 90px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.ptForMobile {
  padding: 40px 0 0 0;
}

ul {
  padding: 70px 0 0 0;
  margin-left: auto;
  list-style: none;
  width: 180px;
  position: relative;
  //transform: translateX(-11px);

  .link {
    font-size: 1em;
    transition: all .1s;

    &:hover {
      background: linear-gradient(90.63deg, rgba(255, 255, 255, 0.4) 0.53%, rgba(255, 255, 255, 0.02) 99.5%);
      border-bottom-left-radius: 38px;
      border-top-left-radius: 38px;
      padding-left: 35px;
      margin-left: -35px;
    }

    a {
      text-decoration: none;
      color: var(--v-white-base);
      width: 100%;
    }
  }
}

.adminWidth {
  width: 180px !important;
}

.active-indicator {
  width: 216px;
  height: 60.8px;
  margin-left: 39px;
  transform: translateX(2.4px);
  background: white;
  position: absolute;
  border-top-left-radius: 38px;
  border-bottom-left-radius: 38px;
  //z-index: -1;
  transition: all .3s;

  @include mixins.md {
    //transform: translateX(3px);
  }
}

.linkActive {
  background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base)) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;

  a {
    color: inherit;
    font-weight: bold;
  }
}

.curve-edge {
  width: 30px;
  height: 30px;
  background: white;
  position: absolute;
  right: 0;

  &-top {
    top: -29px;

    .inner {
      transform: translate(-2px, -1px);
    }
  }

  &-bottom {
    bottom: -29px;
    transform: rotate(270deg);

    .inner {
      transform: translate(-1px, -1px);
    }
  }


  .inner {
    height: 100%;
    width: 100%;
    position: absolute;
    background: var(--v-deep__purple-base);
    clip-path: circle(100% at 0% 0%);
  }


}
</style>