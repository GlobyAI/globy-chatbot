import React, { useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import { useClickOutside } from '~/hooks/useClickOutsite'
import FileUploadIcon from '/icons/file-upload.svg'
import PlusIcon from '/icons/plus.svg'
import { useWebSocket } from '~/providers/WSProdivder'
import type { IUploadFile } from '~/types/models'
import { useAppContext } from '~/providers/AppContextProvider'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import axiosInstance from '~/services/axiosInstance'

type Props = {
    setUploadedFiles: React.Dispatch<React.SetStateAction<IUploadFile[]>>
    uploadedFiles: IUploadFile[],
    setPct: Dispatch<SetStateAction<number>>
}

export default function UploadFile({ setUploadedFiles, uploadedFiles, setPct }: Props) {
    const optionPopUpRef = useRef<HTMLDivElement>(null)
    const { userId } = useAppContext()

    const [showDropdown, setShowDropDown] = useState(false)
    useClickOutside(optionPopUpRef, handleClosePopup)

    function handleOpenPopUp() {
        setShowDropDown(true)
    }
    function handleClosePopup() {
        setShowDropDown(false)
    }

    async function handleSelectFiles(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        if (!userId) return
        const fileList = e.target.files
        if (fileList) {
            const files = Array.from(fileList)
            const filesToUpload = files.map((f) => {
                const previewUrl = URL.createObjectURL(f)
                return ({
                    id: crypto.randomUUID(),
                    url: previewUrl,
                    file: f,
                })
            })
            setPct(0)
            setUploadedFiles(filesToUpload)
            uploadFIles(filesToUpload)
            handleClosePopup()
        }

    }
    // const putToS3WithProcess = async (
    //     url: string,
    //     file: File,
    //     fileId: string
    // ): Promise<AxiosResponse> => {
    //     return await axios({
    //         url,
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": file.type,
    //         },
    //         data: file,
    //         onUploadProgress: (event) => {
    //             if (event.total) {
    //                 const pct = Math.round((event.loaded * 100) / event.total);
    //                 setUploadedFiles(prev => prev.map(((f) => f.id === fileId ? { ...f, pct: pct } : f)))

    //             }
    //         },
    //     });
    // };

    async function uploadFIles(filesToUpload: IUploadFile[]) {
        if (!userId) return
        try {
            const formData = new FormData()
            formData.append('user_id', userId)
            filesToUpload.forEach(f => {
                formData.append('files', f.file)
            })
            await axiosInstance({
                timeout: undefined,
                url: '/chatbot/v1/upload',
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: formData,
                onUploadProgress: (event) => {
                    if (event.total) {
                        const pct = Math.round((event.loaded * 100) / event.total);
                        setPct(pct)
                    }
                },
            });

        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError) {
                toast.error(error.message)
            } else {
                toast.error("Unable to upload file. Try again later")
            }
        }

    }



    return (
        <div ref={optionPopUpRef} className={`icons icons--plus  ${showDropdown ? "open" : ""}`} onClick={handleOpenPopUp}>
            <img src={PlusIcon} alt="PlusIcon" />
            <div className="options-popup" >
                <ul>
                    <li>
                        <label className="" htmlFor='file-image'>
                            <img src={FileUploadIcon} alt="FileUploadIcon" />
                            Attach images and files
                            <input type="file" multiple name="" id="file-image" hidden onChange={handleSelectFiles} />
                        </label>
                    </li>

                </ul>
            </div>
        </div>
    )
}