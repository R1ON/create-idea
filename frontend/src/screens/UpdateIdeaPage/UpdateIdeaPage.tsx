import { trpc } from '../../lib/trpc';
import { useParams } from 'react-router-dom';
import { ideaParams } from '../../lib/routes';
import { UpdateIdeaForm } from './UpdateIdeaForm';

export const UpdateIdeaPage = () => {
  const { nick = '' } = useParams<typeof ideaParams>();

  const getIdeaResult = trpc.getIdea.useQuery({ nick });
  const getMeResult = trpc.getMe.useQuery();

  if (
    getIdeaResult.isLoading ||
    getIdeaResult.isFetching ||
    getMeResult.isLoading ||
    getMeResult.isFetching
  ) {
    return (
      <span>Loading...</span>
    );
  }

  if (getIdeaResult.isError) {
    return <span>Error: ({getIdeaResult.error.message})</span>
  }

  if (getMeResult.isError) {
    return <span>Error: ({getMeResult.error.message})</span>
  }


  if (!getIdeaResult.data.idea) {
    return <span>idea not found</span>
  }

  const idea = getIdeaResult.data.idea;
  const me = getMeResult.data.me;

  if (!me) {
    return <span>only for authorized</span>
  }

  if (me.id !== idea.authorId) {
    return <span>not your idea</span>
  }

  return <UpdateIdeaForm idea={idea} />
}
