import axios from "axios";
import { envConfig } from "~/utils/envConfig";
import { getTokenFromSession } from "./axiosInstance";

if (!envConfig.BOOKING_API_URL) {
  console.warn('BOOKING_API_URL is not configured. Booking API calls may fail.');
}

const bookingAxios = axios.create({
  baseURL: envConfig.BOOKING_API_URL || '',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

bookingAxios.interceptors.request.use(
  function (config) {
    if (!config.headers["Authorization"]) {
      const token = getTokenFromSession();
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export interface BusinessInfo {
  business_id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description?: string;
}

export type ServiceCategory =
  | 'hair' | 'nails' | 'massage' | 'facial' | 'makeup'
  | 'waxing' | 'lashes' | 'brows' | 'spa' | 'barber'
  | 'consultation' | 'other';

export interface Service {
  id?: string;
  business_id?: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  duration_minutes: number;
  price: number;
  currency: string;
}

export interface OnboardingStartResponse {
  businessId: string;
  suggestedServices: Service[];
}

export interface ExternalBookingConfig {
  provider: 'fresha' | 'booksy' | 'treatwell';
  embedCode?: string;
  bookingUrl?: string;
}

export interface ExternalInstructions {
  provider: string;
  steps: string[];
  embedExample?: string;
}

export async function startOnboarding(businessInfo: BusinessInfo) {
  const response = await bookingAxios.post<OnboardingStartResponse>(
    "/api/v1/onboarding/start",
    businessInfo
  );
  return response;
}

export async function acceptServices(businessId: string, services: Service[]) {
  const response = await bookingAxios.post(
    `/api/v1/onboarding/services/accept?business_id=${encodeURIComponent(businessId)}`,
    services
  );
  return response;
}

export async function setupExternalBooking(config: ExternalBookingConfig) {
  const response = await bookingAxios.post(
    "/api/v1/external-booking/setup",
    config
  );
  return response;
}

export async function getExternalInstructions(provider: string) {
  const response = await bookingAxios.get<ExternalInstructions>(
    `/api/v1/external-booking/${provider}/instructions`
  );
  return response;
}

export interface BookingStatus {
  configured: boolean;
  provider?: 'globy' | 'fresha' | 'booksy' | 'treatwell';
  businessName?: string;
  servicesCount?: number;
}

export async function getBookingStatus(userId: string) {
  const response = await bookingAxios.get<BookingStatus>(
    `/api/v1/booking/status?user_id=${encodeURIComponent(userId)}`
  );
  return response;
}
