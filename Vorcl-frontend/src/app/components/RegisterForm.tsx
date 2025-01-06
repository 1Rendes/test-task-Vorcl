'use client';

import { ErrorMessage, Field, FieldInputProps, Form, Formik } from 'formik';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import React from 'react';
import * as Yup from 'yup';

const RegisterForm = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Invalid email address')
      .required('Email is required!'),
  });
  const handleSubmit = (values: { email: string }) => {
    console.log(values);
  };
  const initialValues = { email: '' };
  return (
    <div className="bg-audio-background rounded-[24px] m-auto mb-6 flex flex-col px-[32px] pt-[26px] pb-[40px] w-[384px] h-auto">
      <h2 className="text-white text-[20px] mb-[26px]">Sign Up</h2>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        <Form>
          <Field name="email">
            {({
              field,
              meta,
            }: {
              field: FieldInputProps<string>;
              meta: { error?: string; touched: boolean };
            }) => {
              return (
                <Input
                  size="md"
                  isRequired
                  isInvalid={!!meta.error && meta.touched}
                  {...field}
                  type="email"
                  className="mb-[12px]"
                  classNames={{
                    inputWrapper: [
                      'border-transparent border-2 focus-within:shadow-blue-500 focus-within:shadow-[0_0_0_2px] focus-within:border-black rounded-xl',
                    ],
                  }}
                  label="mail"
                  errorMessage={
                    meta.touched && meta.error ? meta.error : undefined
                  }
                ></Input>
              );
            }}
          </Field>
          <ErrorMessage name="email" component="span" className="hidden" />
          <Button
            className="dark bg-[#006FEE] text-white w-[100%] py-[12px] mb-[16px]"
            type="submit"
          >
            Continue with Email
          </Button>
        </Form>
      </Formik>
      <div className="flex gap-1 justify-center">
        <p>Already have an account?</p>
        <a href="#" className="text-[#006FEE]">
          Log In
        </a>
      </div>
    </div>
  );
};

export default RegisterForm;
