// const getImages = boughtItems => {
//     let imagesArray = boughtItems[0]?.images
//     return imagesArray?.map(({image_url}) => image_url) ?? []
// }


const getBuyTableObject = transactions =>
    transactions
        .filter(transaction => transaction.type === 'buy')
        .map(transaction => {
            if (transaction.type === 'buy') {
                const transactionTotalValue = transaction.item.map(({count, rate: {denomination, rate}}) => {
                    return count * denomination * rate
                }).reduce((a, b) => a + b)

                const transactionItems = transaction.item
                    .map(({count, rate: {denomination, rate}, bought, progress, id}) =>
                        ({
                            count,
                            denomination,
                            progress,
                            id,
                            rate,
                            amount: denomination * rate,
                            boughtItems: bought.map(({id, images, payment_status, verification}) => ({id, images, payment_status, verification}))
                        }))
                const totalCount = transaction.item.map(({count}) => count).reduce((a, b) => a + b)


                return ({
                    date: transaction.created_at,
                    giftcard: transaction.item[0].rate.cardtype.giftcard.title,
                    status: transaction.progress,
                    value: transactionTotalValue,
                    type: transaction.type,
                    items: transactionItems,
                    totalCount: totalCount,
                    ref: transaction.id,
                    user: transaction.user.name
                })
            }
        })

const getSellTableObject = (transactions) => {
    return transactions
        .filter(transaction => transaction.type === 'sell')
        .map((transaction) => {
            let {item: items, user} = transaction
            const {sell} = items[0]

            items = items.map(item => ({...item, images: item.images.map((image) => ({image_url: image.image_url, group: image.group, id: image.id}))}))
            const status = (function () {
                if (items.every(item => item.progress === 'completed')) return 'completed'
                if (items.every(item => item.progress === 'cancelled')) return 'cancelled'
                return 'pending'
            })()
            if (sell === null) {
                return {
                    date: transaction.created_at,
                    gift_card: '',
                    status,
                    items,
                    totalCount: 0,
                    amount: 0,
                    rate: 0,
                    type: transaction.type,
                    ref: transaction.id,
                    user: user.name
                }
            }
            return {
                date: transaction.created_at,
                giftcard: sell.cardtype.giftcard.title,
                status,
                value: items.reduce((acc, curr) => (acc + (curr.count * curr.amount * curr.sell.rate)), 0),
                items,
                rate: sell.rate,
                type: transaction.type,
                totalCount: items.reduce((acc, curr) => acc + curr.count, 0),
                ref: transaction.id,
                user: user.name
                // images,
            }
        })
}

const processTransactionsToFitTableHeaders = transactions => {
    const buyObjects = getBuyTableObject(transactions)
    const sellObjects = getSellTableObject(transactions)
    console.log({sellObjects, buyObjects})
    return buyObjects.concat(sellObjects).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export default {
    headers: state => state.purchaseHeaders,
    items: state => state.purchaseItems,
    recentTransactions: state => {
        return processTransactionsToFitTableHeaders(state.userTransactions).splice(0, 5)
    },
    userTransactions: state => processTransactionsToFitTableHeaders(state.userTransactions),
    adminAllTransactions: state => processTransactionsToFitTableHeaders(state.usersTransactions)
}