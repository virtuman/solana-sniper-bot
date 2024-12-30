import { Connection } from '@solana/web3.js';
import { LiquidityPoolKeysV4, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import { getMetadataAccountDataSerializer } from '@metaplex-foundation/mpl-token-metadata';
import { BurnFilter } from './burn.filter';
import { MutableFilter } from './mutable.filter';
import { RenouncedFreezeFilter } from './renounced.filter';
import { PoolSizeFilter } from './pool-size.filter';
import {
	CHECK_HONEYPOT_SOLSNIFFER,
	CHECK_IF_BURNED,
	CHECK_IF_FREEZABLE,
	CHECK_IF_IS_LOCKED,
	CHECK_IF_MINT_IS_RENOUNCED,
	CHECK_IF_MUTABLE,
	CHECK_IF_SOCIALS,
	RUG_CHECK,
	logger
} from '../helpers';
import { LockedFilter } from './locked.filter';
import { RugcheckHoneypotFilter } from './rugcheck.honeypot.filter';

export interface Filter {
  execute(poolKeysV4: LiquidityPoolKeysV4): Promise<FilterResult>;
}

export interface FilterResult {
  ok: boolean;
  message?: string;
  data?: any;
}

export interface PoolFilterArgs {
  minPoolSize: TokenAmount;
  maxPoolSize: TokenAmount;
  quoteToken: Token;
}

export class PoolFilters {
  private readonly filters: Filter[] = [];

  constructor(
    readonly connection: Connection,
    readonly args: PoolFilterArgs,
  ) {
    if (CHECK_IF_BURNED) {
      this.filters.push(new BurnFilter(connection));
    }
		// TODO: Probably same as CHECK_IF_MUTABLE
    if (CHECK_IF_IS_LOCKED) {
      this.filters.push(new LockedFilter(connection));
    }

    if (RUG_CHECK) {
      if (CHECK_HONEYPOT_SOLSNIFFER) {
        // this.filters.push(new SolsnifferHoneypotFilter(connection));
      }
      this.filters.push(new RugcheckHoneypotFilter(connection));
    }

    if (CHECK_IF_MINT_IS_RENOUNCED || CHECK_IF_FREEZABLE) {
      this.filters.push(new RenouncedFreezeFilter(connection, CHECK_IF_MINT_IS_RENOUNCED, CHECK_IF_FREEZABLE));
    }

    if (CHECK_IF_MUTABLE || CHECK_IF_SOCIALS) {
      this.filters.push(new MutableFilter(connection, getMetadataAccountDataSerializer(), CHECK_IF_MUTABLE, CHECK_IF_SOCIALS));
    }

    if (!args.minPoolSize.isZero() || !args.maxPoolSize.isZero()) {
      this.filters.push(new PoolSizeFilter(connection, args.quoteToken, args.minPoolSize, args.maxPoolSize));
    }
  }

  public async execute(poolKeys: LiquidityPoolKeysV4): Promise<boolean> {
    if (this.filters.length === 0) {
      return true;
    }

    const result = await Promise.all(this.filters.map((f) => f.execute(poolKeys)));
    const pass = result.every((r) => r.ok);

    if (pass) {
      return true;
    }

    for (const filterResult of result.filter((r) => !r.ok)) {
      logger.trace(filterResult.message);
      if (filterResult?.data) {
        logger.debug(filterResult.data);
      }
    }

    return false;
  }
}
