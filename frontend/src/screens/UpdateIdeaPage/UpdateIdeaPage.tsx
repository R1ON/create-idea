import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Segment } from '../../components/Segment';
import { Alert } from '../../components/Alert';
import { trpc } from '../../lib/trpc';
import { zUpdateIdeaTrpcInput } from '@your-ideas/backend/src/router/updateIdea/input';
import { Button } from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { pick } from 'lodash';
import { getIdeaRoute, ideaParams } from '../../lib/routes';
import { useForm } from '../../lib/form';
import { withPageWrapper } from '../../lib/withPageWrapper';

const UpdateIdeaForm: Parameters<typeof pageWrapper>[0] = ({ idea }) => {
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

const pageWrapper = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { nick = '' } = useParams<typeof ideaParams>();
    return trpc.getIdea.useQuery({ nick });
  },
  setProps: ({ ctx, queryResult, checkExists, checkAccess }) => {
    const idea = checkExists(queryResult.data.idea, 'Idea not found!');
    checkAccess(!!ctx.me && ctx.me.id === queryResult.data.idea?.authorId, 'Not your idea!');

    return { idea };
  },
});

export const UpdateIdeaPage = pageWrapper(UpdateIdeaForm);
