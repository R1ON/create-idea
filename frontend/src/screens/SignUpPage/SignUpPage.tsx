import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Segment } from '../../components/Segment';
import { useState } from 'react';
import { useFormik } from 'formik';
import { trpc } from '../../lib/trpc';
import { withZodSchema } from 'formik-validator-zod';
import { zSignUpTrpcInput } from '@your-ideas/backend/src/router/signUp/input';
import { z } from 'zod';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllIdeasRoute } from '../../lib/routes';

export const SignUpPage = () => {
  const navigate = useNavigate();

  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const trpcContext = trpc.useContext();
  const signUp = trpc.signUp.useMutation();

  const formik = useFormik({
    initialValues: { nick: '', password: '', passwordAgain: '' },
    validate: withZodSchema(
      zSignUpTrpcInput
        .extend({
          passwordAgain: z.string().min(1),
        })
        .superRefine((val, ctx) => {
          if (val.password !== val.passwordAgain) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Пароли должны совпадать',
              path: ['passwordAgain'],
            });
          }
        })
    ),
    onSubmit: async (data) => {
      try {
        setSubmittingError(null)
        const { token } = await signUp.mutateAsync(data);

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
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          {/*<Input label="E-mail" name="email" formik={formik} />*/}
          <Input label="Password" name="password" type="password" formik={formik} />
          <Input label="Password again" name="passwordAgain" type="password" formik={formik} />

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
