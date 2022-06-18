import Vue from 'vue'
import App from './App.vue'
import "@/assets/styles/main.scss";
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import numeral from "numeral"
import {displaySnackbar} from "@/utils/componentMethods";
import SnackbarEmbedded from "@/components/resuables/SnackbarEmbedded"
// import Chat from "@/components/Chat"

import VueAzureUploader from 'vue-azure-blob-upload'
Vue.use(VueAzureUploader);

import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';

Vue.use(VueTelInput);

Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs.extend(relativeTime)
Vue.prototype.$numberToAmount = numeral
Vue.prototype.$displaySnackbar = displaySnackbar

const snackbar = new Vue(SnackbarEmbedded).$mount()
// const chat = new Vue(Chat).$mount()

Vue.prototype.$snackbar = snackbar

document.body.append(snackbar.$el)
// document.body.append(chat.$el)

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
