import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Segment } from '../../components/Segment';
import { useFormik } from 'formik';
import { Alert } from '../../components/Alert';
import { withZodSchema } from 'formik-validator-zod';
import { trpc } from '../../lib/trpc';
import { zUpdateIdeaTrpcInput } from '@your-ideas/backend/src/router/updateIdea/input';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { TrpcRouterOutput } from '@your-ideas/backend/src/router';
import { useNavigate } from 'react-router-dom';
import { pick } from 'lodash';
import { getIdeaRoute } from '../../lib/routes';

type UpdateIdeaFormProps = {
  idea: NonNullable<TrpcRouterOutput['getIdea']['idea']>;
};

export const UpdateIdeaForm = ({ idea }: UpdateIdeaFormProps) => {
  const navigate = useNavigate();

  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const updateIdea = trpc.updateIdea.useMutation();

  const formik = useFormik({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text']),
    validate: withZodSchema(
      zUpdateIdeaTrpcInput.omit({ ideaId: true })
    ),
    onSubmit: async (data) => {
      try {
        setSubmittingError(null);

        await updateIdea.mutateAsync({ ideaId: idea.id, ...data });

        navigate(getIdeaRoute({ nick: data.nick }));
      }
      catch (error) {
        if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
          setSubmittingError(error.message);
          setTimeout(() => setSubmittingError(null), 3000);
        }
      }
    },
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

          {submittingError && (
            <Alert color="red">{submittingError}</Alert>
          )}

          <Button loading={formik.isSubmitting}>Update Idea</Button>
        </FormItems>
      </form>
    </Segment>
  );
}
