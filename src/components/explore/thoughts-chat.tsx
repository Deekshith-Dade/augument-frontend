import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { MessageCircle, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";

export default function ThoughtsChat() {
  const { messages, setMessages, handleSubmit, input, setInput } = useChat({
    api: "http://localhost:8000/chat",
    maxSteps: 4,
    onError: (error) => {
      if (error.message.includes("400")) {
        setMessages((prev) => [
          ...prev,
          {
            id: "error",
            role: "assistant",
            content:
              "I'm sorry, I couldn't process your request. Please try again.",
          },
        ]);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-2 h-[calc(100vh-10rem)]">
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
              {messages.map((message) => (
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
                    {message.content}
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className="border-gray-200/60 focus:border-gray-300"
              />
              <Button
                onClick={() => handleSubmit()}
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
