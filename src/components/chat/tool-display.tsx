import { Message } from "@ai-sdk/react";

const TOOL_INVOCATION_NAMES = {
  tavily_search: "Web Search",
  fetch_relevant_thoughts: "Relevant Thoughts",
  get_thought_details: "Thought Details",
};

export default function ToolDisplay({ message }: { message: Message }) {
  return (
    <div>
      {message.parts?.map((part) => {
        if (part.type === "tool-invocation") {
          return (
            <div
              key={part.toolInvocation.toolCallId}
              className="flex justify-start"
            >
              <div className="flex flex-wrap gap-1.5 max-w-[85%] py-0.5">
                <div
                  key={part.toolInvocation.toolCallId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300"
                >
                  {TOOL_INVOCATION_NAMES[
                    part.toolInvocation
                      .toolName as keyof typeof TOOL_INVOCATION_NAMES
                  ] || part.toolInvocation.toolName}
                  {part.toolInvocation.state === "call" && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                  {part.toolInvocation.toolName === "tavily_search" &&
                    part.toolInvocation.state === "call" &&
                    part.toolInvocation.args && (
                      <div className="text-xs text-gray-500 animate-pulse">
                        {part.toolInvocation.args.query}
                      </div>
                    )}
                  {part.toolInvocation.state === "result" && (
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
