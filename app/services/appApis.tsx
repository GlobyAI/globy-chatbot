import axiosInstance from "./axiosInstance";

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