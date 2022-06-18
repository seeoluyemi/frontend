<template>
  <div class="not-found pl-10 pb-10">
    <v-row>
      <v-col cols="12" md="6">
        <div class="ah-flex ah-flex-col">
          <simple-icon type="wrong-icon"/>
          <div>
            <v-img :src="require('../assets/images/404.svg')"/>
          </div>
          <p>The page you are looking for was moved, removed, renamed or might never existed.</p>
          <base-button outlined :color="$vuetify.theme.themes.light.linear__purple2">Go to Dashboard</base-button>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="pt-0">
        <div>
          <v-img :src="require('../assets/images/not_found_bg.svg')"/>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SimpleIcon from "@/components/resuables/SimpleIcon";
import BaseButton from "@/components/resuables/BaseButton";
export default {
  name: "NotFound",
  components: {BaseButton, SimpleIcon}
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/mixins";
  .not-found {
    background: url("../assets/images/not_found_bg.svg") no-repeat;

    @include sm {
      background: none;
    }
  }
</style>