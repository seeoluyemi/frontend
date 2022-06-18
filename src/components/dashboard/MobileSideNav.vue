<template>
  <nav class="navigation__wrapper" :class="{'in-view': slideIn}">
    <div>
      <div ref="activeIndicator" :style="activeIndicatorStyle" class="active-indicator">
        <span class="curve-edge curve-edge-top">
          <span class="inner"/>
        </span>
        <span class="curve-edge curve-edge-bottom">
          <span class="inner"/>
        </span>
      </div>
      <ul :class="{ adminWidth: $route.path.split('/')[2] === 'admin', 'ptForMobile': mobile }">
        <router-link v-for="(nav, i) in navs" :key="i" v-slot="{ href, navigate }" :to="nav.route">
          <li :class="{ linkActive: nav.name.toLowerCase().split(' ').join('_') === linkActive }" class="link mb-3">
            <a :href="href" @click="navigate" class="ah-flex ah-items-center py-4">
              <double-state-icon :active="nav.name.toLowerCase().split(' ').join('_') === linkActive" :type="nav.icon" class="mr-3"/>
              {{ nav.name }}
            </a>
          </li>
        </router-link>
      </ul>
      <div>
        <span class="log-out d-flex align-center my-2" @click="logout" style="margin-left: 76px;">
          <simple-icon type="log-out" class="mr-2"/>
        Log out
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
import DoubleStateIcon from "@/components/resuables/DoubleStateIcon";
import {mapGetters} from "vuex";
import SimpleIcon from "@/components/resuables/SimpleIcon";
export default {
  name: "MobileSideNav",
  components: {SimpleIcon, DoubleStateIcon},
  data: () => ({
    mobile: false,
  }),
  computed: {
    ...mapGetters(['menuToggle']),
    linkActive() {
      let route = this.$route.path.split('/')[3]
      return route.split('-').join('_')
    },
    sideNavStyles() {
      return {
        // transform: `translate(${this.determineNavPosition()}, -1vh)`,
        // zIndex: this.open  && this.mobile ? 4 : 'initial'
      }
    },
    activeIndicatorStyle() {
      const index = this.navs.findIndex(nav => nav.name.toLowerCase().split(' ').join('_') === this.linkActive)
      return {
        top: index * (68) + (40) + 'px'
      }
    }
  },
  props: {
    navs: Array,
    slideIn: Boolean
  },
  methods: {
    logout() {
      sessionStorage.clear()
      localStorage.clear()
      this.$store.commit('setLoggedIn', false)
      this.$router.push({name: 'Login'})
    }
  }
}
</script>

<style scoped lang="scss">
@use 'src/assets/styles/mixins';
  .navigation__wrapper {
    max-width: 256px;
    width: 70%;
    position: fixed;
    height: 100vh;
    background: var(--v-deep__purple-base);
    z-index: 5;
    top: 0;
    transform: translateX(-300px);
    overflow-x: hidden;
    transition: all .2s ease-in-out;

    ul {
      width: 180px;
      margin-left: auto;
      position: relative;
      padding-top: 40px;

      .linkActive {
        background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base)) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;

        a {
          color: inherit;
          font-weight: bold;
        }
      }

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

    .active-indicator {
      width: 216px;
      height: 60.8px;
      margin-left: 39px;
      transform: translateX(2.4px);
      background: white;
      position: absolute;
      border-top-left-radius: 38px;
      border-bottom-left-radius: 38px;
      transition: all .3s;

      @include mixins.md {
        //transform: translateX(3px);
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
    }
  }

.log-out {
  color: white;
}

.in-view {
  transform: translateX(0px) !important;
}
</style>