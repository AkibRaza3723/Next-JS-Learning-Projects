import { requireAuth } from "@/module/authentication/actions";
import ChatSideBar from "@/module/chat/components/chat-sidebar";
import Header from "@/components/header";
import { getAllChat } from "@/module/chat/actions";

export default async function RootLayout({children}:{children: React.ReactNode;}){
    const session = await requireAuth();
    // we can direclty call any server actions.
    const {data:chats} = await getAllChat();

    return (
        <div className='flex h-screen overflow-hidden'>
            <ChatSideBar user={session?.user} chats={chats}/> 
            <main className="flex-1 w-full">
                {/* header  */}
                <Header/>
                {children}
            </main>
        </div> 
    );
}