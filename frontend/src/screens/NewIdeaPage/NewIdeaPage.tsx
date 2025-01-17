import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Segment } from '../../components/Segment';
import { useFormik } from 'formik';
import { Alert } from '../../components/Alert';
import { withZodSchema } from 'formik-validator-zod';
import { trpc } from '../../lib/trpc';
import { zCreateIdeaTrpcInput } from '@your-ideas/backend/src/router/createIdea/input';
import { useState } from 'react';
import { Button } from '../../components/Button';

export const NewIdeaPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const createIdea = trpc.createIdea.useMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validate: withZodSchema(zCreateIdeaTrpcInput),
    onSubmit: async (data) => {
      try {
        await createIdea.mutateAsync(data);
        formik.resetForm();
        setSuccessMessageVisible(true);
        setTimeout(() => setSuccessMessageVisible(false), 3000);
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
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormItems>
          <Input name="name" label="Name" formik={formik} />
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="description" label="Description" formik={formik} maxWidth={500} />
          <Textarea name="text" label="Text" formik={formik} />

          {successMessageVisible && (
            <Alert color="green">Idea created!</Alert>
          )}

          {submittingError && (
            <Alert color="red">{submittingError}</Alert>
          )}

          <Button loading={formik.isSubmitting}>Create Idea</Button>
        </FormItems>
      </form>
    </Segment>
  );
}
