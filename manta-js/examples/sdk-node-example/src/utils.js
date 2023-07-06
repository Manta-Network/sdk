const path = require('path')

const getDbPath = (palletName, network, address) => {
  return path.resolve(__dirname, `../db/${palletName}_${network}_${address}`)
}

const overrideToJSON = () => {
  let beforeBigIntToJSON = BigInt.prototype.toJSON
  let beforeUint8ArrayToJSON = Uint8Array.prototype.toJSON
  let beforeMapToJSON = Map.prototype.toJSON

  BigInt.prototype.toJSON = function () {
    return {
      ___type___: 'BigInt',
      value: this.toString(),
    }
  }

  Uint8Array.prototype.toJSON = function () {
    return {
      ___type___: 'Uint8Array',
      value: Array.from(this),
    }
  }

  Map.prototype.toJSON = function () {
    return {
      ___type___: 'Map',
      value: JSON.stringify(Array.from(this.entries())),
    }
  }

  return () => {
    BigInt.prototype.toJSON = beforeBigIntToJSON
    Uint8Array.prototype.toJSON = beforeUint8ArrayToJSON
    Map.prototype.toJSON = beforeMapToJSON
  }
}

const formatStateToJson = (state) => {
  const revert = overrideToJSON()
  const result = JSON.stringify(state, (key, value) => {
    return value === undefined ? '___undefined___' : value
  })
  revert()
  return result
}
const revertJsonToState = (json) => {
  const formatJSON = JSON.parse(json)
  const walk = (value) => {
    if (value instanceof Array) {
      return value.map(walk)
    } else if (value instanceof Object && Object.keys(value).length > 0) {
      if (value.___type___) {
        if (value.___type___ === 'BigInt') {
          return BigInt(value.value)
        } else if (value.___type___ === 'Uint8Array') {
          return Uint8Array.from(value.value)
        } else if (value.___type___ === 'Map') {
          const json = JSON.parse(value.value)
          return new Map(json.map(walk))
        }
      } else {
        Object.keys(value).forEach((key) => {
          value[key] = walk(value[key])
        })
        return value
      }
    } else if (typeof value === 'string' && value === '___undefined___') {
      return undefined
    } else {
      return value
    }
  }
  const result = walk(formatJSON)
  return result
}

const saveStorageState = async (db, data) => {
  await db.put('value', formatStateToJson(data))
  return true
}

const getStorageState = async (db) => {
  try {
    const result = await db.get('value')
    return result ? revertJsonToState(result) : null
  } catch (ex) {
    return null
  }
}

module.exports = {
  getDbPath,
  saveStorageState,
  getStorageState,
}
