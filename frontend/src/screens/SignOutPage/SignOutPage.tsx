import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Cookie from 'js-cookie';
import { trpc } from '../../lib/trpc';
import { getSignInRoute } from '../../lib/routes';

export const SignOutPage = () => {
  const navigate = useNavigate();
  const trpcContext = trpc.useContext();

  useEffect(() => {
    Cookie.remove('token');

    void trpcContext.invalidate().then(() => {
      navigate(getSignInRoute(), { replace: true });
    });
  }, []);

  return <p>Загрузка...</p>;
}
