import { ThoughtList } from "@/lib/types";

import { useMemo, useState } from "react";
import ThoughtModal, { Thought } from "./thought-modal";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ThoughtsListProps {
  thoughts: ThoughtList[];
  setThoughts: (thoughts: ThoughtList[]) => void;
}

const colors = [
  "bg-rose-50 border-rose-200", // Soft rose pink
  "bg-sky-50 border-sky-200", // Light sky blue
  "bg-emerald-50 border-emerald-200", // Calming green
  "bg-indigo-50 border-indigo-200", // Peaceful indigo
  "bg-orange-50 border-orange-200", // Gentle orange
  "bg-teal-50 border-teal-200", // Soothing teal
  "bg-fuchsia-50 border-fuchsia-200", // Soft purple-pink
];

const sortThoughtsByTime = (thoughts: ThoughtList[]) => {
  return thoughts.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export default function ThoughtsList({
  thoughts,
  setThoughts,
}: ThoughtsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentThought, setCurrentThought] = useState<ThoughtList | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const filteredThoughts = useMemo(() => {
    if (!searchQuery.trim()) {
      return thoughts;
    }
    const query = searchQuery.toLowerCase();
    return thoughts.filter(
      (thought) =>
        thought.title.toLowerCase().includes(query) ||
        thought.excerpt.toLowerCase().includes(query) ||
        thought.label.toString().includes(query)
    );
  }, [searchQuery, thoughts]);

  const updateThought = (thought: Thought) => {
    const currThought = thoughts.find((t) => t.id === thought.id);
    if (currThought) {
      currThought.title = thought.title;
      currThought.excerpt = thought.text_content.slice(0, 100);
      currThought.created_at = thought.created_at;
    }
  };

  const deleteThought = (thought_id: string) => {
    const newThoughts = thoughts.filter((t) => t.id !== thought_id);
    setThoughts(newThoughts);
  };

  const openThoughtModal = (thought: ThoughtList) => {
    setCurrentThought(thought);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <Input
              type="text"
              placeholder="Search your thoughts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200/60 focus:border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-3 h-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500 font-light">
                {filteredThoughts.length === 0
                  ? "No thoughts found"
                  : `${filteredThoughts.length} thought${
                      filteredThoughts.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredThoughts &&
          sortThoughtsByTime(filteredThoughts).map((thought) => (
            <div
              key={thought.id}
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${
                colors[thought.label % colors.length]
              }`}
              onClick={() => openThoughtModal(thought)}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <span className="text-xs text-gray-500 font-light capitalize line-clamp-2">
                  {thought.title}
                </span>
                <span className="text-xs text-gray-400 font-light">
                  {new Date(thought.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 font-light leading-relaxed line-clamp-4">
                {thought.excerpt}
              </p>
            </div>
          ))}
      </div>

      <ThoughtModal
        thought_id={currentThought?.id || ""}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        updateThought={updateThought}
        deleteThought={deleteThought}
      />
    </div>
  );
}
