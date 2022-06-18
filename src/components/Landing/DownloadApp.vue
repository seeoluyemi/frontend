<template>
  <div class="ah-flex ah-w-full download-app ah-relative">
    <div class="handle-phone ah-absolute">
      <v-img :src="require('../../assets/images/handle__phone.png')"/>
    </div>
    <div class="skewed-bg ah-absolute ah-text-white">
      <div class="unskewed">
        <h3 class="ah-text-md md:ah-text-4xl ah-text-right md:ah-text-center">Download Our Mobile App</h3>
        <p class="mb-4 mb-md-16 ah-text-sm">AlajeHub is home to a handful of highly motivated individuals who work tirelessly to enrich trade experience of customers at all stages of the value chain. You can now download our app on Android and iOS</p>
        <div class="ah-flex ah-flex-col sm:ah-flex-row ah-justify-between ah-items-center download-action">
          <a href="#">
            <v-img :src="require('../../assets/images/google__play.svg')"/>
          </a>
          <a href="#">
            <v-img :src="require('../../assets/images/apple__store.svg')"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DownloadApp"
}
</script>

<style scoped lang="scss">
@use '../../assets/styles/mixins';

.download-app {
  width: 100%;
  min-height: 400px;
  z-index: 1;
  overflow-x: hidden;

  @include mixins.lg {
    height: 800px;
  }
}

.handle-phone {
  max-width: 200px;
  height: auto;

  @include mixins.lg {
    max-width: 800px;
  }
}

.skewed-bg {
  width: calc(100% - 10px);
  transform-origin: top left;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  right: -100px;
  height: 80%;
  display: grid;
  place-items: center;

  @include mixins.lg {
    width: calc(100% - 500px);
    height: 60%;
  }

  &::before {
    content: '';
    position: absolute;
    background: var(--v-deep__purple-base);
    height: 100%;
    width: 100%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    transform: skew(10deg, 0);
    z-index: -1;
  }
}

.unskewed {
  transform: skew(0);
  max-width: 60%;
  padding: 0 20px;
  margin-right: 50px;

  @include mixins.md {
    max-width: 36%;
  }

  p {
    font-size: 12px;
    text-align: justify;
  }
}

.download-action {
  a {
    width: 100px;
    margin-bottom: 10px;
    transition: .1s ease-in all;

    &:hover {
      transform: scale(1.1);
    }

    @include mixins.md {
      width: initial;
      margin-bottom: 0;
    }
  }
}
</style>