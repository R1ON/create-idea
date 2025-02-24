import { useParams } from "react-router-dom";
import { getUpdateIdeaRoute, ideaParams } from "../../lib/routes";
import { trpc } from '../../lib/trpc';

import s from './IdeaPage.module.scss';
import { Segment } from '../../components/Segment';
import { format } from 'date-fns';
import { LinkButton } from '../../components/Button';
import { withPageWrapper } from '../../lib/withPageWrapper';
import { TrpcRouterOutput } from '@your-ideas/backend/src/router';

type IdeaComponentProps = {
  idea: NonNullable<TrpcRouterOutput['getIdea']['idea']>;
  me: TrpcRouterOutput['getMe']['me'];
}

const IdeaComponent = ({ idea, me }: IdeaComponentProps) => {
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

export const IdeaPage = withPageWrapper({
  useQuery: () => {
    const { nick = '' } = useParams<typeof ideaParams>();
    return trpc.getIdea.useQuery({ nick });
  },
  checkExists: ({ queryResult }) => !!queryResult.data.idea,
  checkExistsMessage: 'Idea not found',
  setProps: ({ queryResult, ctx }) => ({
    idea: queryResult.data.idea!,
    me: ctx.me,
  }),
})(IdeaComponent);
