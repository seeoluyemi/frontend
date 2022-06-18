import _ from "lodash"

export const convertToUnit = (unit) => {
    if (unit === null || unit === undefined || unit === '') return undefined
    else if (isNaN(+unit)) return String(unit)
    else {
        return unit + 'px'
    }
}

export const capitalizeStr = str => {
    let _split = str.split('-')
    return _split.map(split => capitalize(split)).join(' ')
   //  console.log(_split)
   // return _split.join(' ')
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const removeSeparatingCommas = num => {
    console.log(num)
    return +(num.split(',').join(''))
}

export const removeUnwantedProps = (model, props) => {
    let keys = Object.keys(model)
    keys = keys.filter(key => !props.includes(key))
    let newModel = {}
    keys.map(key => newModel[key] = model[key])
    return newModel
}


export const emptyObject =(target, defaults = {}) => {
    console.log(target)
    const result = {}
    const targetKeys = Object.keys(target)
    if(!_.isEmpty(defaults)) {
        const keysOfDefinedDefaults = Object.keys(defaults)
        console.log(keysOfDefinedDefaults)
        targetKeys.forEach(targetKey => {
            if (keysOfDefinedDefaults.includes(targetKey)) {
                result[targetKey] = defaults[targetKey]
            } else {
                result[targetKey] = _.isArray(target[targetKey]) ? [] : getPropertyDefaultValueByType(typeof target[targetKey])
            }
        })
    } else {
        targetKeys.forEach(targetKey => {
            result[targetKey] = _.isArray(target[targetKey]) ? [] : getPropertyDefaultValueByType(typeof target[targetKey])
        })
    }
    return result
}

const getPropertyDefaultValueByType = (type) => {
    const types = {
        'string': '',
        'undefined': undefined,
        'number': null,
        'object': {},
        'boolean': false
    }
    return types[type]
}