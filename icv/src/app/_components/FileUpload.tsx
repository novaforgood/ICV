// import { useRef } from 'react'

// interface FileUploadProps {
//     fileName?: string[]
//     handleFileChange: (
//         e: React.ChangeEvent<HTMLInputElement>,
//         field: string,
//         nameField: string,
//     ) => void
//     handleAddFile: (ref: React.RefObject<HTMLInputElement>) => void
//     deleteFile: (fileName: string, fileType: string, nameType: string) => void
//     field: string
//     nameField: string
//     buttonText: string
// }

// const FileUpload: React.FC<FileUploadProps> = ({
//     fileName = [],
//     handleFileChange,
//     handleAddFile,
//     deleteFile,
//     field,
//     nameField,
//     buttonText,
// }) => {
//     const fileInputRef = useRef<HTMLInputElement>(null!)
//     const dynamicButtonText = fileName.length > 0 ? 'Reupload' : buttonText

//     return (
//         <div className="space-y-[24px]">
//             {fileName && Array.isArray(fileName) && fileName.length > 0 && (
//                 <div className="flex flex-col space-y-2">
//                     {fileName.map((name, index) => (
//                         <div key={index} className="flex justify-between">
//                             <p>{name}</p>
//                             <button
//                                 type="button"
//                                 onClick={() =>
//                                     deleteFile(name, field, nameField)
//                                 }
//                             >
//                                 x
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//             {fileName && fileName.length === 0 && (
//                 <div className="space-y-[24px]">
//                     <button
//                         type="button"
//                         onClick={() => handleAddFile(fileInputRef)}
//                         className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
//                     >
//                         + {buttonText}
//                     </button>
//                     <input
//                         ref={fileInputRef}
//                         type="file"
//                         multiple
//                         onChange={(e) => handleFileChange(e, field, nameField)}
//                         className="hidden" // Hide the actual file input
//                     />
//                 </div>
//             )}
//         </div>
//     )
// }

// export default FileUpload

// interface ResetProps {
//     fileName?: string[]
//     resetFiles: (field: string, nameType: string) => void
//     field: string
//     nameField: string
// }

// export const ResetButton: React.FC<ResetProps> = ({
//     fileName = [],
//     resetFiles,
//     field,
//     nameField,
// }) => {
//     return (
//         <div>
//             <button
//                 type="button"
//                 onClick={() =>
//                     fileName?.length > 0 && resetFiles(field, nameField)
//                 }
//                 className={`flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] px-[12px] py-[16px] ${
//                     fileName?.length > 0
//                         ? 'cursor-pointer'
//                         : 'cursor-not-allowed text-gray-300'
//                 }`}
//                 disabled={!fileName?.length}
//             >
//                 Reset ↻
//             </button>
//         </div>
//     )
// }

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
    buttonText: string
}

const FileUpload: React.FC<FileUploadProps> = ({
    data,
    handleFileChange,
    handleAddFile,
    field,
    buttonText,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null!)

    const files =
        (data[field as keyof ClientType] as { name: string; url: string }[]) ||
        []

    return (
        <div className="space-y-[24px]">
            {files.length > 0 && (
                <div className="flex flex-col space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="mt-4">
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
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {file.name}
                                </a>
                            </label>
                        </div>
                    ))}
                </div>
            )}
            {files.length === 0 && (
                <div className="space-y-[24px]">
                    <button
                        type="button"
                        onClick={() => handleAddFile(fileInputRef)}
                        className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                    >
                        + {buttonText}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, field)}
                        className="hidden"
                    />
                </div>
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

    console.log('files', files)

    return (
        <div>
            <button
                type="button"
                onClick={() => files.length > 0 && resetFiles(field)}
                className={`flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] px-[12px] py-[16px] ${
                    files.length > 0
                        ? 'cursor-pointer bg-gray-800 text-white'
                        : 'cursor-not-allowed text-gray-300'
                }`}
                disabled={!files.length}
            >
                Reset ↻
            </button>
        </div>
    )
}
