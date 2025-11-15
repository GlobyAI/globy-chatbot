import React from 'react'
import type { IUploadFile } from '~/types/models'
import TrashIcon from '/icons/trash-red.svg'
import FileIcon from '/icons/file-upload.svg'
import axios from 'axios'
import { envConfig } from '~/utils/envConfig'
import toast from 'react-hot-toast'
type Props = {
    setImages: React.Dispatch<React.SetStateAction<IUploadFile[]>>
    images: IUploadFile[],
}

export default function FilePreviews({ images, setImages }: Props) {

    const handleDeleteUploadedImage = async (img: IUploadFile) => {
        if (!img) return
        const result = await axios({
            url: envConfig.IMAGE_LIBRARY_API + '/image',
            method: "DELETE",
            data: JSON.stringify({
                bucket: img.bucket,
                key: img.key
            })
        })
        if (result?.status === 200 && result?.data.deleted.key) {
            setImages(prev => prev.filter(i => i.id !== img.id))
        }else{
            toast.error("Cannot remove this image. Try again later")
        }
    }
    return (
        <>
            {
                images.length > 0 &&
                <div className="images-container">
                    {
                        images.map((img, idx) => {
                            const isImage = img.file.type?.startsWith('image')
                            const isPending = img.pct < 100 && img.url === ''

                            if (isPending) {
                                return (
                                    <figure key={idx} className={`selected-img`}>
                                        <div className="circular-progress" style={{ "--percent": img.pct } as React.CSSProperties}>

                                        </div>
                                    </figure>
                                )
                            }
                            return (
                                <figure key={idx} className={`selected-img ${isImage ? '' : 'is-file'}`}>
                                    <img title='Remove image' src={TrashIcon} alt="Delete" className='delete-img' onClick={() => handleDeleteUploadedImage(img)} />
                                    {
                                        isImage ?
                                            <img src={img.url} key={idx} className='image' />
                                            :
                                            <>
                                                <img src={FileIcon} key={idx} className='file' />
                                                <figcaption>
                                                    <p>{img.file.name}</p>
                                                    <p>{img.file.type.split("/")[1]?.toUpperCase()}</p>
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