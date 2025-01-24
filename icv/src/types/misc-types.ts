import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'

export const timestampToDateSchema = z
    .union([z.date(), z.instanceof(Timestamp)])
    .transform((value) => {
        if (value instanceof Timestamp) {
            return value.toDate()
        }
        return value
    })
