"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import { Markdown } from "../general/markdown";
import useExploreChatStore from "@/store/explore-chat-store";
import { Message } from "@ai-sdk/react";
import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const { getToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, input, handleInputChange, handleSubmit } =
    useChat({
      api: `${API_BASE_URL}/chat/`,
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
      fetch: async (url, options) => {
        const token = await getToken();
        return fetch(url, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        });
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
          `${API_BASE_URL}/chat/history/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching session history:", error);
      }
    };
    fetchSessionHistory(activeSessionId);
  }, [activeSessionId, setMessages, getToken]);

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
    <div className="flex flex-col h-full min-h-0 min-w-0 overflow-hidden">
      {/* Messages Area - This should be the only scrollable part */}
      <div className="flex-1 min-h-0 max-h-[calc(100vh-220px)] overflow-y-auto px-4">
        <div className="space-y-4 pb-4 mx-auto">
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
            <div className="flex justify-center items-center h-full w-full">
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200/60 bg-white">
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
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
