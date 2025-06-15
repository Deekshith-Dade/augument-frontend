"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import { Markdown } from "../general/markdown";
import useExploreChatStore from "@/store/explore-chat-store";
import { Message } from "@ai-sdk/react";

// const sessionId = "265687ad-9c61-4f83-a269-c8fa6672d495";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  [key: string]: JSONValue; // Add index signature to make it compatible with JSONValue
}

interface ChatMessage extends Message {
  annotations?: Array<{
    session: ChatSession;
  }>;
}

export function ChatWindow({}) {
  const { activeSessionId, setActiveSessionId, addSession } =
    useExploreChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, input, handleInputChange, handleSubmit } =
    useChat({
      api: `http://localhost:8000/chat/`,
      experimental_prepareRequestBody({ messages }) {
        return {
          messages: messages[messages.length - 1],
          session_id: activeSessionId,
        };
      },
      onFinish: (message: Message) => {
        const chatMessage = message as ChatMessage;
        const session = chatMessage.annotations?.[0]?.session;
        if (session && !activeSessionId) {
          addSession(session);
          setActiveSessionId(session.id);
        }
      },
    });

  useEffect(() => {
    const fetchSessionHistory = async (sessionId: string | null) => {
      if (!sessionId) {
        setMessages([]);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/chat/history/${sessionId}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching session history:", error);
      }
    };
    fetchSessionHistory(activeSessionId);
  }, [activeSessionId, setMessages]);

  // Scroll to bottom when messages change

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const renderMessageWithCitations = (
  //   message: string,
  //   citations?: number[]
  // ) => {
  //   if (!citations || citations.length === 0) {
  //     return <span>{message}</span>;
  //   }

  //   // Simple citation rendering - in a real app you might want to use a more sophisticated approach
  //   const parts = message.split(/\[(\d+)\]/);

  //   return (
  //     <>
  //       {parts.map((part, index) => {
  //         // Check if this part is a citation number
  //         const citationMatch = part.match(/^\d+$/);
  //         if (citationMatch && citations.includes(Number.parseInt(part))) {
  //           const thoughtId = Number.parseInt(part);
  //           return (
  //             <button
  //               key={index}
  //               onClick={() => onCitationClick(thoughtId)}
  //               className="text-blue-600 hover:underline font-medium px-1"
  //             >
  //               [{part}]
  //             </button>
  //           );
  //         }
  //         return <span key={index}>{part}</span>;
  //       })}
  //     </>
  //   );
  // };

  return (
    <div className="flex flex-col flex-3/4">
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-4 pb-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm font-light ${
                    message.role === "user"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-700 border border-gray-200/60"
                  }`}
                >
                  <Markdown content={message.content} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center my-auto">
              <div className="text-center space-y-4 max-w-lg mx-auto">
                <div className="text-gray-600 text-xl font-semibold">
                  Welcome to Your Thought Assistant
                </div>
                <div className="text-gray-500 space-y-2">
                  <p className="text-sm">
                    Speak with an intelligent agent that understands your
                    thoughts and ideas.
                  </p>
                  <p className="text-sm">
                    Share your perspectives and get meaningful insights through
                    natural conversation.
                  </p>
                </div>
                <div className="text-gray-400 text-xs italic">
                  Start typing below to begin exploring your ideas
                </div>
              </div>
            </div>
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex-shrink-0 p-4 border-t border-gray-200/60">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="border-gray-200/60 focus:border-gray-300 min-h-[40px] max-h-[200px] resize-none"
            rows={1}
            style={{
              height: "auto",
              overflow: "hidden",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
          <Button className="bg-gray-800 hover:bg-gray-900">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
