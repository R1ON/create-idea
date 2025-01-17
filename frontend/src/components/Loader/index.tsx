import cn from 'classnames'
import s from './index.module.scss'

type LoaderProps = {
  type: 'page' | 'section'
};

export const Loader = ({ type }: LoaderProps) => (
  <span
    className={cn({
      [s.loader]: true,
      [s[`type-${type}`]]: true,
    })}
  />
)
