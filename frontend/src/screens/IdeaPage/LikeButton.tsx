import { TrpcRouterOutput } from '@your-ideas/backend/src/router';
import { trpc } from '../../lib/trpc';
import s from './IdeaPage.module.scss';
import { Icon } from '../../components/Icon/Icon';

type LikeButtonProps = {
  idea: NonNullable<TrpcRouterOutput['getIdea']['idea']>
};

export const LikeButton = ({ idea }: LikeButtonProps) => {
  const trpcContext = trpc.useContext()

  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcContext.getIdea.getData({ nick: idea.nick });
      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcContext.getIdea.setData({ nick: idea.nick }, newGetIdeaData)
      }
    },
    onSuccess: () => {
      void trpcContext.getIdea.invalidate({ nick: idea.nick })
    },
  })
  return (
    <button
      className={s.likeButton}
      onClick={() => {
        void setIdeaLike
          .mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
          // TODO: позже
          // .then(({ idea: { isLikedByMe } }) => {
          //   if (isLikedByMe) {
          //     mixpanelSetIdeaLike(idea)
          //   }
          // })
      }}
    >
      <Icon size={32} className={s.likeIcon} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </button>
  )
}
