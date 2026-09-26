import { Title } from "radix-ui/dialog"
import {z} from "zod"

export const todoSchema = z.object(
    {
        title:z.string().min(1).max(100)
    }
)

// for updating the schema 
export const todoActionSchema = z.object(
    {
        title:z.string().min(1).max(100),
        completed:z.boolean().optional()
    }
)
//it validate the input data