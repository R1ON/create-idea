import cn from 'classnames'
import { type FormikProps } from 'formik'
import s from './index.module.scss'

type InputProps = {
  name: string
  label: string
  formik: FormikProps<any>
  maxWidth?: number | string
  type?: 'text' | 'password'
}

export const Input = ({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
}: InputProps) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  return (
    <div className={cn({ [s.field]: true, [s.disabled]: disabled })}>
      <label className={s.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={cn({
          [s.input]: true,
          [s.invalid]: invalid,
        })}
        style={{ maxWidth }}
        type={type}
        onChange={(e) => {
          void formik.setFieldValue(name, e.target.value)
        }}
        onBlur={() => {
          void formik.setFieldTouched(name)
        }}
        value={value}
        name={name}
        id={name}
        disabled={formik.isSubmitting}
      />
      {invalid && <div className={s.error}>{error}</div>}
    </div>
  )
}
