import { Alert } from '../Alert'
import { Segment } from '../Segment'

type ErrorPageProps = {
  title?: string
  message?: string
  children?: React.ReactNode
};

export const ErrorPage = ({
  title = 'Oops, error',
  message = 'Something went wrong',
  children,
}: ErrorPageProps) => {
  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
      {children}
    </Segment>
  )
}
