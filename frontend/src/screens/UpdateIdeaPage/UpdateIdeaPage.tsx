import { trpc } from '../../lib/trpc';
import { useParams } from 'react-router-dom';
import { ideaParams } from '../../lib/routes';
import { UpdateIdeaForm } from './UpdateIdeaForm';
import { useMe } from '../../lib/ctx';

export const UpdateIdeaPage = () => {
  const { nick = '' } = useParams<typeof ideaParams>();

  const getIdeaResult = trpc.getIdea.useQuery({ nick });
  const me = useMe();

  if (getIdeaResult.isLoading || getIdeaResult.isFetching) {
    return (
      <span>Loading...</span>
    );
  }

  if (getIdeaResult.isError) {
    return <span>Error: ({getIdeaResult.error.message})</span>
  }


  if (!getIdeaResult.data.idea) {
    return <span>idea not found</span>
  }

  const idea = getIdeaResult.data.idea;

  if (!me) {
    return <span>only for authorized</span>
  }

  if (me.id !== idea.authorId) {
    return <span>not your idea</span>
  }

  return <UpdateIdeaForm idea={idea} />
}
