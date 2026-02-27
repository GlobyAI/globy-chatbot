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

export interface CalComConnectResponse {
  success: boolean;
  authorization_url: string;
}

export interface CalComStatusResponse {
  success: boolean;
  connected: boolean;
  cal_user_id?: string;
  connected_at?: string;
  last_sync_at?: string;
  mapped_services_count?: number;
}

export async function startOnboarding(businessInfo: BusinessInfo) {
  const response = await bookingAxios.post<OnboardingStartResponse>(
    "/booking/api/v1/onboarding/start",
    businessInfo
  );
  return response;
}

export async function acceptServices(businessId: string, services: Service[]) {
  const response = await bookingAxios.post(
    `/booking/api/v1/onboarding/services/accept?user_id=${encodeURIComponent(businessId)}`,
    services
  );
  return response;
}

export async function getCalComConnectUrl() {
  const response = await bookingAxios.get<CalComConnectResponse>(
    "/booking/api/v1/integrations/calcom/connect"
  );
  return response;
}

export async function getCalComStatus() {
  const response = await bookingAxios.get<CalComStatusResponse>(
    "/booking/api/v1/integrations/calcom/status"
  );
  return response;
}

export interface BookingStatus {
  configured: boolean;
  provider?: 'globy' | 'calcom';
  businessName?: string;
  servicesCount?: number;
}

export async function getBookingStatus(userId: string) {
  const response = await bookingAxios.get<BookingStatus>(
    `/booking/api/v1/booking/status?user_id=${encodeURIComponent(userId)}`
  );
  return response;
}
