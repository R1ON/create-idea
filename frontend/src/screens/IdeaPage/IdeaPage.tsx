import { useParams } from "react-router-dom";
import { getUpdateIdeaRoute, ideaParams } from "../../lib/routes";
import { trpc } from '../../lib/trpc';

import s from './IdeaPage.module.scss';
import { Segment } from '../../components/Segment';
import { format } from 'date-fns';
import { LinkButton } from '../../components/Button';
import { withPageWrapper } from '../../lib/withPageWrapper';
import { LikeButton } from './LikeButton';

const IdeaComponent: Parameters<typeof pageWrapper>[0] = ({ idea, me }) => {
  return (
    <Segment title={idea.nick} description={idea.description}>
      <div className={s.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
      <div className={s.author}>Author: {idea.author.nick}</div>

      {idea.author.name && (
        <div className={s.author}>
          Name: {idea.author.name}
        </div>
      )}

      <div className={s.text} dangerouslySetInnerHTML={{ __html: idea.text }} />

      <div className={s.likes}>
        Likes: {idea.likesCount}

        {me && (
          <>
            <br/>
            <LikeButton idea={idea} />
          </>
        )}
      </div>

      {me?.id === idea.authorId && (
        <div className={s.editButton}>
          <LinkButton to={getUpdateIdeaRoute({ nick: idea.nick })}>Edit idea</LinkButton>
        </div>
      )}
    </Segment>
  );
}

const pageWrapper = withPageWrapper({
  showLoaderOnFetching: false,
  useQuery: () => {
    const { nick = '' } = useParams<typeof ideaParams>();
    return trpc.getIdea.useQuery({ nick });
  },
  setProps: ({ queryResult, ctx, checkExists }) => ({
    idea: checkExists(queryResult.data.idea),
    me: ctx.me,
  }),
});

export const IdeaPage = pageWrapper(IdeaComponent);
