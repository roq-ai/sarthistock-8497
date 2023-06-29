import * as yup from 'yup';

export const stockValidationSchema = yup.object().shape({
  name: yup.string().required(),
  current_price: yup.number().integer().required(),
  historical_performance: yup.number().integer().required(),
});
