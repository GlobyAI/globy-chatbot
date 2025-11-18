import type { AxiosResponse } from 'axios';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAppContext } from '~/providers/AppContextProvider';
// import { createSignedUrl } from '~/services/fileApis';
import type { CreateSignedUrlPayload } from '~/types/models';
import { envConfig } from '~/utils/envConfig';
import { changeFileExtension } from '~/utils/file';


export default function useUploadLogo() {
    const [pct, setPct] = useState(0)
    const { userId } = useAppContext()
    const putToS3WithProcess = async (
        url: string,
        file: File,
    ): Promise<AxiosResponse> => {
        return await axios({
            url,
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            data: file,
            onUploadProgress: (event) => {
                if (event.total) {
                    const pct = Math.round((event.loaded * 100) / event.total);
                    setPct(pct)

                }
            },
        });
    };
    const createSignedUrl = async (
        payload: CreateSignedUrlPayload
    ): Promise<AxiosResponse> => {
        return await axios({
            url: envConfig.IMAGE_LIBRARY_API + "/upload-url",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        });
    };


    const onUploadFile = async (file: File) => {
        if (!userId) return
        let signedUrl = ''
        setPct(0)
        try {
            const filename = changeFileExtension(file.name, file.type);
            const key = `images/${new Date().getFullYear()}/${userId}/${filename}`;
            const data: CreateSignedUrlPayload = {
                bucket: "globylibrary-" + userId,
                key: key,
                content_type: file.type,
                expires: 900,
            }
            const response = await createSignedUrl(data)
            // if (signedUlrRes?.status !== 200) {
            //     toast.error("Cannot create signed url to upload file");
            // } else {
            //     url = signedUlrRes.data.url;
            // }
            // return {
            //     url,
            //     key,
            // };
        } catch (error) {
            const message = error instanceof AxiosError ? error.message : "Unable to upload logo. Try again later"
            toast.error(message)
            console.log('createSignedUrl error: ', error)
        }
    }
    return {
        putToS3WithProcess,
        pct,
        onUploadFile
    }
}