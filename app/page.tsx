"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { useTaskStore, useFilteredTasks } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  PieChart,
  Pie
} from "recharts";
import { format, subDays, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { TaskDialog } from "@/components/features/task/task-dialog";
import { Plus, CheckCircle2, Clock, AlertCircle, PieChart as PieChartIcon } from "lucide-react";

export default function Dashboard() {
  const { tasks, tags } = useTaskStore();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const overdueTasks = tasks.filter(task => 
    task.status !== "completed" && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  ).length;
  const upcomingTasks = tasks.filter(task => 
    task.status !== "completed" && 
    task.dueDate && 
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate) < new Date(new Date().setDate(new Date().getDate() + 7))
  ).length;
  
  // Calculate completion rate
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Generate data for the tasks created chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, "MMM dd"),
      created: tasks.filter(task => isSameDay(new Date(task.createdAt), date)).length,
      completed: tasks.filter(task => task.completedAt && isSameDay(new Date(task.completedAt), date)).length,
    };
  }).reverse();
  
  // Generate data for priority distribution
  const priorityData = [
    { name: "Low", value: tasks.filter(task => task.priority === "low").length },
    { name: "Medium", value: tasks.filter(task => task.priority === "medium").length },
    { name: "High", value: tasks.filter(task => task.priority === "high").length },
    { name: "Urgent", value: tasks.filter(task => task.priority === "urgent").length },
  ];
  
  // Generate data for tag distribution
  const tagData = tags.map(tag => ({
    name: tag.name,
    value: tasks.filter(task => task.tags.includes(tag.id)).length,
    color: tag.color,
  }));
  
  // Top task categories
  const topCategories = [...tagData].sort((a, b) => b.value - a.value).slice(0, 5);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const MotionCard = motion(Card);
  
  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Your task overview and statistics"
        action={{
          label: "New Task",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: () => setTaskDialogOpen(true),
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MotionCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </MotionCard>
        
        <MotionCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}% of total tasks
            </p>
          </CardContent>
        </MotionCard>
        
        <MotionCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Due in the next 7 days
            </p>
          </CardContent>
        </MotionCard>
        
        <MotionCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks past their due date
            </p>
          </CardContent>
        </MotionCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MotionCard 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <CardHeader>
            <CardTitle>Task Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={last7Days}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="2"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MotionCard>
        
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MotionCard>
        
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topCategories}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name"
                    width={80}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MotionCard>
      </div>
      
      <TaskDialog 
        open={taskDialogOpen} 
        onOpenChange={setTaskDialogOpen} 
      />
    </div>
  );
}