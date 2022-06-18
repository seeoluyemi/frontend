<template>
  <v-app id="app">
    <snackbar/>
    <router-view/>
    <error-or-success-dialog :dialog="errorOrSuccessDialog" @close="closeDialog" :title="errorOrSuccessTitle" :success="success" :message="errorOrSuccessMessage"/>
  </v-app>
</template>

<script>
import ErrorOrSuccessDialog from "@/components/resuables/ErrorOrSuccessDialog";
import {mapGetters, mapMutations} from "vuex";
import Snackbar from "@/components/resuables/Snackbar";
export default {
  components: {Snackbar, ErrorOrSuccessDialog},
  computed: {
    ...mapGetters(['errorOrSuccessDialog', "errorOrSuccessMessage", "errorOrSuccessTitle", "success",]),
  },
  methods: {
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle']),
    showNotification(message) {
      // eslint-disable-next-line no-unused-vars
      const notification = new Notification("New message incoming..", {
        body: message
      })
    },
    closeDialog() {
      this.setErrorOrSuccessMessage('')
      this.setErrorOrSuccessTitle('')
      this.setErrorOrSuccessDialog(false)
    }
  },
  mounted() {
    if (Notification.permission === 'default') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          this.showNotification("Thank you. This way you won't miss a ping!")
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "~vue2-animate/src/sass/vue2-animate.scss";

@font-face {
  font-family: "Avenir";
  src: url(~@/assets/fonts/TTNorms-Regular.ttf) format('truetype');
}

@font-face {
  font-family: "Avenir";
  src: url(~@/assets/fonts/TTNorms-Medium.ttf) format('truetype');
  font-weight: 500;
}

@font-face {
  font-family: "Avenir";
  src: url(~@/assets/fonts/TTNorms-Bold.ttf) format('truetype');
  font-weight: bold;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif !important;
  //overflow-y: hidden;
}

html {
  //overflow-y: hidden !important;
  scroll-behavior: smooth;

  .v-application {
    font-family: "Avenir", Helvetica, Arial, sans-serif !important;
  }
}

a {
  text-decoration: none !important;
}

// showcase action button
.showcase-btn {
  .v-btn {
    background: var(--v-deep__purple-base) !important;
    color: var(--v-white-base) !important;
    border: 1px solid var(--v-white-base) !important;
  }
}

// overriding the v-data-table for recent-transactions table on the user's dashboard
.recent-transactions {
  .v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th,
  .v-data-table > .v-data-table__wrapper > table > tbody > tr,
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    border-bottom: none !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    height: 75px;
    font-size: 0.87067em;
  }

  .v-data-table > .v-data-table__wrapper > table > thead > tr >th {
    font-size: 1em !important;
    color: #000 !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr {
    &:hover {
      background: white;
    }
  }
}

.history-table {
  .v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th,
  .v-data-table > .v-data-table__wrapper > table > tbody > tr,
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    border-bottom: none !important;
  }

  .v-data-table > .v-data-table__wrapper > table > thead > tr >th {
    font-size: 1em !important;
    color: #000 !important;
  }

  .v-data-table {
    line-height: 4;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr {

    td {
      height: 58px;
    }

    &:nth-child(odd) {
      background: #F5F5F9 !important;
    }
  }
}

ul {
  padding-left: 0 !important;
  list-style: none;
}

.wallet-recent-activities {
  .v-timeline {
    padding-top: 0;
    margin-left: -40px;

    &:before {
      top: 1% !important;
      left: calc(68px - 1px) !important;
    }
  }

  .v-timeline-item__divider {
    min-width: 56px !important;
  }

  .v-timeline-item__dot {
    box-shadow: none;
    background: transparent !important;
  }
}

//.box {
//  border: thin solid var(--v-button__border-base);
//  border-radius: 10px;
//}

.store-name {

  .v-slider--horizontal .v-slider__track-container {
    height: 10px;
    border-radius: 6px;
  }

  .v-slider__thumb-label-container {
    display: block !important;
  }

  .v-slider__track-background {
    border-radius: 20px;
    background-color: rgba(154, 159, 191, 0.15) !important;
  }

  .v-slider--horizontal .v-slider__thumb-label {
    background: transparent !important;
    width: 80px !important;
    border: 2px solid var(--v-button__border-base) !important;
    transform: translateY(-24px) translateX(-30px) rotate(0) !important;
    border-radius: 0!important;
    display: flex;
    align-items: center;
  }

  .v-slider--horizontal .v-slider__thumb-label > * {
    transform: rotate(0);
  }
}

.dash-head {
  .v-sheet.v-app-bar.v-toolbar {
    z-index: 200;
  }

  //.v-menu__content {
  //  z-index: 1000;
  //  box-shadow: none;
  //}
}

.nav-icon {
  .v-btn--outlined .v-btn__content .v-icon, .v-btn--round .v-btn__content .v-icon {
    color: #211048;
    font-size: 30px;
    height: 30px;
    width: 30px;
  }
}

.v-menu__content.dropdown-menu {
  //box-shadow: none;
  padding-top: 30px;

  &:before {
    content: '';
    position: absolute;
    top: 10px;
    right: 18px;
    height: 20px;
    width: 20px;
    background: var(--v-white-base);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  .dropdown {
    width: 260px;
    height: auto;
    background: white;
    position: relative;
    border-radius: 2px;
    padding: 10px 25px;
    //border: 1px solid #ccc;
  }
}

.gift__card__form {
  .v-menu__content {
    max-width: 350px !important;
  }
}

.round-image {
  border-radius: 5px;
}

button {
  outline: none !important;
}

.creditInput input[type='number'] {
  -moz-appearance:textfield;
}
.creditInput input::-webkit-outer-spin-button,
.creditInput input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.theme--light.v-icon.mdi-message-outline {
  color: whitesmoke;
}

.vue-tel-input {
  height: 66px;
  box-shadow: none !important;
  border: 1px solid var(--v-button__border-base) !important;
  border-radius: .25rem;
  .vti__dropdown {
    outline: none!important;

    &:focus {
      outline: none !important;
    }
  }
}

</style>