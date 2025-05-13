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
import { CalendarIcon, Plus, X } from "lucide-react";
import { Goal, Priority, Status, Milestone } from "@/lib/types";
import { useTaskStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
}

const defaultGoal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
  title: "",
  description: "",
  target: 0,
  current: 0,
  unit: "",
  status: "todo",
  priority: "medium",
  tags: [],
  milestones: [],
};

export const GoalDialog: FC<GoalDialogProps> = ({
  open,
  onOpenChange,
  goal,
}) => {
  const { addGoal, updateGoal, tags } = useTaskStore();
  const [formData, setFormData] = useState<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>(defaultGoal);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [newMilestone, setNewMilestone] = useState({ title: "", target: 0 });
  
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || "",
        target: goal.target,
        current: goal.current,
        unit: goal.unit,
        status: goal.status,
        priority: goal.priority,
        tags: goal.tags,
        milestones: goal.milestones,
      });
      setStartDate(goal.startDate);
      setDueDate(goal.dueDate);
    } else {
      setFormData(defaultGoal);
      setStartDate(undefined);
      setDueDate(undefined);
    }
  }, [goal, open]);
  
  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.unit.trim()) return;
    
    const goalData = {
      ...formData,
      startDate,
      dueDate,
    };
    
    if (goal) {
      updateGoal(goal.id, goalData);
    } else {
      addGoal(goalData);
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
  
  const handleAddMilestone = () => {
    if (!newMilestone.title.trim() || newMilestone.target <= 0) return;
    
    const milestone: Milestone = {
      id: uuidv4(),
      title: newMilestone.title,
      target: newMilestone.target,
      isCompleted: false,
    };
    
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, milestone],
    }));
    
    setNewMilestone({ title: "", target: 0 });
  };
  
  const handleRemoveMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id),
    }));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create Goal"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter goal title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your goal"
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                min="0"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="current">Current Value</Label>
              <Input
                id="current"
                type="number"
                min="0"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: Number(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="unit">Unit of Measurement</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g., hours, kilometers, books"
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
            <Label>Milestones</Label>
            <div className="space-y-2">
              {formData.milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div>
                    <span className="font-medium">{milestone.title}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({milestone.target} {formData.unit})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Milestone title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Target"
                  value={newMilestone.target || ""}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, target: Number(e.target.value) }))}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  onClick={handleAddMilestone}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {goal ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};