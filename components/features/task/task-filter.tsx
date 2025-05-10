"use client";

import { FC } from "react";
import { useTaskStore } from "@/lib/store";
import { Status, Priority } from "@/lib/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TaskFilter: FC = () => {
  const { 
    filter, 
    tags, 
    setStatusFilter, 
    setPriorityFilter, 
    toggleTagFilter, 
    setSearchQuery, 
    resetFilters 
  } = useTaskStore();
  
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={filter.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filter.status}
            onValueChange={(value) => setStatusFilter(value as Status | 'all')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filter.priority}
            onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="ghost"
          onClick={resetFilters}
          className="hidden md:inline-flex"
        >
          Reset
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={filter.tags.includes(tag.id) ? "default" : "outline"}
              style={{
                backgroundColor: filter.tags.includes(tag.id) ? tag.color : "transparent",
                color: filter.tags.includes(tag.id) ? "white" : tag.color,
                borderColor: tag.color,
              }}
              className="cursor-pointer"
              onClick={() => toggleTagFilter(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        
        <Button 
          variant="ghost"
          onClick={resetFilters}
          className="md:hidden"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};