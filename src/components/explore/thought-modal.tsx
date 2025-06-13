import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mic, Trash2, X, Save, Loader2 } from "lucide-react";
import Image from "next/image";

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
  useEffect(() => {
    if (thought_id) {
      setEditedThought(null);
      setImageFile(null);
      const fetchThought = async () => {
        const response = await fetch(
          `http://localhost:8000/thoughts/${thought_id}`
        );
        const data = await response.json();
        if (response.ok) {
          setEditedThought(data);
        }
      };
      fetchThought();
    }
  }, [thought_id]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
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

    const response = await fetch(
      `http://localhost:8000/thoughts/${thought_id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

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

  const handleDeleteThought = async () => {
    if (editedThought) {
      setDeleteLoading(true);
      const response = await fetch(
        `http://localhost:8000/thoughts/${thought_id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        deleteThought(thought_id);
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete thought");
      }
      setDeleteLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light flex items-center">
            {/* {editedThought?.type === "text" && <Type className="w-4 h-4 mr-2" />}
              {editedThought?.type === "image" && <ImageIcon className="w-4 h-4 mr-2" />}
              {editedThought?.type === "audio" && <Mic className="w-4 h-4 mr-2" />} */}
            Edit Thought
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Make changes to your thought here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        {editedThought && (
          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-600 font-light">
                Title
              </Label>
              <Input
                id="title"
                value={editedThought.title}
                onChange={(e) =>
                  setEditedThought({ ...editedThought, title: e.target.value })
                }
                className="border-gray-200/60 focus:border-gray-300"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-600 font-light">
                Content
              </Label>
              <Textarea
                id="content"
                value={editedThought.text_content}
                onChange={(e) =>
                  setEditedThought({
                    ...editedThought,
                    text_content: e.target.value,
                  })
                }
                className="min-h-32 border-gray-200/60 focus:border-gray-300 resize-none"
              />
            </div>

            {/* Media Section */}

            <div className="space-y-3">
              <Label className="text-gray-600 font-light">Image</Label>
              <div className="border border-gray-200/60 border-dashed rounded-lg p-4">
                {editedThought.image_url ? (
                  <div className="space-y-3">
                    <Image
                      src={editedThought.image_url || "/placeholder.svg"}
                      alt={editedThought.title}
                      className="rounded-md w-full max-h-64 object-contain mx-auto"
                      width={500}
                      height={500}
                    />
                    <div className="flex justify-center">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Audio Section */}

            <div className="space-y-3">
              <Label className="text-gray-600 font-light">Audio</Label>
              <div className="border border-gray-200/60 border-dashed rounded-lg p-4">
                {editedThought.audio_url ? (
                  <div className="space-y-3">
                    <audio controls className="w-full">
                      <source src={editedThought.audio_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={toggleRecording}
                        className="border-gray-200/60"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {isRecording ? "Stop Recording" : "Record New Audio"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Mic className="w-8 h-8 text-gray-400 mx-auto" />
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
                )}
                {isRecording && (
                  <div className="text-center mt-2">
                    <div className="inline-flex items-center space-x-2 text-red-500 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>Recording...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleDeleteThought}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="w-4 h-4 mr-2 " />
              Cancel
            </Button>
            <Button
              disabled={
                saveLoading ||
                editedThought?.text_content.length === 0 ||
                editedThought?.title.length === 0
              }
              onClick={handleSaveThought}
              className="bg-gray-800 hover:bg-gray-900"
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
      </DialogContent>
    </Dialog>
  );
}
