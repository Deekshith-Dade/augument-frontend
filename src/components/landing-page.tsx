"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  Mic,
  ImageIcon,
  Type,
  MessageCircle,
  BarChart3,
  Sparkles,
  Users,
  Shield,
  Zap,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-light text-gray-800 tracking-wide">
              Augment
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="border-gray-200/60 text-gray-600 px-3 py-1"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Capture thoughts in any form
            </Badge>
            <h1 className="text-5xl md:text-6xl font-light text-gray-800 tracking-tight leading-tight">
              Your thoughts,
              <br />
              <span className="text-gray-600">beautifully organized</span>
            </h1>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
              Augment transforms how you capture, connect, and explore your
              ideas. Whether through text, voice, or images—your thoughts find
              their perfect home.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3"
              >
                Start Capturing Ideas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-200/60 px-8 py-3"
              >
                View Demo
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12">
            <ChevronDown className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800">
              Three ways to capture,
              <br />
              <span className="text-gray-600">infinite ways to connect</span>
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
              Every thought matters. Capture them naturally and watch as
              patterns emerge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Text Thoughts */}
            <Card className="border-gray-200/60 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Type className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800">
                  Text Thoughts
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Quick notes, deep reflections, or fleeting ideas. Write
                  naturally and let your thoughts flow.
                </p>
              </CardContent>
            </Card>

            {/* Voice Notes */}
            <Card className="border-gray-200/60 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Mic className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800">
                  Voice Notes
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Speak your mind when typing isn&apos;t enough. Perfect for
                  capturing spontaneous insights.
                </p>
              </CardContent>
            </Card>

            {/* Visual Memories */}
            <Card className="border-gray-200/60 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800">
                  Visual Memories
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Images speak volumes. Capture moments, diagrams, or
                  inspiration that words can&apos;t express.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800">
              Simple to use,
              <br />
              <span className="text-gray-600">powerful to explore</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center mx-auto text-lg font-medium">
                1
              </div>
              <h3 className="text-xl font-medium text-gray-800">Capture</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Record your thoughts through text, voice, or images. No
                structure required—just capture what matters.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center mx-auto text-lg font-medium">
                2
              </div>
              <h3 className="text-xl font-medium text-gray-800">Connect</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Watch as your thoughts form connections. Our AI helps you
                discover patterns and relationships.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center mx-auto text-lg font-medium">
                3
              </div>
              <h3 className="text-xl font-medium text-gray-800">Explore</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Navigate your thought network, chat with your ideas, and
                discover insights you never knew existed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 bg-gray-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800">
              Your personal
              <br />
              <span className="text-gray-600">thought workspace</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Thoughts Grid */}
            <Card className="border-gray-200/60 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-800">
                    Thought Collection
                  </h3>
                </div>
                <p className="text-sm text-gray-600 font-light">
                  All your thoughts in one beautiful, searchable grid.
                  Color-coded and organized just the way you like.
                </p>
                <div className="space-y-2">
                  <div className="h-3 bg-yellow-100 rounded-full"></div>
                  <div className="h-3 bg-blue-100 rounded-full w-4/5"></div>
                  <div className="h-3 bg-green-100 rounded-full w-3/5"></div>
                </div>
              </CardContent>
            </Card>

            {/* Network View */}
            <Card className="border-gray-200/60 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-800">Network View</h3>
                </div>
                <p className="text-sm text-gray-600 font-light">
                  Visualize connections between your thoughts in an interactive
                  3D network. See your mind map come alive.
                </p>
                <div className="flex items-center justify-center h-16">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-px h-8 bg-gray-300 mx-2"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            {/* AI Chat */}
            <Card className="border-gray-200/60 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-800">
                    AI Conversations
                  </h3>
                </div>
                <p className="text-sm text-gray-600 font-light">
                  Chat with your thoughts. Ask questions, explore connections,
                  and gain new insights through AI-powered conversations.
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-lg p-2 text-xs text-gray-600">
                    &quot;Tell me about my project ideas&quot;
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-xs text-gray-600 ml-4">
                    &quot;Based on your thoughts...&quot;
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800">
              Why choose
              <br />
              <span className="text-gray-600">Augment?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">
                Lightning Fast
              </h3>
              <p className="text-gray-600 font-light">
                Capture thoughts instantly. No complex setup, no learning
                curve—just pure, effortless thought recording.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">
                Private & Secure
              </h3>
              <p className="text-gray-600 font-light">
                Your thoughts are yours alone. End-to-end encryption ensures
                your ideas remain completely private.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">
                Built for Thinkers
              </h3>
              <p className="text-gray-600 font-light">
                Designed by and for people who think deeply. Every feature
                serves the art of reflection and discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light text-white">
              Ready to augment
              <br />
              <span className="text-gray-300">your thinking?</span>
            </h2>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Join thousands of thinkers who&apos;ve transformed how they
              capture and connect their ideas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3"
              >
                Explore Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200/60 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-light text-gray-800">Augment</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-gray-800 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200/60 text-center">
            <p className="text-sm text-gray-400 font-light">
              © 2024 Augment. Beautifully crafted for beautiful minds.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
