import { Filter, FilterResult } from './pool-filters';
import { Connection } from '@solana/web3.js';
import { LIQUIDITY_STATE_LAYOUT_V4, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { logger } from '../helpers';
import BN from 'bn.js';

export class LockedFilter implements Filter {
  constructor(private readonly connection: Connection) {}

  async execute(poolKeys: LiquidityPoolKeysV4): Promise<FilterResult> {
    try {
      const accountInfo = await this.connection.getAccountInfo(poolKeys.baseMint, this.connection.commitment);
      if (!accountInfo?.data) {
        return { ok: false, message: 'LockedLiquidity -> Failed to fetch account data' };
      }

      const liquidityState = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data);
      let isLocked: boolean;
      const maxSafeIntegerBN = new BN(Number.MAX_SAFE_INTEGER.toString());

      if (liquidityState.status.gt(maxSafeIntegerBN)) {
        isLocked = false;
      } else {
        isLocked = liquidityState.status.toNumber() === 1;
      }

      return { ok: isLocked, message: isLocked ? undefined : 'LockedLiquidity -> Creator can Rug Pull' };
    } catch (e) {
      logger.error({ mint: poolKeys.baseMint }, `LockedLiquidity -> Failed to check if liquidity is locked`);
    }

    return { ok: false, message: 'LockedLiquidity -> Failed to check if liquidity is locked' };
  }
}
