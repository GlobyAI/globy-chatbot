import type { ChangeEvent } from 'react'
import PlusIcon from '/icons/plus.svg'
import useUploadLogo from '~/hooks/useUploadLogo'
import toast from 'react-hot-toast'


export default function UploadLogo() {
    const { onUploadFile } = useUploadLogo()
    async function handleSelectFiles(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        const file = e.target.files[0]
        if (file) {
            toast.success("Coming soon")
            // onUploadFile(file)
        }

    }


    return (
        <div className="upload-logo">
            <b>
                Upload logo
            </b>
            <p>Used on your website header and branding.</p>
            <label htmlFor='upload-logo'>
                <img src={PlusIcon} alt="PlusIcon" />
                <input type="file" name="" id="upload-logo" hidden onChange={handleSelectFiles} />
            </label>
        </div>
    )
}