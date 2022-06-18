export default {
    bitcoinRate: state => state.bitcoinInfo.splice(0, 3),
    btcInNaira: state => state.btcInNaira
}