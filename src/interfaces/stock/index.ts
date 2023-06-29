import { InvestmentRecommendationInterface } from 'interfaces/investment-recommendation';
import { PortfolioInterface } from 'interfaces/portfolio';
import { GetQueryInterface } from 'interfaces';

export interface StockInterface {
  id?: string;
  name: string;
  current_price: number;
  historical_performance: number;
  created_at?: any;
  updated_at?: any;
  investment_recommendation?: InvestmentRecommendationInterface[];
  portfolio?: PortfolioInterface[];

  _count?: {
    investment_recommendation?: number;
    portfolio?: number;
  };
}

export interface StockGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
}
