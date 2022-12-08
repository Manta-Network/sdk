var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ApiPromise, WsProvider } from '@polkadot/api';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
// TODO: remove this dependency with better signer integration
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
// @ts-ignore
import Api, { ApiConfig } from 'manta-wasm-wallet-api';
import axios from 'axios';
import BN from 'bn.js';
import config from './manta-config.json';
var rpc = config.RPC;
var types = config.TYPES;
var DEFAULT_PULL_SIZE = config.DEFAULT_PULL_SIZE;
var SIGNER_URL = config.SIGNER_URL;
/// TODO: NFT stuff
var PRIVATE_ASSET_PREFIX = "p";
var NFT_AMOUNT = 1000000000000;
/// The Envrionment that the sdk is configured to run for, if development
/// is selected then it will attempt to connect to a local node instance.
/// If production is selected it will attempt to connect to actual node.
export var Environment;
(function (Environment) {
    Environment["Development"] = "DEV";
    Environment["Production"] = "PROD";
})(Environment || (Environment = {}));
/// Supported networks.
export var Network;
(function (Network) {
    Network["Dolphin"] = "Dolphin";
    Network["Calamari"] = "Calamari";
    Network["Manta"] = "Manta";
})(Network || (Network = {}));
/// MantaSdk class
var MantaSdk = /** @class */ (function () {
    function MantaSdk(api, signer, wasm, wasmWallet, network, environment, wasmApi) {
        this.api = api;
        this.signer = signer;
        this.wasm = wasm;
        this.wasmWallet = wasmWallet;
        this.network = network;
        this.environment = environment;
        this.wasmApi = wasmApi;
    }
    ///
    /// SDK methods
    ///
    /// Converts a javascript number to Uint8Array(32), which is the type of AssetId and used
    /// for all transactions.
    /// @TODO: Add proper implementation for this method. 
    MantaSdk.prototype.numberToAssetIdArray = function (assetIdNumber) {
        return numberToUint8Array(assetIdNumber);
    };
    /// Converts an AssetId of type [u8;32] to a number.
    /// Assumes that AssetId Uint32Array is in little endian order.
    MantaSdk.prototype.assetIdArrayToNumber = function (assetId) {
        return uint8ArrayToNumber(assetId);
    };
    /// Convert a private address to JSON.
    MantaSdk.prototype.convertPrivateAddressToJson = function (address) {
        return privateAddressToJson(address);
    };
    /// Switches MantaSdk environment.
    /// Requirements: Must call initialWalletSync() after switching to a different
    /// environment, to pull the latest data before calling any other methods.
    MantaSdk.prototype.setEnvironment = function (environment) {
        return __awaiter(this, void 0, void 0, function () {
            var sdk, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (environment === this.environment) {
                            return [2 /*return*/];
                        }
                        sdk = init(environment, this.network, this.signer);
                        _a = this;
                        return [4 /*yield*/, sdk];
                    case 1:
                        _a.api = (_f.sent()).api;
                        _b = this;
                        return [4 /*yield*/, sdk];
                    case 2:
                        _b.signer = (_f.sent()).signer;
                        _c = this;
                        return [4 /*yield*/, sdk];
                    case 3:
                        _c.wasm = (_f.sent()).wasm;
                        _d = this;
                        return [4 /*yield*/, sdk];
                    case 4:
                        _d.wasmWallet = (_f.sent()).wasmWallet;
                        _e = this;
                        return [4 /*yield*/, sdk];
                    case 5:
                        _e.wasmApi = (_f.sent()).wasmApi;
                        this.environment = environment;
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Switches MantaSdk to a different network.
    /// Requirements: Must call initialWalletSync() after switching to a different
    /// network, to pull the latest data before calling any other methods.
    MantaSdk.prototype.setNetwork = function (network) {
        return __awaiter(this, void 0, void 0, function () {
            var sdk, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (network === this.network) {
                            return [2 /*return*/];
                        }
                        sdk = init(this.environment, network, this.signer);
                        _a = this;
                        return [4 /*yield*/, sdk];
                    case 1:
                        _a.api = (_f.sent()).api;
                        _b = this;
                        return [4 /*yield*/, sdk];
                    case 2:
                        _b.signer = (_f.sent()).signer;
                        _c = this;
                        return [4 /*yield*/, sdk];
                    case 3:
                        _c.wasm = (_f.sent()).wasm;
                        _d = this;
                        return [4 /*yield*/, sdk];
                    case 4:
                        _d.wasmWallet = (_f.sent()).wasmWallet;
                        _e = this;
                        return [4 /*yield*/, sdk];
                    case 5:
                        _e.wasmApi = (_f.sent()).wasmApi;
                        this.network = network;
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Returns information about the currently supported networks.
    MantaSdk.prototype.networks = function () {
        return config.NETWORKS;
    };
    ///
    /// Signer methods
    ///
    /// Returns the zkAddress of the currently connected manta-signer instance.
    MantaSdk.prototype.privateAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var privateAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPrivateAddress(this.wasm, this.wasmWallet, this.network)];
                    case 1:
                        privateAddress = _a.sent();
                        return [2 /*return*/, privateAddress];
                }
            });
        });
    };
    /// Returns the currently connected public polkadot.js address.
    MantaSdk.prototype.publicAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.signer];
            });
        });
    };
    /// Performs full wallet recovery. Restarts `self` with an empty state and
    /// performs a synchronization against the signer and ledger to catch up to
    /// the current checkpoint and balance state.
    ///
    /// Requirements: Must be called once after creating an instance of MantaSdk 
    /// and must be called before walletSync(). Must also be called after every 
    /// time the network is changed.
    MantaSdk.prototype.initalWalletSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, init_sync(this.wasm, this.wasmWallet, this.network)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Pulls data from the ledger, synchronizing the currently connected wallet and
    /// balance state. This method runs until all the ledger data has arrived at and
    /// has been synchronized with the wallet.
    MantaSdk.prototype.walletSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sync(this.wasm, this.wasmWallet, this.network)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Returns the version of the currently connected manta-signer instance.
    MantaSdk.prototype.signerVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_signer_version()];
                    case 1:
                        version = _a.sent();
                        return [2 /*return*/, version];
                }
            });
        });
    };
    ///
    /// Fungible token methods
    ///
    /// Returns the metadata for an asset with a given `asset_id` for the currently
    /// connected network.
    MantaSdk.prototype.assetMetaData = function (asset_id) {
        return __awaiter(this, void 0, void 0, function () {
            var assetIdNumber, data, json, jsonObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetIdNumber = this.assetIdArrayToNumber(asset_id);
                        return [4 /*yield*/, this.api.query.assetManager.assetIdMetadata(assetIdNumber)];
                    case 1:
                        data = _a.sent();
                        json = JSON.stringify(data.toHuman());
                        jsonObj = JSON.parse(json);
                        return [2 /*return*/, jsonObj];
                }
            });
        });
    };
    /// Returns the private balance of the currently connected zkAddress for the currently
    /// connected network.
    MantaSdk.prototype.privateBalance = function (asset_id) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_private_balance(this.wasmWallet, asset_id)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    /// Returns the public balance associated with an account for a given `asset_id`.
    /// If no address is provided, the balance will be returned for this.signer.
    MantaSdk.prototype.publicBalance = function (asset_id, address) {
        if (address === void 0) { address = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var targetAddress, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetAddress = address;
                        if (!targetAddress) {
                            targetAddress = this.signer;
                        }
                        return [4 /*yield*/, get_public_balance(this.api, asset_id, targetAddress)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    /// Executes a "To Private" transaction for any fungible token, using the post method.
    MantaSdk.prototype.toPrivatePost = function (asset_id, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, to_private_by_post(this.wasm, this.wasmWallet, asset_id, amount, this.network)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /// Executes a "To Private" transaction for any fungible token.
    /// Optional: The `onlySign` flag allows for the ability to sign and return
    /// the transaction without posting it to the ledger.
    MantaSdk.prototype.toPrivateSign = function (asset_id, amount, onlySign) {
        if (onlySign === void 0) { onlySign = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, to_private_by_sign(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, this.network, onlySign)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /// Executes a "Private Transfer" transaction for any fungible token.
    /// Optional: The `onlySign` flag allows for the ability to sign and return
    /// the transaction without posting it to the ledger.
    MantaSdk.prototype.privateTransfer = function (asset_id, amount, address, onlySign) {
        if (onlySign === void 0) { onlySign = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, private_transfer(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, address, this.network, onlySign)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /// Executes a public transfer of `asset_id` for an amount of `amount` from the address
    /// of this.signer to `address`.
    MantaSdk.prototype.publicTransfer = function (asset_id, amount, address) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_transfer(this.api, this.signer, asset_id, address, amount)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /// Executes a "To Public" transaction for any fungible token.
    /// Optional: The `onlySign` flag allows for the ability to sign and return
    /// the transaction without posting it to the ledger.
    MantaSdk.prototype.toPublic = function (asset_id, amount, onlySign) {
        if (onlySign === void 0) { onlySign = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, to_public(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, amount, this.network, onlySign)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ///
    /// Non fungible token methods
    ///
    /// Collection ID : The ID corresponding to the NFT collection.
    ///
    /// Item ID: The ID corresponding to a given item (NFT) of a collection.
    ///
    /// Asset ID: The ID derived from combining a Collection ID with an Item ID,
    /// this is used for transacting NFTs on mantapay.
    /// Executes a "To Private" transaction for any non-fungible token.
    MantaSdk.prototype.toPrivateNFT = function (asset_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, to_private_nft(this.signer, this.api, this.wasm, this.wasmWallet, asset_id, this.network)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Executes a "Private Transfer" transaction for any non-fungible token.
    MantaSdk.prototype.privateTransferNFT = function (asset_id, address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, private_transfer_nft(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, address, this.network)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Transfer a public NFT to another address, using the mantaPay pallet.
    MantaSdk.prototype.publicTransferNFT = function (asset_id, address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, publicTransferNFT(this.api, this.signer, asset_id, address)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Executes a "To Public" transaction for any non-fungible token.
    MantaSdk.prototype.toPublicNFT = function (asset_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, to_public_nft(this.api, this.signer, this.wasm, this.wasmWallet, asset_id, this.network)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Creates an NFT collection
    /// Returns the newly created collections ID
    MantaSdk.prototype.createCollection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createNFTCollection(this.api, this.signer)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /// Creates a new NFT as a part of an existing collection with collection id of
    /// `collectionId` and item Id of `itemId` to the destination address of `address`.
    /// Note: if no address is provided, the NFT will be minted to the address of this.signer
    /// Registers the NFT in Asset Manager and returns the unique Asset ID.
    MantaSdk.prototype.mintNFT = function (collectionId, itemId, address) {
        if (address === void 0) { address = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var targetAddress, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetAddress = address;
                        if (!address) {
                            targetAddress = this.signer;
                        }
                        return [4 /*yield*/, createNFT(this.api, collectionId, itemId, targetAddress, this.signer)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /// Updates the metadata of the NFT
    MantaSdk.prototype.updateNFTMetadata = function (collectionId, itemId, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, updateMetadata(this.api, collectionId, itemId, metadata, this.signer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// Executes a batch transaction of minting the NFT and setting the metadata at once.
    MantaSdk.prototype.mintNFTAndSetMetadata = function (collectionId, itemId, address, metadata) {
        if (address === void 0) { address = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var targetAddress, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetAddress = address;
                        if (!address) {
                            targetAddress = this.signer;
                        }
                        return [4 /*yield*/, createNFTAndSetMetadata(this.api, collectionId, itemId, targetAddress, this.signer, metadata)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /// Returns the metadata associated with a particular NFT of with collection id of
    /// `collectionId` and item Id of `itemId`.
    MantaSdk.prototype.getNFTMetadata = function (collectionId, itemId) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, viewMetadata(this.api, collectionId, itemId)];
                    case 1:
                        metadata = _a.sent();
                        return [2 /*return*/, metadata];
                }
            });
        });
    };
    /// View all NFTs owned by `address` of a particular `collectionId`. If address is not
    /// specified the sdk address will be used.
    MantaSdk.prototype.viewAllNFTsInCollection = function (collectionId, address) {
        if (address === void 0) { address = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var targetAddress, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetAddress = address;
                        if (!address) {
                            targetAddress = this.signer;
                        }
                        return [4 /*yield*/, allNFTsInCollection(this.api, collectionId, targetAddress)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /// Returns the address of the owner of an NFT with a particular assetId
    MantaSdk.prototype.getNFTOwner = function (assetId) {
        return __awaiter(this, void 0, void 0, function () {
            var assetIdNumber, nextAssetId, assetIdMetadata, readableAssetIdMetadata, collectionId, itemId, uniquesAssetMetadata, readableUniquesAssetMetadata, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetIdNumber = this.assetIdArrayToNumber(assetId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.api.query.assetManager.nextAssetId()];
                    case 2:
                        nextAssetId = _a.sent();
                        if (assetIdNumber >= nextAssetId.toHuman()) {
                            return [2 /*return*/, ""];
                        }
                        return [4 /*yield*/, this.api.query.assetManager.assetIdMetadata(assetIdNumber)];
                    case 3:
                        assetIdMetadata = _a.sent();
                        // assetId does not exist.
                        if (assetIdMetadata.isEmpty) {
                            return [2 /*return*/, ""];
                        }
                        readableAssetIdMetadata = assetIdMetadata.toHuman();
                        collectionId = readableAssetIdMetadata["NonFungible"]["collectionId"];
                        itemId = readableAssetIdMetadata["NonFungible"]["itemId"];
                        return [4 /*yield*/, this.api.query.uniques.asset(parseInt(collectionId), parseInt(itemId))];
                    case 4:
                        uniquesAssetMetadata = _a.sent();
                        readableUniquesAssetMetadata = uniquesAssetMetadata.toHuman();
                        return [2 /*return*/, readableUniquesAssetMetadata["owner"]];
                    case 5:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /// Returns the Asset ID of the NFT associated with the given `collectionId` and `itemId`.
    MantaSdk.prototype.assetIdFromCollectionAndItemId = function (collectionId, itemId) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, registeredAssetId, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        metadata = {
                            "NonFungible": [collectionId, itemId]
                        };
                        return [4 /*yield*/, this.api.query.assetManager.registeredAssetId(metadata)];
                    case 1:
                        registeredAssetId = _a.sent();
                        return [2 /*return*/, registeredAssetId.toHuman()];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MantaSdk;
}());
export { MantaSdk };
// Initializes the MantaSdk class, given an optional address, this will be used
// for specifying which polkadot.js address to use upon initialization if there are several.
// If no address is specified then the first polkadot.js address will be used.
export function init(env, network, address) {
    if (address === void 0) { address = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, api, signer, _b, wasm, wasmWallet, wasmApi, sdk;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, init_api(env, address.toLowerCase(), network)];
                case 1:
                    _a = _c.sent(), api = _a.api, signer = _a.signer;
                    return [4 /*yield*/, init_wasm_sdk(api, signer)];
                case 2:
                    _b = _c.sent(), wasm = _b.wasm, wasmWallet = _b.wasmWallet, wasmApi = _b.wasmApi;
                    sdk = new MantaSdk(api, signer, wasm, wasmWallet, network, env, wasmApi);
                    return [2 /*return*/, sdk];
            }
        });
    });
}
/// Returns the corresponding blockchain connection URL from Environment
/// and Network values. 
function env_url(env, network) {
    var url = config.NETWORKS[network].ws_local;
    if (env == Environment.Production) {
        url = config.NETWORKS[network].ws;
    }
    return url;
}
// Polkadot.js API with web3Extension
function init_api(env, address, network) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, api, _a, chain, nodeName, nodeVersion, extensions, allAccounts, account, i, errorString, injector, signer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    provider = new WsProvider(env_url(env, network));
                    return [4 /*yield*/, ApiPromise.create({ provider: provider, types: types, rpc: rpc })];
                case 1:
                    api = _b.sent();
                    return [4 /*yield*/, Promise.all([
                            api.rpc.system.chain(),
                            api.rpc.system.name(),
                            api.rpc.system.version()
                        ])];
                case 2:
                    _a = _b.sent(), chain = _a[0], nodeName = _a[1], nodeVersion = _a[2];
                    console.log("You are connected to chain ".concat(chain, " using ").concat(nodeName, " v").concat(nodeVersion));
                    return [4 /*yield*/, web3Enable('Polkadot App')];
                case 3:
                    extensions = _b.sent();
                    if (extensions.length === 0) {
                        throw new Error("Polkadot browser extension missing. https://polkadot.js.org/extension/");
                    }
                    return [4 /*yield*/, web3Accounts()];
                case 4:
                    allAccounts = _b.sent();
                    if (!address) {
                        account = allAccounts[0];
                    }
                    else {
                        // need to check that argument `address` exists in `allAccounts` if an address was
                        // specified.
                        address = address.toLowerCase();
                        for (i = 0; i < allAccounts.length; i++) {
                            if (allAccounts[i].address.toLowerCase() === address) {
                                console.log("Account with selected address found!");
                                account = allAccounts[i];
                                break;
                            }
                        }
                        if (!account) {
                            errorString = "Unable to find account with specified address: " + address + " in Polkadot JS.";
                            throw new Error(errorString);
                        }
                    }
                    return [4 /*yield*/, web3FromSource(account.meta.source)];
                case 5:
                    injector = _b.sent();
                    signer = account.address;
                    console.log("address:" + account.address);
                    api.setSigner(injector.signer);
                    return [2 /*return*/, {
                            api: api,
                            signer: signer
                        }];
            }
        });
    });
}
// Initialize wasm wallet sdk
function init_wasm_sdk(api, signer) {
    return __awaiter(this, void 0, void 0, function () {
        var wasm, wasmSigner, wasmApiConfig, wasmApi, wasmLedger, wasmWallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, import('manta-wasm-wallet')];
                case 1:
                    wasm = _a.sent();
                    wasmSigner = new wasm.Signer(SIGNER_URL);
                    wasmApiConfig = new ApiConfig(api, signer, DEFAULT_PULL_SIZE, DEFAULT_PULL_SIZE);
                    wasmApi = new Api(wasmApiConfig);
                    wasmLedger = new wasm.PolkadotJsLedger(wasmApi);
                    wasmWallet = new wasm.Wallet(wasmLedger, wasmSigner);
                    return [2 /*return*/, {
                            wasm: wasm,
                            wasmWallet: wasmWallet,
                            wasmApi: wasmApi
                        }];
            }
        });
    });
}
/// Returns the version of the currently connected manta-signer instance.
function get_signer_version() {
    return __awaiter(this, void 0, void 0, function () {
        var version_res, version, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("".concat(SIGNER_URL, "version"), {
                            timeout: 1500
                        })];
                case 1:
                    version_res = _a.sent();
                    version = version_res.data;
                    return [2 /*return*/, version];
                case 2:
                    error_1 = _a.sent();
                    console.error('Sync failed', error_1);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/// Returns the zkAddress of the currently connected manta-signer instance.
function getPrivateAddress(wasm, wallet, network) {
    return __awaiter(this, void 0, void 0, function () {
        var networkType, privateAddressRaw, privateAddressBytes, privateAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    networkType = wasm.Network.from_string("\"".concat(network, "\""));
                    return [4 /*yield*/, wallet.address(networkType)];
                case 1:
                    privateAddressRaw = _a.sent();
                    privateAddressBytes = __spreadArray([], privateAddressRaw.receiving_key, true);
                    privateAddress = base58Encode(privateAddressBytes);
                    return [2 /*return*/, privateAddress];
            }
        });
    });
}
;
/// Returns private asset balance for a given `asset_id` for the associated zkAddress.
function get_private_balance(wasmWallet, asset_id) {
    var assetIdNumber = uint8ArrayToNumber(asset_id);
    var balance = wasmWallet.balance(assetIdNumber);
    console.log("\uD83D\uDCB0private asset ".concat(asset_id, " balance:") + balance);
    return balance;
}
function get_public_balance(api, asset_id, targetAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var assetIdNumber, account, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, uint8ArrayToNumber(asset_id)];
                case 1:
                    assetIdNumber = _a.sent();
                    return [4 /*yield*/, api.query.assets.account(assetIdNumber, targetAddress)];
                case 2:
                    account = _a.sent();
                    if (account.value.isEmpty) {
                        return [2 /*return*/, "0"];
                    }
                    else {
                        return [2 /*return*/, account.value.balance.toString()];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    console.log("Failed to fetch public balance.");
                    console.error(e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/// Converts a given zkAddress to json.
function privateAddressToJson(privateAddress) {
    var bytes = base58Decode(privateAddress);
    return JSON.stringify({
        // spend: Array.from(bytes.slice(0, 32)),
        // view: Array.from(bytes.slice(32))
        receiving_key: Array.from(bytes)
    });
}
;
/// Initial synchronization with signer.
function init_sync(wasm, wasmWallet, network) {
    return __awaiter(this, void 0, void 0, function () {
        var networkType, startTime, endTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Beginning initial sync');
                    networkType = wasm.Network.from_string("\"".concat(network, "\""));
                    startTime = performance.now();
                    return [4 /*yield*/, wasmWallet.restart(networkType)];
                case 1:
                    _a.sent();
                    endTime = performance.now();
                    console.log("Initial sync finished in ".concat((endTime - startTime) / 1000, " seconds"));
                    return [2 /*return*/];
            }
        });
    });
}
/// Syncs wallet with ledger.
function sync(wasm, wasmWallet, network) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, networkType, endTime, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Beginning sync');
                    startTime = performance.now();
                    networkType = wasm.Network.from_string("\"".concat(network, "\""));
                    return [4 /*yield*/, wasmWallet.sync(networkType)];
                case 1:
                    _a.sent();
                    endTime = performance.now();
                    console.log("Sync finished in ".concat((endTime - startTime) / 1000, " seconds"));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Sync failed', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/// Attempts to execute a "To Private" transaction by a post on the currently
/// connected wallet.
function to_private_by_post(wasm, wasmWallet, asset_id, to_private_amount, network) {
    return __awaiter(this, void 0, void 0, function () {
        var amountBN, asset_id_arr, txJson, transaction, networkType, res, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("to_private transaction...");
                    amountBN = new BN(to_private_amount);
                    asset_id_arr = Array.from(asset_id);
                    txJson = "{ \"ToPrivate\": { \"id\": [".concat(asset_id_arr, "], \"value\": ").concat(amountBN, " }}");
                    console.log("txJson:" + txJson);
                    transaction = wasm.Transaction.from_string(txJson);
                    console.log("transaction:" + JSON.stringify(transaction));
                    networkType = wasm.Network.from_string("\"".concat(network, "\""));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, wasmWallet.post(transaction, null, networkType)];
                case 2:
                    res = _a.sent();
                    console.log("📜to_private result:" + res);
                    return [2 /*return*/, res];
                case 3:
                    error_3 = _a.sent();
                    console.error('Transaction failed', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/// Attempts to execute a "To Private" transaction by a sign + sign_and_send on
/// the currently connected wallet.
/// Optional: The `onlySign` flag allows for the ability to sign and return
/// the transaction without posting it to the ledger.
function to_private_by_sign(api, signer, wasm, wasmWallet, asset_id, to_private_amount, network, onlySign) {
    return __awaiter(this, void 0, void 0, function () {
        var amountBN, asset_id_arr, txJson, transaction, signResult, res, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("to_private transaction...");
                    amountBN = new BN(to_private_amount);
                    asset_id_arr = Array.from(asset_id);
                    txJson = "{ \"ToPrivate\": { \"id\": [".concat(asset_id_arr, "], \"value\": ").concat(amountBN, " }}");
                    transaction = wasm.Transaction.from_string(txJson);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!onlySign) return [3 /*break*/, 3];
                    return [4 /*yield*/, sign_transaction(api, wasm, wasmWallet, null, transaction, network)];
                case 2:
                    signResult = _a.sent();
                    return [2 /*return*/, signResult];
                case 3: return [4 /*yield*/, sign_and_send_without_metadata(wasm, api, signer, wasmWallet, transaction, network)];
                case 4:
                    res = _a.sent();
                    console.log("📜to_private done");
                    return [2 /*return*/, res];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error('Transaction failed', error_4);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/// public transfer transaction
/// Optional: The `onlySign` flag allows for the ability to sign and return
/// the transaction without posting it to the ledger.
function to_public(api, signer, wasm, wasmWallet, asset_id, transfer_amount, network, onlySign) {
    return __awaiter(this, void 0, void 0, function () {
        var amountBN, asset_id_arr, txJson, transaction, assetIdNumber, asset_meta, json, jsonObj, decimals, symbol, assetMetadataJson, signResult, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("to_public transaction of asset_id:" + asset_id);
                    amountBN = new BN(transfer_amount);
                    asset_id_arr = Array.from(asset_id);
                    txJson = "{ \"ToPublic\": { \"id\": [".concat(asset_id_arr, "], \"value\": ").concat(amountBN, " }}");
                    transaction = wasm.Transaction.from_string(txJson);
                    console.log("sdk transaction:" + txJson + ", " + JSON.stringify(transaction));
                    assetIdNumber = uint8ArrayToNumber(asset_id);
                    return [4 /*yield*/, api.query.assetManager.assetIdMetadata(assetIdNumber)];
                case 1:
                    asset_meta = _a.sent();
                    json = JSON.stringify(asset_meta.toHuman());
                    jsonObj = JSON.parse(json);
                    console.log("asset metadata:" + json);
                    decimals = jsonObj["Fungible"]["metadata"]["decimals"];
                    symbol = jsonObj["Fungible"]["metadata"]["symbol"];
                    assetMetadataJson = "{ \"decimals\": ".concat(decimals, ", \"symbol\": \"").concat(PRIVATE_ASSET_PREFIX).concat(symbol, "\" }");
                    console.log("📜asset metadata:" + assetMetadataJson);
                    if (!onlySign) return [3 /*break*/, 3];
                    return [4 /*yield*/, sign_transaction(api, wasm, wasmWallet, assetMetadataJson, transaction, network)];
                case 2:
                    signResult = _a.sent();
                    return [2 /*return*/, signResult];
                case 3: return [4 /*yield*/, sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network)];
                case 4:
                    res = _a.sent();
                    console.log("📜finish to public transfer.");
                    return [2 /*return*/, res];
            }
        });
    });
}
/// private transfer transaction
function private_transfer(api, signer, wasm, wasmWallet, asset_id, private_transfer_amount, to_private_address, network, onlySign) {
    return __awaiter(this, void 0, void 0, function () {
        var addressJson, amountBN, asset_id_arr, txJson, transaction, assetIdNumber, asset_meta, json, jsonObj, decimals, symbol, assetMetadataJson, signResult, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("private_transfer transaction of asset_id:" + asset_id);
                    addressJson = privateAddressToJson(to_private_address);
                    console.log("to zkAddress:" + JSON.stringify(addressJson));
                    amountBN = new BN(private_transfer_amount);
                    asset_id_arr = Array.from(asset_id);
                    txJson = "{ \"PrivateTransfer\": [{ \"id\": [".concat(asset_id_arr, "], \"value\": ").concat(amountBN, " }, ").concat(addressJson, " ]}");
                    transaction = wasm.Transaction.from_string(txJson);
                    console.log("sdk transaction:" + txJson + ", " + JSON.stringify(transaction));
                    assetIdNumber = uint8ArrayToNumber(asset_id);
                    return [4 /*yield*/, api.query.assetManager.assetIdMetadata(assetIdNumber)];
                case 1:
                    asset_meta = _a.sent();
                    json = JSON.stringify(asset_meta.toHuman());
                    jsonObj = JSON.parse(json);
                    console.log("asset metadata:" + json);
                    console.log("asset JSON:" + jsonObj);
                    decimals = jsonObj["Fungible"]["metadata"]["decimals"];
                    symbol = jsonObj["Fungible"]["metadata"]["symbol"];
                    assetMetadataJson = "{ \"decimals\": ".concat(decimals, ", \"symbol\": \"").concat(PRIVATE_ASSET_PREFIX).concat(symbol, "\" }");
                    console.log("📜asset metadata:" + assetMetadataJson);
                    if (!onlySign) return [3 /*break*/, 3];
                    return [4 /*yield*/, sign_transaction(api, wasm, wasmWallet, assetMetadataJson, transaction, network)];
                case 2:
                    signResult = _a.sent();
                    return [2 /*return*/, signResult];
                case 3: return [4 /*yield*/, sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network)];
                case 4:
                    res = _a.sent();
                    console.log("📜finish private transfer.");
                    return [2 /*return*/, res];
            }
        });
    });
}
/// Executes a public transfer from the address of `signer` to the address of `address`,
/// of the fungible token with AssetId `asset_id`.
function public_transfer(api, signer, asset_id, address, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var asset_id_arr, amountBN, tx, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    asset_id_arr = Array.from(asset_id);
                    amountBN = new BN(amount).toArray('le', 16);
                    return [4 /*yield*/, api.tx.mantaPay.publicTransfer({ id: asset_id_arr, value: amountBN }, address)];
                case 1:
                    tx = _a.sent();
                    return [4 /*yield*/, tx.signAndSend(signer)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    console.log("Failed to execture public transfer.");
                    console.error(e_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/// Create NFT collection
/// Returns Collection Id of newly created collection.
function createNFTCollection(api, signer) {
    return __awaiter(this, void 0, void 0, function () {
        var collectionId, submitExtrinsic, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, api.query.uniques.nextCollectionId()];
                case 1:
                    collectionId = _a.sent();
                    return [4 /*yield*/, api.tx.uniques.create(signer)];
                case 2:
                    submitExtrinsic = _a.sent();
                    return [4 /*yield*/, submitExtrinsic.signAndSend(signer)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, collectionId.toHuman()];
                case 4:
                    e_5 = _a.sent();
                    console.log("Failed to create NFT collection");
                    console.error(e_5);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/// Creates NFT Item and Registers it in Asset Manager.
/// Returns the Asset ID of the newly created NFT.
function createNFT(api, collectionId, itemId, address, signer) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata, assetId, mintExtrinsic, registerAssetExtrinsic, batchTx, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    metadata = {
                        "NonFungible": {
                            "name": "",
                            "info": "",
                            "collection_id": collectionId,
                            "item_id": itemId,
                        }
                    };
                    return [4 /*yield*/, api.query.assetManager.nextAssetId()];
                case 1:
                    assetId = _a.sent();
                    return [4 /*yield*/, api.tx.uniques.mint(collectionId, itemId, address)];
                case 2:
                    mintExtrinsic = _a.sent();
                    return [4 /*yield*/, api.tx.assetManager.registerAsset(address, metadata)];
                case 3:
                    registerAssetExtrinsic = _a.sent();
                    return [4 /*yield*/, api.tx.utility.batch([mintExtrinsic, registerAssetExtrinsic])];
                case 4:
                    batchTx = _a.sent();
                    return [4 /*yield*/, batchTx.signAndSend(signer)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, assetId.toHuman()];
                case 6:
                    e_6 = _a.sent();
                    console.log("Failed to create NFT item of Collection ID: " + collectionId + " and Item ID: " + itemId);
                    console.error(e_6);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/// Update NFT metadata
function updateMetadata(api, collectionId, itemId, metadata, signer) {
    return __awaiter(this, void 0, void 0, function () {
        var submitExtrinsic, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, api.tx.uniques.setMetadata(collectionId, itemId, metadata, false)];
                case 1:
                    submitExtrinsic = _a.sent();
                    return [4 /*yield*/, submitExtrinsic.signAndSend(signer)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    e_7 = _a.sent();
                    console.log("Failed to update NFT item of Collection ID: " + collectionId + " and Item ID: " + itemId);
                    console.error(e_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/// Mint NFT and set metadata in one call.
function createNFTAndSetMetadata(api, collectionId, itemId, targetAddress, signer, metadata) {
    return __awaiter(this, void 0, void 0, function () {
        var assetManagerMetadata, assetId, mintExtrinsic, registerAssetExtrinsic, setMetadataExtrinsic, batchTx, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    assetManagerMetadata = {
                        "NonFungible": {
                            "name": "",
                            "info": "",
                            "collection_id": collectionId,
                            "item_id": itemId,
                        }
                    };
                    return [4 /*yield*/, api.query.assetManager.nextAssetId()];
                case 1:
                    assetId = _a.sent();
                    return [4 /*yield*/, api.tx.uniques.mint(collectionId, itemId, targetAddress)];
                case 2:
                    mintExtrinsic = _a.sent();
                    return [4 /*yield*/, api.tx.assetManager.registerAsset(targetAddress, assetManagerMetadata)];
                case 3:
                    registerAssetExtrinsic = _a.sent();
                    return [4 /*yield*/, api.tx.uniques.setMetadata(collectionId, itemId, metadata, false)];
                case 4:
                    setMetadataExtrinsic = _a.sent();
                    return [4 /*yield*/, api.tx.utility.batch([mintExtrinsic, registerAssetExtrinsic, setMetadataExtrinsic])];
                case 5:
                    batchTx = _a.sent();
                    return [4 /*yield*/, batchTx.signAndSend(signer)];
                case 6:
                    _a.sent();
                    return [2 /*return*/, assetId.toHuman()];
                case 7:
                    e_8 = _a.sent();
                    console.log("Failed to update NFT item of Collection ID: " + collectionId + " and Item ID: " + itemId);
                    console.error(e_8);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/// View NFT metadata
function viewMetadata(api, collectionId, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api.query.uniques.instanceMetadataOf(collectionId, itemId)];
                case 1:
                    metadata = _a.sent();
                    return [2 /*return*/, metadata.toHuman()];
                case 2:
                    e_9 = _a.sent();
                    console.log("Failed to update NFT item of Collection ID: " + collectionId + " and Item ID: " + itemId);
                    console.error(e_9);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/// View all NFTs an account owns of a particular collection
function allNFTsInCollection(api, collectionId, address) {
    return __awaiter(this, void 0, void 0, function () {
        var CALAMARI_PRIVATE_SS58_ADDRESS, publicOwnedNfts, allPrivateNftsInCollection, publicOwnedNFTs, privateNFTsInCollection, i, readableResult, metadata, formatted, i, readableResult, metadata, formatted, result, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    CALAMARI_PRIVATE_SS58_ADDRESS = config.CALAMARI_PRIVATE_SS58_ADDRESS;
                    return [4 /*yield*/, api.query.uniques.account.keys(address, collectionId)];
                case 1:
                    publicOwnedNfts = _a.sent();
                    return [4 /*yield*/, api.query.uniques.account.keys(CALAMARI_PRIVATE_SS58_ADDRESS, collectionId)];
                case 2:
                    allPrivateNftsInCollection = _a.sent();
                    publicOwnedNFTs = [];
                    privateNFTsInCollection = [];
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < publicOwnedNfts.length)) return [3 /*break*/, 6];
                    readableResult = publicOwnedNfts[i].toHuman();
                    return [4 /*yield*/, viewMetadata(api, readableResult[1], readableResult[2])];
                case 4:
                    metadata = _a.sent();
                    formatted = {
                        owner: readableResult[0],
                        collectionId: readableResult[1],
                        itemId: readableResult[2],
                        metadata: metadata
                    };
                    publicOwnedNFTs.push(formatted);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < allPrivateNftsInCollection.length)) return [3 /*break*/, 10];
                    readableResult = allPrivateNftsInCollection[i].toHuman();
                    return [4 /*yield*/, viewMetadata(api, readableResult[1], readableResult[2])];
                case 8:
                    metadata = _a.sent();
                    formatted = {
                        owner: readableResult[0],
                        collectionId: readableResult[1],
                        itemId: readableResult[2],
                        metadata: metadata
                    };
                    privateNFTsInCollection.push(formatted);
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 7];
                case 10:
                    result = {
                        publicOwnedNFTs: publicOwnedNFTs,
                        privateNFTsInCollection: privateNFTsInCollection
                    };
                    return [2 /*return*/, result];
                case 11:
                    e_10 = _a.sent();
                    console.log("Failed to view all NFTs of Collection ID: " + collectionId);
                    console.error(e_10);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
/// to_private transaction for NFT
/// TODO: fixed amount value
function to_private_nft(signer, api, wasm, wasmWallet, asset_id, network) {
    return __awaiter(this, void 0, void 0, function () {
        var asset_id_arr, txJson, transaction, res, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("to_private NFT transaction...");
                    asset_id_arr = Array.from(asset_id);
                    txJson = "{ \"ToPrivate\": { \"id\": [".concat(asset_id_arr, "], \"value\": ").concat(NFT_AMOUNT, " }}");
                    transaction = wasm.Transaction.from_string(txJson);
                    console.log("transaction:" + JSON.stringify(transaction));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, sign_and_send_without_metadata(wasm, api, signer, wasmWallet, transaction, network)];
                case 2:
                    res = _a.sent();
                    console.log("📜to_private NFT result:" + res);
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Transaction failed', error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/// private transfer transaction for NFT
/// TODO: fixed amount value and asset metadata
function private_transfer_nft(api, signer, wasm, wasmWallet, asset_id, to_private_address, network) {
    return __awaiter(this, void 0, void 0, function () {
        var addressJson, asset_id_arr, txJson, transaction, assetMetadataJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("private_transfer NFT transaction...");
                    addressJson = privateAddressToJson(to_private_address);
                    asset_id_arr = Array.from(asset_id);
                    txJson = "{ \"PrivateTransfer\": [{ \"id\": [".concat(asset_id_arr, "], \"value\": ").concat(NFT_AMOUNT, " }, ").concat(addressJson, " ]}");
                    transaction = wasm.Transaction.from_string(txJson);
                    assetMetadataJson = "{ \"decimals\": 12, \"symbol\": \"pNFT\" }";
                    return [4 /*yield*/, sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network)];
                case 1:
                    _a.sent();
                    console.log("📜finish private nft transfer.");
                    return [2 /*return*/];
            }
        });
    });
}
/// Transfer an nft publicly using the uniques pallet.
function publicTransferNFT(api, signer, assetId, address) {
    return __awaiter(this, void 0, void 0, function () {
        var asset_id_arr, tx, batchTx, e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    asset_id_arr = Array.from(assetId);
                    return [4 /*yield*/, api.tx.mantaPay.publicTransfer({ id: asset_id_arr, value: NFT_AMOUNT }, address)];
                case 1:
                    tx = _a.sent();
                    return [4 /*yield*/, api.tx.utility.batch([tx])];
                case 2:
                    batchTx = _a.sent();
                    return [4 /*yield*/, batchTx.signAndSend(signer)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_11 = _a.sent();
                    console.log("Failed to transfer NFT item of Asset ID: " + assetId + " to address: " + address);
                    console.error(e_11);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/// to_public transaction for NFT
/// TODO: fixed amount value and asset metadata
function to_public_nft(api, signer, wasm, wasmWallet, asset_id, network) {
    return __awaiter(this, void 0, void 0, function () {
        var asset_id_arr, txJson, transaction, assetMetadataJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("to_public NFT transaction...");
                    asset_id_arr = Array.from(asset_id);
                    txJson = "{ \"ToPublic\": { \"id\": [".concat(asset_id_arr, "], \"value\": ").concat(NFT_AMOUNT, " }}");
                    transaction = wasm.Transaction.from_string(txJson);
                    assetMetadataJson = "{ \"decimals\": 12 , \"symbol\": \"pNFT\" }";
                    return [4 /*yield*/, sign_and_send(api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network)];
                case 1:
                    _a.sent();
                    console.log("📜finish to public nft transfer.");
                    return [2 /*return*/];
            }
        });
    });
}
;
/// Using sign on wallet and using signAndSend to polkadot.js transaction
/// This version is using `null` asset metdata. Only meaningful for to_private.
var sign_and_send_without_metadata = function (wasm, api, signer, wasmWallet, transaction, network) { return __awaiter(void 0, void 0, void 0, function () {
    var signed_transaction, i, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sign_transaction(api, wasm, wasmWallet, null, transaction, network)];
            case 1:
                signed_transaction = _a.sent();
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < signed_transaction.txs.length)) return [3 /*break*/, 7];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, signed_transaction.txs[i].signAndSend(signer, function (status, events) { })];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                console.error('Transaction failed', error_6);
                return [3 /*break*/, 6];
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); };
/// Signs the a given transaction returning posts, transactions and batches.
/// assetMetaDataJson is optional, pass in null if transaction should not contain any.
var sign_transaction = function (api, wasm, wasmWallet, assetMetadataJson, transaction, network) { return __awaiter(void 0, void 0, void 0, function () {
    var assetMetadata, networkType, posts, transactions, i, convertedPost, transaction_1, txs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assetMetadata = null;
                if (assetMetadataJson) {
                    assetMetadata = wasm.AssetMetadata.from_string(assetMetadataJson);
                }
                networkType = wasm.Network.from_string("\"".concat(network, "\""));
                return [4 /*yield*/, wasmWallet.sign(transaction, assetMetadata, networkType)];
            case 1:
                posts = _a.sent();
                transactions = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < posts.length)) return [3 /*break*/, 5];
                console.log("post" + i + ":" + JSON.stringify(posts[i]));
                convertedPost = transfer_post(posts[i]);
                console.log("convert post:" + JSON.stringify(convertedPost));
                return [4 /*yield*/, mapPostToTransaction(convertedPost, api)];
            case 3:
                transaction_1 = _a.sent();
                console.log("transaction:" + JSON.stringify(transaction_1));
                transactions.push(transaction_1);
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, transactionsToBatches(transactions, api)];
            case 6:
                txs = _a.sent();
                return [2 /*return*/, {
                        posts: posts,
                        transactions: transactions,
                        txs: txs
                    }];
        }
    });
}); };
/// Using sign on wallet and using signdAndSend to polkadot.js transaction
var sign_and_send = function (api, signer, wasm, wasmWallet, assetMetadataJson, transaction, network) { return __awaiter(void 0, void 0, void 0, function () {
    var signed_transaction, i, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sign_transaction(api, wasm, wasmWallet, assetMetadataJson, transaction, network)];
            case 1:
                signed_transaction = _a.sent();
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < signed_transaction.txs.length)) return [3 /*break*/, 7];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, signed_transaction.txs[i].signAndSend(signer, function (_status, _events) { })];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_7 = _a.sent();
                console.error('Transaction failed', error_7);
                return [3 /*break*/, 6];
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); };
/// Maps a given `post` to a known transaction type, either Mint, Private Transfer or Reclaim.
function mapPostToTransaction(post, api) {
    return __awaiter(this, void 0, void 0, function () {
        var sources, senders, receivers, sinks, mint_tx, private_transfer_tx, reclaim_tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sources = post.sources.length;
                    senders = post.sender_posts.length;
                    receivers = post.receiver_posts.length;
                    sinks = post.sinks.length;
                    if (!(sources == 1 && senders == 0 && receivers == 1 && sinks == 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, api.tx.mantaPay.toPrivate(post)];
                case 1:
                    mint_tx = _a.sent();
                    return [2 /*return*/, mint_tx];
                case 2:
                    if (!(sources == 0 && senders == 2 && receivers == 2 && sinks == 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.tx.mantaPay.privateTransfer(post)];
                case 3:
                    private_transfer_tx = _a.sent();
                    return [2 /*return*/, private_transfer_tx];
                case 4:
                    if (!(sources == 0 && senders == 2 && receivers == 1 && sinks == 1)) return [3 /*break*/, 6];
                    return [4 /*yield*/, api.tx.mantaPay.toPublic(post)];
                case 5:
                    reclaim_tx = _a.sent();
                    return [2 /*return*/, reclaim_tx];
                case 6: throw new Error('Invalid transaction shape; there is no extrinsic for a transaction'
                    + "with ".concat(sources, " sources, ").concat(senders, " senders, ")
                    + " ".concat(receivers, " receivers and ").concat(sinks, " sinks"));
            }
        });
    });
}
;
/// Batches transactions.
function transactionsToBatches(transactions, api) {
    return __awaiter(this, void 0, void 0, function () {
        var MAX_BATCH, batches, i, transactionsInSameBatch, batchTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MAX_BATCH = 2;
                    batches = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < transactions.length)) return [3 /*break*/, 4];
                    transactionsInSameBatch = transactions.slice(i, i + MAX_BATCH);
                    return [4 /*yield*/, api.tx.utility.batch(transactionsInSameBatch)];
                case 2:
                    batchTransaction = _a.sent();
                    batches.push(batchTransaction);
                    _a.label = 3;
                case 3:
                    i += MAX_BATCH;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, batches];
            }
        });
    });
}
/// NOTE: `post` from manta-rs sign result should match runtime side data structure type.
var transfer_post = function (post) {
    var json = JSON.parse(JSON.stringify(post));
    // transfer authorization_signature format
    if (json.authorization_signature != null) {
        var scala = json.authorization_signature.signature.scalar;
        var nonce = json.authorization_signature.signature.nonce_point;
        json.authorization_signature.signature = [scala, nonce];
    }
    // transfer receiver_posts to match runtime side
    json.receiver_posts.map(function (x) {
        // `message` is [[[..],[..],[..]]], change to [[..], [..], [..]]
        var arr1 = x.note.incoming_note.ciphertext.ciphertext.message.flatMap(function (item, index, a) {
            return item;
        });
        var tag = x.note.incoming_note.ciphertext.ciphertext.tag;
        var pk = x.note.incoming_note.ciphertext.ephemeral_public_key;
        x.note.incoming_note.tag = tag;
        x.note.incoming_note.ephemeral_public_key = pk;
        x.note.incoming_note.ciphertext = arr1;
        delete x.note.incoming_note.header;
        var light_pk = x.note.light_incoming_note.ciphertext.ephemeral_public_key;
        // ciphertext is [u8; 96] on manta-rs, but runtime side is [[u8; 32]; 3]
        var light_cipher = x.note.light_incoming_note.ciphertext.ciphertext;
        var light_ciper0 = light_cipher.slice(0, 32);
        var light_ciper1 = light_cipher.slice(32, 64);
        var light_ciper2 = light_cipher.slice(64, 96);
        x.note.light_incoming_note.ephemeral_public_key = light_pk;
        x.note.light_incoming_note.ciphertext = [light_ciper0, light_ciper1, light_ciper2];
        delete x.note.light_incoming_note.header;
        // convert asset value to [u8; 16]
        x.utxo.public_asset.value = new BN(x.utxo.public_asset.value).toArray('le', 16);
        x.full_incoming_note = x.note;
        delete x.note;
    });
    // transfer sender_posts to match runtime side
    json.sender_posts.map(function (x) {
        var pk = x.nullifier.outgoing_note.ciphertext.ephemeral_public_key;
        var cipher = x.nullifier.outgoing_note.ciphertext.ciphertext;
        var ciper0 = cipher.slice(0, 32);
        var ciper1 = cipher.slice(32, 64);
        var outgoing = {
            ephemeral_public_key: pk,
            ciphertext: [ciper0, ciper1]
        };
        x.outgoing_note = outgoing;
        var nullifier = x.nullifier.nullifier.commitment;
        x.nullifier_commitment = nullifier;
        delete x.nullifier;
    });
    console.log("origin sources:" + JSON.stringify(json.sources));
    return json;
};
/// Convert uint8Array to number
/// This method assumes the uint8array is sorted in little-endian form
/// thus the smallest, least significant value is stored first.
var uint8ArrayToNumber = function (uint8array) {
    var value = 0;
    for (var i = uint8array.length - 1; i >= 0; i--) {
        value = (value * 256) + uint8array[i];
    }
    return value;
};
/// @TODO: Proper implementation of this function
var numberToUint8Array = function (assetIdNumber) {
    // @TODO: the `number` type has value limitation, should change to `string` type.
    var bn = assetIdNumber.toString();
    var hex = BigInt(bn).toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    var len = 32;
    var u8a = new Uint8Array(len);
    var i = 0;
    var j = 0;
    while (i < len) {
        u8a[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }
    return u8a;
};
