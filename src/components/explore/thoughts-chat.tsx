import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function ThoughtsChat() {
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      message:
        "Hello! I'm here to help you explore and discuss your thoughts. What would you like to talk about?",
    },
  ]);
  const [chatMessage, setChatMessage] = useState("");

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { role: "user", message: chatMessage },
      {
        role: "assistant",
        message:
          "That's an interesting thought! Tell me more about what inspired this idea.",
      },
    ]);
    setChatMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-full">
      <Card className="h-full border-gray-200/60 shadow-sm flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-gray-800 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Thought Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${
                    chat.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm font-light ${
                      chat.role === "user"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200/60"
                    }`}
                  >
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-6 border-t border-gray-200/60">
            <div className="flex space-x-2">
              <Input
                placeholder="Discuss your thoughts..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="border-gray-200/60 focus:border-gray-300"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-gray-800 hover:bg-gray-900"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
