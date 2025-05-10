"use client";

import { useState, FormEvent } from "react";
import { useTaskStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

export default function TagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useTaskStore();
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    addTag(newTagName, newTagColor);
    setNewTagName("");
  };
  
  const handleEdit = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (!tag) return;
    
    setEditMode(id);
    setEditName(tag.name);
    setEditColor(tag.color);
  };
  
  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    
    updateTag(id, {
      name: editName,
      color: editColor,
    });
    
    setEditMode(null);
  };
  
  const handleDelete = (id: string) => {
    deleteTag(id);
  };
  
  const colors = [
    "#3b82f6", // blue
    "#f97316", // orange
    "#14b8a6", // teal
    "#ef4444", // red
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#10b981", // emerald
    "#ec4899", // pink
    "#6366f1", // indigo
  ];
  
  return (
    <div>
      <PageHeader 
        title="Tags" 
        description="Manage and organize your task tags"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Create New Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="tagName">Tag Name</Label>
                <Input
                  id="tagName"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        newTagColor === color ? "border-black dark:border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Create Tag
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {tags.length === 0 ? (
                  <motion.div 
                    className="text-center p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No tags yet</h3>
                    <p className="text-muted-foreground">
                      Create your first tag to organize your tasks.
                    </p>
                  </motion.div>
                ) : (
                  tags.map((tag) => (
                    <motion.div 
                      key={tag.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {editMode === tag.id ? (
                        <div className="p-4 border rounded-lg">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor={`edit-${tag.id}`}>Tag Name</Label>
                              <Input
                                id={`edit-${tag.id}`}
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Color</Label>
                              <div className="flex flex-wrap gap-2">
                                {colors.map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    className={`w-6 h-6 rounded-full border-2 ${
                                      editColor === color ? "border-black dark:border-white" : "border-transparent"
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setEditColor(color)}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditMode(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(tag.id)}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="font-medium">{tag.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(tag.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(tag.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                      <Separator className="my-2" />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}