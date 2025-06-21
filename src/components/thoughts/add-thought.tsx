"use client";

import { SignedIn, useAuth, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Mic, Send, Loader2, Grid3X3, Plus, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddThought() {
  const [textThought, setTextThought] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  // const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

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
    if (audioBlob) {
      if (audioBlob.size > 2 * 1024 * 1024) {
        setFormStatus({
          status: "error",
          message: "Audio file is too large. Please record a shorter audio.",
        });
        return;
      }
      formData.append("audio", audioBlob, "audio.webm");
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

  const toggleRecording = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream; // Store stream reference

      // Use a local array to collect chunks
      const chunks: Blob[] = [];
      // setRecordedChunks([]);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          // setRecordedChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorder.onstop = () => {
        // Use local chunks array instead of state
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        console.log("audioURL", url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      const mediaRecorder = mediaRecorderRef.current;
      const stream = streamRef.current;

      if (!mediaRecorder) return;

      // Stop the media recorder
      mediaRecorder.stop();

      // Immediately stop all tracks to release microphone
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (audioBlob && audioBlob.size > 2 * 1024 * 1024) {
        setFormStatus({
          status: "error",
          message: "Audio file is too large. Please record a shorter audio.",
        });
        setAudioBlob(null);
        setAudioURL(null);
        // setRecordedChunks([]);
      }

      setIsRecording(false);
    }
  };

  return (
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
        <Card className=" shadow-lg bg-white/90 backdrop-blur-sm py-2 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="relative">
              {/* Main Input Area */}
              <div className="relative">
                <Textarea
                  placeholder="What's on your mind?"
                  value={textThought}
                  onChange={(e) => {
                    setTextThought(e.target.value);
                  }}
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
                  maxLength={3000}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 px-8 py-1">
                {/* Left Corner - Add Image Button */}
                <div className="flex items-center gap-2">
                  <div className="">
                    <div className="">
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

                  <div className="">
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

                <div className="">
                  <p className="text-xs text-gray-500">
                    {textThought.length}/3000
                  </p>
                </div>
              </div>

              {/* Media Preview Section */}
              {(selectedFile || isRecording || isPasting || audioURL) && (
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

                  {/* Audio Preview */}
                  {audioURL && (
                    <div className=" flex items-start space-x-3 w-full">
                      <div className="relative">
                        <audio src={audioURL} controls className="w-64 h-8" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-5 h-5 p-0 rounded-full bg-gray-800 text-white hover:bg-gray-400"
                          onClick={() => {
                            setAudioBlob(null);
                            setAudioURL(null);
                            // setRecordedChunks([]);
                            setIsRecording(false);
                          }}
                        >
                          <X className="w-3 h-3" />
                          <span className="sr-only">Remove audio</span>
                        </Button>
                      </div>
                      <div className="flex-1 px-2 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          Audio
                        </p>
                        <p className="text-xs text-gray-500">
                          {((audioBlob?.size ?? 0) / 1024).toFixed(2)} KB
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
                        {/* <p className="text-xs text-gray-500">
                          {((recordedChunks[0]?.size ?? 0) / 1024).toFixed(2)}{" "}
                          KB
                        </p> */}
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
  );
}
