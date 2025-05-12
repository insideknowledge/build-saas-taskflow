import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Priority, Status, Tag, Automation, Document } from './types';

interface TaskState {
  tasks: Task[];
  tags: Tag[];
  automations: Automation[];
  documents: Document[];
  filter: {
    status: Status | 'all';
    priority: Priority | 'all';
    tags: string[];
    searchQuery: string;
  };
  
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
      filter: {
        status: 'all',
        priority: 'all',
        tags: [],
        searchQuery: '',
      },
      
      // Task actions
      addTask: (task) => {
        const newTask: Task = {
          id: uuidv4(),
          ...task,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({ 
          tasks: [...state.tasks, newTask] 
        }));
        
        // Check automations with task-created trigger
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
          
          // Process automations for priority changes
          if (updates.priority && updates.priority !== oldTask.priority) {
            get().processAutomations(
              { type: 'priority-changed', priority: updates.priority },
              updatedTask
            );
          }
          
          // Process automations for tag additions
          if (updates.tags) {
            const newTags = updates.tags.filter(tag => !oldTask.tags.includes(tag));
            newTags.forEach(tag => {
              get().processAutomations({ type: 'tag-added', tag }, updatedTask);
            });
          }
          
          return { tasks: newTasks };
        });
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
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
          
          // Process automations for task completion
          get().processAutomations({ type: 'task-completed' }, updatedTask);
          
          return { tasks: newTasks };
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
            
            // Check additional conditions for specific trigger types
            switch (trigger.type) {
              case 'priority-changed':
                return automation.trigger.priority === trigger.priority;
              case 'tag-added':
                return automation.trigger.tag === trigger.tag;
              case 'task-due-soon':
                if (!task.dueDate) return false;
                const daysUntilDue = Math.ceil(
                  (task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysUntilDue <= automation.trigger.days;
              default:
                return true;
            }
          })
          .forEach(automation => {
            // Execute action
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
                // In a real app, we'd integrate with a notification system
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
    // Filter by status
    if (filter.status !== 'all' && task.status !== filter.status) {
      return false;
    }
    
    // Filter by priority
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false;
    }
    
    // Filter by tags
    if (filter.tags.length > 0 && !filter.tags.some(tagId => task.tags.includes(tagId))) {
      return false;
    }
    
    // Filter by search query
    if (filter.searchQuery && !task.title.toLowerCase().includes(filter.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};