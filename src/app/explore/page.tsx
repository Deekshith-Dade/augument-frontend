"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MessageCircle,
  BarChart3,
  Grid3X3,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import ThoughtsList from "@/components/explore/thoughts-list";
import { ThoughtList } from "@/lib/types";
import ThoughtsGraph from "@/components/explore/thoughts-graph";
import { useEffect, useState } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import Discover from "@/components/explore/discover";

export default function ExplorePage() {
  const [thoughts, setThoughts] = useState<ThoughtList[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchThoughts = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:8000/thoughts/visualize");
      const data = await response.json();
      setThoughts(data.thoughts);
      setLoading(false);
    };
    fetchThoughts();
  }, []);

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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <Tabs defaultValue="thoughts" className="w-full h-full">
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200/60 bg-white/50">
                <div className="max-w-7xl mx-auto">
                  <TabsList className="bg-transparent h-14 w-fit justify-start space-x-2 px-4">
                    <TabsTrigger
                      value="thoughts"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200/60 px-4 h-10 hover:cursor-pointer"
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Thoughts
                    </TabsTrigger>
                    <TabsTrigger
                      value="graph"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200/60 px-4 h-10 hover:cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Visualize
                    </TabsTrigger>
                    <TabsTrigger
                      value="chat"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200/60 px-4 h-10 hover:cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger
                      value="discover"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200/60 px-4 h-10 hover:cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Discover
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Thoughts Section */}
              <TabsContent
                value="thoughts"
                className="mt-0 h-[calc(100vh-130px)]"
              >
                <ThoughtsList thoughts={thoughts} setThoughts={setThoughts} />
              </TabsContent>

              {/* Graph Section */}
              <TabsContent value="graph" className="mt-0 h-[calc(100vh-130px)]">
                <ThoughtsGraph thoughts={thoughts} />
              </TabsContent>

              {/* Chat Section */}
              <TabsContent value="chat" className="mt-0 h-[calc(100vh-130px)]">
                <ChatLayout />
              </TabsContent>

              {/* Discover Section */}
              <TabsContent
                value="discover"
                className="mt-0 h-[calc(100vh-130px)]"
              >
                <Discover />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
