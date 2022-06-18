<template>
  <div>
    <small>Upload GiftCard {{back ? 'back' : 'front'}}</small>
    <div class="ah-flex ah-items-center ah-justify-between">
      <div class="input-like mr-3 pa-1 d-flex align-center justify-center" :class="{'fade-no-img': !image}">
<!--        <v-btn v-if="image" icon class="cancel-img">-->
<!--          <v-icon>mdi-close</v-icon>-->
<!--        </v-btn>-->
        <small v-if="!image" class="title">{{back ? 'Back Image' : 'Front Image'}}</small>
        <v-img v-else class="ah-w-full ah-h-full" :src="image"/>
      </div>
      <div class="upload ah-w-1/2">
        <input type="file" ref="file_picker" class="ah-hidden" @change="emitFile">
        <base-button outlined block type="button" :color="$vuetify.theme.themes.light.linear__purple2" :height="40" :min-height="40" @click="openFileWindow">Upload</base-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";
export default {
name: "InputLikeUploadButton",
  components: {BaseButton},
  data() {
    return {
      fileName: '',
      image: ''
    }
  },
  computed: {
    shortenedName() {
      if (this.fileName === '') return
      return this.fileName.slice(0, 10) + '...'
    }
  },
  watch: {
    propImage: {
      handler: function (val) {
        val !== undefined && (this.image = val)
      },
      immediate: true
    }
  },
  methods: {
    emitFile(event) {
      const file = event.target.files[0]
      this.fileName = file.name
      const reader = new FileReader()
      reader.onload = e => {
        console.log(e)
        this.image = e.target.result
      }
      reader.readAsDataURL(file)
      this.$emit('file', file)
    },
    openFileWindow() {
      this.$refs.file_picker.click()
    }
  },
  props: {
    back: Boolean,
    propImage: String
  }
}
</script>

<style scoped lang="scss">
  .input-like {
    border-radius: 6px;
    height: 100px;
    width: 160px;
    border: thin solid var(--v-button__border-base);
    position: relative;

    .cancel-img {
      position: absolute;
      top: -18px;
      right: -15px;
    }
  }

  .fade-no-img {
    //background: rgba(0, 0, 0, .3);
  }
</style>