import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/chat/chat.tsx"),
  route("*", "routes/not-found/NotFound.tsx"),
] satisfies RouteConfig;
