"use client"
import React from "react";
import { useState } from "react";
import ChatWelcome from "./chat-welcome";
import ChatMessageForm from "./chat-message-form";

const ChatMessageView = ({ user }: any) => {
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

    const handleMessageSelect = (message: string) => {
        setSelectedMessage(message)
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-10">
            <ChatWelcome useName={user?.name} onMessageSelect={handleMessageSelect} />
            <ChatMessageForm
                initialMessage={selectedMessage}
                onMessageChange={handleMessageSelect}
            />
        </div>
    );
};

export default ChatMessageView;