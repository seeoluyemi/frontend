<template>
  <div class="ah-fixed chat__wrapper">
    <v-card v-ripple="false" elevation="0" class="chat__wrapper__inner" flat @click="showChatBox = true" v-click-outside="closeBox">
      <div>
        <v-icon color="white">mdi-message-outline</v-icon>
        <span class="text--white ml-2">Chat us now</span>
      </div>
      <v-slide-x-reverse-transition>
        <v-card max-width="240" flat v-show="showChatBox" class="chat__box ah-absolute">
          <form @submit.prevent="sendChat" style="width: 180px" class="mx-auto ah-mx-auto">
            <base-input @input="[getData('name', $event.value)]" class="input__chat" label="Name" :must-validate="false" dense/>
            <base-input @input="[getData('email', $event.value)]" class="input__chat" label="Email" :must-validate="false" dense/>
            <label class="input__chat">
              <span>Message</span>
              <textarea class="text__area" v-model="message" placeholder="Message"/>
            </label>
            <div class="d-flex justify-center" style="width: 100%">
              <v-btn outlined :loading="loading" color="purple" type="submit">Send</v-btn>
            </div>
          </form>
        </v-card>
      </v-slide-x-reverse-transition>
    </v-card>
  </div>
</template>

<script>
import BaseInput from "@/components/resuables/BaseInput";
import {sendComplaint} from "@/apis";
export default {
name: "Chat",
  components: {BaseInput},
  data: () => ({
    showChatBox: false,
    message: '',
    name: '',
    email: '',
    loading: false
  }),
  methods: {
    closeBox() {
      this.showChatBox = false
    },
    getData(name, value) {
      this.$data[name] = value
    },
    async sendChat() {
      const {message, name, email} = this
      try {
        this.loading = true
        const {data} = await sendComplaint({message, name, email})
        console.log(data)
      } catch (e) {
        this.$snackbar.displaySnackbar({success: false, message: 'An error occurred'})
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
  .chat__wrapper {
    bottom: 60px;
    right: 10px;
    cursor: pointer;
  }

  .chat__wrapper__inner {
    border-radius: 20px;
    background: var(--v-linear__purple1-base);
    padding: 8px;
  }

  .text--white {
    color: whitesmoke;
    font-weight: bold;
  }

  .chat__box {
    top: -630%;
    right: 20px;
    width: 340px;
    padding-bottom: 10px;
    //background: purple;
    border-radius: 0!important;
  }

  .text__area {
    border: 1px solid #ccc;
    width: 100%;
    outline: none;
    text-indent: 5px;
  }

  .input__chat {
    margin: 5px 0;
  }

  .d-flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }
</style>