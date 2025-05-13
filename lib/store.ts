import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Priority, Status, Tag, Automation, Document, Project, Goal } from './types';

interface TaskState {
  tasks: Task[];
  tags: Tag[];
  automations: Automation[];
  documents: Document[];
  projects: Project[];
  goals: Goal[];
  filter: {
    status: Status | 'all';
    priority: Priority | 'all';
    tags: string[];
    searchQuery: string;
  };
  
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
      filter: {
        status: 'all',
        priority: 'all',
        tags: [],
        searchQuery: '',
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
          
          get().processAutomations({ type: 'task-completed' }, updatedTask);
          
          return newState;
        });
      },
      
      // Tag actions
      addTag: (name, color) => {
        set((state) => ({
          tags: [...state.tags, { id: uuidv4(), name, color }]
        }));
      },
      
      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map(tag => 
            tag.id === id ? { ...tag, ...updates } : tag
          )
        }));
      },
      
      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter(tag => tag.id !== id),
          tasks: state.tasks.map(task => ({
            ...task,
            tags: task.tags.filter(tagId => tagId !== id),
            updatedAt: new Date()
          })),
          projects: state.projects.map(project => ({
            ...project,
            tags: project.tags.filter(tagId => tagId !== id),
            updatedAt: new Date()
          }))
        }));
      },
      
      // Automation actions
      addAutomation: (automation) => {
        set((state) => ({
          automations: [
            ...state.automations, 
            { ...automation, id: uuidv4(), createdAt: new Date() }
          ]
        }));
      },
      
      updateAutomation: (id, updates) => {
        set((state) => ({
          automations: state.automations.map(automation => 
            automation.id === id ? { ...automation, ...updates } : automation
          )
        }));
      },
      
      deleteAutomation: (id) => {
        set((state) => ({
          automations: state.automations.filter(automation => automation.id !== id)
        }));
      },
      
      toggleAutomation: (id) => {
        set((state) => ({
          automations: state.automations.map(automation => 
            automation.id === id ? { ...automation, active: !automation.active } : automation
          )
        }));
      },
      
      // Document actions
      addDocument: (doc) => {
        set((state) => ({
          documents: [
            ...state.documents,
            {
              id: uuidv4(),
              ...doc,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ]
        }));
      },
      
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map(doc =>
            doc.id === id
              ? { ...doc, ...updates, updatedAt: new Date() }
              : doc
          )
        }));
      },
      
      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter(doc => doc.id !== id)
        }));
      },
      
      // Filter actions
      setStatusFilter: (status) => {
        set((state) => ({
          filter: { ...state.filter, status }
        }));
      },
      
      setPriorityFilter: (priority) => {
        set((state) => ({
          filter: { ...state.filter, priority }
        }));
      },
      
      toggleTagFilter: (tagId) => {
        set((state) => {
          const currentTags = state.filter.tags;
          const newTags = currentTags.includes(tagId)
            ? currentTags.filter(id => id !== tagId)
            : [...currentTags, tagId];
            
          return {
            filter: { ...state.filter, tags: newTags }
          };
        });
      },
      
      setSearchQuery: (searchQuery) => {
        set((state) => ({
          filter: { ...state.filter, searchQuery }
        }));
      },
      
      resetFilters: () => {
        set((state) => ({
          filter: {
            status: 'all',
            priority: 'all',
            tags: [],
            searchQuery: '',
          }
        }));
      },
      
      // Helper function to process automations
      processAutomations: (trigger: any, task: Task) => {
        const { automations, tasks } = get();
        
        automations
          .filter(automation => automation.active)
          .filter(automation => {
            if (automation.trigger.type !== trigger.type) return false;
            
            switch (trigger.type) {
              case 'priority-changed':
                return automation.trigger.priority === trigger.priority;
              case 'tag-added':
                return automation.trigger.tag === trigger.tag;
              case 'task-due-soon':
                if (!task.dueDate) return false;
                const daysUntilDue = Math.ceil(
                  (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysUntilDue <= automation.trigger.days;
              default:
                return true;
            }
          })
          .forEach(automation => {
            switch (automation.action.type) {
              case 'create-task':
                get().addTask({
                  title: automation.action.title,
                  description: automation.action.description || '',
                  priority: automation.action.priority || 'medium',
                  status: 'todo',
                  tags: automation.action.tags || [],
                });
                break;
                
              case 'change-priority':
                get().updateTask(task.id, {
                  priority: automation.action.priority
                });
                break;
                
              case 'add-tag':
                if (!task.tags.includes(automation.action.tag)) {
                  get().updateTask(task.id, {
                    tags: [...task.tags, automation.action.tag]
                  });
                }
                break;
                
              case 'send-notification':
                console.log(`Notification: ${automation.action.message}`);
                break;
            }
          });
      }
    }),
    {
      name: 'task-automation-storage',
    }
  )
);

export const useFilteredTasks = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const filter = useTaskStore((state) => state.filter);
  
  return tasks.filter(task => {
    if (filter.status !== 'all' && task.status !== filter.status) {
      return false;
    }
    
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false;
    }
    
    if (filter.tags.length > 0 && !filter.tags.some(tagId => task.tags.includes(tagId))) {
      return false;
    }
    
    if (filter.searchQuery && !task.title.toLowerCase().includes(filter.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};

export const useProjectTasks = (projectId: string) => {
  const tasks = useTaskStore((state) => state.tasks);
  return tasks.filter(task => task.projectId === projectId);
};

export const useGoalTasks = (goalId: string) => {
  const tasks = useTaskStore((state) => state.tasks);
  return tasks.filter(task => task.goalId === goalId);
};