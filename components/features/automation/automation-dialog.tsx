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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Automation, AutomationTrigger, AutomationAction, Priority } from "@/lib/types";
import { useTaskStore } from "@/lib/store";

interface AutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automation?: Automation;
}

const defaultAutomation: Omit<Automation, 'id' | 'createdAt'> = {
  name: "",
  active: true,
  trigger: { type: 'task-created' },
  action: { type: 'send-notification', message: '' },
};

export const AutomationDialog: FC<AutomationDialogProps> = ({
  open,
  onOpenChange,
  automation,
}) => {
  const { addAutomation, updateAutomation, tags } = useTaskStore();
  const [formData, setFormData] = useState<Omit<Automation, 'id' | 'createdAt'>>(defaultAutomation);
  const [triggerType, setTriggerType] = useState<string>('task-created');
  const [actionType, setActionType] = useState<string>('send-notification');
  
  useEffect(() => {
    if (automation) {
      setFormData({
        name: automation.name,
        active: automation.active,
        trigger: automation.trigger,
        action: automation.action,
      });
      setTriggerType(automation.trigger.type);
      setActionType(automation.action.type);
    } else {
      setFormData(defaultAutomation);
      setTriggerType('task-created');
      setActionType('send-notification');
    }
  }, [automation, open]);
  
  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    if (automation) {
      updateAutomation(automation.id, formData);
    } else {
      addAutomation(formData);
    }
    
    onOpenChange(false);
  };
  
  const updateTrigger = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        [key]: value,
      },
    }));
  };
  
  const updateAction = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      action: {
        ...prev.action,
        [key]: value,
      },
    }));
  };
  
  const renderTriggerFields = () => {
    switch (triggerType) {
      case 'task-due-soon':
        return (
          <div className="grid gap-2">
            <Label htmlFor="days">Days before due date</Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="30"
              value={(formData.trigger as any).days || 1}
              onChange={(e) => updateTrigger('days', Number(e.target.value))}
            />
          </div>
        );
      case 'priority-changed':
        return (
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={(formData.trigger as any).priority || 'high'}
              onValueChange={(value) => updateTrigger('priority', value)}
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
        );
      case 'tag-added':
        return (
          <div className="grid gap-2">
            <Label>Select Tag</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={(formData.trigger as any).tag === tag.id ? "default" : "outline"}
                  style={{
                    backgroundColor: (formData.trigger as any).tag === tag.id ? tag.color : "transparent",
                    color: (formData.trigger as any).tag === tag.id ? "white" : tag.color,
                    borderColor: tag.color,
                  }}
                  className="cursor-pointer"
                  onClick={() => updateTrigger('tag', tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderActionFields = () => {
    switch (actionType) {
      case 'create-task':
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={(formData.action as any).title || ''}
                onChange={(e) => updateAction('title', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={(formData.action as any).description || ''}
                onChange={(e) => updateAction('description', e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority (Optional)</Label>
              <Select
                value={(formData.action as any).priority || ''}
                onValueChange={(value) => updateAction('priority', value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'change-priority':
        return (
          <div className="grid gap-2">
            <Label htmlFor="priority">Change to Priority</Label>
            <Select
              value={(formData.action as any).priority || 'high'}
              onValueChange={(value) => updateAction('priority', value)}
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
        );
      case 'add-tag':
        return (
          <div className="grid gap-2">
            <Label>Add Tag</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={(formData.action as any).tag === tag.id ? "default" : "outline"}
                  style={{
                    backgroundColor: (formData.action as any).tag === tag.id ? tag.color : "transparent",
                    color: (formData.action as any).tag === tag.id ? "white" : tag.color,
                    borderColor: tag.color,
                  }}
                  className="cursor-pointer"
                  onClick={() => updateAction('tag', tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 'send-notification':
        return (
          <div className="grid gap-2">
            <Label htmlFor="message">Notification Message</Label>
            <Textarea
              id="message"
              value={(formData.action as any).message || ''}
              onChange={(e) => updateAction('message', e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  const handleTriggerTypeChange = (value: string) => {
    setTriggerType(value);
    
    // Set default values for each trigger type
    switch (value) {
      case 'task-created':
        setFormData(prev => ({
          ...prev,
          trigger: { type: 'task-created' },
        }));
        break;
      case 'task-completed':
        setFormData(prev => ({
          ...prev,
          trigger: { type: 'task-completed' },
        }));
        break;
      case 'task-due-soon':
        setFormData(prev => ({
          ...prev,
          trigger: { type: 'task-due-soon', days: 1 },
        }));
        break;
      case 'priority-changed':
        setFormData(prev => ({
          ...prev,
          trigger: { type: 'priority-changed', priority: 'high' },
        }));
        break;
      case 'tag-added':
        setFormData(prev => ({
          ...prev,
          trigger: { type: 'tag-added', tag: tags[0]?.id || '' },
        }));
        break;
    }
  };
  
  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    
    // Set default values for each action type
    switch (value) {
      case 'create-task':
        setFormData(prev => ({
          ...prev,
          action: { type: 'create-task', title: 'New Automated Task' },
        }));
        break;
      case 'change-priority':
        setFormData(prev => ({
          ...prev,
          action: { type: 'change-priority', priority: 'high' },
        }));
        break;
      case 'add-tag':
        setFormData(prev => ({
          ...prev,
          action: { type: 'add-tag', tag: tags[0]?.id || '' },
        }));
        break;
      case 'send-notification':
        setFormData(prev => ({
          ...prev,
          action: { type: 'send-notification', message: 'Task requires your attention' },
        }));
        break;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>{automation ? "Edit Automation" : "Create Automation"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Automation Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name your automation"
            />
          </div>
          
          <Tabs defaultValue="trigger" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trigger">Trigger</TabsTrigger>
              <TabsTrigger value="action">Action</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trigger" className="space-y-4 pt-2">
              <div className="grid gap-2">
                <Label htmlFor="triggerType">Trigger Type</Label>
                <Select
                  value={triggerType}
                  onValueChange={handleTriggerTypeChange}
                >
                  <SelectTrigger id="triggerType">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task-created">When a task is created</SelectItem>
                    <SelectItem value="task-completed">When a task is completed</SelectItem>
                    <SelectItem value="task-due-soon">When a task is due soon</SelectItem>
                    <SelectItem value="priority-changed">When priority changes</SelectItem>
                    <SelectItem value="tag-added">When a tag is added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {renderTriggerFields()}
            </TabsContent>
            
            <TabsContent value="action" className="space-y-4 pt-2">
              <div className="grid gap-2">
                <Label htmlFor="actionType">Action Type</Label>
                <Select
                  value={actionType}
                  onValueChange={handleActionTypeChange}
                >
                  <SelectTrigger id="actionType">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create-task">Create a new task</SelectItem>
                    <SelectItem value="change-priority">Change priority</SelectItem>
                    <SelectItem value="add-tag">Add a tag</SelectItem>
                    <SelectItem value="send-notification">Send notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {renderActionFields()}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {automation ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};