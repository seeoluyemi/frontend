<template>
  <div class="home">
    <LandingHeader @click:drawerOpen="drawer = true"/>
    <sidebar :style="sideBarStyles"/>
    <back-drop :style="backDropStyles" @click="drawer = false"/>
    <v-main>
      <router-view/>
      <Footer landing/>
    </v-main>
  </div>
</template>

<script>
import LandingHeader from "@/components/Landing/LandingHeader";
import Sidebar from "@/components/Landing/Sidebar/Sidebar";
import BackDrop from "@/components/resuables/BackDrop";
import Footer from "@/components/resuables/Footer";
export default {
  name: "Landing",
  components: {Footer, BackDrop, Sidebar, LandingHeader},
  data: () => ({
    drawer: false,
    isSmallScreen: false
  }),
  computed: {
    sideBarStyles() {
      const { drawer, isSmallScreen } = this
      return {
        transform: `translateX(${drawer && isSmallScreen ? 0 : '-400px'})`,
        transition: 'all .1s ease-in-out',
      }
    },
    backDropStyles() {
      const { drawer, isSmallScreen } = this
      return {
        transform: `scale(${drawer && isSmallScreen ? 1 : 0})`,
        transition: 'all .3s'
      }
    }
  },
  created() {
    window.addEventListener('resize', this.captureScreenSize)
    this.captureScreenSize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.captureScreenSize)
  },
  watch: {
    $route() {
      this.drawer = false
    }
  },
  methods: {
    captureScreenSize() {
      this.isSmallScreen = window.document.documentElement.clientWidth <= 768;
    }
  }
}
</script>

<style scoped>

</style>