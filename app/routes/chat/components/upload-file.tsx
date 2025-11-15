import React, { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useClickOutside } from '~/hooks/useClickOutsite'
import FileUploadIcon from '/icons/file-upload.svg'
import PlusIcon from '/icons/plus.svg'
import { useWebSocket } from '~/providers/WSProdivder'
import type { IUploadFile } from '~/types/models'
import { createSignedUrl } from '~/services/fileApis'
import { useAppContext } from '~/providers/AppContextProvider'
import toast from 'react-hot-toast'
import type { AxiosResponse } from 'axios'
import axios from 'axios'

type Props = {
    setImages: React.Dispatch<React.SetStateAction<IUploadFile[]>>
    images: IUploadFile[]
}

export default function UploadFile({ setImages, images }: Props) {
    const optionPopUpRef = useRef<HTMLDivElement>(null)
    const { isPending } = useWebSocket()
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
            const previewFiles = files.map((f) => ({
                id: crypto.randomUUID(),
                url: "",
                pct: 0,
                file: f,
                bucket: 'globylibrary-' + userId,
                key: ""
            }))
            setImages(prev => [...prev, ...previewFiles])
            setTimeout(async () => {
                await Promise.all(previewFiles.map((item) => uploadFIles(item.file, item.id)))

            }, 50)
            handleClosePopup()

        }

    }
    const putToS3WithProcess = async (
        url: string,
        file: File,
        fileId: string
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
                    setImages(prev => prev.map(((f) => f.id === fileId ? { ...f, pct: pct } : f)))

                }
            },
        });
    };
    async function uploadFIles(file: File, fileId: string) {
        if (!userId) return
        const res: {
            url: string,
            key: string
        } = await createSignedUrl(userId, file)
        const signedUrl = res.url
        if (res.url) {
            const putFileRes = await putToS3WithProcess(signedUrl, file, fileId)
            if (putFileRes.status !== 200) {
                toast.error(`Failed to upload the image ${file.name}. Please try again`)
                setImages(prev => prev.filter(((f) => f.id !== fileId)))
            } else {
                const previewUrl = URL.createObjectURL(file)
                setImages(prev => prev.map(((f) => f.id === fileId ? { ...f, key: res.key, url: previewUrl } : f)))
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