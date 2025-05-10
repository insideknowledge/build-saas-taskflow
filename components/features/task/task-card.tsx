"use client";

import { FC } from "react";
import { Task, Priority, Status } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2, Edit, CheckCircle2 } from "lucide-react";
import { useTaskStore } from "@/lib/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityClasses: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusClasses: Record<Status, string> = {
  todo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  archived: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

export const TaskCard: FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, completeTask, tags } = useTaskStore();
  
  const isCompleted = task.status === "completed";
  
  const handleComplete = () => {
    completeTask(task.id);
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md", 
        isCompleted ? "opacity-70" : "opacity-100"
      )}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn(
              "text-lg font-medium line-clamp-2",
              isCompleted && "line-through opacity-70"
            )}>
              {task.title}
            </h3>
            <div className="flex gap-1">
              <Badge className={priorityClasses[task.priority]}>
                {task.priority}
              </Badge>
              <Badge className={statusClasses[task.status]}>
                {task.status}
              </Badge>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;
              
              return (
                <Badge 
                  key={tagId} 
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    borderColor: `${tag.color}40`,
                  }}
                  variant="outline"
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
          
          {task.dueDate && (
            <div className="text-xs text-muted-foreground mt-3">
              Due: {format(new Date(task.dueDate), "PPP")}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="text-xs text-muted-foreground">
            Created: {format(new Date(task.createdAt), "PP")}
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleComplete}
              disabled={isCompleted}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};