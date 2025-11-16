import { Navigate } from "react-router"

type Props = {}

export default function NotFound({}: Props) {
  return <Navigate to={''} replace />
}