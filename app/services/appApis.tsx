import { useSearchParams } from "react-router";
import axiosInstance from "./axiosInstance";
import { MESSAGE_LIMIT } from "~/utils/vars";
import type { HistoryResponse, ImageLibraryResponse, KpisResponse, UploadedImage } from "~/types/models";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { envConfig } from "~/utils/envConfig";

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

export function fetchHistory(userId: string, offset: number = 0): Promise<AxiosResponse<HistoryResponse>> {
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


export function fetchKpis(userId: string): Promise<KpisResponse> {
    return axiosInstance({
        
        url: `/chatbot/v1/kpis?user_id=${userId}`,
        method: "GET",
    })
}


export function fetchImageLibrary(userId: string): Promise<AxiosResponse<ImageLibraryResponse>> {
    return axiosInstance({
        baseURL: `${envConfig.IMAGE_LIBRARY_API}/images?bucket=globylibrary-${userId}`,
        method: "GET",
    })

}
