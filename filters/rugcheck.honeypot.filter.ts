import { Filter, FilterResult } from './pool-filters';
import { Connection } from '@solana/web3.js';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { logger, RUG_CHECK_WAIT_TIMEOUT_SECONDS, sleep } from '../helpers';

export class RugcheckHoneypotFilter implements Filter {
  constructor(private readonly connection: Connection) {}

  async execute(poolKeys: LiquidityPoolKeysV4, retries: number = 2, retryDelay: number = 1000): Promise<FilterResult> {
    await new Promise((resolve) => setTimeout(resolve, RUG_CHECK_WAIT_TIMEOUT_SECONDS * 1000));

    while (retries >= 0) {
      try {
        const responseRaw = await fetch(`https://api.rugcheck.xyz/v1/tokens/${poolKeys.baseMint}/report/summary`);
        const response = await responseRaw.json();

        return {
          ok: response?.score > 600,
          data: response?.score,
          message: `Honeypot RugCheck -> rug score: ${response?.score} < 600`,
        };
      } catch (error) {
        logger.error({ mint: poolKeys.baseMint, error }, `Honeypot RugCheck -> Failed to Rugcheck`);
      }

      retries--;
      if (retries > 0 && retryDelay > 0) {
        await sleep(retryDelay);
      }
    }
    return {
      ok: false,
      message: `Honeypot RugCheck -> failed exceeded number of retries`,
    };
  }
}
