<template>
  <div class="avatar ah-absolute">
    <button @focus="drop = true" @blur="drop =false">
      <span>
        <v-img width="56" :src="require('../../assets/images/avatar.svg')"/>
      </span>
      <transition name="drop">
        <span v-if="drop" class="ah-absolute ah-rounded ah-shadow-md dropdown">
        <span class="ah-flex ah-items-center">
          <span class="inner-avatar mr-3">
            <v-img :src="require('../../assets/images/avatar.svg')"/>
          </span>
          <span class="mb-0 ah-font-bold ah-text-xl">Albert Flores</span>
        </span>
        <base-button :to="{ name: 'Login' }" block height="45" min-height="45" outlined :color="$vuetify.theme.themes.light.linear__purple1">View Profile</base-button>
        <base-button @click="logout" block height="45" min-height="45" outlined :color="$vuetify.theme.themes.light.linear__purple1">Log Out</base-button>
      </span>
      </transition>
    </button>
  </div>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";

export default {
  name: "UserDropdown",
  components: {BaseButton},
  data() {
    return {
      drop: false
    }
  },
  methods: {
    logout() {
      console.log('clciked...')
      sessionStorage.removeItem('userData')
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style lang="scss" scoped>

button {
  outline: none;
}

.avatar {
  right: 80px;
}

.dropdown {
  background: white;
  height: auto;
  width: 330px;
  padding: 25px 28px;
  z-index: 20;
  left: -275px;
  top: 69px;
  transition: all .1s;

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    right: 18px;
    height: 20px;
    width: 20px;
    background: var(--v-white-base);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  a {
    margin: 0 6px;
  }
}

.drop-enter, .drop-leave-active {
  transform: translateY(10px);
}

.drop-leave {
  transform: translateX(-10px);
}

.inner-avatar {
  width: 60px;
}

//.avatar {
//
//
//  button {
//    outline: none;
//
//    &:focus + .dropdown {
//      height: 230px;
//      visibility: initial;
//      pointer-events: auto;
//    }
//  }
//
//}
//
//.dropdown {
//  width: 250px;
//  right: -25px;
//  background: var(--v-white-base);
//  top: 60px;
//  height: 0;
//  //overflow-y: hidden;
//  pointer-events: none;
//  visibility: hidden;
//  border-radius: 10px;
//  transition: height .2s ease-in-out;
//
//
//  .dropdown-avatar {
//    width: 60px;
//  }
//}
</style>