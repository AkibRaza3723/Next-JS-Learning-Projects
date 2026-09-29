"use client"
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useGetChatById } from "../../hooks/user-chats";
import useAiModels from "../../hooks/use-ai-models";
import { Spinner } from "@/components/ui/spinner";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import { ModelSelector } from "../Chat-view/model-selector";
import { UIMessage } from "ai";
import { Message, MessageContent, MessageResponse} from "@/components/ai-elements/message";
import { Reasoning, ReasoningTrigger,ReasoningContent } from "@/components/ai-elements/reasoning";


type MessagePartShape = { type: string; text?: string };

function parseMessageToUI(msg: any) {
  const basePart = { type: "text", text: msg.content };
  const role = (msg.messageroll ?? msg.messageRole ?? "user").toLowerCase();

  try {
    const parts = JSON.parse(msg.content);
    return {
      id: msg.id,
      role,
      parts: Array.isArray(parts) ? parts : [basePart],
      createdAt: msg.createdAt,
    };
  } catch {
    return {
      id: msg.id,
      role,
      parts: [basePart],
      createdAt: msg.createdAt,
    };
  }
}

function MessagePart({ part, messageId, partIndex, role , isStreaming }:{
   part: MessagePartShape;
  messageId: string;
  partIndex: number;
  role: UIMessage["role"];
  isStreaming: boolean;
}) {
  const key = `${messageId}-${partIndex}`;

  if (part.type === "text") {
    return (
      <Message from={role} key={key}>
        <MessageContent>
          <MessageResponse>{part.text}</MessageResponse>
        </MessageContent>
      </Message>
    );
  }

  if (part.type === "reasoning") {
    return (
      <Reasoning
        className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
        key={key}
        isStreaming={isStreaming}
      >
        <ReasoningTrigger />
        <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
          {part.text ?? ""}
        </ReasoningContent>
      </Reasoning>
    );
  }

  if (part.type === "step-start" && partIndex > 0) {
    return (
      <div key={key} className="my-4 text-gray-500">
        <hr className="border-gray-300" />
      </div>
    );
  }

  return null;
}


export const MessageViewForm = ({chatId}:{chatId:string}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const shouldAutoTrigger = searchParams.get("autotrigger") === "true"
    const hasAutoTrigger = useRef(false)
    
    const [selectedModel, setSelectedModel] = useState<string | null>(null)
    const [input, setInput] = useState("");

    const {data, isPending} = useGetChatById(chatId)
    const {data:models, isPending: isModelLoading} = useAiModels();

    const initialMessage = useMemo(()=>{
        if( !data?.data?.messages) return [];

        return data.data.messages
        .filter((message)=> message.content?.trim() && message.id)
        .map(parseMessageToUI) 
        //to convert our existing data into Ai-sdk compatible data
    },[data])

    useEffect(() => {
        if (data?.data?.model && !selectedModel) {
            setSelectedModel(data.data.model);
        }
    }, [data, selectedModel]);
    
    if (isPending || isModelLoading) return <div className="flex items-center justify-center h-full"><Spinner/></div>

    const handleSubmit = () => {}
    const isStreaming = false
    // streaming response means writting the response chunk by chunk through Ai and get it to the user (all Ai agents stream the response)
    const isBuzy = false
    const status = undefined
    const error = null as any
    const stop = () => {}
    const allMessages = [...initialMessage]
    
    return (
        <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
          <div className="flex flex-col h-full">
            {/* chat messages list */}
            <Conversation className="h-full">
          <ConversationContent>
            {allMessages.length === 0 ? (
              <ConversationEmptyState
                title="Start the conversation"
                description="Send a message to get started."
              />
            ) : (
              allMessages.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => (
                    <MessagePart
                      key={`${message.id}-${i}`}
                      part={part as MessagePartShape}
                      messageId={message.id}
                      partIndex={i}
                      role={message.role}
                      isStreaming={
                        isBuzy &&
                        message === allMessages.at(-1) &&
                        i === message.parts.length - 1
                      }
                    />
                  ))}
                </Fragment>
              ))
            )}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive">
                {error.message || "Something went wrong."}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

            {/* Input */}
            <PromptInput onSubmit={handleSubmit} className="mt-4">
                <PromptInputBody>
                    <PromptInputTextarea placeholder="Write a message" value={input} onChange={(e)=>setInput(e.target.value)} disabled={false}/>
                </PromptInputBody>

                <PromptInputFooter>
            <PromptInputTools className="flex items-center justify-between gap-2 w-full">
              <div className="flex-1">
                {isModelLoading ? (
                  <Spinner />
                ) : (
                  <ModelSelector
                    models={models?.models ?? []}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedModel} 
                    className=""
                  />
                )}
              </div> 
              <PromptInputSubmit status={status} onStop={stop} />
            </PromptInputTools>
          </PromptInputFooter>
            </PromptInput>

          </div>
        </div>
    )
}       