<template>
  <v-dialog v-model="dialog" max-width="400" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="ah-flex ah-justify-between">
        <small class="ah-font-bold">Sell Bitcoin</small>
        <v-btn icon @click="$emit('close')">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <small class="error--text font-weight-bold" v-if="image">Drag and drop, or click the image.</small>
        <div id="dragArea" :class="{'over': draggedOver}" class="pa-22"
             @drop.prevent="uploadImage" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave">
          <input ref="upload" accept="image/png, image/jpeg" @change="uploadImage" class="d-none" type="file">
          <div v-if="!image" class="d-flex justify-center flex-column align-center" style="height: 200px">
            <h4>Please Upload Proof of Payment</h4>
            <div class="d-flex justify-center align-center my-3">
              <v-icon>mdi-download</v-icon>
              <div class="ah-flex ah-justify-between align-center ml-2">
                <p class="mb-0 mr-2 font-weight-bold">Drag and drop <span style="font-weight: normal;">or</span></p>
                <v-btn :color="$vuetify.theme.themes.light.linear__purple1" outlined @click="openExplorer">
                  Browse
                </v-btn>
              </div>
          </div>
          </div>
          <div class="image" v-ripple style="cursor: pointer" v-else @click="openExplorer">
            <v-img :src="image"/>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-center mb-3">
        <v-btn :color="$vuetify.theme.themes.light.linear__purple1" :loading="loading" @click="$emit('submit')" class="sell-btn" depressed>
          Sell Bitcoin
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "BitcoinImageUploader",
  data: () => ({
    draggedOver: false,
  }),
  props: {
    dialog: Boolean,
    loading: Boolean,
    image: String
  },
  methods: {
    openExplorer() {
      this.$refs.upload.click()
    },
    onDragOver() {
      this.draggedOver = true
    },
    onDragLeave() {
      this.draggedOver = false
    },
    uploadImage(e) {
      let file
      if (e.type === 'drop') {
        file = e.dataTransfer.files[0]
      } else {
        this.draggedOver = true
        file = e.target.files[0]
      }
      this.$emit('file', file)
    }
  }
}
</script>

<style lang="scss" scoped>
#dragArea {
  border-radius: 6px;
  border: 1px dashed #2b1c1c;
  width: 100%;
  min-height: 200px;
  background: #faf7f7;
}

.sell-btn {
  color: white;
  text-transform: capitalize;
}

.over {
  border-style: solid !important;
}

.image {
  //width: 350px;
}
</style>