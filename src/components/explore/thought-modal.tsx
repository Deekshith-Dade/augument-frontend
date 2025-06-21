import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mic, Trash2, X, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Thought {
  id: string;
  title: string;
  text_content: string;
  image_url: string;
  audio_url: string;
  full_content: string;
  created_at: string;
  updated_at: string;
  meta: Record<string, unknown>;
  tags: string[];
}

interface ThoughtModalProps {
  thought_id: string;
  isModalOpen: boolean;
  setIsModalOpen: (boolean: boolean) => void;
  updateThought: (thought: Thought) => void;
  deleteThought: (thought_id: string) => void;
}

export default function ThoughtModal({
  thought_id,
  isModalOpen,
  setIsModalOpen,
  updateThought,
  deleteThought,
}: ThoughtModalProps) {
  const [editedThought, setEditedThought] = useState<Thought | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const { getToken } = useAuth();
  useEffect(() => {
    if (thought_id) {
      setEditedThought(null);
      setImageFile(null);
      setAudioBlob(null);
      setAudioURL(null);
      const fetchThought = async () => {
        const response = await fetch(`${API_BASE_URL}/thoughts/${thought_id}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setEditedThought(data);
        }
      };
      fetchThought();
    }
  }, [thought_id, getToken]);

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
        if (editedThought) {
          setEditedThought({
            ...editedThought,
            audio_url: url,
          });
        }
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
        alert("Audio file is too large. Please record a shorter audio.");
        setAudioBlob(null);
        setAudioURL(null);
        if (editedThought) {
          setEditedThought({
            ...editedThought,
            audio_url: "",
          });
        }
      }

      setIsRecording(false);
    }
  };

  const handleSaveThought = async () => {
    if (!editedThought) return;

    // Save to DB Here
    setSaveLoading(true);
    const formData = new FormData();
    formData.append("title", editedThought.title);
    formData.append("text_content", editedThought.text_content);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (audioBlob) {
      if (audioBlob.size > 2 * 1024 * 1024) {
        alert("Audio file is too large. Please record a shorter audio.");
        setAudioBlob(null);
        setAudioURL(null);
        setSaveLoading(false);
        return;
      }
      formData.append("audio", audioBlob, "audio.webm");
    }

    const response = await fetch(`${API_BASE_URL}/thoughts/${thought_id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    if (response.ok) {
      setIsModalOpen(false);
      updateThought(editedThought);
    } else {
      const errorData = await response.json();
      console.error("Failed to update thought", errorData);
    }
    setSaveLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      if (editedThought) {
        setEditedThought({
          ...editedThought,
          image_url: URL.createObjectURL(e.target.files[0]),
        });
      }
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
          setImageFile(file);
          if (editedThought) {
            setEditedThought({
              ...editedThought,
              image_url: URL.createObjectURL(file),
            });
          }
          setIsPasting(false);
          break;
        }
      }
    }

    setTimeout(() => setIsPasting(false), 1000);
  };

  const handleDeleteThought = async () => {
    if (editedThought) {
      setDeleteLoading(true);
      const response = await fetch(`${API_BASE_URL}/thoughts/${thought_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (response.ok) {
        deleteThought(thought_id);
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete thought");
      }
      setDeleteLoading(false);
    }

    setTimeout(() => setIsPasting(false), 500);
  };

  return (
    <>
      <ImageViewer
        imageUrl={editedThought?.image_url || ""}
        title={editedThought?.title || ""}
        isImageViewerOpen={isImageViewerOpen}
        setIsImageViewerOpen={setIsImageViewerOpen}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          {/* Header with gradient background */}
          <div className="relative -mx-6 -mt-6 px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-30"></div>
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-2xl font-extralight tracking-wide text-gray-900 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-gray-800 to-gray-400 rounded-full mr-4"></div>
                <p className="text-xl md:text-2xl font-extralight tracking-wide text-gray-900">
                  Edit Thought
                </p>
              </DialogTitle>
              {/* <DialogDescription className="text-gray-500 font-light mt-2 leading-relaxed">
                Refine your thoughts with precision. Every detail matters.
              </DialogDescription> */}
            </DialogHeader>
          </div>

          {editedThought && (
            <div className="space-y-4 py-6 px-6 overflow-y-auto max-h-[calc(95vh-220px)]">
              {/* Title Section */}
              <div className="group space-y-1">
                <Label
                  htmlFor="title"
                  className="text-gray-700 font-light text-sm tracking-wide uppercase"
                >
                  Title
                </Label>
                <div className="relative">
                  <Input
                    id="title"
                    value={editedThought.title}
                    onChange={(e) =>
                      setEditedThought({
                        ...editedThought,
                        title: e.target.value,
                      })
                    }
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-lg font-light focus:border-gray-800 focus:ring-0 transition-all duration-300 placeholder:text-gray-300"
                    placeholder="Enter your thought title..."
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-800 to-gray-400 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>

              {/* Content Section */}
              <div className="group space-y-3">
                <Label
                  htmlFor="content"
                  className="text-gray-700 font-light text-sm tracking-wide uppercase"
                >
                  Content
                </Label>
                <div className="relative">
                  <Textarea
                    id="content"
                    value={editedThought.text_content}
                    onChange={(e) =>
                      setEditedThought({
                        ...editedThought,
                        text_content: e.target.value,
                      })
                    }
                    className="min-h-40 border border-gray-200 rounded-xl bg-gray-50/30 px-4 py-4 text-gray-800 font-light leading-relaxed resize-none focus:border-gray-400 focus:bg-white focus:ring-0 transition-all duration-300 placeholder:text-gray-400"
                    placeholder="Share your thoughts here..."
                  />
                  <div className="absolute top-3 right-3 text-xs text-gray-400 font-light">
                    {editedThought.text_content.length} characters
                  </div>
                </div>
              </div>

              {/* Media Sections Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="space-y-4">
                  <Label className="text-gray-700 font-light text-sm tracking-wide uppercase flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Image
                  </Label>
                  <div
                    className="group border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-all duration-300 cursor-pointer"
                    onPaste={handlePaste}
                    onDragOver={(e) => e.preventDefault()}
                    tabIndex={0}
                  >
                    {editedThought.image_url ? (
                      <div className="space-y-4 relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-5 h-5 p-0 rounded-full bg-red-800 text-white hover:bg-gray-400 z-10"
                          onClick={() => {
                            setImageFile(null);
                            setEditedThought({
                              ...editedThought,
                              image_url: "",
                            });
                          }}
                        >
                          <X className="w-3 h-3" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                        <div
                          className="relative overflow-hidden rounded-lg bg-gray-50 cursor-pointer group w-full h-full"
                          onClick={() => setIsImageViewerOpen(true)}
                        >
                          <Image
                            src={editedThought.image_url || "/placeholder.svg"}
                            alt={editedThought.title}
                            className="w-full max-h-48 object-cover transition-all duration-300 group-hover:scale-105"
                            width={400}
                            height={300}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Click to view indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Subtle border animation */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg transition-all duration-300"></div>
                        </div>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="text-xs border-gray-200 bg-gray-50 file:bg-gray-800 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:text-xs"
                        />
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                          <ImageIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500 font-light">
                            Drop an image or click to browse
                          </p>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-xs border-gray-200 bg-gray-50 file:bg-gray-800 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:text-xs"
                          />
                        </div>
                      </div>
                    )}
                    {isPasting && (
                      <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
                        <div className="flex items-center space-x-3 text-gray-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-light">
                            Processing image...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Section */}
                <div className="space-y-4">
                  <Label className="text-gray-700 font-light text-sm tracking-wide uppercase flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Audio
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300">
                    {editedThought.audio_url ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <audio controls className="w-full">
                            <source
                              src={audioURL || editedThought.audio_url || ""}
                              type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                        <Button
                          type="button"
                          variant={isRecording ? "destructive" : "outline"}
                          onClick={toggleRecording}
                          className="w-full border-gray-200 hover:bg-gray-50 transition-all duration-300"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          {isRecording ? "Stop Recording" : "Record New"}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300">
                          <Mic className="w-6 h-6 text-gray-600" />
                        </div>
                        <Button
                          type="button"
                          variant={isRecording ? "destructive" : "outline"}
                          onClick={toggleRecording}
                          className="w-full border-gray-200 hover:bg-gray-50 transition-all duration-300"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                      </div>
                    )}
                    {isRecording && (
                      <div className="text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center justify-center space-x-2 text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-light">
                            Recording in progress...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="relative -mx-6 -mb-6 px-6 py-4 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
            <DialogFooter className="relative z-10 flex justify-between items-center text-xs md:text-base">
              <Button
                variant="outline"
                className="group border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300 text-xs md:text-base px-2 md:px-4"
                onClick={handleDeleteThought}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                )}
                Delete
              </Button>
              <div className="flex space-x-1 md:space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-gray-200 hover:bg-gray-50 transition-all duration-300 text-xs md:text-base px-2 md:px-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  disabled={
                    saveLoading ||
                    editedThought?.text_content.length === 0 ||
                    editedThought?.title.length === 0
                  }
                  onClick={handleSaveThought}
                  className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-xs md:text-base"
                >
                  {saveLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ImageViewer({
  imageUrl,
  title,
  isImageViewerOpen,
  setIsImageViewerOpen,
}: {
  imageUrl: string;
  title: string;
  isImageViewerOpen: boolean;
  setIsImageViewerOpen: (boolean: boolean) => void;
}) {
  return (
    <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
      <DialogContent className="p-0 border-none bg-transparent backdrop-blur-3xl shadow-2xl max-w-[95vw] max-h-[80vh] w-full h-full flex items-center justify-center">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}

          {/* Image */}
          {imageUrl && (
            <div className="max-w-full max-h-full px-4 py-6 flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={title}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
              />
              {/* Caption */}
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-md">
                {title}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
