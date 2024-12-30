import axios from 'axios';
import { PoolSuggestionResponse } from './interfaces';

import { Filter, FilterResult } from './pool-filters';
import { Connection } from '@solana/web3.js';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { logger, RUG_CHECK_WAIT_TIMEOUT_SECONDS, sleep } from '../helpers';

export class SolsnifferHoneypotFilter implements Filter {
  constructor(private readonly connection: Connection) {}

  async execute(poolKeys: LiquidityPoolKeysV4, retries: number = 2, retryDelay: number = 1000): Promise<FilterResult> {
    await new Promise((resolve) => setTimeout(resolve, RUG_CHECK_WAIT_TIMEOUT_SECONDS * 1000));

    const url = `https://solsniffer.com/api/v1/sniffer/suggestion/${poolKeys.baseMint}`;
    console.log('url', url);
    try {
      let response = {
        tokenAddr: poolKeys.baseMint,
        honeypot: true,
        status: 'unknown',
        score: 0,
        retries: 0,
        result: {},
      };

      while (retries >= 0) {
        let tokenResponse: PoolSuggestionResponse = (await axios.get(url)).data;

        if (!tokenResponse.data[0]) {
          // logger.error(tokenResponse, 'tokenResponse');
          // logger.error(`Honeypot Checker: empty response for: ${tokenAddr}`);
        } else if (tokenResponse.data[0]?.indicatorData) {
          response.honeypot = tokenResponse?.data[0].score < 40 || tokenResponse.data[0].indicatorData.high.count > 1;
          response.score = tokenResponse?.data[0].score;
          response.result = tokenResponse.data[0];
          response.retries = retries;
          response.status = 'processed';

          return {
            ok: !response.honeypot,
            message: !response.honeypot
              ? undefined
              : `Honeypot SolSniffer -> Likely a scam token score ${response.score} < 40 and high.count: ${tokenResponse.data[0].indicatorData.high.count}`,
            data: response,
          };
        }

        retries--;
        if (retries > 0 && retryDelay > 0) {
          await sleep(retryDelay);
        }
      }
    } catch (e) {
      logger.error({ mint: poolKeys.baseMint }, `Honeypot SolSniffer -> error for ${poolKeys.baseMint}`);
    }

    return { ok: false, message: 'Honeypot SolSniffer -> Failed to check score' };
  }
}
