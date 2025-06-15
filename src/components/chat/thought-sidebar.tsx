"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
// import Image from "next/image";
// import { ThoughtList } from "@/lib/types";

interface ThoughtSidebarProps {
  thought: string | null;
  onClose: () => void;
}

export function ThoughtSidebar({ thought, onClose }: ThoughtSidebarProps) {
  if (!thought) {
    return null;
  }

  return (
    <div className="w-72 border-l border-gray-200/60 h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200/60 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Referenced Thought</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className={`p-4 rounded-lg border ${"gold"}`}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-500 font-light capitalize">
              {"type"}
            </span>
            <span className="text-xs text-gray-400 font-light">
              {thought.created_at}
            </span>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">{thought.title}</h3>
          <p className="text-sm text-gray-700 font-light leading-relaxed">
            {thought.excerpt}
          </p>

          {/* {thought.type === "image" && thought.mediaUrl && (
            <div className="mt-3">
              <Image
                src={thought.mediaUrl || "/placeholder.svg"}
                alt={thought.title}
                className="rounded-md w-full h-32 object-cover"
              />
            </div>
          )}

          {thought.type === "audio" && thought.mediaUrl && (
            <div className="mt-3">
              <audio controls className="w-full">
                <source src={thought.mediaUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )} */}
        </div>
      </ScrollArea>
    </div>
  );
}
