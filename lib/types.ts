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
  projectId?: string;
  goalId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: Status;
  priority: Priority;
  tags: string[];
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  teamMembers: string[];
  progress: number;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  startDate?: Date;
  dueDate?: Date;
  status: Status;
  priority: Priority;
  tags: string[];
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};

export type Milestone = {
  id: string;
  title: string;
  target: number;
  isCompleted: boolean;
};

export type AutomationTrigger = 
  | { type: 'task-created' }
  | { type: 'task-completed' }
  | { type: 'task-due-soon', days: number }
  | { type: 'priority-changed', priority: Priority }
  | { type: 'tag-added', tag: string }
  | { type: 'project-status-changed', status: Status }
  | { type: 'goal-progress', progress: number }
  | { type: 'focus-session-completed', duration: number };

export type AutomationAction = 
  | { type: 'create-task', title: string, description?: string, priority?: Priority, tags?: string[] }
  | { type: 'change-priority', priority: Priority }
  | { type: 'add-tag', tag: string }
  | { type: 'send-notification', message: string }
  | { type: 'update-goal-progress', goalId: string, progress: number }
  | { type: 'create-document', title: string, content: string, tags?: string[] }
  | { type: 'update-project-status', projectId: string, status: Status };

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
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
};