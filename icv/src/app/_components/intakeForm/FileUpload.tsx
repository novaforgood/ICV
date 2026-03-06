import { ClientIntakeSchema } from '@/types/client-types'
import { getCroppedImg, isImageFile } from '@/utils/cropImage'
import { useCallback, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { TypeOf } from 'zod'
type ClientType = TypeOf<typeof ClientIntakeSchema>

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

interface FileUploadProps {
    data: ClientType
    handleFileChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
    ) => void
    handleAddFile: (ref: React.RefObject<HTMLInputElement>) => void
    onRemoveFile?: (field: string, index: number) => void
    field: string
    isUploading: boolean
    isProfilePic?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
    data,
    handleFileChange,
    handleAddFile,
    onRemoveFile,
    field,
    isUploading,
    isProfilePic,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null!)
    const cameraInputRef = useRef<HTMLInputElement>(null!)

    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
    const [cropFile, setCropFile] = useState<File | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    )
    const [isCropping, setIsCropping] = useState(false)

    const files =
        (data[field as keyof ClientType] as { name: string; uri: string }[]) ||
        []

    const onCropAreaChange = useCallback(
        (_croppedArea: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels)
        },
        [],
    )

    const handleCropConfirm = useCallback(async () => {
        if (!cropImageSrc || !cropFile || !croppedAreaPixels) return

        setIsCropping(true)
        try {
            const mimeType = IMAGE_TYPES.includes(cropFile.type)
                ? cropFile.type
                : 'image/jpeg'
            const blob = await getCroppedImg(
                cropImageSrc,
                croppedAreaPixels,
                mimeType,
            )
            const baseName = cropFile.name.replace(/\.[^/.]+$/, '') || 'image'
            const extension = cropFile.name.split('.').pop() || 'jpg'
            const croppedFile = new File(
                [blob],
                `${baseName}-${crypto.randomUUID()}-crop.${extension}`,
                { type: mimeType },
            )

            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(croppedFile)
            const syntheticEvent = {
                target: { files: dataTransfer.files },
            } as React.ChangeEvent<HTMLInputElement>
            handleFileChange(syntheticEvent, field)
        } finally {
            URL.revokeObjectURL(cropImageSrc)
            setCropImageSrc(null)
            setCropFile(null)
            setCroppedAreaPixels(null)
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setIsCropping(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
            if (cameraInputRef.current) cameraInputRef.current.value = ''
        }
    }, [cropImageSrc, cropFile, croppedAreaPixels, field, handleFileChange])

    const handleCropCancel = useCallback(() => {
        if (cropImageSrc) URL.revokeObjectURL(cropImageSrc)
        setCropImageSrc(null)
        setCropFile(null)
        setCroppedAreaPixels(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (cameraInputRef.current) cameraInputRef.current.value = ''
    }, [cropImageSrc])

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = e.target.files
            if (!selectedFiles || selectedFiles.length === 0) return

            const file = selectedFiles[0]
            const shouldCrop = isProfilePic && isImageFile(file)

            if (shouldCrop) {
                setCropFile(file)
                setCropImageSrc(URL.createObjectURL(file))
            } else {
                handleFileChange(e, field)
            }
        },
        [field, handleFileChange, isProfilePic],
    )

    return (
        <div className="space-y-[24px]">
            {/* Crop Modal */}
            {cropImageSrc && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black">
                    <div className="relative flex-1">
                        <Cropper
                            image={cropImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropAreaChange}
                            onCropAreaChange={onCropAreaChange}
                            onZoomChange={setZoom}
                            cropShape="round"
                        />
                    </div>
                    <div className="flex justify-end gap-4 border-t border-gray-700 bg-black p-4">
                        <button
                            type="button"
                            onClick={handleCropCancel}
                            className="rounded-md px-4 py-2 text-white hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCropConfirm}
                            disabled={isCropping || !croppedAreaPixels}
                            className="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-200 disabled:opacity-50"
                        >
                            {isCropping ? 'Cropping...' : 'Crop'}
                        </button>
                    </div>
                </div>
            )}

            {isUploading ? (
                <div className="text-[16px] text-gray-400">Uploading...</div>
            ) : (
                <>
                    {files.length > 0 && (
                        <div className="flex flex-col space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="mt-4 flex items-center justify-between gap-2"
                                >
                                    <div className="min-w-0 flex-1">
                                        {isProfilePic ? (
                                            <a
                                                href={file.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                <img
                                                    src={file.uri}
                                                    alt="Profile"
                                                    className="h-[120px] w-[120px] rounded-full object-cover"
                                                />
                                            </a>
                                        ) : (
                                            <label className="gap- flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="24px"
                                                    viewBox="0 -960 960 960"
                                                    width="24px"
                                                    fill="#000000"
                                                >
                                                    <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                                </svg>
                                                <a
                                                    href={file.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    {file.name}
                                                </a>
                                            </label>
                                        )}
                                    </div>
                                    {onRemoveFile && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemoveFile(field, index)
                                            }
                                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-gray-500"
                                            aria-label="Remove file"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 6 6 18" />
                                                <path d="m6 6 12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {(!isProfilePic || files.length === 0) && (
                        <div className="flex flex-row items-center gap-[24px]">
                            <button
                                type="button"
                                onClick={() => handleAddFile(fileInputRef)}
                                className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white hover:bg-[#6D757F]"
                            >
                                <div className="flex flex-row space-x-[8px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFFFFF"
                                    >
                                        <path d="M444-240h72v-150l57 57 51-51-144-144-144 144 51 51 57-57v150ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                                    </svg>
                                    <label>Upload File</label>
                                </div>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={
                                    isProfilePic
                                        ? 'image/png,image/jpeg,image/jpg'
                                        : '*/*'
                                }
                                multiple={!isProfilePic}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddFile(cameraInputRef)}
                                className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white hover:bg-[#6D757F]"
                            >
                                <div className="flex flex-row space-x-[8px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFFFFF"
                                    >
                                        <path d="M444-240h72v-150l57 57 51-51-144-144-144 144 51 51 57-57v150ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                                    </svg>
                                    <label>Take Picture</label>
                                </div>
                            </button>
                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                multiple={!isProfilePic}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default FileUpload

interface ResetProps {
    data: ClientType
    resetFiles: (field: string) => void
    field: string
}

export const ResetButton: React.FC<ResetProps> = ({
    data,
    resetFiles,
    field,
}) => {
    const files =
        (data[field as keyof ClientType] as { name: string; uri: string }[]) ||
        []

    return (
        <div>
            <button
                type="button"
                onClick={() => files.length > 0 && resetFiles(field)}
                className={`flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] px-[12px] py-[16px] ${
                    files.length > 0
                        ? 'cursor-pointer text-black'
                        : 'cursor-not-allowed text-gray-300'
                }`}
                disabled={!files.length}
            >
                Reset ↻
            </button>
        </div>
    )
}
