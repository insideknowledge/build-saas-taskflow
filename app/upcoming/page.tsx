"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { useTaskStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { TaskCard } from "@/components/features/task/task-card";
import { TaskDialog } from "@/components/features/task/task-dialog";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { format, isToday, isTomorrow, isThisWeek, addDays, compareAsc } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function UpcomingPage() {
  const { tasks } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };
  
  // Filter tasks that have due dates and are not completed
  const upcomingTasks = tasks
    .filter(task => 
      task.status !== "completed" && 
      task.status !== "archived" && 
      task.dueDate
    )
    .sort((a, b) => 
      compareAsc(new Date(a.dueDate!), new Date(b.dueDate!))
    );
  
  const todayTasks = upcomingTasks.filter(
    task => task.dueDate && isToday(new Date(task.dueDate))
  );
  
  const tomorrowTasks = upcomingTasks.filter(
    task => task.dueDate && isTomorrow(new Date(task.dueDate))
  );
  
  const thisWeekTasks = upcomingTasks.filter(
    task => 
      task.dueDate && 
      isThisWeek(new Date(task.dueDate)) && 
      !isToday(new Date(task.dueDate)) && 
      !isTomorrow(new Date(task.dueDate))
  );
  
  const laterTasks = upcomingTasks.filter(
    task => 
      task.dueDate && 
      new Date(task.dueDate) > addDays(new Date(), 7)
  );
  
  // Overdue tasks
  const overdueTasks = tasks.filter(
    task => 
      task.status !== "completed" && 
      task.status !== "archived" && 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      !isToday(new Date(task.dueDate))
  ).sort((a, b) => 
    compareAsc(new Date(a.dueDate!), new Date(b.dueDate!))
  );
  
  const renderTaskGroup = (groupTasks: Task[], emptyMessage: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <AnimatePresence>
        {groupTasks.length > 0 ? (
          groupTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask} 
            />
          ))
        ) : (
          <motion.div 
            className="col-span-full flex flex-col items-center justify-center p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              {emptyMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  return (
    <div>
      <PageHeader 
        title="Upcoming Tasks" 
        description="View and manage your upcoming tasks"
      />
      
      {overdueTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-red-500 mb-4">Overdue</h2>
          {renderTaskGroup(overdueTasks, "No overdue tasks. Great job!")}
        </div>
      )}
      
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="today">
            Today 
            <span className="ml-1 text-xs">{todayTasks.length > 0 ? `(${todayTasks.length})` : ''}</span>
          </TabsTrigger>
          <TabsTrigger value="tomorrow">
            Tomorrow
            <span className="ml-1 text-xs">{tomorrowTasks.length > 0 ? `(${tomorrowTasks.length})` : ''}</span>
          </TabsTrigger>
          <TabsTrigger value="this-week">
            This Week
            <span className="ml-1 text-xs">{thisWeekTasks.length > 0 ? `(${thisWeekTasks.length})` : ''}</span>
          </TabsTrigger>
          <TabsTrigger value="later">
            Later
            <span className="ml-1 text-xs">{laterTasks.length > 0 ? `(${laterTasks.length})` : ''}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          {renderTaskGroup(todayTasks, "No tasks due today. Enjoy your day!")}
        </TabsContent>
        
        <TabsContent value="tomorrow">
          {renderTaskGroup(tomorrowTasks, "No tasks due tomorrow. Plan ahead!")}
        </TabsContent>
        
        <TabsContent value="this-week">
          {renderTaskGroup(thisWeekTasks, "No tasks due this week. You're all caught up!")}
        </TabsContent>
        
        <TabsContent value="later">
          {renderTaskGroup(laterTasks, "No tasks scheduled for later. Time to plan ahead!")}
        </TabsContent>
      </Tabs>
      
      <TaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        task={selectedTask} 
      />
    </div>
  );
}