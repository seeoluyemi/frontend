// export const baseUrl = "https://api.local.alaje.hub.test/v1"
// https://alajeprojectapi-dev.azurewebsites.net/
export const baseUrl = process.env.VUE_APP_API_URL


export const adminPermissions = {
    'usermanagement': '',
    'transactions': 'handle-transactions',
    'giftcardmanagement': 'manage-gift-card',
    'bitcoinmanagement': 'manage-funds',
    'adminmanagement': 'create-user'
}