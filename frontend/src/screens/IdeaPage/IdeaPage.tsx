import { useParams } from "react-router-dom";
import { getUpdateIdeaRoute, ideaParams } from "../../lib/routes";
import { trpc } from '../../lib/trpc';

import s from './IdeaPage.module.scss';
import { Segment } from '../../components/Segment';
import { format } from 'date-fns';
import { LinkButton } from '../../components/Button';

export const IdeaPage = () => {
  const { nick } = useParams<typeof ideaParams>();

  if (!nick) return;

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

    return (
      <Segment title={idea.nick} description={idea.description}>
        <div className={s.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
        <div className={s.author}>Author: {idea.author.nick}</div>
        <div className={s.text} dangerouslySetInnerHTML={{ __html: idea.text }} />

        {me?.id === idea.authorId && (
          <div className={s.editButton}>
            <LinkButton to={getUpdateIdeaRoute({ nick: idea.nick })}>Edit idea</LinkButton>
          </div>
        )}
      </Segment>
    );
}
