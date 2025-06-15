import { ClientIntakeSchema } from '@/types/client-types'
import { useRef } from 'react'
import { TypeOf } from 'zod'
type ClientType = TypeOf<typeof ClientIntakeSchema>

interface FileUploadProps {
    data: ClientType
    handleFileChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
    ) => void
    handleAddFile: (ref: React.RefObject<HTMLInputElement>) => void
    field: string
    isUploading: boolean
    isProfilePic?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
    data,
    handleFileChange,
    handleAddFile,
    field,
    isUploading,
    isProfilePic,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null!)
    const cameraInputRef = useRef<HTMLInputElement>(null!)

    const files =
        (data[field as keyof ClientType] as { name: string; uri: string }[]) ||
        []

    return (
        <div className="space-y-[24px]">
            {isUploading ? (
                <div className="text-[16px] text-gray-400">Uploading...</div>
            ) : (
                <>
                    {files.length > 0 && (
                        <div className="flex flex-col space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="mt-4">
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
                            ))}
                        </div>
                    )}
                    {files.length === 0 && (
                        <div className="flex flex-row space-x-[24px]">
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
                                onChange={(e) => handleFileChange(e, field)}
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
                                onChange={(e) => handleFileChange(e, field)}
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
