import { ThoughtList } from "@/lib/types";

import { useState } from "react";
import ThoughtModal, { Thought } from "./thought-modal";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {thoughts &&
          sortThoughtsByTime(thoughts).map((thought) => (
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
