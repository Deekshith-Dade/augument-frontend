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
import { SignedIn, useAuth, UserButton, useUser } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ExplorePage() {
  const [thoughts, setThoughts] = useState<ThoughtList[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchThoughts = async () => {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/thoughts/visualize`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      const data = await response.json();
      setThoughts(data.thoughts);
      setLoading(false);
    };
    fetchThoughts();
  }, [getToken]);

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
          <div className="flex items-center justify-center space-x-2">
            <Link href="/">
              <Button variant="outline" className="border-gray-200/60">
                <Plus className="w-4 h-4 mr-2" />
                New Thought
              </Button>
            </Link>
            <div className="relative mt-2">
              <SignedIn>
                <UserButton />

                {/* Tooltip */}
                <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {user?.firstName} {user?.lastName}
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {loading ? (
          <div className="h-full m-auto flex items-center justify-center mt-24">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <Tabs defaultValue="chat" className=" h-full w-full">
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200/60 bg-white/50">
                <div className="max-w-7xl mx-auto">
                  <TabsList className="bg-transparent h-14 justify-start space-x-2 px-4 w-full overflow-x-auto scrollbar-hide">
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
                className="mt-0 h-[calc(100vh-130px)] overflow-y-auto"
              >
                <ThoughtsList thoughts={thoughts} setThoughts={setThoughts} />
              </TabsContent>

              {/* Graph Section */}
              <TabsContent value="graph" className="mt-0 h-[calc(100vh-130px)]">
                <ThoughtsGraph thoughts={thoughts} />
              </TabsContent>

              {/* Chat Section */}
              <TabsContent value="chat" className="h-screen flex-none">
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
