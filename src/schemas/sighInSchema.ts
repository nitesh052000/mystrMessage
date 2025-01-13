import {z} from "zod"

export const sighInSchema = z.object({
    identifier: z.string(),
    password: z.string(),
})