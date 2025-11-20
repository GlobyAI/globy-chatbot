import ImageUploader from '~/components/ImageUploader/ImageUploader'
import Slider from '~/components/Slider/Slider'
import type { UploadedImage } from '~/types/models'

type Props = {
    uploadedImages: UploadedImage[]
    onUploadFile: (file: File, id: string) => void
    onDeleteImage: (img: UploadedImage) => void,
    pct: number,
    isUploading: string


}

export default function ImageLibrary({ uploadedImages, pct, isUploading, onUploadFile, onDeleteImage }: Props) {
    return (
        <div className='image-library'>
            <b>
                Images
            </b>
            <p>Images that inspire your visual style.</p>
            <div className="images">
                <Slider data={uploadedImages}>
                    {
                        uploadedImages && uploadedImages.map((img, index) => (
                            <figure key={index} className='uploaded-img'>
                                <span className='close' onClick={() => onDeleteImage(img)}>X</span>
                                <img src={img.url} alt="Uploaded image" />
                            </figure>
                        ))
                    }
                    <ImageUploader pct={pct} isUploading={isUploading} onUploadFile={onUploadFile} id="add-more-image" />
                </Slider>
            </div>
        </div>
    )
}