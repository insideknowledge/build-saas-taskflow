"use client";

import { FC, useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/lib/store";

interface WhiteboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whiteboard?: any;
}

const defaultWhiteboard = {
  title: "",
  description: "",
  tags: [],
  collaborators: [],
};

export const WhiteboardDialog: FC<WhiteboardDialogProps> = ({
  open,
  onOpenChange,
  whiteboard,
}) => {
  const { addWhiteboard, updateWhiteboard, tags } = useTaskStore();
  const [formData, setFormData] = useState(defaultWhiteboard);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");

  useEffect(() => {
    if (whiteboard) {
      setFormData({
        title: whiteboard.title,
        description: whiteboard.description || "",
        tags: whiteboard.tags,
        collaborators: whiteboard.collaborators,
      });
    } else {
      setFormData(defaultWhiteboard);
    }
  }, [whiteboard, open]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (whiteboard) {
      updateWhiteboard(whiteboard.id, formData);
    } else {
      addWhiteboard(formData);
    }

    onOpenChange(false);
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      const hasTag = prev.tags.includes(tagId);
      return {
        ...prev,
        tags: hasTag 
          ? prev.tags.filter((id: string) => id !== tagId) 
          : [...prev.tags, tagId],
      };
    });
  };

  const handleAddCollaborator = () => {
    if (!collaboratorEmail.trim()) return;

    setFormData(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, collaboratorEmail.trim()]
    }));
    setCollaboratorEmail("");
  };

  const handleRemoveCollaborator = (email: string) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter((e: string) => e !== email)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {whiteboard ? "Edit Whiteboard" : "Create Whiteboard"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter whiteboard title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your whiteboard"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={formData.tags.includes(tag.id) ? "default" : "outline"}
                  style={{
                    backgroundColor: formData.tags.includes(tag.id) ? tag.color : "transparent",
                    color: formData.tags.includes(tag.id) ? "white" : tag.color,
                    borderColor: tag.color,
                  }}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Collaborators</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add collaborator email"
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCollaborator();
                  }
                }}
              />
              <Button onClick={handleAddCollaborator}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.collaborators.map((email: string) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveCollaborator(email)}
                >
                  {email}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {whiteboard ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}