import { useFlowStore } from "@/store/flow-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Brain,
  Heart,
  Target,
  Hash,
  NotebookText,
  BarChart3,
} from "lucide-react";

const nodeTypeConfig = {
  self_reflection_theme: {
    icon: Brain,
    color: "bg-blue-50 border-blue-200 text-blue-800",
    accent: "bg-blue-100 text-blue-700",
    title: "Theme",
  },
  self_reflection_emotion: {
    icon: Heart,
    color: "bg-red-50 border-red-200 text-red-800",
    accent: "bg-red-100 text-red-700",
    title: "Emotion",
  },
  self_reflection_goal: {
    icon: Target,
    color: "bg-green-50 border-green-200 text-green-800",
    accent: "bg-green-100 text-green-700",
    title: "Goal",
  },
  self_reflection_connector: {
    icon: Hash,
    color: "bg-gray-50 border-gray-200 text-gray-800",
    accent: "bg-gray-100 text-gray-700",
    title: "Connection",
  },
};

export const NodeDisplay = () => {
  const { setCurrentNodeId, currentNodeData } = useFlowStore();

  if (!currentNodeData) return null;

  const nodeType = currentNodeData.type || "self_reflection_connector";
  const config =
    nodeTypeConfig[nodeType as keyof typeof nodeTypeConfig] ||
    nodeTypeConfig.self_reflection_connector;
  const IconComponent = config.icon;
  const data = currentNodeData.data;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className={`w-full max-w-2xl max-h-[90vh] overflow-hidden border-2 ${config.color} shadow-2xl`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${config.accent}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{data.label}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className={config.accent}>
                  {config.title}
                </Badge>
                {data.thought_ids && (
                  <Badge
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <NotebookText className="w-3 h-3" />
                    <span>{data.thought_ids.length} thoughts</span>
                  </Badge>
                )}
                {data.intensity && (
                  <Badge
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>{(data.intensity * 100).toFixed(0)}% intensity</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentNodeId("")}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary Section */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wide opacity-70">
              Summary
            </h3>
            <p className="text-sm leading-relaxed bg-white/50 rounded-lg p-3 border border-white/20">
              {data.summary}
            </p>
          </div>

          {/* Thought IDs Section */}
          {data.thought_ids && data.thought_ids.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide opacity-70">
                Related Thoughts
              </h3>
              <ScrollArea className="h-32 w-full rounded-lg border border-white/20 bg-white/30">
                <div className="p-3 space-y-2">
                  {data.thought_ids.map((thoughtId: string, index: number) => (
                    <div
                      key={thoughtId}
                      className="flex items-center space-x-2 text-sm bg-white/50 rounded-md px-3 py-2 border border-white/20"
                    >
                      <span className="font-mono text-xs opacity-60">
                        #{index + 1}
                      </span>
                      <span className="font-mono text-xs">{thoughtId}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Node Metadata */}
          <div className="pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Node ID:</span>
                <span className="font-mono ml-2">{currentNodeData.id}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
