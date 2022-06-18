<template>
  <v-app-bar app height="87" flat :color="$vuetify.theme.themes.light.deep__purple">
    <div class="ah-flex ah-items-center ah-w-full">
      <div class="ah-hidden md:ah-block brand__logo">
        <v-img :src="require('../../assets/images/brand__logo_w.svg')" transition="scale-transition"/>
      </div>
      <div class="ah-flex ah-justify-between header__ext">
        <div class="ah-flex ah-items-center">
          <double-state-icon :type="tabInView.toLowerCase()"/>
          <p class="ml-3 ah-text-2xl mb-0 ah-text-white">{{ tabInView }}</p>
        </div>
        <div class="md:ah-items-center ah-hidden md:ah-flex user-corner ah-justify-around">
<!--          <double-state-icon :active="false" type="bell-icon"/>-->
          <v-menu offset-y content-class="dropdown-menu">
            <template #activator="{attrs, on}">
              <v-avatar color="red" size="60" v-bind="attrs" v-on="on">
                <span v-if="!user.image" class="white--text ah-text-xl font-weight-bold">{{ getProfilePicture }}</span>
                <v-img v-else :src="getProfilePicture" :alt="user.firstName"/>
              </v-avatar>
            </template>
            <div class="dropdown ah-shadow-md">
              <div class="ah-flex ah-items-center mb-4">
                <v-avatar color="red" class="mr-3">
                  <span v-if="!user.image" class="white--text ah-text-xl font-weight-bold">{{ getProfilePicture }}</span>
                  <v-img v-else :src="getProfilePicture" :alt="user.firstName"/>
                </v-avatar>
                <p class="mb-0 font-weight-bold">{{ getName }}</p>
              </div>
              <div>
                <base-button outlined :color="$vuetify.theme.themes.light.linear__purple1" min-height="40" height="40" :to="{ name: 'Settings' }" v-if="user.role === 'customer'"><small>View Profile</small></base-button>
                <base-button outlined :color="$vuetify.theme.themes.light.linear__purple1" min-height="40" height="40" block class="my-4" @click="logout"><small>Log out</small></base-button>
              </div>
            </div>
          </v-menu>
        </div>
        <div class="ah-flex md:ah-hidden ah-justify-center hamburger ah-items-center" @click="$emit('toggle')">
          <simple-icon type="hamburger"/>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
// import BrandLogo from "@/components/resuables/BrandLogo";
import DoubleStateIcon from "@/components/resuables/DoubleStateIcon";
import {capitalizeStr} from "@/utils/helpers";
import SimpleIcon from "@/components/resuables/SimpleIcon";
import BaseButton from "@/components/resuables/BaseButton";
import {mapGetters, mapMutations} from "vuex";
export default {
  name: "TheDashboardHeader",
  components: {BaseButton, SimpleIcon, DoubleStateIcon,},
  computed: {
    ...mapGetters(['user']),
    tabInView() {
      return capitalizeStr(this.$route.path.split('/')[3])
    },
    getName() {
      if (this.user.user_type === 'super_admin') {
        return this.user.name
      } else {
        return this.user.firstName + " " + this.user.lastName
      }
    },
    getProfilePicture() {
      if (this.user.image) {
        return this.user.image
      } else {
        return this.user.firstName.substring(0, 1).toUpperCase()
      }
    }
  },
  methods: {
    ...mapMutations(['setLoggedIn']),
    logout() {
      sessionStorage.clear()
      const email = localStorage.getItem('user_login')
      const rem = localStorage.getItem('remember')
      localStorage.clear()
      email && localStorage.setItem('user_login', email)
      localStorage.setItem('remember', rem)
      this.setLoggedIn(false)
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped lang="scss">
@use "../../assets/styles/mixins";
  .header__ext {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;

    @include mixins.md {
      margin-left: 171px;
      width: calc(100% - 231px);
    }

    .user-corner {
      width: 180px;
    }
  }
</style>