import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getInvestmentRecommendationById, updateInvestmentRecommendationById } from 'apiSdk/investment-recommendations';
import { Error } from 'components/error';
import { investmentRecommendationValidationSchema } from 'validationSchema/investment-recommendations';
import { InvestmentRecommendationInterface } from 'interfaces/investment-recommendation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { StockInterface } from 'interfaces/stock';
import { getUsers } from 'apiSdk/users';
import { getStocks } from 'apiSdk/stocks';

function InvestmentRecommendationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InvestmentRecommendationInterface>(
    () => (id ? `/investment-recommendations/${id}` : null),
    () => getInvestmentRecommendationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InvestmentRecommendationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInvestmentRecommendationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/investment-recommendations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InvestmentRecommendationInterface>({
    initialValues: data,
    validationSchema: investmentRecommendationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Investment Recommendation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="recommendation" mb="4" isInvalid={!!formik.errors?.recommendation}>
              <FormLabel>Recommendation</FormLabel>
              <Input
                type="text"
                name="recommendation"
                value={formik.values?.recommendation}
                onChange={formik.handleChange}
              />
              {formik.errors.recommendation && <FormErrorMessage>{formik.errors?.recommendation}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<StockInterface>
              formik={formik}
              name={'stock_id'}
              label={'Select Stock'}
              placeholder={'Select Stock'}
              fetcher={getStocks}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'investment_recommendation',
    operation: AccessOperationEnum.UPDATE,
  }),
)(InvestmentRecommendationEditPage);
