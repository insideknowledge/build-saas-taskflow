export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Status = 'todo' | 'in-progress' | 'completed' | 'archived';

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};

export type AutomationTrigger = 
  | { type: 'task-created' }
  | { type: 'task-completed' }
  | { type: 'task-due-soon', days: number }
  | { type: 'priority-changed', priority: Priority }
  | { type: 'tag-added', tag: string };

export type AutomationAction = 
  | { type: 'create-task', title: string, description?: string, priority?: Priority, tags?: string[] }
  | { type: 'change-priority', priority: Priority }
  | { type: 'add-tag', tag: string }
  | { type: 'send-notification', message: string };

export type Automation = {
  id: string;
  name: string;
  active: boolean;
  trigger: AutomationTrigger;
  action: AutomationAction;
  createdAt: Date;
};

export type Document = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};