import { UserInterface } from 'interfaces/user';
import { StockInterface } from 'interfaces/stock';
import { GetQueryInterface } from 'interfaces';

export interface PortfolioInterface {
  id?: string;
  user_id?: string;
  stock_id?: string;
  quantity: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  stock?: StockInterface;
  _count?: {};
}

export interface PortfolioGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  stock_id?: string;
}
