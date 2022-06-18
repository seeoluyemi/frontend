export default {
    buyRate: state => {
        return state.price_ratings.find(rate => rate.type === 'buy')
    },
    sellRate: state => {
        return state.price_ratings.find(rate => rate.type === 'sell')
    },
}