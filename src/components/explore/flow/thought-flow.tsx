"use client";
import { Edge, Node } from "reactflow";
import ThoughtEvolutionFlow from "./flow-layout";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useFlowStore } from "@/store/flow-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ThoughtFlowData = {
  nodes: Node[];
  edges: Edge[];
};

export default function ThoughtFlow() {
  const { getToken } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { setFlow } = useFlowStore();

  const { data: flowData, isLoading } = useQuery<ThoughtFlowData>({
    queryKey: ["flow", searchQuery],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/flow/`, {
        method: "POST",
        body: JSON.stringify({
          message: `${searchQuery}?`,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
    enabled: !!searchQuery, // Only fetch on demand
  });

  useEffect(() => {
    if (flowData) {
      setFlow(flowData.nodes, flowData.edges);
    }
  }, [flowData, setFlow]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setInputValue("");
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <div className="max-w-md mx-auto">
        <div className="relative">
          {isLoading ? (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          )}
          <Input
            type="text"
            placeholder="Ask a question to create a flow..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="px-10 border-gray-200/60 focus:border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm"
            disabled={isLoading}
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              onClick={handleClear}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>
      <ThoughtEvolutionFlow />
    </div>
  );
}
