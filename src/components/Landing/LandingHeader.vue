<template>
  <div>
    <v-app-bar
        app
        height="87"
        elevate-on-scroll
        :color="$vuetify.theme.themes.light.white"
        class="px-0 px-md-10"
    >
      <div class="ah-flex ah-items-center nav">
        <brand-logo/>
        <ul class="ah-hidden ah-justify-around md:ah-flex">
          <li v-for="(link, index) in navLinks" :key="index">
            <router-link :to="link.link">{{ link.name }}</router-link>
          </li>
        </ul>
      </div>
      <v-spacer/>
      <div class="ah-hidden md:ah-flex ah-justify-start nav-btns">
        <BaseButton class="mr-5" outlined :color="$vuetify.theme.themes.light.deep__purple" :to="{ name: 'Login' }">Log In</BaseButton>
        <BaseButton outlined :color="$vuetify.theme.themes.light.deep__purple" @click="$router.push('/register')">Get Started</BaseButton>
      </div>
      <div class="nav-icon ah-flex ah-justify-center ah-items-center md:ah-hidden" @click="$emit('click:drawerOpen')">
        <v-app-bar-nav-icon/>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";
import BrandLogo from "@/components/resuables/BrandLogo";

export default {
  name: "LandingHeader",
  components: {BrandLogo, BaseButton},
  data() {
    return {
      drawer: false,
      navLinks: [
        {
          name: "Buy",
          link: "/login",
        },
        {
          name: "Sell",
          link: "/login",
        },
        {
          name: "About Us",
          link: "/about",
        },
        {
          name: "Download",
          link: "/download",
        },
        // {
        //   name: "Contact",
        //   link: "/contact",
        // },
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@use "src/assets/styles/mixins";

ul {
  list-style: none;
  padding: 0;
  flex: 1;

  li {
    a {
      text-decoration: none;
      font-weight: 500;
      color: var(--v-deep__purple-base);
    }
  }

  a {
    div {
      color: var(--v-deep__purple-base);
    }
  }
}

.nav {
  width: 60%;
  padding: 0;

  @include mixins.md {
    padding: 0 40px;
  }
}

.nav-btns {
  width: 300px;
}

.nav-icon {
  border: 1px solid var(--v-button__border-base);
  width: 40px;
  height: 40px;
}
</style>