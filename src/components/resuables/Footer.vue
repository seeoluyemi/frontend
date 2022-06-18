<template>
  <footer class="pa-md-5 ah-footer mx-auto pa-3">
    <div :class="`ah-flex mb-5 ah-items-center ah-justify-between mx-auto`">
      <brand-logo footer/>
      <div class="socials ah-flex ah-justify-between ah-items-center">
        <a v-for="(media, index) in medias" :key="index" :href="media.link">
          <simple-icon :type="media.name"/>
        </a>
      </div>
    </div>
    <v-divider></v-divider>
    <div class=" ah-flex ah-justify-between ah-items-center mx-auto copyright">
      <span>&copy;
        <small class="ah-hidden md:ah-inline-block">AlajeHub is a property of Alaje Hub Nigeria Limited, a company duly registered with CAC with RC Number: RC 1331517.</small>
        <small class="ah-inline-block md:ah-hidden">2020 Alaje Hub All Rights Reserved</small>
      </span>
      <v-btn icon text @click="scrollToTop">
        <simple-icon type="arrow-down"/>
      </v-btn>
    </div>
  </footer>
</template>

<script>
import BrandLogo from "@/components/resuables/BrandLogo";
import SimpleIcon from "@/components/resuables/SimpleIcon";

export default {
  name: "Footer",
  components: {SimpleIcon, BrandLogo},
  data() {
    return {
      medias: [
        {
          name: 'facebook',
          link: '#'
        },
        {
          name: 'twitter',
          link: '#'
        },
        {
          name: 'instagram',
          link: '#'
        },
      ]
    }
  },
  methods: {
    scrollToTop() {
      let targetElement = document.querySelector(this.landing ? 'html' : `#${this.targetId}`)
      console.log(targetElement)
      targetElement.style.scrollBehavior = 'smooth'
      targetElement.scrollTop = 0
    }
  },
  props: {
    block: Boolean,
    targetId: String,
    landing: Boolean
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/mixins";

.socials {
  width: 100px;
}

small {
  font-size: 12px;
}

.copyright {
  height: 40px;
  margin-bottom: -10px;
  //width: 100%;
  //
  //@include sm {
  //  width: 65%;
  //}
}

.ah-footer {
  width: 100%;

  @include md {
    max-width: 800px;
  }
}

.non-block {
  width: 100% !important;

  @include sm {
    width: 65% !important;
  }
}

.v-btn {
  outline: none;
}
</style>