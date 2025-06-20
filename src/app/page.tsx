"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mic, Send, Loader2, Grid3X3, Plus, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import LandingPage from "@/components/landing-page";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const response = await fetch(`${API_BASE_URL}/thoughts/create`, {
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
    const items = e.clipboardData?.items;
    if (!items) return;

    // Check if there are any image items
    let hasImage = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault(); // Only prevent default for images
        setIsPasting(true);

        const file = item.getAsFile();
        if (file) {
          setSelectedFile(file);
          hasImage = true;
          break;
        }
      }
    }

    // // If we found an image, show the pasting indicator briefly
    if (hasImage) {
      setTimeout(() => setIsPasting(false), 500);
    }
    // For text pasting, let the default behavior handle it (don't prevent default)
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("file changed", e.target.files[0]);
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement audio recording logic
  };

  return (
    <div className="min-h-screen bg-gray-50/30 flex items-center justify-center p-4">
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
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
            <Card className="border-gray-200/50 shadow-lg bg-white/90 backdrop-blur-sm py-2 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="relative">
                  {/* Main Input Area */}
                  <div className="relative">
                    <Textarea
                      placeholder="What's on your mind?"
                      value={textThought}
                      onChange={(e) => setTextThought(e.target.value)}
                      onPaste={handlePaste}
                      className="min-h-32 max-h-64 border-0 resize-none text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent  pr-12 pl-12 overflow-y-auto"
                      style={{
                        height: "auto",
                        minHeight: "8rem",
                        maxHeight: "16rem",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#ededed #ffffff",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height =
                          Math.min(target.scrollHeight, 256) + "px";
                      }}
                    />

                    {/* Left Corner - Add Image Button */}
                    <div className="absolute left-4 bottom-4">
                      <div className="relative">
                        <Input
                          ref={fileInputRef}
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="sr-only">Add image</span>
                        </Button>
                      </div>
                    </div>

                    {/* Right Corner - Voice Recording Button */}
                    <div className="absolute right-4 bottom-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`w-8 h-8 p-0 rounded-full transition-colors ${
                          isRecording
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={toggleRecording}
                      >
                        <Mic className="w-4 h-4" />
                        <span className="sr-only">
                          {isRecording ? "Stop recording" : "Start recording"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Media Preview Section */}
                  {(selectedFile || isRecording || isPasting) && (
                    <div className="border-t border-gray-100 p-2 bg-gray-50/50">
                      {/* Image Preview */}
                      {selectedFile && (
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            {selectedFile.type.startsWith("image/") ? (
                              <Image
                                src={
                                  URL.createObjectURL(selectedFile) ||
                                  "/placeholder.svg"
                                }
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                width={64}
                                height={64}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 w-5 h-5 p-0 rounded-full bg-gray-800 text-white hover:bg-gray-400"
                              onClick={() => setSelectedFile(null)}
                            >
                              <X className="w-3 h-3" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-600">
                              Recording...
                            </p>
                            <p className="text-xs text-gray-500">
                              Click the mic button to stop
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Pasting Indicator */}
                      {isPasting && (
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-600">
                              Pasting image...
                            </p>
                            <p className="text-xs text-gray-500">
                              Processing clipboard content
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="absolute top-4 right-4">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        !textThought.trim() && !selectedFile && !isRecording
                      }
                      className="w-8 h-8 p-0 rounded-full bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="sr-only">Submit thought</span>
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
      </SignedIn>
    </div>
  );
}
