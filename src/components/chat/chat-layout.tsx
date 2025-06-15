"use client";

import { SessionSidebar } from "./session-sidebar";
import { ChatWindow } from "./chat-window";
import { ThoughtSidebar } from "./thought-sidebar";

import useExploreChatStore from "@/store/explore-chat-store";

export function ChatLayout() {
  const { currentThoughtId, setCurrentThoughtId } = useExploreChatStore();

  return (
    <div className="flex container mx-auto h-[80vh] ">
      <SessionSidebar
      // activeSessionId={activeSessionId}
      // onSelectSession={setActiveSessionId}
      // onNewSession={handleNewSession}
      // onDeleteSession={handleDeleteSession}
      />
      <ChatWindow />
      {currentThoughtId && (
        <ThoughtSidebar
          thought={currentThoughtId}
          onClose={() => setCurrentThoughtId(null)}
        />
      )}
    </div>
  );
}
