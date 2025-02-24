import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Segment } from '../../components/Segment';
import { trpc } from '../../lib/trpc';
import { zSignUpTrpcInput } from '@your-ideas/backend/src/router/signUp/input';
import { z } from 'zod';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllIdeasRoute } from '../../lib/routes';
import { useForm } from '../../lib/form';

export const SignUpPage = () => {
  const navigate = useNavigate();

  const trpcContext = trpc.useContext();
  const signUp = trpc.signUp.useMutation();

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: { nick: '', password: '', passwordAgain: '' },
    validationSchema:
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
        }
    ),
    onSubmit: async (data) => {
      const { token } = await signUp.mutateAsync(data);

      Cookie.set('token', token, { expires: 99999 });
      void trpcContext.invalidate();

      navigate(getAllIdeasRoute());
    },
    resetOnSuccess: false,
  });

  return (
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          {/*<Input label="E-mail" name="email" formik={formik} />*/}
          <Input label="Password" name="password" type="password" formik={formik} />
          <Input label="Password again" name="passwordAgain" type="password" formik={formik} />

          <Alert {...alertProps} />

          <Button {...buttonProps}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
