<template>
  <button v-if="!to" :class="['base-btn']" @click.stop="$emit('click')" class="base-btn" :disabled="disabled" :style="style" @mouseover="mouseOver" @mouseout="mouseOut">
    <slot v-if="!loading">{{ value }}</slot>
    <span v-else class="ah-w-full">
      <v-progress-circular :color="$vuetify.theme.themes.light.linear__purple2" indeterminate/>
    </span>
  </button>
  <router-link v-else :to="to">
    <span class="base-btn link" :style="style" @mouseover="mouseOver" @mouseout="mouseOut">
      <slot>{{value}}</slot>
    </span>
  </router-link>
</template>

<script>
import {convertToUnit} from "@/utils/helpers";

export default {
  name: "BaseButton",
  data() {
    return {
      hovering: false,
    }
  },
  computed: {
    style() {
      let style = {
        padding: '4px 26px'
      }
      style.minHeight = convertToUnit(this.minHeight)
      style.height = convertToUnit(this.height)
      style.minWidth = this.block ? '100%' : convertToUnit(this.minWidth)
      style.maxWidth = this.block ? '100%' : 'initial'
      style.color = this.resolveTextColor()
      style.border = `thin solid ${this.resolveBorderColor()}`
      style.backgroundColor = this.resolveBackgroundColor()
      style.pointerEvents = this.loading ? 'none' : 'initial'
      return style
    }
  },
  methods: {
    mouseOver() {
      if (this.loading) return
      this.hovering = true
    },
    mouseOut() {
      this.hovering = false
    },
    resolveTextColor() {
      // color property: textColor, colorOnHover, backgroundColor
      let color

      if (!this.hovering) {
        if (!this.outlined) {
          if (typeof this.color === 'object') {
            if (this.color.textColor) {
              color = this.color.textColor
            } else if (this.color.backgroundColor) {
              color = this.$vuetify.theme.themes.light.white
            }
          } else {
            color = this.$vuetify.theme.themes.light.white
          }
        } else {
          if (this.disabled) color = this.$vuetify.theme.themes.light.button__border
          else color = this.color
        }
      } else {
        if (this.outlined) {
          color = this.$vuetify.theme.themes.light.white
        } else {
          if (typeof this.color === 'object') {
            if (this.color.textColorOnHover) {
              color = this.color.textColorOnHover
            } else if (this.color.backgroundColor) {
              color = this.color.backgroundColor
            }
          }
        }
      }

      return color
    },
    resolveBorderColor() {
      let color

      if (!this.hovering) {
        if (!this.outlined) {
          if (typeof this.color === 'object') {
            if (this.color.borderColor) {
              color = this.color.borderColor
            } else if (this.color.backgroundColor) {
              color = this.backgroundColor
            }
          } else {
            // borderColor takes the color of the button background which is the string provided as color
            color = this.color
          }
        } else {
          if (typeof this.color === 'string') {
            color = this.$vuetify.theme.themes.light.button__border
          }
        }
      }

      return color
    },
    resolveBackgroundColor() {
      let color

      if (!this.hovering) {
        if (!this.outlined) {
          if (typeof this.color === 'object') {
            if (this.color.backgroundColor) {
              color = this.color.backgroundColor
            }
          } else {
            color = this.color
          }
        } else {
          // you can't provide a backgroundColor if you are outlined, hence the direct assignment
          color = this.$vuetify.theme.themes.light.white
        }
      } else {
        if (!this.outlined) {
          if (typeof this.color === 'object') {
            if (this.color.backgroundColorOnHover) {
              color = this.color.backgroundColorOnHover
            } else if (this.simpleHoverEffect) {
              if (this.color.backgroundColor) {
                color = this.color.backgroundColor
              }
            }
          } else {
            if (this.simpleHoverEffect) {
              color = this.color
            }
          }
        } else {
          color = this.color
        }
      }

      return color
    }
  },
  props: {
    value: String,
    outlined: Boolean,
    color: [String, Object],
    minHeight: {
      type: [String, Number],
      default: 56
    },
    minWidth: {
      type: [String, Number],
      default: 65,
    },
    width: {
      type: [String, Number],
      default: 65,
    },
    height: {
      type: [String, Number],
      default: 56
    },
    simpleHoverEffect: {
      type: Boolean,
      default: true
    },
    to: [String, Object],
    block: Boolean,
    loading: Boolean,
    disabled: Boolean,
  }
}
</script>

<style scoped lang="scss">
.base-btn {
  border-radius: .25rem;
  transition: all .2s ease-in;
  outline: none;
  font-weight: bold;
  word-spacing: 2.5px;
  white-space: nowrap;
}

.link {
  display: grid;
  place-items: center;
  max-width: 160px;
}

a {
  text-decoration: none;
  color: inherit !important;
  background: inherit !important;
}
</style>