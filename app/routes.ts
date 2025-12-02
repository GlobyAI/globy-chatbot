import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/chat/chat.tsx"),
  route("/price", "routes/pricing/Pricing.tsx"),
  route("/payment-process", "routes/payment-process/PaymentProcess.tsx"),
  route("/payment-success/:plan", "routes/payment-success/PaymentSuccess.tsx"),
  route("*", "routes/not-found/NotFound.tsx"),
] satisfies RouteConfig;
