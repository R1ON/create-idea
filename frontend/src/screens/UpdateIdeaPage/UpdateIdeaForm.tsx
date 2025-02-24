import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Segment } from '../../components/Segment';
import { Alert } from '../../components/Alert';
import { trpc } from '../../lib/trpc';
import { zUpdateIdeaTrpcInput } from '@your-ideas/backend/src/router/updateIdea/input';
import { Button } from '../../components/Button';
import { TrpcRouterOutput } from '@your-ideas/backend/src/router';
import { useNavigate } from 'react-router-dom';
import { pick } from 'lodash';
import { getIdeaRoute } from '../../lib/routes';
import { useForm } from '../../lib/form';

type UpdateIdeaFormProps = {
  idea: NonNullable<TrpcRouterOutput['getIdea']['idea']>;
};

export const UpdateIdeaForm = ({ idea }: UpdateIdeaFormProps) => {
  const navigate = useNavigate();

  const updateIdea = trpc.updateIdea.useMutation();

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text']),
    validationSchema: zUpdateIdeaTrpcInput.omit({ ideaId: true }),
    onSubmit: async (data) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...data });
      navigate(getIdeaRoute({ nick: data.nick }));
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  });

  return (
    <Segment title={`Edit idea: ${idea.nick}`}>
      <form
        onSubmit={formik.handleSubmit}
      >
        <FormItems>
          <Input name="name" label="Name" formik={formik} />
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="description" label="Description" formik={formik} maxWidth={500} />
          <Textarea name="text" label="Text" formik={formik} />

          <Alert {...alertProps} />

          <Button {...buttonProps}>Update Idea</Button>
        </FormItems>
      </form>
    </Segment>
  );
}
