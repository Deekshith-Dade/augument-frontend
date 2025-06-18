"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageCircle, Trash2, MoreVertical, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import useExploreChatStore from "@/store/explore-chat-store";
import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function SessionSidebar({}) {
  const {
    sessions,
    setSessions,
    activeSessionId,
    setActiveSessionId,
    setNewSession,
    setIsSidebarOpen,
  } = useExploreChatStore();
  const { getToken } = useAuth();

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    const data = await response.json();
    console.log(data);
    setSessions(sessions.filter((session) => session.id !== sessionId));
    setActiveSessionId(null);
  };

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // Close sidebar on mobile after selecting a session
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      const data = await response.json();
      setSessions(data);
    };
    fetchSessions();
  }, [getToken]);

  return (
    <div className="flex-1/4 border-r border-gray-200/60 h-full max-w-[280px] w-[280px] flex flex-col bg-white shadow-lg lg:shadow-none">
      {/* Header with close button for mobile */}
      <div className="p-4 border-b border-gray-200/60 flex items-center justify-between">
        <Button
          onClick={setNewSession}
          variant="outline"
          className="flex-1 border-gray-200/60 justify-start"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden ml-2 p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-md mb-1 cursor-pointer transition-colors ${
                  activeSessionId === session.id
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleSessionSelect(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <MessageCircle className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <div className="truncate flex-1">
                      <div className="font-medium text-sm hover:underline">
                        {session.title.length > 25
                          ? session.title.slice(0, 25) + "..."
                          : session.title}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-100 group-hover:opacity-100 ml-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-xs text-gray-400 mt-1 text-left">
                  {formatDate(session.updated_at)}
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
