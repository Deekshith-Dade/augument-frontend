// import { BarChart3 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ThoughtList } from "@/lib/types";
import ThoughtCloud from "./thought-cloud";

export default function ThoughtsGraph({
  thoughts,
}: {
  thoughts: ThoughtList[];
}) {
  return (
    <div className="max-w-7xl mx-auto py-2 px-4 ">
      {/* <Card className="h-full border-gray-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-gray-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Thought Network Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[calc(100vh-250px)]">
          
        </CardContent>
      </Card> */}
      <ThoughtCloud thoughts={thoughts} />
    </div>
  );
}
