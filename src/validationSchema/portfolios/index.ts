import * as yup from 'yup';

export const portfolioValidationSchema = yup.object().shape({
  quantity: yup.number().integer().required(),
  user_id: yup.string().nullable(),
  stock_id: yup.string().nullable(),
});
