"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { useFilteredTasks } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { TaskCard } from "@/components/features/task/task-card";
import { TaskDialog } from "@/components/features/task/task-dialog";
import { TaskFilter } from "@/components/features/task/task-filter";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TasksPage() {
  const tasks = useFilteredTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  
  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };
  
  return (
    <div>
      <PageHeader 
        title="Tasks" 
        description="Manage and organize your tasks"
        action={{
          label: "Add Task",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: handleAddTask,
        }}
      />
      
      <TaskFilter />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask} 
            />
          ))}
          
          {tasks.length === 0 && (
            <motion.div 
              className="col-span-full flex flex-col items-center justify-center p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or create a new task.
              </p>
              <button
                className="text-primary hover:underline"
                onClick={handleAddTask}
              >
                + Add a new task
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <TaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        task={selectedTask} 
      />
    </div>
  );
}