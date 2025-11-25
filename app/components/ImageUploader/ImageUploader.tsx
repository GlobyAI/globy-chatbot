import React, { type ChangeEvent, type HTMLAttributes } from 'react'
import PlusIcon from '/icons/plus.svg'

interface Props extends HTMLAttributes<HTMLInputElement> {
  onUploadFile: (file: File, id: string) => void,
  pct: number,
  isUploading?: string
}

export default function ImageUploader({ onUploadFile, pct, id='', isUploading = '', ...props }: Props) {
  function handleSelectFiles(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (file) {
      onUploadFile(file, id)
    }
  }
  if (isUploading === id && pct < 100)
    return (
      <div className='image-uploader' title="Uploading...">
        <span className="circular-progress" style={{ "--percent": pct } as React.CSSProperties}>
        </span>
      </div>
    )

  return (
    <label className='image-uploader' htmlFor={id} title="Upload images">

      <img src={PlusIcon} alt="PlusIcon" />
      <input  {...props} type="file" accept=".jpeg, .png, .jpg , .svg, .webp" name="" id={id} hidden onChange={handleSelectFiles} />
    </label>
  )
}