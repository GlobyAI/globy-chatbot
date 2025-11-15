import React, { useRef, useState, type ChangeEvent } from 'react'
import { useClickOutside } from '~/hooks/useClickOutsite'
import FileUploadIcon from '/icons/file-upload.svg'
import PlusIcon from '/icons/plus.svg'
import { useWebSocket } from '~/providers/WSProdivder'
import type { IUploadFile } from '~/types/models'

type Props = {
    setImages: React.Dispatch<React.SetStateAction<IUploadFile[]>>
}

export default function UploadFile({ setImages }: Props) {
    const optionPopUpRef = useRef<HTMLDivElement>(null)
    const { isPending } = useWebSocket()

    const [showDropdown, setShowDropDown] = useState(false)
    useClickOutside(optionPopUpRef, handleClosePopup)

    function handleOpenPopUp() {
        setShowDropDown(true)
    }
    function handleClosePopup() {
        setShowDropDown(false)
    }

    function handleSelectFiles(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        if (isPending) return
        const fileList = e.target.files
        if (fileList) {
            const previewFiles = Array.from(fileList).map((f) => ({
                url: URL.createObjectURL(f),
                file: f
            }))
            setImages(prev => [...prev, ...previewFiles])
            handleClosePopup()
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