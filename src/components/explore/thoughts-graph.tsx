import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ThoughtsGraph() {
  return (
    <div className="max-w-7xl mx-auto p-4 h-full">
      <Card className="h-full border-gray-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-gray-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Thought Network Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[calc(100vh-250px)]">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <p className="text-xl text-gray-600 font-light">
                3D Thought Visualization
              </p>
              <p className="text-sm text-gray-400 font-light mt-2">
                This is where your Three.js graph will appear, showing
                connections between your thoughts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
