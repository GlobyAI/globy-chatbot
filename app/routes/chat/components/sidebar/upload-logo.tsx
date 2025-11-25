import { useState } from 'react'
import ImageUploader from '~/components/ImageUploader/ImageUploader'
import type { UploadedImage } from '~/types/models'


export default function UploadLogo({
    onUploadFile, pct,
    isUploading,
    onDeleteImage, logo
}: {
    onUploadFile: (file: File, id: string) => void,
    pct: number,
    onDeleteImage: (img: UploadedImage) => void,
    isUploading: string,
    logo: UploadedImage | null
}) {

    return (
        <div className="upload-logo">
            <b>
                Upload logo
            </b>
            <p>Used on your website header and branding.</p>
            {
                !logo ?
                    <ImageUploader isUploading={isUploading} pct={pct} onUploadFile={onUploadFile} id="upload-logo" />
                    :
                    <figure className='uploaded-img'>
                        <span className='close' onClick={() => onDeleteImage(logo)}>X</span>
                        <img src={logo.url} alt="Uploaded image" />
                    </figure>
            }
        </div>
    )
}