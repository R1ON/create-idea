import { createRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  getAllIdeasRoute,
  getNewIdeaRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
  getUpdateProfileRoute
} from '../../lib/routes';
import { useMe } from '../../lib/ctx';
import s from './index.module.scss';

export const layoutContainerRef = createRef<HTMLDivElement>();

export const Layout = () => {
  const me = useMe();

  const renderPublicMenuItems = () => {
    return (
      <>
        <li className={s.item}>
          <Link to={getAllIdeasRoute()} className={s.link}>
            All Ideas
          </Link>
        </li>
      </>
    );
  }

  const renderPossiblePrivateMenuItems = () => {
    if (!!me) {
      return (
        <>
          <li className={s.item}>
            <Link to={getNewIdeaRoute()} className={s.link}>
              Add Idea
            </Link>
          </li>
          <li className={s.item}>
            <Link to={getUpdateProfileRoute()} className={s.link}>
              Edit Profile
            </Link>
          </li>
          <li className={s.item}>
            <Link to={getSignOutRoute()} className={s.link}>
              Sign out ({me.nick})
            </Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li className={s.item}>
          <Link to={getSignUpRoute()} className={s.link}>
            Sign up
          </Link>
        </li>
        <li className={s.item}>
          <Link to={getSignInRoute()} className={s.link}>
            Sign in
          </Link>
        </li>
      </>
    );
  }

  return (
    <div className={s.layout}>
      <div className={s.navigation}>
        <div className={s.logo}>Your Ideas</div>

        <ul className={s.menu}>
          {renderPublicMenuItems()}

          {renderPossiblePrivateMenuItems()}
        </ul>
      </div>

      <div className={s.content} ref={layoutContainerRef}>
        <Outlet />
      </div>
    </div>
  )
}
