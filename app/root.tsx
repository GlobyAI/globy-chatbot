import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
} from "react-router";

import type { Route } from "./+types/root";
import "./style/global.scss";
import { WebSocketProvider } from "./providers/WSProdivder";
import AuthProvider from "./providers/AuthProvider";
import AppContextProvider from "./providers/AppContextProvider";
import GlobyToast from "./providers/GlobyToast";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";



export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppContextProvider>
            <WebSocketProvider>
              {children}
              <LoadingOverlay/>
              <div id="modal-root" />
            </WebSocketProvider>
          </AppContextProvider>
        </AuthProvider>
        <GlobyToast />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main >
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre >
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
