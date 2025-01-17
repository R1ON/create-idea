import css from './index.module.scss'
import { PropsWithChildren } from 'react';

type SegmentProps = PropsWithChildren<{
  title: React.ReactNode
  size?: 1 | 2
  description?: string
}>

export const Segment = ({
  title,
  size = 1,
  description,
  children,
}: SegmentProps) => {
  return (
    <div className={css.segment}>
      {size === 1 ? (
        <h1 className={css.title}>{title}</h1>
      ) : (
        <h2 className={css.title}>{title}</h2>
      )}

      {description && <p className={css.description}>{description}</p>}

      {children && <div className={css.content}>{children}</div>}
    </div>
  )
}
