"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MessageCircle, BarChart3, Grid3X3 } from "lucide-react";
import Link from "next/link";
import ThoughtsList from "@/components/explore/thoughts-list";
import { ThoughtList } from "@/lib/types";
import ThoughtsChat from "@/components/explore/thoughts-chat";
import ThoughtsGraph from "@/components/explore/thoughts-graph";

// Mock data for thoughts
const mockThoughts: ThoughtList[] = [
  {
    id: "1",
    title:
      "Remember to practice mindfulness today. The small moments matter most.",
    excerpt:
      "Remember to practice mindfulness today. The small moments matter most.",
    created_at: "2359823523",
    position: [0, 0],
    label: 0,
  },
  {
    id: "2",
    title: "Beautiful sunset from my walk",
    excerpt: "Beautiful sunset from my walk",
    created_at: "2359823523",
    position: [0, 0],
    label: 1,
  },
  {
    id: "3",
    title: "Voice note about project ideas",
    excerpt: "Voice note about project ideas",
    created_at: "2359823523",
    position: [0, 0],
    label: 2,
  },
  {
    id: "4",
    title: "Gratitude: Coffee, good books, and quiet mornings",
    excerpt: "Gratitude: Coffee, good books, and quiet mornings",
    created_at: "2359823523",
    position: [0, 0],
    label: 2,
  },
  {
    id: "5",
    title: "Idea: What if we could visualize our thoughts as a network?",
    excerpt: "Idea: What if we could visualize our thoughts as a network?",
    created_at: "2359823523",
    position: [0, 0],
    label: 1,
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-gray-800 tracking-wide">
              Augment
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Your thought space
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-gray-200/60">
              <Plus className="w-4 h-4 mr-2" />
              New Thought
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <Tabs defaultValue="thoughts" className="w-full h-full">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200/60 bg-white/50">
            <div className="max-w-7xl mx-auto">
              <TabsList className="bg-transparent h-14 w-fit justify-start space-x-2 px-4">
                <MTabsTrigger value="thoughts">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Thoughts
                </MTabsTrigger>
                <MTabsTrigger value="graph">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Visualize
                </MTabsTrigger>
                <MTabsTrigger value="chat">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </MTabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Thoughts Section */}
          <MTabsContent value="thoughts">
            <ThoughtsList thoughts={mockThoughts} />
          </MTabsContent>

          {/* Graph Section */}
          <MTabsContent value="graph">
            <ThoughtsGraph />
          </MTabsContent>

          {/* Chat Section */}
          <MTabsContent value="chat">
            <ThoughtsChat />
          </MTabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MTabsTrigger({
  children,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200/60 px-4 h-10 hover:cursor-pointer"
      {...props}
    >
      {children}
    </TabsTrigger>
  );
}

function MTabsContent({
  children,
  ...props
}: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent className="mt-0 h-[calc(100vh-130px)]" {...props}>
      {children}
    </TabsContent>
  );
}
