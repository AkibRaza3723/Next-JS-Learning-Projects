import { convertToModelMessages, createIdGenerator, streamText } from "ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";
import { prisma } from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { NextRequest } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openRouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

function dbMessageToUI(msg: any) {
  const role = (msg.messageroll ?? msg.messageRole ?? "user").toLowerCase();
  try {
    const parts = JSON.parse(msg.content);
    const textParts = Array.isArray(parts) ? parts.filter((p) => p.type === "text") : [];

    return {
      id: msg.id,
      role,
      parts: textParts.length > 0 ? textParts : [{ type: "text", text: msg.content }],
      createdAt: msg.createdAt,
    };
  } catch {
    return {
      id: msg.id,
      role,
      parts: [{ type: "text", text: msg.content }],
      createdAt: msg.createdAt,
    };
  }
}

function partsToJSON(message: { parts?: unknown; content?: string }) {
  if (Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }
  return JSON.stringify([{ type: "text", text: message.content ?? "" }]);
}

export async function POST(req: NextRequest) {
  try {
    const { chatId, messages, model, skipUserMessage } = await req.json();

    // 1. Load previous messages from DB
    const dbMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    const previousUI = dbMessages.map(dbMessageToUI).filter(Boolean);
    const incomingMessages = Array.isArray(messages) ? messages : (messages ? [messages] : []);

    // Filter out messages that already exist in DB to prevent duplicates
    const newUI = incomingMessages.filter(
      (m: any) => !previousUI.some((prev: any) => prev.id === m.id)
    );
    const allUI = [...previousUI, ...newUI];

    const modelMessages = await convertToModelMessages(allUI);

    const result = streamText({
      model: openRouter.chat(model),
      messages: modelMessages,
      system: CHAT_SYSTEM_PROMPT,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      originalMessages: allUI,
      onFinish: async ({ responseMessage }) => {
        try {
          const messagesToSave: any[] = [];

          // Save user message if not skipped
          if (!skipUserMessage && newUI.length > 0) {
            const lastUserMessage = newUI[newUI.length - 1];
            if (lastUserMessage?.role === "user") {
              messagesToSave.push({
                chatId,
                content: partsToJSON(lastUserMessage),
                messageroll: MessageRole.USER,
                messagetype: MessageType.NORMAL,
              });
            }
          }

          // Save assistant response
          if (responseMessage?.parts && responseMessage.parts.length > 0) {
            messagesToSave.push({
              chatId,
              content: partsToJSON(responseMessage),
              messageroll: MessageRole.ASSISTANT,
              messagetype: MessageType.NORMAL,
            });
          }

          if (messagesToSave.length > 0) {
            await prisma.message.createMany({
              data: messagesToSave,
            });
          }
        } catch (error) {
          console.error("Error saving messages to DB:", error);
        }
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
