import { FormItems } from '../../components/FormItems';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Segment } from '../../components/Segment';
import { Alert } from '../../components/Alert';
import { trpc } from '../../lib/trpc';
import { zCreateIdeaTrpcInput } from '@your-ideas/backend/src/router/createIdea/input';
import { Button } from '../../components/Button';
import { useForm } from '../../lib/form';

export const NewIdeaPage = () => {
  const createIdea = trpc.createIdea.useMutation();

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validationSchema: zCreateIdeaTrpcInput,
    successMessage: 'Idea created!',
    onSubmit: async (data) => {
      await createIdea.mutateAsync(data);
      formik.resetForm();
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

          <Alert {...alertProps} />
          <Button {...buttonProps}>Create Idea</Button>
        </FormItems>
      </form>
    </Segment>
  );
}
