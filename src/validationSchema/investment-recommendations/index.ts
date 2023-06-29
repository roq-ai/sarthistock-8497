import * as yup from 'yup';

export const investmentRecommendationValidationSchema = yup.object().shape({
  recommendation: yup.string().required(),
  user_id: yup.string().nullable(),
  stock_id: yup.string().nullable(),
});
