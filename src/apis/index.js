import axios from "axios"
import {baseUrl as API_URL} from "@/constants";

// const API_URL = baseUrl
const authHeaders = () => {
    let user = JSON.parse(localStorage.getItem('userData'));
    if (user && user.access_token) return { Authorization: `Bearer ${user.access_token}` }
    else return {}
}
// const headers = authHeaders()
const HTTP_METHODS = {
    GET: 'get',
    POST: 'post',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete'
}

const apiCallResolver = async (method, url, data = null) => {
    switch (method) {
        case HTTP_METHODS.GET:
            return axios(API_URL + url, { headers: authHeaders() })
        case HTTP_METHODS.POST:
            return axios.post(API_URL + url, data, { headers: authHeaders() })
        case HTTP_METHODS.PATCH:
            return axios.patch(API_URL + url, data, { headers: authHeaders() })
        case HTTP_METHODS.PUT:
            return axios.put(API_URL + url, data, { headers: authHeaders() })
        case HTTP_METHODS.DELETE:
            return axios.delete(API_URL + url, { headers: authHeaders() })
        default: return
    }
}

// ON-BOARDING
export const login = async data => {
    const url = "/auth/login"
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const register = async data => {
    const url = "/auth/register"
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const verifyAccount = async data => {
    const url = "/verify"
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const resendVerificationCode = async () => {
    const url = '/auth/mail/resend'
    return apiCallResolver(HTTP_METHODS.POST, url)
}

export const forgotPassword = async data => {
    const url =`/auth/password/reset/mail`
    console.log(url)
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const updateAccount = async (data, id) => {
    const url = `/account/${id}`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const reactivateAccount = async id => {
    const url = `/account/${id}/activate`
    return apiCallResolver(HTTP_METHODS.POST, url)
}


// DELETES
export const deactivateAccount = async id => {
    const url = `/account/${id}/deactivate`
    return apiCallResolver(HTTP_METHODS.DELETE, url)
}

export const deleteRateCalculator = async id => {
    const url = `/rates/${id}`
    return apiCallResolver(HTTP_METHODS.DELETE, url)
}

export const deleteBTCRate = async (id,) => {
    const url = `/bitcoin/rate/${id}`
    return apiCallResolver(HTTP_METHODS.DELETE, url)
}


//FETCHES
export const getUserProgress = async id => {
    const url = `/account/registration-steps/${id}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getUserBalance = async id => {
    const url = `/wallet/${id}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getBitcoinRate = async () => {
    const url = `/bitcoin/rate`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getAllAvailableCards = async () => {
    const url = `/cards`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getAllCountries = async () => {
    const url = `/cards/countries`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getCardTypes = async id => {
    const url = `/cards/types/${id}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getCardRates = async (typeId, countryId) => {
    const url = `/trade/${typeId}/${countryId}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}
export const  fetchWallet = async (userId) => {
    const url = `/wallet/${userId}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getCardRatesWithRanges = async (typeId, countryId) => {
    const url = `/rates/${typeId}/${countryId}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const addCardToPool = async (data) => {
    const url = `/seller/pool`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const getUserTransactions = async (id) => {
    const url = `/trade/transaction/user/${id}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getAllCardTypes = async () => {
    const url = `/trade/all`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getUngroupedCards = async () => {
    const url = `/trade/group/grouping/view/nogroup`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getGroupedCards = async () => {
    const url = `/trade/group/grouping/view/group`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getAllCustomers = async () => {
    const url = `/users/all`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const fetchAllRequests = async () => {
    const url = `/cards/requests`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const notifyUser = async (userId,requestId) => {
    const url = `/cards/requests/notify/${userId}/${requestId}`
    return apiCallResolver(HTTP_METHODS.POST, url)
}

export const getAllRates = async () => {
    const url = `/rates`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getUserActivities = async (id, type, max) => {
    const url = `/user/activity/${id}?activity_type=${type}&limit=${max}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const fetchAllBanks = async () => {
    const url = `/resource/banks`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getUser = async () => {
    const url = `/user`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getUserBTCActivities = () => {
    const url = `/bitcoin/transaction/user`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getALlBitcoin = () => {
    const url = `/bitcoin/transaction`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const fetchAdmins = async () => {
    const url = `/admins/all`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const adminAllTransactions = async () => {
    const url = `/trade/transaction/trade/all/transaction`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const updateCardVerificationStatus = async ({id}) => {
    const url = `/trade/group/grouping/view/pay/${id}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const declineCard = async (id, data) => {
    const url = `/trade/group/grouping/view/reject/${id}`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const fetchAdminPermissions = async id => {
    const url = `/permissions/${id}`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const getSecurityQuestionOTP = async () => {
    const url = `/account/secret/otp`
    return apiCallResolver(HTTP_METHODS.POST, url, { delivery_type: "custom" })
}

export const addSecretQuestion = async (userId, data) => {
    const url = `/account/secret/${userId}`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const getAllBTCTransactions = async () => {
    const url = `/bitcoin/transaction`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

export const uploadBTCProofPayment = async (data) => {
    const url = `/bitcoin/transaction/payment/proof`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const decideBTCTransaction = async (id, data) => {
    const url = `/bitcoin/transaction/${id}`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const fetchAllPermissions = async () => {
    const url = `/permissions`
    return apiCallResolver(HTTP_METHODS.GET, url)
}

//UPDATES
export const updatePassword = async (id, data) => {
    const url = `/account/password-update/${id}`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const updateAccountSettings = async (id, data) => {
    const url = `/account/settings/${id}`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const updateCardType = async (id, data) => {
    const url = `/cards/types/${id}/update`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const updateGiftcardTitle = async (id, data) => {
    const url = `/cards/${id}/update`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const updateBTCRate = async (id, data) => {
    const url = `/bitcoin/rate/${id}`
    return apiCallResolver(HTTP_METHODS.PATCH, url, data)
}

export const assignPermission = async data => {
    const url = `/permissions`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const revokePermission = async (permission_id) => {
    const url = `/permissions/${permission_id}`
    return apiCallResolver(HTTP_METHODS.DELETE, url)
}


export const groupCards = async data => {
    const url = `/trade/group`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const getBuyTransactions = async () => {
    const url = `/trade/transaction/type/buy`
    return apiCallResolver(HTTP_METHODS.GET, url)
}


// CREATIONS
export const createCard = async data => {
    const url = `/cards/create`
    console.log(data)
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const createCardType = async (cardId, data) => {
    const url = `/cards/types/${cardId}/create`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const createCardTradeRate = async data => {
    const url = `/trade`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const tradeGiftCard = async data => {
    const url = `/trade/transaction`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export  const creditWallet = async (userId,data) => {
    const  url =   `/wallet/credit/${userId}`;
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export  const debitWallet = async (userId,data) => {
    const  url =   `/wallet/debit/${userId}`;
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}


export const generateVirtualAccount = async id => {
    const url = `/wallet/account/generate/${id}`
    return apiCallResolver(HTTP_METHODS.POST, url)
}

export const createRateCalculator = async data => {
    const url = `/rates`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const editRateCalculator = async (data, id) => {
    const url = `/rates/${id}`
    return apiCallResolver(HTTP_METHODS.PUT, url, data)
}

export const createBTCTransaction = async data => {
    const url = `/bitcoin/transaction`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const createBTCRate = async data => {
    const url = `/bitcoin/rate`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const createAdmin = async data => {
    const url = `/account`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const creditUserWallet = async (id, data) => {
    const url = `/wallet/admin/credit/${id}`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const debitUserWallet = async (id, data) => {
    const url = `/wallet/admin/debit/${id}`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}

export const requestCard = async data => {
    const url = `/cards/requests`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}



// UPLOADS

export const uploadToAzureViaAlaje = data => {
    const url = `/resource/upload-asset`
    console.log(data)
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}


//customer complaints

export const sendComplaint = data => {
    const url = `/customer/complaint/send`
    return apiCallResolver(HTTP_METHODS.POST, url, data)
}
