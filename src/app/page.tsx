"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Mic, Type, Send, Loader2, Grid3X3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, useAuth, UserButton, useUser } from "@clerk/nextjs";

export default function HomePage() {
  const [textThought, setTextThought] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    status: "success" | "error" | "loading" | null;
    message: string;
  }>({
    status: null,
    message: "",
  });
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isPasting, setIsPasting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({
      status: "loading",
      message: "Capturing your thought...",
    });
    const formData = new FormData();

    if (textThought) {
      formData.append("text", textThought);
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const response = await fetch("http://localhost:8000/thoughts/create", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    if (response.ok) {
      setFormStatus({
        status: "success",
        message: "Thought submitted successfully",
      });
    } else {
      setFormStatus({
        status: "error",
        message: "Failed to submit thought",
      });
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    setIsPasting(true);

    const items = e.clipboardData?.items;
    if (!items) {
      setIsPasting(false);
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          setSelectedFile(file);
          setIsPasting(false);
          break;
        }
      }
    }

    setTimeout(() => setIsPasting(false), 500);
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
        <div className="text-center space-y-2 relative">
          <h1 className="text-3xl font-light text-gray-800 tracking-wide">
            Augment
          </h1>
          <SignedIn>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <div className="relative group">
                <UserButton />

                {/* Tooltip */}
                <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
            </div>
          </SignedIn>
          <p className="text-gray-500 text-sm font-light">
            Capture your thoughts in any form
          </p>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/explore">
            <Button variant="outline" className="border-gray-200/60">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Explore Thoughts
            </Button>
          </Link>
        </div>

        {formStatus.status === "error" || formStatus.status === "success" ? (
          <div className="text-center">
            <p
              className={`text-sm font-light ${
                formStatus.status === "error"
                  ? "text-red-500"
                  : formStatus.status === "success"
                  ? "text-green-500"
                  : ""
              }`}
            >
              {formStatus.message}
            </p>
            <Button
              variant={"outline"}
              onClick={() => {
                setFormStatus({ status: null, message: "" });
                setTextThought("");
                setSelectedFile(null);
                setIsRecording(false);
              }}
              className="mt-8 hover:cursor-pointer"
            >
              Add New Thought
            </Button>
          </div>
        ) : (
          <></>
        )}

        {formStatus.status === "loading" && (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="mt-4 text-sm font-light text-gray-400">
              {formStatus.message}
            </p>
          </div>
        )}

        {/* Main Form */}
        {formStatus.status === null && (
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
                      <Label className="text-gray-600 font-light ">
                        Record your voice
                      </Label>
                      <div className="flex min-h-32 items-center justify-center p-8 border border-gray-200/60 rounded-lg border-dashed">
                        <Button
                          type="button"
                          variant={isRecording ? "destructive" : "outline"}
                          onClick={toggleRecording}
                          className="border-gray-200/60"
                        >
                          <Mic
                            className={`w-4 h-4 mr-2 ${
                              isRecording ? "animate-pulse" : ""
                            }`}
                          />
                          {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="mt-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="image"
                        className="text-gray-600 font-light"
                      >
                        Upload an image
                      </Label>
                      <div
                        className="border border-gray-200/60 border-dashed rounded-lg p-8 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors"
                        onPaste={handlePaste}
                        onDragOver={(e) => e.preventDefault()}
                        tabIndex={0}
                      >
                        <div className="flex flex-col items-center space-y-4">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <div className="mx-auto space-y-2">
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
                            <p className="text-xs text-gray-400 font-light">
                              Or paste an image from your clipboard (Ctrl+V /
                              Cmd+V)
                            </p>
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
                          {isPasting && (
                            <div className="flex items-center space-x-2 bg-gray-50/50 rounded-lg">
                              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
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
                    className={`w-full bg-gray-800 hover:bg-gray-900 text-white border-0 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      formStatus.status === "loading"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={formStatus.status === "loading" || !textThought}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Thought
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400 font-light">
            Your thoughts, beautifully captured, curated.
          </p>
        </div>
      </div>
    </div>
  );
}
