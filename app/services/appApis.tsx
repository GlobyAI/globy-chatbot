import { useSearchParams } from "react-router";
import axiosInstance from "./axiosInstance";
import { MESSAGE_LIMIT } from "~/utils/vars";

export function completeWorkFlow(userId: string) {
    return axiosInstance({
        url: '/chatbot/v1/complete',
        method: "POST",
        data: {
            user_id: userId,
            force: false
        }
    })

}

export function fetchHistory(userId: string, offset: number = 0) {
    const limit = MESSAGE_LIMIT

    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        user_id: userId
    })
    return axiosInstance({
        url: '/chatbot/v1/chat_history?' + params.toString(),
        method: "GET",
    })

}

export interface KpisResponse {
    user_id: string;
    kpis: {
        confidence: number;
    };
}

export function fetchKpis(userId: string): Promise<KpisResponse> {
    return axiosInstance({
        url: `/chatbot/v1/kpis?user_id=${userId}`,
        method: "GET",
    })
}

