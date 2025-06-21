"use client";

import { SessionSidebar } from "./session-sidebar";
import { ChatWindow } from "./chat-window";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import useExploreChatStore from "@/store/explore-chat-store";

// import useExploreChatStore from "@/store/explore-chat-store";

export function ChatLayout() {
  const { isSidebarOpen, setIsSidebarOpen, currentSessionName } =
    useExploreChatStore();

  return (
    <div className="flex w-full h-[calc(100vh-150px)] min-h-0 min-w-0 overflow-hidden container mx-auto">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        fixed lg:relative
        left-0 top-0
        z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        h-full
      `}
      >
        <SessionSidebar />
      </div>
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 h-full overflow-hidden">
        {/* Mobile header with toggle */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200/60 bg-white flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <h1 className="text-lg font-semibold text-center">
            {currentSessionName && currentSessionName.length > 30
              ? currentSessionName.slice(0, 30) + "..."
              : currentSessionName || "Chat"}
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        <ChatWindow />
      </div>
    </div>
  );
}
