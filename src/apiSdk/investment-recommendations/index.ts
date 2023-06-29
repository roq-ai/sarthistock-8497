import axios from 'axios';
import queryString from 'query-string';
import {
  InvestmentRecommendationInterface,
  InvestmentRecommendationGetQueryInterface,
} from 'interfaces/investment-recommendation';
import { GetQueryInterface } from '../../interfaces';

export const getInvestmentRecommendations = async (query?: InvestmentRecommendationGetQueryInterface) => {
  const response = await axios.get(`/api/investment-recommendations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createInvestmentRecommendation = async (investmentRecommendation: InvestmentRecommendationInterface) => {
  const response = await axios.post('/api/investment-recommendations', investmentRecommendation);
  return response.data;
};

export const updateInvestmentRecommendationById = async (
  id: string,
  investmentRecommendation: InvestmentRecommendationInterface,
) => {
  const response = await axios.put(`/api/investment-recommendations/${id}`, investmentRecommendation);
  return response.data;
};

export const getInvestmentRecommendationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/investment-recommendations/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteInvestmentRecommendationById = async (id: string) => {
  const response = await axios.delete(`/api/investment-recommendations/${id}`);
  return response.data;
};
