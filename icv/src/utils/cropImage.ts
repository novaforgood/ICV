type PixelCrop = {
    x: number
    y: number
    width: number
    height: number
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })
}

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: PixelCrop,
    mimeType: string = 'image/jpeg',
): Promise<Blob> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob)
                } else {
                    reject(new Error('Canvas toBlob failed'))
                }
            },
            mimeType,
            0.95,
        )
    })
}

export function isImageFile(file: File): boolean {
    const type = file.type.toLowerCase()
    return (
        type === 'image/jpeg' ||
        type === 'image/jpg' ||
        type === 'image/png'
    )
}
