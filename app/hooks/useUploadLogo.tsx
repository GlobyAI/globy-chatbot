import type { AxiosResponse } from 'axios';
import axios, { AxiosError } from 'axios';
import { useEffect, useState, } from 'react'
import toast from 'react-hot-toast';
import { useAppContext } from '~/providers/AppContextProvider';
import { fetchImageLibrary } from '~/services/appApis';
import axiosInstance from '~/services/axiosInstance';
import type { CreateSignedUrlPayload, UploadedImage } from '~/types/models';
import { envConfig } from '~/utils/envConfig';
import { changeFileExtension } from '~/utils/file';


export default function useUploadLogo() {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
    const [pct, setPct] = useState(100)
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
    const onDeleteImage = async (
        selectedImage: UploadedImage
    ) => {
        try {
            const deleteRes = await axiosInstance({
                baseURL: envConfig.IMAGE_LIBRARY_API + '/image',
                method: "DELETE",
                data: JSON.stringify({
                    bucket: selectedImage.bucket,
                    key: selectedImage.key
                })
            });
            if (deleteRes.status === 200) {
                setUploadedImages(prev => prev.filter(i => i.key !== selectedImage.key && i.url !== selectedImage.url))
            }
        } catch (error) {
            const message = error instanceof AxiosError ? error.message : "Unable to delete logo. Try again later"
            toast.error(message)
            console.log('onDeleteImage error: ', error)
        }

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

    useEffect(() => {
        async function getLibrary() {
            if (!userId) return
            try {
                const res = await fetchImageLibrary(userId)
                if (res.status === 200 && res.data.items) {
                    setUploadedImages(prev => [...prev, ...res.data.items])
                }

            } catch (error) {
                console.log("getLibrary error:", error)
            }
        }
        getLibrary()
    }, [userId])

    const onUploadFile = async (file: File) => {
        if (!userId) return
        setPct(0)
      
        const filename = changeFileExtension(file.name, file.type);
        const key = `images/${new Date().getFullYear()}/${userId}/${filename}`;
        const bucket = "globylibrary-" + userId
        const content_type = file.type

        try {
            const data: CreateSignedUrlPayload = {
                bucket,
                key: key,
                content_type,
                expires: 900,
            }
            const signedUlrRes = await createSignedUrl(data)
            if (signedUlrRes.status === 200) {
                const signedUrl = signedUlrRes.data.url
                try {
                    const response = await putToS3WithProcess(signedUrl, file)
                    if (response.status === 200) {
                        const previewUrl = URL.createObjectURL(file)
                        setUploadedImages((prev) => [...prev, {
                            key,
                            url: previewUrl,
                            bucket,
                            content_type
                        }])
                    }

                } catch (error) {
                    console.log('putToS3WithProcess error:', error)
                    if (error instanceof AxiosError) {
                        toast.error(error.message || "Unable to upload the file. Try again later")
                    }
                }
            }

        } catch (error) {
            const message = error instanceof AxiosError ? error.message : "Unable to upload logo. Try again later"
            toast.error(message)
            console.log('createSignedUrl error: ', error)
        }
    }
    return {
        putToS3WithProcess,
        pct,
        onUploadFile,
        uploadedImages,
        onDeleteImage
    }
}