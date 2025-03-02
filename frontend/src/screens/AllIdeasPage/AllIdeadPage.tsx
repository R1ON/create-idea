import { Link } from "react-router-dom";
import { trpc } from "../../lib/trpc";
import { getIdeaRoute } from "../../lib/routes";
import { Segment } from '../../components/Segment';
import { Alert } from '../../components/Alert';

import s from './AllIdeasPage.module.scss';

export const AllIdeasPage = () => {
    const {
        data, error, isLoading, isError,
        hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching,
    } = trpc.getIdeas.useInfiniteQuery({ limit: 2 }, {
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
        },
    });

    const renderContent = () => {
        if (isLoading || isRefetching) {
            return <div>loading...</div>;
        }

        if (isError) {
            return <Alert color="red">{error.message}</Alert>;
        }

        return (
          <ul className={s.ideas}>
              {data.pages
                .flatMap((page) => page.ideas)
                .map((idea) => (
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
                  ))
              }

              <div className={s.more}>
                  {hasNextPage && !isFetchingNextPage && (
                    <button type="button" onClick={() => {
                        void fetchNextPage();
                    }}>
                        Load more
                    </button>
                  )}

                  {isFetchingNextPage && <div>loading...</div>}
              </div>
          </ul>
        );
    }

    return (
        <Segment title="All Ideas">
            {renderContent()}
        </Segment>
    );
};
