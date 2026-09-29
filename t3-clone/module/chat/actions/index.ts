"use server"
import { prisma } from "@/lib/db"
import { currentUser } from "@/module/authentication/actions";
import { MessageRole,MessageType } from "@/lib/generated/prisma/enums";
import { tuple } from "better-auth";
import { revalidatePath } from "next/cache";

interface IcreateChatWithMessage{
    content:string;
    model:string;
}
    


export async function createChatWithMessage({content,model}:IcreateChatWithMessage) {
    try {
        const user = await currentUser();
        if(!user){
            return {
                success:false,
                error:"User not found"
            }
        }
        
        const title = content.slice(0,50) + (content.length > 50 ? "..." : "")

        const chat = await prisma.chat.create({
            data:{
                title,
                model,
                userId:user.id,
                messages:{
                    create:{
                        content,
                        messageroll:MessageRole.USER,
                        messagetype:MessageType.NORMAL
                    }
                }
            },
            include:{
                messages:true
            }
        })
        revalidatePath("/","page");
        return {
            success:true,
            data:chat
        }
    } catch (error) {
        console.log(error);
        
        return {
            success:false,
            error:"Something went wrong"
        }
    }
}

//constant for sidebar chat show
export async function getAllChat() {
    try {
        const user = await currentUser();
        if(!user){
            return {
                success:false,
                error:"User not found"
            }
        }
        const chats = await prisma.chat.findMany({
            where:{
                userId:user.id
            },
            include:{
                messages:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return {
            success:true,
            data:chats
        }
    } catch (error) {
        console.log(error);
        
        return {
            success:false,
            error:"Something went wrong"
        }
    }
    
}

export async function getChatById(id:string) {
    try {
        const user = await currentUser();
        if(!user){
            return {
                success:false,
                error:"User not found"
            }
        }
        const chat = await prisma.chat.findUnique({
            where:{
                id,
                userId:user.id
            },
            include:{
                messages:true
            }
        })
        if(!chat){
            return {
                success:false,
                error:"Chat not found"
            }
        } 
        return {
            success:true,
            data:chat
        }
    } catch (error) {
        console.log(error);
        
        return {
            success:false,
            error:"Something went wrong"
        }
    }
}

export async function deleteChat(id:string) {
    try {
        const user = await currentUser();
        if(!user){
            return {
                success:false,
                error:"User not found"
            }
        }
        const chat = await prisma.chat.delete({
            where:{
                id,
                userId:user.id
            }
        })
        revalidatePath("/")
        return {
            success:true,
            data:chat
        }
    } catch (error) {
        console.log(error);
        
        return {
            success:false,
            error:"Something went wrong"
        }
    }
    
}

//here backend schema is done now go and implement the hooks for the implementation of the chat module.