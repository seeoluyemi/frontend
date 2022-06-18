export default {
    methods: {
        formatTransactions (transactions, options = {}) {
            const { action, color } = options
            const getMessage = type => {
                return type === 'sell' ? 'Amount of bitcoin sold' : 'Amount of bitcoin bought'
            }

            transactions = transactions.map(transaction => ({
                rate: transaction.rate.rate,
                value: transaction.amount,
                amount: +transaction.rate.rate,
                status: transaction.progress,
                date: transaction.created_at,
                image: transaction.image_url,
                time: transaction.created_at,
                proof_url: transaction.proof?.img,
                type: transaction.type
            }))
            if (action) {
                transactions.forEach(act => act.action = {message: getMessage(act.type), amount: act.amount})
            }
            if (color) {
                const colors = ['purple', 'blue', 'green', 'yellow']
                transactions.forEach(act => act.color = colors[Math.floor(Math.random() * colors.length)])
            }
            return transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        }
    }
}