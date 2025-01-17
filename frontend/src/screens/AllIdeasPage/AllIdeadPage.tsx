import { Link } from "react-router-dom";
import { trpc } from "../../lib/trpc";
import { getIdeaRoute } from "../../lib/routes";
import { Segment } from '../../components/Segment';

import s from './AllIdeasPage.module.scss';

export const AllIdeasPage = () => {
    const {
        data, error, isLoading, isFetching, isError,
    } = trpc.getIdeas.useQuery();

    if (isLoading || isFetching) {
        return <div>loading...</div>
    }

    if (isError) {
        return <div>{error.message}</div>
    }

    if (!data) {
      return <div>no ideas at all</div>
    }

    return (
        <Segment title="All Ideas">
            <ul className={s.ideas}>
                {data.ideas.map((idea) => (
                    <div key={idea.nick} className={s.idea}>
                      <Segment
                        size={2}
                        title={(
                          <Link to={getIdeaRoute({ nick: idea.nick })} className={s.ideaLink}>
                            {idea.name}
                          </Link>
                        )}
                        description={idea.description}
                      />
                    </div>
                ))}
            </ul>
        </Segment>
    );
};
