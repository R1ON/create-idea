import { useParams } from "react-router-dom";
import { ideaParams } from "../../lib/routes";
import { trpc } from '../../lib/trpc';

import s from './IdeaPage.module.scss';
import { Segment } from '../../components/Segment';
import { format } from 'date-fns';

export const IdeaPage = () => {
    const { nick } = useParams<typeof ideaParams>();

    if (!nick) return;

    const {
      data, isLoading, isFetching, isError, error,
    } = trpc.getIdea.useQuery({ nick });

  if (isLoading || isFetching) {
    return <div>loading...</div>
  }

  if (isError) {
    return <div>{error.message}</div>
  }

  if (!data.idea) {
    return <div>idea not found</div>
  }

    return (
      <Segment title={data.idea.nick} description={data.idea.description}>
        <div className={s.createdAt}>Created At: {format(data.idea.createdAt, 'yyyy-MM-dd')}</div>
        <div className={s.author}>Author: {data.idea.author.nick}</div>
        <div className={s.text} dangerouslySetInnerHTML={{ __html: data.idea.text }} />
      </Segment>
    );
}
