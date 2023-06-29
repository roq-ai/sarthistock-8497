import { UserInterface } from 'interfaces/user';
import { StockInterface } from 'interfaces/stock';
import { GetQueryInterface } from 'interfaces';

export interface InvestmentRecommendationInterface {
  id?: string;
  user_id?: string;
  stock_id?: string;
  recommendation: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  stock?: StockInterface;
  _count?: {};
}

export interface InvestmentRecommendationGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  stock_id?: string;
  recommendation?: string;
}
