import { Navigate, useNavigate } from "react-router"
import type { Route } from "../../+types/root";
import { APP_ROUTES } from "~/utils/vars";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "globy.ai  | Page Not Found", },
  ];
}

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="payment-status ">
      <div>
        <h2>
          404 - Page Not Found
        </h2>
        <button
          onClick={() => navigate(APP_ROUTES.INDEX)}
        >
          Go to Home Page
        </button>
      </div>
    </div>
  )
}