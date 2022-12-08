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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
// TODO: should use published npm package
// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';
// const to_private_address = "64nmibscb1UdWGMWnRQAYx6hS4TA2iyFqiS897cFRWvNTmjad85p6yD9ud7cyVPhyNPDrSMs2eZxTfovxZbJdFqH";
var to_private_address = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var publicPolkadotJsAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicPolkadotJsAddress = "5HifovYZVQSD4rKLVMo1Rqtv45jfPhCUiGYbf4gPEtKyc1PS";
                    return [4 /*yield*/, ft_test_to_private()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ft_test_to_public()];
                case 2:
                    _a.sent();
                    console.log("END");
                    return [2 /*return*/];
            }
        });
    });
}
var ft_test_to_private_only_sign = function () { return __awaiter(void 0, void 0, void 0, function () {
    var env, net, mantaSdk, privateAddress, amount, asset_id_number, asset_id, initalPrivateBalance, signResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                env = sdk.Environment.Development;
                net = sdk.Network.Dolphin;
                return [4 /*yield*/, sdk.init(env, net)];
            case 1:
                mantaSdk = _a.sent();
                return [4 /*yield*/, mantaSdk.privateAddress()];
            case 2:
                privateAddress = _a.sent();
                console.log("The private address is: ", privateAddress);
                amount = 10000000000000000000;
                asset_id_number = 1;
                asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);
                return [4 /*yield*/, mantaSdk.initalWalletSync()];
            case 3:
                _a.sent();
                return [4 /*yield*/, mantaSdk.privateBalance(asset_id)];
            case 4:
                initalPrivateBalance = _a.sent();
                console.log("The inital private balance is: ", initalPrivateBalance);
                return [4 /*yield*/, mantaSdk.toPrivateSign(asset_id, amount, true)];
            case 5:
                signResult = _a.sent();
                console.log("The result of the signing: ", signResult);
                return [2 /*return*/];
        }
    });
}); };
var ft_test_to_private = function () { return __awaiter(void 0, void 0, void 0, function () {
    var env, net, mantaSdk, privateAddress, amount, asset_id_number, asset_id, initalPrivateBalance, newPrivateBalance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                env = sdk.Environment.Development;
                net = sdk.Network.Dolphin;
                return [4 /*yield*/, sdk.init(env, net)];
            case 1:
                mantaSdk = _a.sent();
                return [4 /*yield*/, mantaSdk.privateAddress()];
            case 2:
                privateAddress = _a.sent();
                console.log("The private address is: ", privateAddress);
                amount = 1000000000000000000;
                asset_id_number = 1;
                asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);
                return [4 /*yield*/, mantaSdk.initalWalletSync()];
            case 3:
                _a.sent();
                return [4 /*yield*/, mantaSdk.privateBalance(asset_id)];
            case 4:
                initalPrivateBalance = _a.sent();
                console.log("The inital private balance is: ", initalPrivateBalance);
                return [4 /*yield*/, mantaSdk.toPrivateSign(asset_id, amount)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!true) return [3 /*break*/, 10];
                return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 5000); })];
            case 7:
                _a.sent();
                console.log("Syncing with ledger...");
                return [4 /*yield*/, mantaSdk.walletSync()];
            case 8:
                _a.sent();
                return [4 /*yield*/, mantaSdk.privateBalance(asset_id)];
            case 9:
                newPrivateBalance = _a.sent();
                console.log("Private Balance after sync: ", newPrivateBalance);
                if (initalPrivateBalance !== newPrivateBalance) {
                    console.log("Detected balance change after sync!");
                    console.log("Old balance: ", initalPrivateBalance);
                    console.log("New balance: ", newPrivateBalance);
                    return [3 /*break*/, 10];
                }
                return [3 /*break*/, 6];
            case 10: return [2 /*return*/];
        }
    });
}); };
var ft_test_to_public = function () { return __awaiter(void 0, void 0, void 0, function () {
    var env, net, mantaSdk, privateAddress, amount, asset_id_number, asset_id, initalPrivateBalance, privateBalance, newPrivateBalance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                env = sdk.Environment.Development;
                net = sdk.Network.Dolphin;
                return [4 /*yield*/, sdk.init(env, net)];
            case 1:
                mantaSdk = _a.sent();
                return [4 /*yield*/, mantaSdk.privateAddress()];
            case 2:
                privateAddress = _a.sent();
                console.log("The private address is: ", privateAddress);
                amount = 1000000000000000000;
                asset_id_number = 1;
                asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);
                return [4 /*yield*/, mantaSdk.initalWalletSync()];
            case 3:
                _a.sent();
                return [4 /*yield*/, mantaSdk.privateBalance(asset_id)];
            case 4:
                initalPrivateBalance = _a.sent();
                console.log("The inital private balance is: ", initalPrivateBalance);
                return [4 /*yield*/, mantaSdk.toPublic(asset_id, amount)];
            case 5:
                _a.sent();
                return [4 /*yield*/, mantaSdk.walletSync()];
            case 6:
                _a.sent();
                return [4 /*yield*/, mantaSdk.privateBalance(asset_id)];
            case 7:
                privateBalance = _a.sent();
                _a.label = 8;
            case 8:
                if (!true) return [3 /*break*/, 12];
                return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 5000); })];
            case 9:
                _a.sent();
                console.log("Syncing with ledger...");
                return [4 /*yield*/, mantaSdk.walletSync()];
            case 10:
                _a.sent();
                return [4 /*yield*/, mantaSdk.privateBalance(asset_id)];
            case 11:
                newPrivateBalance = _a.sent();
                console.log("Private Balance after sync: ", newPrivateBalance);
                if (privateBalance !== newPrivateBalance) {
                    console.log("Detected balance change after sync!");
                    console.log("Old balance: ", privateBalance);
                    console.log("New balance: ", newPrivateBalance);
                    return [3 /*break*/, 12];
                }
                return [3 /*break*/, 8];
            case 12: return [2 /*return*/];
        }
    });
}); };
main();
