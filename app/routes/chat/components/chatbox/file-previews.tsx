import React from 'react'
import type { IUploadFile } from '~/types/models'
import TrashIcon from '/icons/trash-red.svg'
import FileIcon from '/icons/file-upload.svg'
type Props = {
    handleDeleteUploadedImage: (file: IUploadFile) => void
    uploadedFiles: IUploadFile[],
    pct: number
}

export default function FilePreviews({ uploadedFiles, handleDeleteUploadedImage, pct }: Props) {
    return (
        <>
            {
                uploadedFiles.length > 0 &&
                <div className="images-container">
                    {
                        uploadedFiles.map((f, idx) => {
                            const isImage = f.file.type?.startsWith('image')
                            const isPending = pct < 100

                            if (isPending) {
                                return (
                                    <figure key={idx} className={`selected-img`}>
                                        <div className="circular-progress" style={{ "--percent": pct } as React.CSSProperties}>

                                        </div>
                                    </figure>
                                )
                            }
                            return (
                                <figure key={idx} className={`selected-img ${isImage ? '' : 'is-file'}`}>
                                    <img title='Remove image' src={TrashIcon} alt="Delete" className='delete-img' onClick={() => handleDeleteUploadedImage(f)} />
                                    {
                                        isImage ?
                                            <img src={f.url} key={idx} className='image' />
                                            :
                                            <>
                                                <img src={FileIcon} key={idx} className='file' />
                                                <figcaption>
                                                    <p>{f.file.name}</p>
                                                    <p>{f.file.type.split("/")[1]?.toUpperCase()}</p>
                                                </figcaption>
                                            </>
                                    }
                                </figure>
                            )
                        })
                    }
                </div>
            }
        </>
    )
}