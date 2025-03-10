import { zUpdateProfileTrpcInput } from '@your-ideas/backend/src/router/updateProfile/input';
import { zUpdatePasswordTrpcInput } from '@your-ideas/backend/src/router/updatePassword/input';
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { useForm } from '../../lib/form'
import { withPageWrapper } from '../../lib/withPageWrapper'
import { trpc } from '../../lib/trpc'
import { z } from 'zod';

const General: Parameters<typeof pageWrapper>[0] = ({ me }) => {
  const trpcContext = trpc.useContext()
  const updateProfile = trpc.updateProfile.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values)
      trpcContext.getMe.setData(undefined, { me: updatedMe })
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Nick" name="nick" formik={formik} />
        <Input label="Name" name="name" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Update Profile</Button>
      </FormItems>
    </form>
  )
}

const Password = () => {
  const updatePassword = trpc.updatePassword.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
      .extend({
        newPasswordAgain: z.string().min(1),
      })
      .superRefine((val, ctx) => {
        if (val.newPassword !== val.newPasswordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords must be the same',
            path: ['newPasswordAgain'],
          });
        }
      }),
      // TODO: позже
      // .extend({
      //   newPasswordAgain: zStringRequired,
      // })
      // .superRefine(zPasswordsMustBeTheSame('newPassword', 'newPasswordAgain')),
    onSubmit: async ({ newPassword, oldPassword }) => {
      await updatePassword.mutateAsync({ newPassword, oldPassword })
    },
    successMessage: 'Password updated',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Old password" name="oldPassword" type="password" formik={formik} />
        <Input label="New password" name="newPassword" type="password" formik={formik} />
        <Input label="New password again" name="newPasswordAgain" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Update Password</Button>
      </FormItems>
    </form>
  )
}

const pageWrapper = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
});

const UpdateProfileForm: Parameters<typeof pageWrapper>[0] = (({ me }) => {
  return (
    <Segment title="Edit Profile">
      <Segment title="General" size={2}>
        <General me={me} />
      </Segment>
      <Segment title="Password" size={2}>
        <Password />
      </Segment>
    </Segment>
  )
});

export const UpdateProfilePage = pageWrapper(UpdateProfileForm);
