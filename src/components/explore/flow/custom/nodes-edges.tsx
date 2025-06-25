import { useFlowStore } from "@/store/flow-store";
import { Handle, Position } from "reactflow";

type NodeData = {
  label: string;
  summary: string;
  thought_ids: string[];
};

type EdgeData = {
  label: string;
};

const nodeTypeStyles: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  self_reflection_emotion: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
  },
  self_reflection_theme: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
  },
  self_reflection_goal: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
  },
  self_reflection_connector: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-800",
  },
};

// Custom Node Component
export const CustomNode = ({
  id,
  data,
  selected,
  type,
}: {
  id: string;
  data: NodeData;
  selected: boolean;
  type: string;
}) => {
  const { setCurrentNodeId } = useFlowStore();
  const nodeStyle =
    nodeTypeStyles[type] || nodeTypeStyles.self_reflection_connector;

  return (
    <div
      className={`
        relative border-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out
        ${nodeStyle.bg}
        ${
          selected
            ? `${nodeStyle.border} shadow-xl scale-105`
            : `${nodeStyle.border} hover:shadow-xl hover:scale-102`
        }
        w-80 min-h-[60px] p-4
      `}
      onClick={() => setCurrentNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full hover:bg-gray-500 transition-colors"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />

      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-bold line-clamp-1 ${nodeStyle.text}`}>
            {data.label}
          </h3>
          <div className="text-xs text-gray-600 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200">
            {data.thought_ids?.length || 0} thoughts
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <p
            className={`text-sm leading-relaxed line-clamp-2 ${nodeStyle.text} opacity-80`}
          >
            {data.summary}
          </p>
        </div>

        {/* Type indicator */}
        <div className="mt-3 pt-2 border-t border-gray-200/50">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                type === "self_reflection_emotion"
                  ? "bg-red-500"
                  : type === "self_reflection_theme"
                  ? "bg-blue-500"
                  : type === "self_reflection_goal"
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            ></div>
            <span className="text-xs text-gray-500 capitalize">
              {type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full hover:bg-gray-500 transition-colors"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
    </div>
  );
};

// Custom Edge Component
export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data: EdgeData;
}) => {
  const edgePath = `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY} ${
    targetX - 50
  } ${targetY} ${targetX} ${targetY}`;

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path stroke-gray-300 stroke-2"
        d={edgePath}
        fill="none"
        strokeDasharray="5,5"
        strokeDashoffset="0"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-10"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>

      <foreignObject
        x={(sourceX + targetX) / 2 - 100}
        y={(sourceY + targetY) / 2 - 15}
        width="200"
        height="30"
        className="cursor-pointer"
        onClick={(e) => {
          const text = e.currentTarget.querySelector(".edge-label");
          if (text) {
            text.classList.toggle("hidden");
          }
        }}
      >
        <div className="edge-label hidden text-xs text-gray-600 font-medium text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200 shadow-sm">
          {data?.label || "evolved to"}
        </div>
      </foreignObject>

      <circle
        cx={targetX - 10}
        cy={targetY}
        r="4"
        className="fill-gray-400 stroke-white stroke-2"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
      />
    </g>
  );
};
