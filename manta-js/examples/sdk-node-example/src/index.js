const BN = require('bn.js')

const { Keyring } = require('@polkadot/keyring')
const { cryptoWaitReady } = require('@polkadot/util-crypto')
const { ClassicLevel } = require('classic-level')

const { BaseWallet, MantaPayWallet } = require('manta-extension-sdk/node')

const { saveStorageState, getStorageState, getDbPath } = require('./utils')

const loggingEnabled = true
const currentNetwork = 'Calamari'
const endPoint = ['wss://calamari.systems']
const maxTransactionCount = 4

let storageStateDb = null

const getPair = (publicAccountSeedPhrase) => {
  const keyring = new Keyring({ type: 'sr25519' })
  const pair = keyring.createFromUri(publicAccountSeedPhrase)
  return pair
}

const sendTransaction = async (pair, transaction) => {
  for (let i = 0; i < transaction.txs.length; i += 1) {
    await transaction.txs[i].signAndSend(pair, { nonce: -1 })
  }
}

const getBaseWallet = async () => {
  const baseWallet = await BaseWallet.init({
    apiEndpoint: endPoint,
    loggingEnabled,
    provingFilePath:
      'https://media.githubusercontent.com/media/Manta-Network/manta-rs/main/manta-parameters/data/pay/proving',
    parametersFilePath:
      'https://raw.githubusercontent.com/Manta-Network/manta-rs/main/manta-parameters/data/pay/parameters',
    async saveStorageStateToLocal(palletName, network, data) {
      const result = await saveStorageState(storageStateDb, data)
      return result
    },
    async getStorageStateFromLocal(palletName, network) {
      const result = await getStorageState(storageStateDb)
      return result
    },
  })
  return baseWallet
}

const getMantaPayWallet = async (baseWallet, zkAccountSeedPhrase) => {
  const mantaPayWallet = MantaPayWallet.init(currentNetwork, baseWallet)

  const dbPath = getDbPath(
    mantaPayWallet.palletName,
    currentNetwork,
    getPair(zkAccountSeedPhrase).address,
  )
  // must be called before `mantaPayWallet.initialSigner`
  storageStateDb = new ClassicLevel(dbPath, { valueEncoding: 'json' })

  await mantaPayWallet.initialSigner()
  await mantaPayWallet.loadUserSeedPhrase(zkAccountSeedPhrase)
  const zkAddress = await mantaPayWallet.getZkAddress()
  console.log(`zkAddress: ${zkAddress}`)
  return mantaPayWallet
}

const initialWallet = async (
  baseWallet,
  zkAccountSeedPhrase,
  publicAccountSeedPhrase,
) => {
  const mantaPayWallet = await getMantaPayWallet(
    baseWallet,
    zkAccountSeedPhrase,
  )

  const publicPair = getPair(publicAccountSeedPhrase)

  return {
    mantaPayWallet,
    async toPrivateSend(assetId, amount) {
      const transaction = await mantaPayWallet.toPrivateBuild(
        new BN(assetId),
        new BN(amount),
      )
      await sendTransaction(publicPair, transaction)
      console.log(`toPrivateSend done, assetId: ${assetId}, amount: ${amount}`)
    },
    async privateTransferSend(assetId, amount, toZkAddress) {
      const assetIdBn = new BN(assetId)
      const amountBn = new BN(amount)
      const estimateTransactionCount =
        await mantaPayWallet.estimateTransferPostsCount(
          'privateToPrivate',
          assetIdBn,
          amountBn,
          toZkAddress,
        )
      if (estimateTransactionCount > maxTransactionCount) {
        console.error(
          `privateTransferSend error, estimateTransactionCount larger than ${maxTransactionCount}, (${estimateTransactionCount}), please consolidate assets first`,
        )
        return
      }
      const transaction = await mantaPayWallet.privateTransferBuild(
        assetIdBn,
        amountBn,
        toZkAddress,
      )
      await sendTransaction(publicPair, transaction)
      console.log(
        `privateTransferSend done, assetId: ${assetId}, amount: ${amount}, toZkAddress: ${toZkAddress}`,
      )
    },
    async toPublicSend(assetId, amount, toPublicAccount) {
      const assetIdBn = new BN(assetId)
      const amountBn = new BN(amount)
      const formatToPublicAddress = toPublicAccount || publicPair.address
      const estimateTransactionCount =
        await mantaPayWallet.estimateTransferPostsCount(
          'privateToPublic',
          assetIdBn,
          amountBn,
          formatToPublicAddress,
        )
      if (estimateTransactionCount > maxTransactionCount) {
        console.error(
          `toPublicSend error, estimateTransactionCount larger than ${maxTransactionCount}, (${estimateTransactionCount}), please consolidate assets first`,
        )
        return
      }
      const transaction = await mantaPayWallet.toPublicBuild(
        assetIdBn,
        amountBn,
        formatToPublicAddress,
      )
      await sendTransaction(publicPair, transaction)
      console.log(
        `toPublicSend done, assetId: ${assetId}, amount: ${amount}, toPublicAccount: ${formatToPublicAddress}`,
      )
    },
  }
}

const start = async () => {
  await cryptoWaitReady()
  const baseWallet = await getBaseWallet()
  await baseWallet.isApiReady()

  const zkAccountSeedPhrase =
    'steak jelly sentence pumpkin crazy fantasy album uncover giant novel strong message'
  const publicAccountSeedPhrase = zkAccountSeedPhrase

  const actions = await initialWallet(
    baseWallet,
    zkAccountSeedPhrase,
    publicAccountSeedPhrase,
  )

  await actions.mantaPayWallet.initialWalletSync()
  const balance = await actions.mantaPayWallet.getZkBalance('1')
  console.log(`KMA Balance: ${balance.toString()}`)

  // test toPrivate transfer
  console.log('Test 1/3: toPrivate')
  await actions.toPrivateSend('1', String(1 * 10 ** 12))
  console.log('Test 1/3: toPrivate done')

  await new Promise((resolve) => {
    setTimeout(resolve, 48 * 1000)
  })
  await actions.mantaPayWallet.walletSync()

  // test toPublic transfer
  console.log('Test 2/3: toPublic')
  await actions.toPublicSend('1', String(1 * 10 ** 12))
  console.log('Test 2/3: toPublic done')

  await new Promise((resolve) => {
    setTimeout(resolve, 48 * 1000)
  })
  await actions.mantaPayWallet.walletSync()

  // test private transfer
  console.log('Test 3/3: privateTransfer')
  await actions.privateTransferSend(
    '1',
    String(1 * 10 ** 12),
    '2aE8dmGPpw74p8eco7y58Aj1THWhEL4YrYp9xULMQDDy',
  )
  console.log('Test 3/3: privateTransfer done')

  console.log('All test done')
  
  process.exit(0);
}

start()
