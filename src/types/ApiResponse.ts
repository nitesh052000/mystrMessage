import { Message } from "@/model/Users"
export interface ApiResponse{
    success:boolean;
    message: string;
    isAccesptMessage?: boolean;
    messages?:Array<Message>  
}