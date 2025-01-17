import s from './index.module.scss'
import { PropsWithChildren } from 'react';

export const FormItems = ({ children }: PropsWithChildren) => {
  return <div className={s.formItems}>{children}</div>
}
