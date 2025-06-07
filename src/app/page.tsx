"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Mic, Type, Send } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const [textThought, setTextThought] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic
    console.log("Submitting thought...");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement audio recording logic
  };

  return (
    <div className="min-h-screen bg-gray-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-gray-800 tracking-wide">
            Augment
          </h1>
          <p className="text-gray-500 text-sm font-light">
            Capture your thoughts in any form
          </p>
        </div>

        {/* Main Form */}
        <Card className="border-gray-200/60 shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-50/50 border border-gray-200/40">
                  <TabsTrigger
                    value="text"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger
                    value="audio"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Audio
                  </TabsTrigger>
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="mt-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="thought"
                      className="text-gray-600 font-light"
                    >
                      What&apos;s on your mind?
                    </Label>
                    <Textarea
                      id="thought"
                      placeholder="Share your thoughts..."
                      value={textThought}
                      onChange={(e) => setTextThought(e.target.value)}
                      className="min-h-32 border-gray-200/60 focus:border-gray-300 resize-none"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="audio" className="mt-6">
                  <div className="space-y-4">
                    <Label className="text-gray-600 font-light">
                      Record your voice
                    </Label>
                    <div className="flex items-center justify-center p-8 border border-gray-200/60 rounded-lg border-dashed">
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={toggleRecording}
                        className="border-gray-200/60"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-2 text-red-500 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Recording...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="image" className="mt-6">
                  <div className="space-y-3">
                    <Label htmlFor="image" className="text-gray-600 font-light">
                      Upload an image
                    </Label>
                    <div className="border border-gray-200/60 border-dashed rounded-lg p-8">
                      <div className="flex flex-col items-center space-y-4">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div className="mx-auto">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Label
                            htmlFor="image"
                            className="cursor-pointer text-gray-600 hover:text-gray-800 font-light"
                          >
                            Click to upload or drag and drop
                          </Label>
                        </div>
                        {selectedFile && (
                          <div className="flex items-center space-x-2">
                            <Image
                              src={URL.createObjectURL(selectedFile)}
                              alt="Selected Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white border-0"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Thought
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400 font-light">
            Your thoughts, beautifully captured
          </p>
        </div>
      </div>
    </div>
  );
}
