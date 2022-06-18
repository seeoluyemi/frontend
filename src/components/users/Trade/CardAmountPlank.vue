<template>
  <div class="plank col-box my-4 px-3 py-4 d-flex justify-space-between ah-flex-col sm:ah-flex-row">
    <div class="d-flex align-center justify-center">
      <p class="mb-0 mr-1">{{`$${denomination}`}}</p><small>{{`(&#8358;${$numberToAmount(rate).format('0,0')}/$)`}}</small>
    </div>
    <div class="d-flex justify-end align-center ah-w-full sm:ah-w-1/2 ah-flex-col sm:ah-flex-row">
      <div class="images d-flex align-center my-4 my-sm-0" v-if="$route.query.trade_type === 'sell'">
        <div class="card-img" v-for="n in images.length >= 2 ? 2 : images.length === 1 ? 1 : 0" :style="{backgroundImage: `url(${backgroundImage(images[n - 1])})`}" :key="n">
          <div class="cancel-image" @click="removeImage(images[n-1].id)"><v-icon :size="20">mdi-close</v-icon></div>
          <div class="more_images ah-h-full ah-w-full ah-flex ah-items-center ah-justify-center" v-if="n === 2 && images.length > 2"><p class="mb-0 ah-text-4xl">+{{additionalImagesNotInvIew}}</p></div>
        </div>
        <div class="add-img d-flex justify-center align-center">
          <v-btn small icon width="30px" :disabled="!count">
            <label :for="`card_sell_images + ${id}`">
              <v-icon :color="$vuetify.theme.themes.light.deep__purple">mdi-cloud-upload-outline</v-icon>
            </label>
            <input class="ah-hidden" :id="`card_sell_images + ${id}`" type="file" multiple @change="pickFiles">
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <rate-decrement-increment-button sign="minus" @click="decrement"/>
        <p :style="{ color: $vuetify.theme.themes.light.linear__purple1 }" class="mb-0 mx-4 font-weight-bold">
          {{ count }}
        </p>
        <rate-decrement-increment-button sign="add" @click="increment"/>
      </div>
    </div>
  </div>
</template>

<script>
import RateDecrementIncrementButton from "@/components/users/Trade/RateDecrementIncrementButton";
import {v4 as uuid} from "uuid";

export default {
  name: "CardAmountPlank",
  components: {RateDecrementIncrementButton},
  data: () => ({
    localCount: 0,
    images: [],
    imgLength: 0,
  }),
  computed: {
    additionalImagesNotInvIew() {
      let length = ''
      console.log(this.images.length)
      if (this.images.length > 2) {
        console.log('yes')
        length = '+' + this.images.length - 2
      }
      console.log(length)
      return length
    },
    backgroundImage() {
      return (image) => {
        if (image && image.baseEnconded) {
          return image.baseEnconded
        } else return ''
      }
    }
  },
  methods: {
    decrement() {
      if (this.count > 0) {
        // this.localCount--
        this.$emit('decrement')
      }
    },
    increment() {
      // this.localCount++
      if (this.$route.query.trade_type === 'buy') {
        if (this.availability_count >= this.count + 1)
          this.$emit('increment')
        else {
          this.$displaySnackbar("The number of cards you are requesting is not available.")
        }
      } else {
        this.$emit('increment')
      }
    },
    pickFiles(evt) {
      const files = evt.target.files
      const length = files.length
      for (let i = 0; i < length; i++) {
        try {
          this.validateImageFile(files[i])
        } catch (e) {
          this.$displaySnackbar(e.message)
          continue
        }
        const reader = new FileReader()
        let image = {
          imageFile: files[i]
        }
        reader.onload = e => {
          image.id = uuid()
          image.baseEnconded = e.target.result
          this.images.push(image)
          this.$emit('upload', {files: this.images})
        }
        reader.readAsDataURL(files[i])
      }
    },
    removeImage(id) {
      this.images = this.images.filter(image => image.id !== id)
      this.$emit('upload', {files: this.images, id: this.id})
    },
    validateImageFile (file) {
      if (file.size > 2000000) {
        throw new Error("File size must not be more than 2mb.")
      }
    }
  },
  watch: {
    // count: {
    //   handler: function (value) {
    //     this.localCount = value
    //   },
    //   immediate: true,
    // }
  },
  props: {
    rate: [Number, String],
    denomination: [Number, String],
    count: Number,
    id: String,
    availability_count: [String, Number]
    // images: Array
  }
}
</script>

<style scoped lang="scss">
  .card-img {
    width: 100px;
    height: 60px;
    border-radius: 5px;
    /*background: #f8f8f8;*/
    margin-left: 4px;
    margin-right: 4px;
    position: relative;
    background-position: center;
    background-size: cover;
  }


  .cancel-image {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #f8f8f8;
    cursor: pointer;
  }

  .add-img {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    background: #f8f8f8;
    margin-left: 4px;
    margin-right: 4px;
    position: relative;
    cursor: pointer;

    &:before {
      content: 'Upload image';
      transition: all .1s ease;
      transform: scale(0);
      position: absolute;
      width: 120px;
      height: 30px;
      font-size: 12px;
      background: #291e1e;
      color: whitesmoke;
      font-weight: 500;
      top: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      margin-top: 5px;
    }

    &:hover {
      &:before {
        transform: scale(1);
      }
    }
  }

  .more_images {
    background: rgba(0, 0, 0, .04);
    border-radius: 5px;
    color: whitesmoke;
  }
</style>