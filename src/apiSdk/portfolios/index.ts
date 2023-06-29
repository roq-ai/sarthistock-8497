import axios from 'axios';
import queryString from 'query-string';
import { PortfolioInterface, PortfolioGetQueryInterface } from 'interfaces/portfolio';
import { GetQueryInterface } from '../../interfaces';

export const getPortfolios = async (query?: PortfolioGetQueryInterface) => {
  const response = await axios.get(`/api/portfolios${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPortfolio = async (portfolio: PortfolioInterface) => {
  const response = await axios.post('/api/portfolios', portfolio);
  return response.data;
};

export const updatePortfolioById = async (id: string, portfolio: PortfolioInterface) => {
  const response = await axios.put(`/api/portfolios/${id}`, portfolio);
  return response.data;
};

export const getPortfolioById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/portfolios/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePortfolioById = async (id: string) => {
  const response = await axios.delete(`/api/portfolios/${id}`);
  return response.data;
};
