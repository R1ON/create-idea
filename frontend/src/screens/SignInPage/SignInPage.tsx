import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Segment } from '../../components/Segment';
import { trpc } from '../../lib/trpc';
import { zSignInTrpcInput } from '@your-ideas/backend/src/router/signIn/input';
import Cookie from 'js-cookie';
import { useForm } from '../../lib/form';
import { withPageWrapper } from '../../lib/withPageWrapper';

const SignInForm = () => {
  const trpcContext = trpc.useContext();
  const signIn = trpc.signIn.useMutation();

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: { nick: '', password: '' },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (data) => {
      const { token } = await signIn.mutateAsync(data);

      Cookie.set('token', token, { expires: 99999 });
      void trpcContext.invalidate();
    },
  });

  return (
    <Segment title="Sign In">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
}

export const SignInPage = withPageWrapper({
  redirectAuthorized: true,
})(SignInForm);
