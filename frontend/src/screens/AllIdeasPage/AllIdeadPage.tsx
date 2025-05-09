import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { useDebounceValue } from "usehooks-ts";
import { trpc } from "../../lib/trpc";
import { getIdeaRoute } from "../../lib/routes";
import { Segment } from '../../components/Segment';
import { Alert } from '../../components/Alert';

import s from './AllIdeasPage.module.scss';
import { layoutContainerRef } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { useForm } from '../../lib/form.ts';
import { zGetAllIdeasTrpcInput } from '@your-ideas/backend/src/router/getAllIdeas/input.ts';
import { Input } from '../../components/Input';

export const AllIdeasPage = () => {
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetAllIdeasTrpcInput.pick({ search: true }),
  });

  const debouncedValue = useDebounceValue(formik.values.search, 300);


    const {
        data, error, isLoading, isError,
        hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching,
    } = trpc.getIdeas.useInfiniteQuery({
      search: debouncedValue[0],
    }, {
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

        if (!data.pages[0].ideas.length) {
          return <Alert color="brown">Nothing has found</Alert>
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
        <div className={s.filter}>
          <Input maxWidth="100%" label="Search" name="search" formik={formik} />
        </div>
          {renderContent()}
      </Segment>
    );
};
