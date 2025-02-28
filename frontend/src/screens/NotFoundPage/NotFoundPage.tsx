import { ErrorPage } from '../../components/ErrorPage';
import css from './NotFoundPage.module.scss';
import image404 from '../../assets/404.png';

export type NotFoundPageProps = {
  title?: string
  message?: string
};

export const NotFoundPage = ({
  title = 'Not Found',
  message = 'This page does not exist',
}: NotFoundPageProps) => (
  <ErrorPage title={title} message={message}>
    <img src={image404} className={css.image} alt="" width="800" height="600" />
  </ErrorPage>
)
