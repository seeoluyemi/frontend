const { BlobServiceClient, ShareServiceClient } = require("@azure/storage-file-share");
// import azure from "@/plugins/azure";
//
// const account = 'alaje'
//
// const credential = new StorageSharedKeyCredential(account, azure.sasToken)
// console.log(credential)
// const serviceClient = new ShareServiceClient(`https://${account}.file.core.net`, credential)
// const shareName = 'profile_pictures'
// const directoryName = 'userImages'
//
async function main() {
    console.log(BlobServiceClient, ShareServiceClient)
    // const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(directoryName);
    // console.log(directoryClient)
    // const content = "Hello World!";
    // const fileName = "newfile" + new Date().getTime();
    // const fileClient = directoryClient.getFileClient(fileName);
    // await fileClient.create(content.length);
    // console.log(`Create file ${fileName} successfully`);
    //
    // // Upload file range
    // await fileClient.uploadRange(content, 0, content.length);
    // console.log(`Upload file range "${content}" to ${fileName} successfully`);
}


export default main