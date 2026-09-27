import { requireAuth } from "@/module/authentication/actions";
import ChatSideBar from "@/module/chat/components/chat-sidebar";
import Header from "@/components/header";

export default async function RootLayout({children}:{children: React.ReactNode;}){
    const session = await requireAuth();

    return (
        <div className='flex h-screen overflow-hidden'>
            <ChatSideBar user={session?.user}/> 
            <main className="flex-1 w-full">
                {/* header  */}
                <Header/>
                {children}
            </main>
        </div> 
    );
}