"use client";

import { FC } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Automation, AutomationTrigger, AutomationAction } from "@/lib/types";
import { useTaskStore } from "@/lib/store";
import { Trash2, Edit, Zap } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface AutomationCardProps {
  automation: Automation;
  onEdit: (automation: Automation) => void;
}

const getTriggerDescription = (trigger: AutomationTrigger, tags: any[]): string => {
  switch (trigger.type) {
    case 'task-created':
      return 'When a task is created';
    case 'task-completed':
      return 'When a task is completed';
    case 'task-due-soon':
      return `When a task is due within ${trigger.days} day${trigger.days !== 1 ? 's' : ''}`;
    case 'priority-changed':
      return `When a task's priority is changed to ${trigger.priority}`;
    case 'tag-added':
      const tag = tags.find(t => t.id === trigger.tag);
      return `When the "${tag?.name || 'Unknown'}" tag is added to a task`;
    default:
      return 'Unknown trigger';
  }
};

const getActionDescription = (action: AutomationAction, tags: any[]): string => {
  switch (action.type) {
    case 'create-task':
      return `Create a new task "${action.title}"`;
    case 'change-priority':
      return `Change task priority to ${action.priority}`;
    case 'add-tag':
      const tag = tags.find(t => t.id === action.tag);
      return `Add the "${tag?.name || 'Unknown'}" tag to the task`;
    case 'send-notification':
      return `Send notification: "${action.message}"`;
    default:
      return 'Unknown action';
  }
};

export const AutomationCard: FC<AutomationCardProps> = ({ automation, onEdit }) => {
  const { toggleAutomation, deleteAutomation, tags } = useTaskStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Zap className={`h-5 w-5 ${automation.active ? 'text-yellow-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-medium">{automation.name}</h3>
            </div>
            <Switch
              checked={automation.active}
              onCheckedChange={() => toggleAutomation(automation.id)}
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Trigger
              </Badge>
              <p className="text-sm mt-1">
                {getTriggerDescription(automation.trigger, tags)}
              </p>
            </div>
            
            <div>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Action
              </Badge>
              <p className="text-sm mt-1">
                {getActionDescription(automation.action, tags)}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="text-xs text-muted-foreground">
            Created: {format(new Date(automation.createdAt), "PP")}
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(automation)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => deleteAutomation(automation.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};