import {z} from "zod"

export const veriftSchema = z.object({
    code:z.string().length(6,`verification code must be 6 digits`)
})