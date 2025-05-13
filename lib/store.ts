import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Priority, Status, Tag, Automation, Document, Project, Goal, Whiteboard } from './types';

interface TaskState {
  tasks: Task[];
  tags: Tag[];
  automations: Automation[];
  documents: Document[];
  projects: Project[];
  goals: Goal[];
  whiteboards: Whiteboard[];
  filter: {
    status: Status | 'all';
    priority: Priority | 'all';
    tags: string[];
    searchQuery: string;
  };
  
  // Whiteboard actions
  addWhiteboard: (whiteboard: Omit<Whiteboard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWhiteboard: (id: string, updates: Partial<Omit<Whiteboard, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteWhiteboard: (id: string) => void;
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProject: (id: string) => void;
  completeProject: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  // Tag actions
  addTag: (name: string, color: string) => void;
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id'>>) => void;
  deleteTag: (id: string) => void;
  
  // Automation actions
  addAutomation: (automation: Omit<Automation, 'id' | 'createdAt'>) => void;
  updateAutomation: (id: string, updates: Partial<Omit<Automation, 'id' | 'createdAt'>>) => void;
  deleteAutomation: (id: string) => void;
  toggleAutomation: (id: string) => void;
  
  // Document actions
  addDocument: (doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteDocument: (id: string) => void;
  
  // Filter actions
  setStatusFilter: (status: Status | 'all') => void;
  setPriorityFilter: (priority: Priority | 'all') => void;
  toggleTagFilter: (tagId: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  
  // Helper functions
  processAutomations: (trigger: any, task: Task) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      tags: [
        { id: uuidv4(), name: 'Personal', color: '#3b82f6' },
        { id: uuidv4(), name: 'Work', color: '#f97316' },
        { id: uuidv4(), name: 'Home', color: '#14b8a6' },
      ],
      automations: [],
      documents: [],
      projects: [],
      goals: [],
      whiteboards: [],
      filter: {
        status: 'all',
        priority: 'all',
        tags: [],
        searchQuery: '',
      },

      // Whiteboard actions
      addWhiteboard: (whiteboard) => {
        const newWhiteboard: Whiteboard = {
          id: uuidv4(),
          ...whiteboard,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({ whiteboards: [...state.whiteboards, newWhiteboard] }));
      },
      
      updateWhiteboard: (id, updates) => {
        set((state) => ({
          whiteboards: state.whiteboards.map(whiteboard =>
            whiteboard.id === id
              ? { ...whiteboard, ...updates, updatedAt: new Date() }
              : whiteboard
          )
        }));
      },
      
      deleteWhiteboard: (id) => {
        set((state) => ({
          whiteboards: state.whiteboards.filter(whiteboard => whiteboard.id !== id)
        }));
      },
      
      // Goal actions
      addGoal: (goal) => {
        const newGoal: Goal = {
          id: uuidv4(),
          ...goal,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },
      
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map(goal =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date() }
              : goal
          )
        }));
      },
      
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter(goal => goal.id !== id),
          tasks: state.tasks.map(task => ({
            ...task,
            goalId: task.goalId === id ? undefined : task.goalId
          }))
        }));
      },
      
      completeGoal: (id) => {
        set((state) => ({
          goals: state.goals.map(goal =>
            goal.id === id
              ? {
                  ...goal,
                  status: 'completed',
                  completedAt: new Date(),
                  updatedAt: new Date(),
                  current: goal.target
                }
              : goal
          )
        }));
      },
      
      updateGoalProgress: (id, progress) => {
        set((state) => ({
          goals: state.goals.map(goal =>
            goal.id === id
              ? {
                  ...goal,
                  current: progress,
                  updatedAt: new Date(),
                  status: progress >= goal.target ? 'completed' : goal.status,
                  completedAt: progress >= goal.target ? new Date() : goal.completedAt
                }
              : goal
          )
        }));
      },
      
      toggleMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map(goal =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: goal.milestones.map(milestone =>
                    milestone.id === milestoneId
                      ? { ...milestone, isCompleted: !milestone.isCompleted }
                      : milestone
                  ),
                  updatedAt: new Date()
                }
              : goal
          )
        }));
      },
      
      // Project actions
      addProject: (project) => {
        const newProject: Project = {
          id: uuidv4(),
          ...project,
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({ projects: [...state.projects, newProject] }));
      },
      
      updateProject: (id, updates) => {
        set((state) => {
          const projectIndex = state.projects.findIndex(project => project.id === id);
          if (projectIndex === -1) return state;
          
          const updatedProject = {
            ...state.projects[projectIndex],
            ...updates,
            updatedAt: new Date(),
          };
          
          const newProjects = [...state.projects];
          newProjects[projectIndex] = updatedProject;
          
          return { projects: newProjects };
        });
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id),
          tasks: state.tasks.filter(task => task.projectId !== id),
          documents: state.documents.filter(doc => doc.projectId !== id),
        }));
      },
      
      completeProject: (id) => {
        set((state) => {
          const projectIndex = state.projects.findIndex(project => project.id === id);
          if (projectIndex === -1) return state;
          
          const updatedProject = {
            ...state.projects[projectIndex],
            status: 'completed' as Status,
            completedAt: new Date(),
            updatedAt: new Date(),
            progress: 100,
          };
          
          const newProjects = [...state.projects];
          newProjects[projectIndex] = updatedProject;
          
          const updatedTasks = state.tasks.map(task => 
            task.projectId === id
              ? {
                  ...task,
                  status: 'completed' as Status,
                  completedAt: new Date(),
                  updatedAt: new Date(),
                }
              : task
          );
          
          return { 
            projects: newProjects,
            tasks: updatedTasks,
          };
        });
      },
      
      // Task actions
      addTask: (task) => {
        const newTask: Task = {
          id: uuidv4(),
          ...task,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => {
          const newState = { tasks: [...state.tasks, newTask] };
          
          if (task.projectId) {
            const projectIndex = state.projects.findIndex(p => p.id === task.projectId);
            if (projectIndex !== -1) {
              const projectTasks = [...state.tasks, newTask].filter(t => t.projectId === task.projectId);
              const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
              const progress = (completedTasks / projectTasks.length) * 100;
              
              const updatedProjects = [...state.projects];
              updatedProjects[projectIndex] = {
                ...state.projects[projectIndex],
                progress,
                updatedAt: new Date(),
              };
              
              newState.projects = updatedProjects;
            }
          }
          
          return newState;
        });
        
        get().processAutomations({ type: 'task-created' }, newTask);
      },
      
      updateTask: (id, updates) => {
        set((state) => {
          const taskIndex = state.tasks.findIndex(task => task.id === id);
          if (taskIndex === -1) return state;
          
          const oldTask = state.tasks[taskIndex];
          const updatedTask = {
            ...oldTask,
            ...updates,
            updatedAt: new Date(),
          };
          
          const newTasks = [...state.tasks];
          newTasks[taskIndex] = updatedTask;
          
          const newState = { tasks: newTasks };
          
          if (oldTask.projectId) {
            const projectIndex = state.projects.findIndex(p => p.id === oldTask.projectId);
            if (projectIndex !== -1) {
              const projectTasks = newTasks.filter(t => t.projectId === oldTask.projectId);
              const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
              const progress = (completedTasks / projectTasks.length) * 100;
              
              const updatedProjects = [...state.projects];
              updatedProjects[projectIndex] = {
                ...state.projects[projectIndex],
                progress,
                updatedAt: new Date(),
              };
              
              newState.projects = updatedProjects;
            }
          }
          
          if (updates.priority && updates.priority !== oldTask.priority) {
            get().processAutomations(
              { type: 'priority-changed', priority: updates.priority },
              updatedTask
            );
          }
          
          if (updates.tags) {
            const newTags = updates.tags.filter(tag => !oldTask.tags.includes(tag));
            newTags.forEach(tag => {
              get().processAutomations({ type: 'tag-added', tag }, updatedTask);
            });
          }
          
          return newState;
        });
      },
      
      deleteTask: (id) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === id);
          if (!task) return { tasks: state.tasks.filter(t => t.id !== id) };
          
          const newState = { tasks: state.tasks.filter(t => t.id !== id) };
          
          if (task.projectId) {
            const projectIndex = state.projects.findIndex(p => p.id === task.projectId);
            if (projectIndex !== -1) {
              const projectTasks = state.tasks
                .filter(t => t.id !== id)
                .filter(t => t.projectId === task.projectId);
              
              const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
              const progress = projectTasks.length ? (completedTasks / projectTasks.length) * 100 : 0;
              
              const updatedProjects = [...state.projects];
              updatedProjects[projectIndex] = {
                ...state.projects[projectIndex],
                progress,
                updatedAt: new Date(),
              };
              
              newState.projects = updatedProjects;
            }
          }
          
          return newState;
        });
      },
      
      completeTask: (id) => {
        set((state) => {
          const taskIndex = state.tasks.findIndex(task => task.id === id);
          if (taskIndex === -1) return state;
          
          const updatedTask = {
            ...state.tasks[taskIndex],
            status: 'completed' as Status,
            completedAt: new Date(),
            updatedAt: new Date(),
          };
          
          const newTasks = [...state.tasks];
          newTasks[taskIndex] = updatedTask;
          
          const newState = { tasks: newTasks };
          
          if (updatedTask.projectId) {
            const projectIndex = state.projects.findIndex(p => p.id === updatedTask.projectId);
            if (projectIndex !== -1) {
              const projectTasks = newTasks.filter(t => t.projectId === updatedTask.projectId);
              const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
              const progress = (com