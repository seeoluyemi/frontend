<template>
  <showcase-overlay>
    <div class="ah-flex contact__wrapper justify-space-around">
      <div class="contact__info">
        <h2>Contact Us</h2>
        <p>Is something unclear? Do you want us to do something for you? Kindly reach us on any of the following: </p>
        <ul>
          <li>Email</li>
          <li>Phone number</li>
          <li>Social media handles</li>
        </ul>
        <p>Or better still yet you could fill this form:</p>
      </div>
      <div class="contact__form ah-shadow-lg">
        <base-input v-for="(field, i) in fields" class="my-6" :key="i" :label="field.label" :placeholder="field.placeholder" :is-error="field.error"/>
        <label for="message">
          Message
        </label>
        <textarea id="message"  rows="6" placeholder="Type your message here"/>
        <div class="send-btn my-4 mx-auto">
          <base-button :color="$vuetify.theme.themes.light.linear__purple1" outlined><small>Send message</small></base-button>
        </div>
      </div>
    </div>
  </showcase-overlay>
</template>

<script>
import ShowcaseOverlay from "@/components/resuables/ShowcaseOverlay";
import BaseInput from "@/components/resuables/BaseInput";
import BaseButton from "@/components/resuables/BaseButton";
export default {
  name: "Contact",
  components: {BaseButton, BaseInput, ShowcaseOverlay},
  data: () => ({
    fields: [
      {
        label: 'Full Name',
        placeholder: 'John Doe',
        error: false,
      },
      {
        label: 'Email Address',
        placeholder: 'john.doe@email.com',
        error: false,
      },
      {
        label: 'Phone Number',
        placeholder: '08023546378',
        error: false
      }
    ]
  })
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/mixins";

  .contact__wrapper {
    flex-direction: column;
    @include customable(1020) {
      flex-direction: row !important;
    }
  }
  .contact__info {
    width: 250px;

    ul > li {
      font-size: 18px;
    }
  }

  .contact__form {
    background: #FFF;
    width: 100%;
    padding: 40px 30px;
    border-radius: 8px;
    //box-shadow: 0 1px 3px rgba(0, 0, 0, .4);

    @include sm {
      width: 400px;
    }
  }


  textarea {
    width: 100%;
    outline: none;
    border: 1px solid var(--v-button__border-base);
    padding: 5px;
  }

  .send-btn {
    width: 140px;
  }
</style>