"use client";

import { FC, useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Task, Priority, Status } from "@/lib/types";
import { useTaskStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

const defaultTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  tags: [],
};

export const TaskDialog: FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  task,
}) => {
  const { addTask, updateTask, tags } = useTaskStore();
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>(defaultTask);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        tags: task.tags,
        dueDate: task.dueDate,
      });
      setDate(task.dueDate);
    } else {
      setFormData(defaultTask);
      setDate(undefined);
    }
  }, [task, open]);
  
  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    
    const taskData = {
      ...formData,
      dueDate: date,
    };
    
    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onOpenChange(false);
  };
  
  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      const hasTag = prev.tags.includes(tagId);
      
      return {
        ...prev,
        tags: hasTag 
          ? prev.tags.filter((id) => id !== tagId) 
          : [...prev.tags, tagId],
      };
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task description"
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Status })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {task ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};