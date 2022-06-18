<template>
  <div v-if="!isSmallScreen" class="py-3 state-indicator-box ah-flex ah-overflow-x-auto">
    <router-link v-for="(link, i) in links" :key="i" :to="link.to">
      <span class="indicator" :class="{ active: active(link.label) }">
        <span class="label">{{link.label}}</span>
      </span>
    </router-link>
  </div>
  <div v-else style="max-width: 180px">
    <v-select dense hide-details :color="$vuetify.theme.themes.light.deep__purple" :items="items" v-model="selected" outlined return-object/>
  </div>
</template>

<script>
export default {
name: "DashboardInnerContentStateIndicator",
  data: (vm) => ({
    isSmallScreen: false,
    selected: vm.$route.params.settingsState ||
        vm.$route.query.filter_key ||
        vm.$route.query.key ||
        vm.$route.params.status,
    items: null
  }),
  computed: {
    active() {
      return label => this.$route.query.filter_key === label.toLowerCase() ||
          this.$route.query.key === label.toLowerCase() ||
          this.$route.params.settingsState === label.toLowerCase() ||
          this.$route.params.status === label.toLowerCase()
    },
    // selected() {
    //   return this.items[0]
    // }
  },
  props: {
    links: Array
  },
  watch: {
    selected: {
      handler: function (value) {
        this.$emit('change', value.value)
      }
    },
    // '$route.params.settingsState': {
    //   handler: function (value) {
    //     console.log(value)
    //     this.selected = 'profile'
    //   }
    // }
  },
  created() {
    window.addEventListener('resize', this.captureScreenSize)
    this.captureScreenSize()
    this.items = this.processLinks()
    // this.selected = this.items[0]
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.captureScreenSize)
  },
  methods: {
    captureScreenSize() {
      this.isSmallScreen = window.document.documentElement.clientWidth <= 768;
    },
    processLinks() {
      // let items = []
      // this.links.map(link => {
      //   link.text = link.label
      //   link.value = link.label.toLowerCase()
      //   items.push(link)
      // })
      // return items
      return this.links.map(link => ({text: link.label, value: link.label.toLowerCase()}))
    },
  }
}
</script>

<style scoped lang="scss">
@use '../../assets/styles/mixins';
  .state-indicator-box {
    height: 56px;
  }

  .indicator {
    padding: 8px;
    border: thin solid var(--v-button__border-base);
    border-radius: 6px;
    transition: all .5s ease-in-out;

    @include mixins.md {
      padding: 8px 15px;
    }

    &.active {
      background: linear-gradient(95.45deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));

      span {
        color: white;
        -webkit-background-clip: initial;
        -webkit-text-fill-color: initial;
        font-weight: 500;
      }
    }

    .label {
      background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  a {
     text-decoration: none;
    font-weight: inherit;
    margin-right: 30px;
   }
</style>