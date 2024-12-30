interface IndicatorDataDetails {
  [key: string]: boolean;
}

interface IndicatorData {
  high: {
    count: number;
    details: IndicatorDataDetails;
  };
  moderate: {
    count: number;
    details: IndicatorDataDetails;
  };
  low: {
    count: number;
    details: IndicatorDataDetails;
  };
  specific: {
    count: number;
    details: IndicatorDataDetails;
  };
}

interface LiquidityList {
  raydium: {
    address: string;
    amount: number;
    lpPair: string;
  };
}

interface OwnersList {
  address: string;
  amount: string;
  percentage: string;
}

interface TokenOverview {
  deployer: string;
  mint: string;
  supply: string;
  marketCap: string;
  address: string;
  type: string;
}

interface PoolSuggestion {
  _id: string;
  address: string;
  __v: number;
  createdAt: string;
  deployTime: string;
  externals: string;
  indicatorData: IndicatorData;
  liquidityList: LiquidityList[];
  marketCap: number;
  ownersList: OwnersList[];
  pageViews: number;
  score: number;
  tokenImg: string;
  tokenName: string;
  tokenOverview: TokenOverview;
  tokenSymbol: string;
  updatedAt: string;
}

interface ApiResponse {
  ok: boolean;
  status: number;
  data: PoolSuggestion[];
}

export type PoolSuggestionResponse = ApiResponse;
