import { Logger } from 'pino';
import dotenv from 'dotenv';
import { Commitment } from '@solana/web3.js';
import { logger } from './logger';

dotenv.config({ override: true });

const retrieveEnvVariable = (variableName: string, logger: Logger, defaultValue: string = '') => {
  const variable = process.env[variableName] || '';
  if (!variable) {
    if (defaultValue) {
      logger.warn(`${variableName} is not set, using default value: ${defaultValue}`);
      return defaultValue;
    }
    logger.error(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

// Wallet

// Connection
export const NETWORK = retrieveEnvVariable('SOLANA_NETWORK', logger, 'mainnet-beta');
export const PRIVATE_KEY = retrieveEnvVariable(`${NETWORK.toUpperCase()}_PRIVATE_KEY`, logger);

export const COMMITMENT_LEVEL: Commitment = retrieveEnvVariable('COMMITMENT_LEVEL', logger) as Commitment;
export const RPC_ENDPOINT = retrieveEnvVariable(`RPC_${NETWORK.toUpperCase()}_ENDPOINT`, logger);
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable(`RPC_${NETWORK.toUpperCase()}_WEBSOCKET_ENDPOINT`, logger);

// Bot
export const LOG_LEVEL = retrieveEnvVariable('LOG_LEVEL', logger);
export const MAX_TOKENS_AT_THE_TIME = Number(retrieveEnvVariable('MAX_TOKENS_AT_THE_TIME', logger));
export const COMPUTE_UNIT_LIMIT = Number(retrieveEnvVariable('COMPUTE_UNIT_LIMIT', logger));
export const COMPUTE_UNIT_PRICE = Number(retrieveEnvVariable('COMPUTE_UNIT_PRICE', logger));
export const PRE_LOAD_EXISTING_MARKETS = retrieveEnvVariable('PRE_LOAD_EXISTING_MARKETS', logger) === 'true';
export const CACHE_NEW_MARKETS = retrieveEnvVariable('CACHE_NEW_MARKETS', logger) === 'true';
export const TRANSACTION_EXECUTOR = retrieveEnvVariable('TRANSACTION_EXECUTOR', logger);
export const CUSTOM_FEE = retrieveEnvVariable('CUSTOM_FEE', logger);

// Buy
export const AUTO_BUY_DELAY = Number(retrieveEnvVariable('AUTO_BUY_DELAY', logger));
export const QUOTE_MINT = retrieveEnvVariable('QUOTE_MINT', logger);
export const QUOTE_AMOUNT = retrieveEnvVariable('QUOTE_AMOUNT', logger);
export const MAX_BUY_RETRIES = Number(retrieveEnvVariable('MAX_BUY_RETRIES', logger));
export const BUY_SLIPPAGE = Number(retrieveEnvVariable('BUY_SLIPPAGE', logger));

// Sell
export const AUTO_SELL = retrieveEnvVariable('AUTO_SELL', logger) === 'true';
export const AUTO_SELL_DELAY = Number(retrieveEnvVariable('AUTO_SELL_DELAY', logger));
export const MAX_SELL_RETRIES = Number(retrieveEnvVariable('MAX_SELL_RETRIES', logger));
export const TAKE_PROFIT = Number(retrieveEnvVariable('TAKE_PROFIT', logger));
export const STOP_LOSS = Number(retrieveEnvVariable('STOP_LOSS', logger));
export const TRAILING_STOP_LOSS = retrieveEnvVariable('TRAILING_STOP_LOSS', logger) === 'true';
export const PRICE_CHECK_INTERVAL = Number(retrieveEnvVariable('PRICE_CHECK_INTERVAL', logger));
export const PRICE_CHECK_DURATION = Number(retrieveEnvVariable('PRICE_CHECK_DURATION', logger));
export const SELL_SLIPPAGE = Number(retrieveEnvVariable('SELL_SLIPPAGE', logger));
export const SKIP_SELLING_IF_LOST_MORE_THAN = Number(retrieveEnvVariable('SKIP_SELLING_IF_LOST_MORE_THAN', logger));

// Filters
export const FILTER_CHECK_INTERVAL = Number(retrieveEnvVariable('FILTER_CHECK_INTERVAL', logger));
export const FILTER_CHECK_DURATION = Number(retrieveEnvVariable('FILTER_CHECK_DURATION', logger));
export const CONSECUTIVE_FILTER_MATCHES = Number(retrieveEnvVariable('CONSECUTIVE_FILTER_MATCHES', logger));
export const CHECK_IF_MUTABLE = retrieveEnvVariable('CHECK_IF_MUTABLE', logger) === 'true';
export const CHECK_IF_SOCIALS = retrieveEnvVariable('CHECK_IF_SOCIALS', logger) === 'true';
export const CHECK_IF_MINT_IS_RENOUNCED = retrieveEnvVariable('CHECK_IF_MINT_IS_RENOUNCED', logger) === 'true';
export const CHECK_IF_FREEZABLE = retrieveEnvVariable('CHECK_IF_FREEZABLE', logger) === 'true';
export const CHECK_IF_BURNED = retrieveEnvVariable('CHECK_IF_BURNED', logger) === 'true';
export const MIN_POOL_SIZE = retrieveEnvVariable('MIN_POOL_SIZE', logger);
export const MAX_POOL_SIZE = retrieveEnvVariable('MAX_POOL_SIZE', logger);
export const USE_SNIPE_LIST = retrieveEnvVariable('USE_SNIPE_LIST', logger) === 'true';
export const SNIPE_LIST_REFRESH_INTERVAL = Number(retrieveEnvVariable('SNIPE_LIST_REFRESH_INTERVAL', logger));

export const PAPER_TRADING_ONLY = retrieveEnvVariable('PAPER_TRADING_ONLY', logger) === 'true';
export const BIRD_EYE_API_KEY = retrieveEnvVariable('BIRD_EYE_API_KEY', logger);
export const AUTO_SELL_RETRIES_BEFORE_HARD_SELL = Number(
  retrieveEnvVariable('AUTO_SELL_RETRIES_BEFORE_HARD_SELL', logger),
);
export const AUTO_SELL_PERCENT = Number(retrieveEnvVariable('AUTO_SELL_PERCENT', logger));
export const CHECK_IF_IS_LOCKED = retrieveEnvVariable('CHECK_IF_IS_LOCKED', logger) === 'true';
export const SKIP_IF_MINT_IS_NOT_RENOUNCED = retrieveEnvVariable('SKIP_IF_MINT_IS_NOT_RENOUNCED', logger) === 'true';
export const SKIP_IF_IS_NOT_LOCKED = retrieveEnvVariable('SKIP_IF_IS_NOT_LOCKED', logger) === 'true';
export const CHECK_BUY_SELL_PRICES = retrieveEnvVariable('CHECK_BUY_SELL_PRICES', logger) === 'true';
export const SKIP_IF_NO_BUY_SELL_PRICES = retrieveEnvVariable('SKIP_IF_NO_BUY_SELL_PRICES', logger) === 'true';
export const CHECK_HONEYPOT_SOLSNIFFER = retrieveEnvVariable('CHECK_BUY_SELL_PRICES', logger) === 'true';
export const SKIP_IF_HONEYPOT_SOLSNIFFER = retrieveEnvVariable('SKIP_IF_NO_BUY_SELL_PRICES', logger) === 'true';
export const RUG_CHECK = retrieveEnvVariable('RUG_CHECK', logger) === 'true';
export const RUG_CHECK_WAIT_TIMEOUT_SECONDS = Number(retrieveEnvVariable('RUG_CHECK_WAIT_TIMEOUT_SECONDS', logger));
export const TRY_COUNT_FOR_BURNED_AND_LOCKED_CHECK = retrieveEnvVariable(
  'TRY_COUNT_FOR_BURNED_AND_LOCKED_CHECK',
  logger,
);
export const WAIT_TIME_FOR_EACH_BURNED_AND_LOCKED_CHECK = retrieveEnvVariable(
  'WAIT_TIME_FOR_EACH_BURNED_AND_LOCKED_CHECK',
  logger,
);
