import React, { useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import { useClickOutside } from '~/hooks/useClickOutsite'
import FileUploadIcon from '/icons/file-upload.svg'
import PlusIcon from '/icons/plus.svg'
import type { IUploadFile } from '~/types/models'
import { useAppContext } from '~/providers/AppContextProvider'

type Props = {
    onUploadFile: (filesToUpload: IUploadFile[]) => void,
    setVectorId: Dispatch<SetStateAction<string>>
}

export default function UploadFile({ onUploadFile }: Props) {
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
            onUploadFile(filesToUpload)
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