import {v4 as uuid} from "uuid"
import {uploadToAzureViaAlaje} from "@/apis";

export default {
    data: () => ({
        images: []
    }),
    methods: {
        addImage() {
            this.$refs.file_input.click()
        },
        storeImages({target: {files}}) {
            const file = files[0]
            const id = uuid()
            const image = {file, base64: '', id}
            const fr = new FileReader()
            const self = this
            fr.onload = function ({target}) {
                image.base64 = target.result
                self.images.push(image)
            }
            fr.readAsDataURL(file)
        },
        deleteImage(image_id) {
            this.images = this.images.filter(image => image.id !== image_id)
        },
        async uploadImages() {
            const images = []
            let isError = false
            let error;
            console.log(this.images)
            for (const image of this.images.map(thisImage => thisImage.file)) {
                const formData = new FormData()
                formData.append('asset_file', image)
                try {
                    const {data: {data: {asset}}} = await uploadToAzureViaAlaje(formData)
                    images.push(asset)
                } catch (e) {
                    this.$displaySnackbar(e)
                    isError = true
                    error = e
                    break
                }
            }
            if (isError) {
                throw error
            }
            return images
        },
    }
}