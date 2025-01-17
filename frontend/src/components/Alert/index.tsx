import cn from 'classnames'
import s from './index.module.scss'
import { PropsWithChildren } from 'react';

export type AlertProps = PropsWithChildren<{
  color: 'red' | 'green' | 'brown';
  hidden?: boolean;
}>;

export const Alert = ({ color, hidden, children }: AlertProps) => {
  if (hidden) {
    return null
  }
  return <div className={cn({ [s.alert]: true, [s[color]]: true })}>{children}</div>
}
