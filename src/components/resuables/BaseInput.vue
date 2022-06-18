<template>
  <label class="w-full">
    <span :class="`label ${dense ? 'ah-text-sm' : 'ah-text-md'}`">{{ label }}</span>
    <span v-if="!hasToggle" :class="classes" class="input">
      <input v-on="listeners" :disabled="disabled" :max="max" :min="min"
             :name="label.toLowerCase().split(' ').join('_')"
             :placeholder="placeholder"
             :type="$type" :value="value" @blur="validate">
      <simple-icon v-if="type === 'password'" :type="appendedPasswordIcon" style="cursor: pointer"
                   @click="show = !show"/>
    </span>
    <input v-if="hasToggle" :checked="value" :name="label.toLowerCase().split(' ').join('_')" :value="value"
           type="checkbox" @change="$emit('input', {value: $event.target.checked, name: $event.target.name})"/>
    <small v-show="!isSuccess" class="d-block ah-text-red">{{ message }}</small>
    <small class="font-weight-bold" v-text="hintMessage"/>
  </label>
</template>

<script>
import SimpleIcon from "@/components/resuables/SimpleIcon";

export default {
  name: "BaseInput",
  components: {SimpleIcon},
  inheritAttrs: false,
  data: () => ({
    show: false,
    value: '',
    hasError: false,
    isSuccess: false,
    message: ''
  }),
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: e => {
          this.value = e.target.value
          this.hasError = this.type === 'password' && this.mustValidate && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(e.target.value);
          this.isSuccess = this.type === 'password' && this.mustValidate && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(e.target.value);
          this.$emit('input', {value: e.target.value, name: e.target.name})
        }
      }
    },
    $type() {
      if (this.show) return 'text'
      else return this.type
    },
    classes() {
      return {
        'disabled': this.disabled,
        'password': this.type === 'password',
        'dense': this.dense,
        'input--error': this.inputError,
        'input--success': this.isSuccess
      }
    },
    appendedPasswordIcon() {
      let icon
      if (this.show && !this.inputError) icon = 'open-eye'
      if (!this.show && !this.inputError) icon = 'closed-eye'
      if (this.inputError) icon = 'error-eye'
      return icon
    },
    inputError() {
      return this.hasError || this.isError || this.confirmationError
    },
  },
  watch: {
    confirmationError: {
      handler: function (value) {
        if (value) {
          this.hasError = true
          this.isSuccess = false
        }
        // if (value && this.label === 'Confirm Password') this.message = 'Password mismatch'
      }
    },
    inputError: {
      handler: function (value) {
        if (value) {
          if (this.type === 'text' || this.type === 'number') {
            this.message = 'Field should not be empty'
          } else if (this.type === 'email') {
            this.message = 'Please enter a valid email address';
          } else if (this.type === 'password') {
            if (this.label === 'Confirm Password' && this.confirmationError) {
              this.message = 'Passwords do not match'
            } else {
              this.message = 'Password does not match format (Eight minimum characters, Uppercase, At least a number and a special character)'
            }
          }
        }
      }
    },
    hasError(value) {
      !value && (this.message = '')
    },
    propValue: {
      handler: function (value) {
        if (value || value === "") this.value = value
      },
      immediate: true
    }
  },
  methods: {
    validate() {
      if (this.mustValidate) {
        if (this.type === 'email') {
          this.validateEmail()
          return
        }
        if (this.type === 'password') {
          this.hasError = !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(this.value);
          this.isSuccess = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(this.value);
          return
        }
        if (this.value === '') {
          this.hasError = true
          this.isSuccess = false
        } else {
          this.hasError = false
          this.isSuccess = true
        }
      }
      this.$emit('valid', this.label)
    },
    validateEmail() {
      if (this.value.indexOf('@') === -1) {
        this.hasError = true
        this.isSuccess = false
      } else {
        this.hasError = false
        this.isSuccess = true
      }
      this.$emit('valid', this.label)
    }
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    label: String,
    placeholder: String,
    dense: Boolean,
    disabled: Boolean,
    isError: [String, Boolean],
    confirmationError: Boolean,
    propValue: [String, Boolean],
    min: [Number, String],
    max: [Number, String],
    mustValidate: {
      default: true,
      type: Boolean
    },
    hasToggle: {
      type: Boolean,
      default: false,
      required: false
    },
    hintMessage: String
  }
}
</script>

<style lang="scss" scoped>
label, span {
  display: block;
  width: 100%;
}

span.input {
  height: 66px;
  border: 1px solid var(--v-button__border-base);
  border-radius: .25rem;
  margin-top: 5px;

  input {
    height: 100%;
    width: 100%;
    text-indent: 10px;
    border: none;
    outline: none;
  }
}

.dense {
  height: 46px !important;
}

.disabled {
  background: #F5F5F9 !important;
  border: none;
  color: black;

  input {
    color: black !important;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[number] {
  -moz-appearance: textfield;
}

.password {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px !important;
}

.label {
  color: var(---v-deep__purple-base);
  font-weight: 500;
}

.input--error {
  border-color: #E41F2D !important;
  background: #FEF4F4;
  border-width: 2px !important;
}

.input--success {
  border-color: #46CC8D !important;
  border-width: 2px !important;
}

input[type="checkbox"] {
  position: relative;
  width: 40px;
  height: 21px;
  -webkit-appearance: none;
  background: #cccfdf;
  border-radius: 16px;
  outline: none;
  /*border-radius: 20px;*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

  &:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    margin-top: 1px;
    border-radius: 16px;
    // top: 5px;
    // left: 5px;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: 1s ease-in;
  }

  &:checked {
    transition: 1s ease-in;
    background: linear-gradient(101.54deg, #b558f9 0%, #932cff 100%);

    &:before {
      left: 20px;
    }
  }
}
</style>