import ImageUploader from '~/components/ImageUploader/ImageUploader'


export default function UploadLogo({
    onUploadFile, pct
}: {
    onUploadFile: (file: File) => void,
    pct: number
}) {
    return (
        <div className="upload-logo">
            <b>
                Upload logo
            </b>
            <p>Used on your website header and branding.</p>
            <ImageUploader pct={pct} onUploadFile={onUploadFile} id="upload-logo" />
        </div>
    )
}