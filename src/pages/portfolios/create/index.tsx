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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPortfolio } from 'apiSdk/portfolios';
import { Error } from 'components/error';
import { portfolioValidationSchema } from 'validationSchema/portfolios';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { StockInterface } from 'interfaces/stock';
import { getUsers } from 'apiSdk/users';
import { getStocks } from 'apiSdk/stocks';
import { PortfolioInterface } from 'interfaces/portfolio';

function PortfolioCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PortfolioInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPortfolio(values);
      resetForm();
      router.push('/portfolios');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PortfolioInterface>({
    initialValues: {
      quantity: 0,
      user_id: (router.query.user_id as string) ?? null,
      stock_id: (router.query.stock_id as string) ?? null,
    },
    validationSchema: portfolioValidationSchema,
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
            Create Portfolio
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="quantity" mb="4" isInvalid={!!formik.errors?.quantity}>
            <FormLabel>Quantity</FormLabel>
            <NumberInput
              name="quantity"
              value={formik.values?.quantity}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.quantity && <FormErrorMessage>{formik.errors?.quantity}</FormErrorMessage>}
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
    entity: 'portfolio',
    operation: AccessOperationEnum.CREATE,
  }),
)(PortfolioCreatePage);
