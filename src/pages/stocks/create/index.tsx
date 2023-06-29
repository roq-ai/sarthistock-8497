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
import { createStock } from 'apiSdk/stocks';
import { Error } from 'components/error';
import { stockValidationSchema } from 'validationSchema/stocks';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { StockInterface } from 'interfaces/stock';

function StockCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: StockInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createStock(values);
      resetForm();
      router.push('/stocks');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<StockInterface>({
    initialValues: {
      name: '',
      current_price: 0,
      historical_performance: 0,
    },
    validationSchema: stockValidationSchema,
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
            Create Stock
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="current_price" mb="4" isInvalid={!!formik.errors?.current_price}>
            <FormLabel>Current Price</FormLabel>
            <NumberInput
              name="current_price"
              value={formik.values?.current_price}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('current_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.current_price && <FormErrorMessage>{formik.errors?.current_price}</FormErrorMessage>}
          </FormControl>
          <FormControl id="historical_performance" mb="4" isInvalid={!!formik.errors?.historical_performance}>
            <FormLabel>Historical Performance</FormLabel>
            <NumberInput
              name="historical_performance"
              value={formik.values?.historical_performance}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('historical_performance', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.historical_performance && (
              <FormErrorMessage>{formik.errors?.historical_performance}</FormErrorMessage>
            )}
          </FormControl>

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
    entity: 'stock',
    operation: AccessOperationEnum.CREATE,
  }),
)(StockCreatePage);
