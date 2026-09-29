"use client";

import React from 'react'
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input';
import UserButton from "@/module/authentication/components/user-button";
import { PlusIcon, SearchIcon, EllipsisIcon, Trash, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
//this is a library which provides the dates like yesterday and today.
import { isToday, isYesterday, isWithinInterval, subDays } from "date-fns";
import { usePathname } from "next/navigation";
import {
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetChats } from "@/module/chat/hooks/user-chats";
// current imports are initialise for sidebar in the projects folder.




function groupChatsByDate(chats: any) {
  const groups:any = { today: [], yesterday: [], lastWeek: [], older: [] };
  const now = new Date();

  if (!chats || !Array.isArray(chats)) return groups;

  chats.forEach((chat) => {
    try {
      const chatDate = chat.createdAt;
      const date = typeof chatDate === "string" ? new Date(chatDate) : chatDate;
      
      console.log("Processing chat:", chat.id, "Date:", date, "createdAt:", chatDate);

      if (isToday(date)) {
        groups.today.push(chat);
      } else if (isYesterday(date)) {
        groups.yesterday.push(chat);
      } else if (isWithinInterval(date, { start: subDays(now, 7), end: now })) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    } catch (error) {
      console.error("Error processing chat date:", error, chat);
      groups.older.push(chat);
    }
  });
  return groups;
}
const DATE_GROUPS  = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "lastWeek", label: "Last 7 Days" },
  { key: "older", label: "Older" },
];


function ChatItem({ chat, isActive, onDelete }: any) {
  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
        isActive && "bg-sidebar-accent",
      )}
    >
      <span className="truncate flex-1">{chat.title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 hover:bg-sidebar-accent-foreground/10"
              onClick={(e) => e.preventDefault()}
            />
          }
        >
          <EllipsisIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-red-500 cursor-pointer"
            onClick={(e) => onDelete(e, chat.id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
}


function ChatGroup({ label, chats, activeChatId, onDelete }: any) {
  if (!chats?.length) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
        {label}
      </div>
      {chats?.map((chat: any) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}




export default function ChatSideBar({ user,chats }: any) {
    const { data: chatData } = useGetChats();
    const allChats = chatData?.data ?? chats ?? [];

    const [searchQuery, setSearchQuery] = useState("");
    const pathname = usePathname();
    const activeChatId = pathname?.startsWith("/chat/")
    ? pathname.split("/")[2]
    : null;
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    const filteredchats = useMemo(() => {
      if (!searchQuery) return allChats;
      return allChats.filter((chat: any) =>
        chat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages?.some((msg: any) => msg.content?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }, [allChats, searchQuery]);

    const groupedChat: any = useMemo(() => groupChatsByDate(filteredchats), [filteredchats]);

    const handleDelete = (e: React.MouseEvent,chatId:string)=>{
      e.preventDefault();
      e.stopPropagation();
      setSelectedChatId(chatId);
      setIsModalOpen(true);
    }
    // close modal function
    
    return (
      // logo for sidebar
        <div className='flex h-full w-64 flex-col border-r border-border bg-sidebar'>
            <div className='flex h-20 items-center border-b border-border p-4 gap-2'>
                <Image
                    src="/logo.png"
                    width={200}
                    height={44}
                    alt="logo"
                    priority
                    style={{ width: 'auto', height: 'auto' }}
                />
            </div>

            <div className='p-4'>
                <Button className='w-full cursor-pointer bg-violet-500' >
                    <Link href="/" className='flex items-center justify-center w-full'>
                        <PlusIcon className='mr-2 h-4 w-4' />
                        New Chat
                    </Link>
                </Button>
            </div>

            {/* search bar for sidebar  */}
        <div className="px-4 pb-4">
         <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your threads..."
            className="pl-9 pr-8 bg-sidebar-accent border-sidebar-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* conditional display when we have some query it shows otherwise don't */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
            <X/> 
            </button>
          )}
        </div>
      </div>

      {/* chat list for sidebar */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {
          filteredchats.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
            {searchQuery ? "No chats found" : "No chats yet"}
            </div>
          ) : (
            DATE_GROUPS.map((group) => (
            <ChatGroup
              key={group.key}
              label={group.label}
              chats={groupedChat[group.key]}
              activeChatId={activeChatId}
              onDelete={handleDelete}
            />
          ))
          )
        }
      </div>

      {/* footer */}
      <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
        <UserButton user={user}/>
        <span className='flex-1 text-sm text-sidebar-foreground truncate'>{user.name}</span>
      </div>
        </div>

    )
}