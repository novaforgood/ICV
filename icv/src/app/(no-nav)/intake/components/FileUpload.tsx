import { useRef } from 'react'

interface FileUploadProps {
    fileName?: string[]
    handleFileChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
        nameField: string,
    ) => void
    handleAddFile: (ref: React.RefObject<HTMLInputElement>) => void
    deleteFile: (
        index: number,
        fileName: string,
        fileType: string,
        nameType: string,
    ) => void
    field: string
    nameField: string
    buttonText: string
}

const FileUpload: React.FC<FileUploadProps> = ({
    fileName = [],
    handleFileChange,
    handleAddFile,
    deleteFile,
    field,
    nameField,
    buttonText,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null!)
    const dynamicButtonText = fileName.length > 0 ? 'Reupload' : buttonText

    return (
        <div className="space-y-[24px]">
            {fileName && Array.isArray(fileName) && fileName.length > 0 && (
                <div className="flex flex-col space-y-2">
                    {fileName.map((name, index) => (
                        <div key={index} className="flex justify-between">
                            <p>{name}</p>
                            <button
                                type="button"
                                onClick={() =>
                                    deleteFile(index, name, field, nameField)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="space-y-[24px]">
                <button
                    type="button"
                    onClick={() => handleAddFile(fileInputRef)}
                    className="flex h-[52px] items-center justify-center gap-[8px] rounded-[5px] bg-[#27262A] px-[12px] py-[16px] text-white"
                >
                    + {dynamicButtonText}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e, field, nameField)}
                    className="hidden" // Hide the actual file input
                />
            </div>
        </div>
    )
}

export default FileUpload
