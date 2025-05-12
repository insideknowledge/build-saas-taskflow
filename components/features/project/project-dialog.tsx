"use client";

import { FC, useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
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
import { Project, Priority, Status } from "@/lib/types";
import { useTaskStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

const defaultProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'> = {
  name: "",
  description: "",
  status: "todo",
  priority: "medium",
  tags: [],
  teamMembers: [],
};

export const ProjectDialog: FC<ProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
}) => {
  const { addProject, updateProject, tags } = useTaskStore();
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>>(defaultProject);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || "",
        status: project.status,
        priority: project.priority,
        tags: project.tags,
        teamMembers: project.teamMembers,
      });
      setStartDate(project.startDate);
      setDueDate(project.dueDate);
    } else {
      setFormData(defaultProject);
      setStartDate(undefined);
      setDueDate(undefined);
    }
  }, [project, open]);
  
  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    const projectData = {
      ...formData,
      startDate,
      dueDate,
    };
    
    if (project) {
      updateProject(project.id, projectData);
    } else {
      addProject(projectData);
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
          <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Project name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project description"
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
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
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
          
          <div className="grid gap-2">
            <Label htmlFor="teamMembers">Team Members</Label>
            <Input
              id="teamMembers"
              placeholder="Add team member email"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  const email = input.value.trim();
                  
                  if (email && !formData.teamMembers.includes(email)) {
                    setFormData(prev => ({
                      ...prev,
                      teamMembers: [...prev.teamMembers, email]
                    }));
                    input.value = '';
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.teamMembers.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      teamMembers: prev.teamMembers.filter(e => e !== email)
                    }));
                  }}
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
            {project ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};