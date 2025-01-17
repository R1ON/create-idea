import cn from 'classnames'
import { Link } from 'react-router-dom'
import s from './index.module.scss'
import { PropsWithChildren } from 'react';

type ButtonColor = 'red' | 'green'

export type ButtonProps = PropsWithChildren<{
  loading?: boolean
  color?: ButtonColor
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}>;

export const Button = ({
  children,
  loading = false,
  color = 'green',
  type = 'submit',
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={cn({
        [s.button]: true,
        [s[`color-${color}`]]: true,
        [s.disabled]: disabled || loading,
        [s.loading]: loading,
      })}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <span className={s.text}>{children}</span>
    </button>
  )
}

type LinkButtonProps = PropsWithChildren<{
  to: string
  color?: ButtonColor
}>

export const LinkButton = ({
  children,
  to,
  color = 'green',
}: LinkButtonProps) => {
  return (
    <Link className={cn({ [s.button]: true, [s[`color-${color}`]]: true })} to={to}>
      {children}
    </Link>
  )
}

export const Buttons = ({ children }: PropsWithChildren) => {
  return <div className={s.buttons}>{children}</div>
}
