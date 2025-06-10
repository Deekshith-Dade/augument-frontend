import { ThoughtList } from "@/lib/types";

interface ThoughtsListProps {
  thoughts: ThoughtList[];
}

const colors = [
  "bg-yellow-50 border-yellow-200",
  "bg-blue-50 border-blue-200",
  "bg-green-50 border-green-200",
  "bg-purple-50 border-purple-200",
  "bg-pink-50 border-pink-200",
];

export default function ThoughtsList({ thoughts }: ThoughtsListProps) {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {thoughts.map((thought) => (
          <div
            key={thought.id}
            className={`p-4 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${
              colors[thought.label % colors.length]
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-gray-500 font-light capitalize">
                {thought.title}
              </span>
              <span className="text-xs text-gray-400 font-light">
                {thought.created_at}
              </span>
            </div>
            <p className="text-sm text-gray-700 font-light leading-relaxed">
              {thought.excerpt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
