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
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllIdeasRoute } from '../../lib/routes';

export const SignInPage = () => {
  const navigate = useNavigate();

  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const trpcContext = trpc.useContext();
  const signIn = trpc.signIn.useMutation();

  const formik = useFormik({
    initialValues: { nick: '', password: '' },
    validate: withZodSchema(zSignInTrpcInput),
    onSubmit: async (data) => {
      try {
        setSubmittingError(null)
        const { token } = await signIn.mutateAsync(data);

        Cookie.set('token', token, { expires: 99999 });
        void trpcContext.invalidate();

        navigate(getAllIdeasRoute());
      }
      catch (error) {
        if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
          setSubmittingError(error.message);
        }
      }
    },
  });

  return (
    <Segment title="Sign In">
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

          <Button loading={formik.isSubmitting}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
