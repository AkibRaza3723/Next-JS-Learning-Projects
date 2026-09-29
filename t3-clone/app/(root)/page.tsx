import { Button } from "@/components/ui/button";
import UserButton from "@/module/authentication/components/user-button";
import Image from "next/image";
import { currentUser } from "@/module/authentication/actions";
import ChatMessageView from "@/module/chat/components/Chat-view/chat-view";

export default async function Home() {
  const user = await currentUser()
  return (
    <>
      <ChatMessageView user={user} />
    </>
  );
}
