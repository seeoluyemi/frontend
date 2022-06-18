export default {
    setSelectedBrand: (state, id) => state.selectedBrand = state.brands.find(brand => brand.id === id),
    setAvailableCountries: (state, countries) => state.availableCountries = countries,
    setBrands: (state, brands) => state.brands = brands,
    setCardTypes: (state, cardTypes) => state.cardTypes = cardTypes,
    setSelectedCountry: (state, country) => state.selectedCountry = country,
    cancelSelectedBrand: state => state.selectedBrand = {id: null},
    setSelectedCardType: (state, cardType) => state.selectedCardType = cardType,
    setFetchingTypes: (state, loading) => state.fetchingTypes = loading
}