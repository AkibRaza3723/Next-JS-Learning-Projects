import { Button } from "@/components/ui/button";
import UserButton from "@/module/authentication/components/user-button";
import Image from "next/image";
import { currentUser } from "@/module/authentication/actions";

export default async function Home() {
  const user = await currentUser()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <UserButton user={user}/>
    </div>
  );
}
