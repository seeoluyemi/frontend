<template>
  <div class="ads-section-box ah-mb-8 md:ah-mb-0">
    <v-row v-if="left" class="row-left">
      <v-col cols="6" class="pa-0 md:ah-px-2 ah-flex ah-text-justify md:ah-text-left ah-justify-center ah-items-center md:ah-justify-end">
        <div class="content content-left">
          <slot/>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="ad-image">
          <slot name="image"></slot>
        </div>
      </v-col>
    </v-row>
    <v-row v-else-if="right" class="row-right">
      <v-col cols="6">
        <div class="ad-image">
          <slot name="image"></slot>
        </div>
      </v-col>
      <v-col cols="6"
             class="pa-0 md:ah-px-2 ah-flex ah-text-justify md:ah-text-right ah-justify-center ah-items-center md:ah-justify-start">
        <div class="content content-right">
          <slot/>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "AdsSection",
  props: {
    left: Boolean,
    right: Boolean,
  }
}
</script>

<style scoped lang="scss">
@use "src/assets/styles/mixins";

.ads-section-box {
  overflow-x: hidden;

  h2 {
    word-spacing: 6px;
    margin-bottom: 18px;
    font-weight: bold;

    @include mixins.md {
      font-size: 3em;
    }
  }

  .content {
    width: 90%;

    p {
      max-width: 350px;

      @include mixins.md {
        font-size: 1.2em;
        max-width: 450px;
      }
    }

    @include mixins.lg {
      width: 70%;
    }

    &.content-right p {
      margin-left: auto;
    }

    .button {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.row-left {
  transform: translateX(40px);

  @include mixins.md {
    transform: translateX(0);
  }
}

.row-right {
  transform: translateX(-40px);
  margin-right: -24px;
}

.ad-image {
  display: flex;
  margin-top: 100%;

  @include mixins.md {
    display: initial;
    margin-top: initial;
  }
}
</style>