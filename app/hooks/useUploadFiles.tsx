import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '~/providers/AppContextProvider'
import { useChatBoxContext } from '~/providers/ChatboxProvider'
import axiosInstance from '~/services/axiosInstance'
import type { IUploadFile } from '~/types/models'


export default function useUploadFiles() {
    const [uploadedFiles, setUploadedFiles] = useState<IUploadFile[]>([])
    const { isAnalyzing, setVectorId, setIsAnalyzing } = useChatBoxContext()
    const { userId } = useAppContext()
    const [pct, setPct] = useState(0)


    const handleDeleteUploadedImage = (f: IUploadFile) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== f.id))
        if (uploadedFiles.length === 1) {
            setVectorId('')
        }
    }
    const handleCleanUploadFilesState = () => {
        setUploadedFiles([])
        setVectorId('')
    }
    function uploadFiles(formData: FormData) {
        return axiosInstance({
            timeout: 5 * 60 * 1000,
            url: '/chatbot/v1/upload',
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: formData,
            onUploadProgress: (event) => {
                if (event.total) {
                    const pct = Math.min(75, Math.round((event.loaded * 100) / event.total));
                    setPct(pct)
                }
            },

        });
    }

  

    async function onUploadFile(filesToUpload: IUploadFile[]) {
        if (!userId) return
        try {
            setIsAnalyzing(true)
            setPct(0)
            setUploadedFiles(filesToUpload)
            const formData = new FormData()
            formData.append('user_id', userId)
            filesToUpload.forEach(f => {
                formData.append('files', f.file)
            })
            const res = await uploadFiles(formData)
            if (res.status === 200 && res.data.vector_id) {
                setVectorId(res.data.vector_id)
            }

        } catch (error) {
            setUploadedFiles([])
            if (error instanceof AxiosError) {
                toast.error(error.message || "Unable to upload files. Try again later")
            } else {
                toast.error("Unable to upload files. Try again later")
            }
        } finally {
            setIsAnalyzing(false)
            setPct(100)
        }

    }


    return {
        handleDeleteUploadedImage,
        setVectorId,
        uploadedFiles,
        onUploadFile,
        isAnalyzing,
        pct,
        handleCleanUploadFilesState
    }
}