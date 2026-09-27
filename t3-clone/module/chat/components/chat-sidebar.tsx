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
import { isToday, isYesterday, isWithinInterval, subDays } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// current imports are initialise for sidebar in the projects folder.

export default function ChatSideBar({ user }: any) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
      // logo for sidebar
        <div className='flex h-full w-64 flex-col border-r border-border bg-sidebar'>
            <div className='flex h-20 items-center border-b border-border p-4 gap-2'>
                <Image
                    src="/logo.svg"
                    width={100}
                    height={22}
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
        {/* Placeholder for chat list */}
        <div className="px-4 py-6 text-center text-muted-foreground">
          No chats yet.
        </div>
      </div>

      {/* footer */}
      <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
        <UserButton user={user}/>
        <span className='flex-1 text-sm text-sidebar-foreground truncate'>{user.name}</span>
      </div>
        </div>

    )
}