import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { trpc } from "../../lib/trpc";
import { getIdeaRoute } from "../../lib/routes";
import { Segment } from '../../components/Segment';
import { Alert } from '../../components/Alert';

import s from './AllIdeasPage.module.scss';
import { layoutContainerRef } from '../../components/Layout';
import { Loader } from '../../components/Loader';

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
            return <Loader type="section" />;
        }

        if (isError) {
            return <Alert color="red">{error.message}</Alert>;
        }

        return (
          <ul className={s.ideas}>
              <InfiniteScroll
                threshold={250}
                hasMore={hasNextPage}
                loadMore={() => {
                  if (!isFetchingNextPage && hasNextPage) {
                    void fetchNextPage()
                  }
                }}
                loader={(
                  <div key="loader"><Loader type="section" /></div>
                )}
                getScrollParent={() => layoutContainerRef.current}
                useWindow={
                  (layoutContainerRef.current && getComputedStyle(layoutContainerRef.current).overflow) !== 'auto'
                }
              >
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
                            >
                              Likes: {idea.likesCount}
                            </Segment>
                        </div>
                      ))
                  }
              </InfiniteScroll>
          </ul>
        );
    }

    return (
        <Segment title="All Ideas">
            {renderContent()}
        </Segment>
    );
};
