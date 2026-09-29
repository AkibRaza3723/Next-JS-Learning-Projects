// after writting backend module schema in actions of chat.
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import {createChatWithMessage,getAllChat,getChatById,deleteChat} from "@/module/chat/actions"
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";


export const useGetChats = ()=>{
    return useQuery({
        queryKey:["chat"],
        queryFn:()=>getAllChat()
    })
}
export const useGetChatById = (id:string)=>{
    return useQuery({
        queryKey:["chat",id],
        queryFn:()=>getChatById(id)
    })
}
export const useCreateChat = ()=>{
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn:({content,model}:{
            content:string;
            model:string;
        })=>createChatWithMessage({content,model}),
        onSuccess:(response)=>{
            queryClient.invalidateQueries({queryKey:["chat"]});
            if(response.success){
                toast.success(response.data?.title || "Chat created successfully");
                router.push(`/chat/${response.data?.id}?autoTrigger=true`);
            }else{
                toast.error(response.error || "Something went wrong");
            }
        },
        onError:(error)=>{
            toast.error(error.message || "Something went wrong");
        }
    })
}
export const useDeleteChat = (chatId:string)=>{
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn:()=>deleteChat(chatId),
        onSuccess:(response)=>{
            queryClient.invalidateQueries({queryKey:["chat"]});
            if(response.success){
                toast.success("Chat deleted successfully");
                router.refresh();
            }else{
                toast.error(response.error || "Something went wrong");
            }
        },
        onError:(error)=>{
            toast.error(error.message || "Something went wrong");
        }
    })
}