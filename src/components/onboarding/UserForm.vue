<template>
  <div class="d-flex justify-center">
    <div class="form-wrapper">
      <div class="img-wrapper mx-auto my-4">
        <v-img :src="require('../../assets/images/keys.svg')"/>
      </div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field outlined v-for="({label, type, rules}, index) in fields" :key="index"
                      v-model="fieldsData[label.split(' ').join('_')]" :label="label"
                      :type="type || 'text'"
                      :append-icon="getAppendIcon()"
                      @click:append="show = !show"
                      :rules="[...getValidationRules(type), ...rules]"/>
        <div class="d-flex justify-center">
          <v-btn :color="$vuetify.theme.themes.light.linear__purple1" depressed :loading="loading" :disabled="!valid">{{buttonText}}</v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserForm",
  data: () => ({
    valid: false,
    show: false,
    fieldsData: {}
  }),
  computed: {
    buttonText() {
      const texts = {
        'login': 'Login',
        'signup': 'Sign Up',
        'reset': 'Reset',
        'update': 'Update'
      }
      return texts[this.formType]
    }
  },
  created() {
    this.fields.forEach(({label, value}) => {
      this.$set(this.fieldsData, label.split(' ').join('_').toLowerCase(), value !== undefined ? value : '')
    })
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    formType: String,
    loading: Boolean
  },
  methods: {
    getValidationRules(fieldType) {
      const rules = {
        'email': [v => !!v || 'E-mail is required', v => /\S+@\S+\.\S+/.test(v) | 'E-mail must be valid'],
        'password': [v => !!v || 'Password is required', v => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(v) || 'Password does not match format (Eight minimum characters, Uppercase, At least a number and a special character)']
      }
      return rules[fieldType]
    },
    getAppendIcon() {
      return this.type === 'password' ? (this.show ? 'mdi-eye' : 'mdi-eye-closed') : undefined
    }
  }
}
</script>

<style scoped lang="scss">

  .form-wrapper {
    background: var(--v-white-base);
    height: auto;
    max-width: 350px;
    border-radius: .25em;
    padding: 25px;
  }
  .img-wrapper {
    width: 40%;
  }

  .v-btn {
    color: var(--v-white-base);
    text-transform: capitalize;
  }
</style>