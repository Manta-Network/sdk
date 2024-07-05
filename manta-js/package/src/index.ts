import type * as interfaces from './interfaces';

import BaseWallet from './BaseWallet';
import PrivateWallet from './PrivateWallet';

import ApiConfig from './config.json';

export * from './pallets';
export { BaseWallet, PrivateWallet };
export { ApiConfig };
export type { interfaces };
