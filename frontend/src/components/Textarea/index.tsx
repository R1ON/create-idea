import cn from 'classnames'
import { type FormikProps } from 'formik'
import s from './index.module.scss'

type TextareaProps = {
  name: string;
  label: string;
  formik: FormikProps<any>;
}

export const Textarea = ({ name, label, formik }: TextareaProps) => {
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
      <textarea
        className={cn({
          [s.input]: true,
          [s.invalid]: invalid,
        })}
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
