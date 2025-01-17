import { Link, Outlet } from 'react-router-dom';
import { getAllIdeasRoute, getNewIdeaRoute, getSignInRoute, getSignUpRoute } from '../../lib/routes';
import s from './index.module.scss';

export const Layout = () => {
  return (
    <div className={s.layout}>
      <div className={s.navigation}>
        <div className={s.logo}>Your Ideas</div>

        <ul className={s.menu}>
          <li className={s.item}>
            <Link to={getAllIdeasRoute()} className={s.link}>
              All Ideas
            </Link>
          </li>
          <li className={s.item}>
            <Link to={getNewIdeaRoute()} className={s.link}>
              Add Idea
            </Link>
          </li>
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
        </ul>
      </div>

      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  )
}
