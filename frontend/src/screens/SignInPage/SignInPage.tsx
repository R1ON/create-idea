import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Segment } from '../../components/Segment';
import { useState } from 'react';
import { useFormik } from 'formik';
import { trpc } from '../../lib/trpc';
import { withZodSchema } from 'formik-validator-zod';
import { zSignInTrpcInput } from '@your-ideas/backend/src/router/signIn/input';

export const SignInPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const signIn = trpc.signIn.useMutation();

  const formik = useFormik({
    initialValues: { nick: '', password: '' },
    validate: withZodSchema(zSignInTrpcInput),
    onSubmit: async (data) => {
      try {
        setSubmittingError(null)
        await signIn.mutateAsync(data);
        formik.resetForm();
        setSuccessMessageVisible(true);
        setTimeout(() => setSuccessMessageVisible(false), 3000);
      }
      catch (error) {
        if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
          setSubmittingError(error.message);
        }
      }
    },
  });

  return (
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />

          {!formik.isValid && !!formik.submitCount && (
            <Alert color="red">Некоторые поля с ошибкой</Alert>
          )}

          {submittingError && (
            <Alert color="red">{submittingError}</Alert>
          )}

          {successMessageVisible && (
            <Alert color="green">Все отлично</Alert>
          )}

          <Button loading={formik.isSubmitting}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
