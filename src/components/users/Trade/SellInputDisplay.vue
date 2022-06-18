<template>
  <div>
    <div class="d-flex my-6 wrapper align-center">
      <label class="mr-4">
        <span class="font-weight-bold mr-1">$</span>
        <input @input="onNumberInput" ref="number_input" type="number">
        <span ref="input__widener" class="input__widener"/>
      </label>
      <div class="d-flex justify-space-between align-center mr-4" style="width: 90px">
        <rate-decrement-increment-button sign="minus" @click="decrement"/>
        <span>{{ card.count }}</span>
        <rate-decrement-increment-button @click="increment"/>
      </div>
      <div class="images d-flex">
<!--        class="image__uploader d-flex justify-center align-center"-->
        <v-btn icon @click="openExplorer">
          <input ref="file" multiple class="d-none" type="file" @change="pickImage"/>
          <v-icon size="30" :color="$vuetify.theme.themes.light.deep__purple">mdi-cloud-upload-outline</v-icon>
        </v-btn>
      </div>
      <div v-if="images.length" class="images ml-2" @click="dialog = true">
<!--        <v-img :src="image" width="50px" height="55px" alt="image"/>-->
        <div class="image" :style="{backgroundImage: `url(${images[images.length - 1].image})`}" />
        <div class="more_images ah-h-full ah-w-full ah-flex ah-items-center ah-justify-center" v-if="images.length > 1"><p class="mb-0 ah-text-4xl">+{{additionalImagesNotInvIew}}</p></div>
      </div>
      <v-btn icon @click="$emit('delete')">
        <v-icon color="red" class="ml-3">mdi-close</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialog" max-width="700">
      <v-card class="py-6">
        <v-card-text class="d-flex">
          <div class="dialog__image mr-6" v-for="image in images" :key="image.id" :style="{backgroundImage: `url(${image.image})`}">
            <div class="close--btn">
              <v-btn rounded depressed min-width="36px" width="36px" color="red" @click="[deleteImage(image.id)]">
                <v-icon color="white">mdi-close</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RateDecrementIncrementButton from "@/components/users/Trade/RateDecrementIncrementButton";
import {v4 as uuid} from "uuid"

export default {
  name: "SellInputDisplay",
  components: {RateDecrementIncrementButton},
  data: () => ({
    images: [],
    dialog: false
  }),
  props: {
    card: Object
  },
  computed: {
    additionalImagesNotInvIew () {
      // let extraLength = null
      // if (this.images.length > 1) {
      //   extraLength = this.images.length - 1
      // }
      // return extraLength
      return this.images.length - 1
    }
  },
  methods: {
    decrement() {
      if (this.card.count) this.$emit('decrement')
    },
    increment() {
      this.$emit('increment')
    },
    pickImage({target: {files}}) {
      console.log({files})
      const imagesLength = files.length
      const self = this
      for (let i = 0; i < imagesLength; i++) {
        try {
          this.validateImageFile(files[i])
        } catch (e) {
          this.$displaySnackbar(e.message)
          continue
        }
        const fr = new FileReader()
        const id = uuid()
        let imageInfo = {
          id,
          imageFile: files[i]
        }
        fr.onload = function ({target: {result}}) {
          imageInfo.image = result
          console.log(imageInfo)
          self.images.push(imageInfo)
          console.log(self.images, 'images')
          self.$emit('file', self.images)
        }
        fr.readAsDataURL(files[i])
      }
    },
    onNumberInput({target}) {
      const {input__widener} = this.$refs
      input__widener.innerHTML = target.value.replace(/\s/g, '&nbsp;')
      target.style.width = input__widener.offsetWidth + 'px'
      this.$emit('input', +target.value)
    },
    openExplorer() {
      this.$refs.file.click()
    },
    deleteImage(id) {
      this.images = this.images.filter(image => image.id !== id)
      this.$emit('delete-image', id)
    },
    validateImageFile (file) {
      if (file.size > 2000000) {
        throw new Error("File size must not be more than 2mb.")
      }
    }
  }
}
</script>

<style scoped lang="scss">
input {

  &[type="number"] {
    border: 1px solid #333;
    width: 50px;
    padding: 8px 6px;
    height: 36px;
    border-radius: 4px;
    outline: none;
    text-indent: 3px ;
    -moz-appearance: textfield;
  }

  &::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.wrapper {
  max-width: 400px;
}

.input__widener {
  position: absolute;
  left: -9999px;
  display: inline-block;
  min-width: 50px;
  padding: 8px 4px;
  max-width: 100px;
}

.images {
  //background-color: #ccc;
  //border: 1px solid #4f4f4f;
  //width: 50px;
  //height: 55px;
  //border-radius: 4px;

  .image__uploader {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  image {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    object-fit: cover;
  }
}

.more_images {
  background: rgba(0, 0, 0, .04);
  border-radius: 5px;
  color: whitesmoke;
  position: absolute;
  top: 0;
  z-index: 2;
}

.images {
  position: relative;
  cursor: pointer;
}

.image {
  height: 55px;
  width: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.dialog__image {
  width: 300px;
  height: 220px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  object-fit: cover;
  position: relative;
}

.v-card__text {
  overflow-x: auto;
}

.close--btn {
  position: absolute;
  right: -15px;
  top: -6px;
}
</style>