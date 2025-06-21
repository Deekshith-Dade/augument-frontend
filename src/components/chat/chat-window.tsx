"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Markdown } from "../general/markdown";
import useExploreChatStore from "@/store/explore-chat-store";
import { Message } from "@ai-sdk/react";
import { useAuth } from "@clerk/nextjs";
import ToolDisplay from "./tool-display";
import { useQueryClient } from "@tanstack/react-query";

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
  [key: string]: JSONValue;
}

interface ChatMessage extends Message {
  annotations?: Array<{
    session: ChatSession;
  }>;
}

export function ChatWindow({}) {
  const { activeSessionId, setActiveSessionId, setCurrentSessionName } =
    useExploreChatStore();
  const { getToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
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
          setActiveSessionId(session.id);
          setCurrentSessionName(session.title);
          queryClient.invalidateQueries({ queryKey: ["sessions"] });
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

  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchSessionHistory = async (sessionId: string | null) => {
      setMessages([]);
      try {
        setLoadingMessages(true);
        const response = await fetch(
          `${API_BASE_URL}/chat/history/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        const data = await response.json();
        if (data.length > 0) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching session history:", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchSessionHistory(activeSessionId);
  }, [activeSessionId, setMessages, getToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 ">
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-hidden min-h-0">
        {loadingMessages ? (
          <div className="h-full flex justify-center items-center">
            <div className="text-center space-y-4 max-w-lg mx-auto">
              <div className="text-gray-600 text-xl font-semibold">
                Loading...
              </div>
            </div>
          </div>
        ) : (
          <div
            className="h-full overflow-y-auto p-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#ededed #ffffff",
            }}
          >
            <div className="space-y-4 py-4">
              {messages.length > 0 ? (
                <>
                  {messages.map((message, index) => (
                    <div key={message.id} className="space-y-2 mb-4">
                      {/* Tool Indicators */}
                      <ToolDisplay message={message} />

                      {/* Regular Message Content */}
                      <div
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        } mb-2 group animate-in slide-in-from-bottom-2 duration-300`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {message.content.length > 0 ? (
                          <div className="max-w-[85%]">
                            <div
                              className={`relative p-4 rounded-2xl text-sm font-light transition-all duration-200 group-hover:shadow-md ${
                                message.role === "user"
                                  ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-br-md shadow-sm"
                                  : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md"
                              }`}
                            >
                              {/* Subtle glow effect for user messages */}
                              {message.role === "user" && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl rounded-br-md blur-sm -z-10 opacity-20"></div>
                              )}

                              <Markdown content={message.content} />
                            </div>
                          </div>
                        ) : (
                          // Enhanced thinking component
                          <div className="max-w-[85%]">
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-lg relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent opacity-50 animate-pulse"></div>

                              <div className="flex items-center gap-3 relative z-10">
                                <div className="flex gap-1.5">
                                  <div
                                    className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  ></div>
                                  <div
                                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "200ms" }}
                                  ></div>
                                  <div
                                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "400ms" }}
                                  ></div>
                                </div>

                                <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex justify-center items-center">
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
                        Share your perspectives and get meaningful insights
                        through natural conversation.
                      </p>
                    </div>
                    <div className="text-gray-400 text-xs italic">
                      Start typing below to begin exploring your ideas
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
