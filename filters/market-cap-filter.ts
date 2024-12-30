// market-cap.filter.ts

import { Filter, FilterResult } from './pool-filters';
import { Connection } from '@solana/web3.js';
import { LiquidityPoolKeysV4, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import { logger } from '../helpers';
import BN from 'bn.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface MarketCapFilterConfig {
    targetMarketCap: TokenAmount;
    timeWindow: number; // in milliseconds
}

export class MarketCapFilter implements Filter {
    private readonly poolStartTimes: Map<string, number> = new Map();
    private readonly successfulPools: Set<string> = new Set();

    constructor(
        private readonly connection: Connection,
        private readonly config: MarketCapFilterConfig
    ) { }

    async execute(poolKeys: LiquidityPoolKeysV4): Promise<FilterResult> {
        try {


            const poolId = poolKeys.baseMint.toString();



            if (this.successfulPools.has(poolId)) {
                return { ok: true };

            }

            if (!this.poolStartTimes.has(poolId)) {
                this.poolStartTimes.set(poolId, Date.now());
            }

            const poolStartTime = this.poolStartTimes.get(poolId)!;
            const currentTime = Date.now();
            const timeElapsed = currentTime - poolStartTime;

            if (timeElapsed <= this.config.timeWindow) {
                // Get vault balances and supply
                const [baseVaultInfo, quoteVaultInfo, supply] = await Promise.all([
                    this.connection.getTokenAccountBalance(poolKeys.baseVault),
                    this.connection.getTokenAccountBalance(poolKeys.quoteVault),
                    this.connection.getTokenSupply(poolKeys.baseMint)
                ]).catch(error => {
                    logger.error({ mint: poolKeys.baseMint.toString(), error }, 'Failed to fetch vault balances');
                    throw error;
                });

                if (!baseVaultInfo?.value || !quoteVaultInfo?.value || !supply?.value) {
                    return {
                        ok: false,
                        message: 'MarketCap -> Failed to fetch vault balances'
                    };
                }

                // Convert to decimal-adjusted values
                const baseAmount = Number(baseVaultInfo.value.amount) / Math.pow(10, poolKeys.baseDecimals);
                const quoteAmount = Number(quoteVaultInfo.value.amount) / Math.pow(10, poolKeys.quoteDecimals);
                const totalSupply = Number(supply.value.amount) / Math.pow(10, poolKeys.baseDecimals);

                // Calculate price and market cap
                const price = baseAmount === 0 ? 0 : quoteAmount / baseAmount;
                const marketCap = price * totalSupply;

                // Convert target to comparable number
                const targetMarketCap = Number(this.config.targetMarketCap.toFixed());
                const hasReachedTarget = marketCap >= targetMarketCap;

                if (hasReachedTarget) {
                    this.successfulPools.add(poolId);
                    this.poolStartTimes.delete(poolId);
                    logger.trace({ mint: poolId }, `MarketCap -> Target reached! Current: ${marketCap.toFixed(2)} Target: ${targetMarketCap.toFixed(2)}`);  // Add this

                    return { ok: true };
                }

                const timeLeft = (this.config.timeWindow - timeElapsed) / 1000;

                return {
                    ok: false,
                    message: `MarketCap -> Current: ${marketCap.toFixed(2)} Target: ${targetMarketCap.toFixed(2)} Time left: ${timeLeft.toFixed(1)}s`
                };
            }

            this.poolStartTimes.delete(poolId);
            return {
                ok: false,
                message: `MarketCap -> Failed to reach target within ${this.config.timeWindow / 1000}s time window`
            };

        } catch (error) {
            logger.error(
                { mint: poolKeys.baseMint.toString(), error },
                'MarketCap -> Failed to check market cap'
            );
            return {
                ok: false,
                message: 'MarketCap -> Failed to check market cap'
            };
        }
    }
}