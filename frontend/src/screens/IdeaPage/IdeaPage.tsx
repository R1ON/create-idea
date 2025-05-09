import { useParams } from "react-router-dom";
import { getUpdateIdeaRoute, ideaParams } from "../../lib/routes";
import { trpc } from '../../lib/trpc';

import s from './IdeaPage.module.scss';
import { Segment } from '../../components/Segment';
import { format } from 'date-fns';
import { Button, LinkButton } from '../../components/Button';
import { withPageWrapper } from '../../lib/withPageWrapper';
import { LikeButton } from './LikeButton';
import { canBlockIdeas, canEditIdea } from '@your-ideas/backend/src/utils/can.ts';
import { TrpcRouterOutput } from '@your-ideas/backend/src/router';
import { useForm } from '../../lib/form.ts';
import { FormItems } from '../../components/FormItems';
import { Alert } from '../../components/Alert';

const BlockIdea = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const blockIdea = trpc.blockIdea.useMutation();
  const trpcUtils = trpc.useContext();

  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await trpcUtils.getIdea.refetch({ nick: idea.nick })
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block Idea
        </Button>
      </FormItems>
    </form>
  )
}

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

      {canEditIdea(me, idea) && (
        <div className={s.editButton}>
          <LinkButton to={getUpdateIdeaRoute({ nick: idea.nick })}>Edit idea</LinkButton>
        </div>
      )}

      {canBlockIdeas(me) && (
        <div className={s.blockIdea}>
          <BlockIdea idea={idea} />
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
