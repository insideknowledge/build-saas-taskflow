"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

// Default values for settings to ensure consistency between server and client
const defaultSettings = {
  notifications: true,
  taskCompletionSound: true,
  autoArchive: false
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark as client-side after first render
    setIsClient(true);
    
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('taskflow-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...defaultSettings, // Ensure all properties exist
          ...parsedSettings // Override with saved values
        }));
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('taskflow-settings', JSON.stringify(settings));
    }
  }, [settings, isClient]);
  
  const handleExportData = () => {
    const data = localStorage.getItem('task-automation-storage');
    if (!data) return;
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const updateSetting = (key: keyof typeof defaultSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Settings" 
        description="Configure your TaskFlow application"
      />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <motion.div 
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general application behavior and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-archive">Auto-archive completed tasks</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically archive tasks 7 days after completion
                    </p>
                  </div>
                  <Switch
                    id="auto-archive"
                    checked={settings.autoArchive}
                    onCheckedChange={(checked) => updateSetting('autoArchive', checked)}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-completion">Task completion sound</Label>
                    <p className="text-sm text-muted-foreground">
                      Play a sound when a task is marked as completed
                    </p>
                  </div>
                  <Switch
                    id="task-completion"
                    checked={settings.taskCompletionSound}
                    onCheckedChange={(checked) => updateSetting('taskCompletionSound', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <motion.div 
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for upcoming tasks and automation events
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting('notifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="data">
          <motion.div 
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export or clear your application data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Export Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a JSON file containing all your tasks, tags, and automations. 
                    You can use this for backup purposes.
                  </p>
                  <Button onClick={handleExportData}>Export Data</Button>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Clear All Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Remove all your data from the application and start fresh. 
                    This action cannot be undone.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Clear All Data</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your tasks, 
                          tags, automations, and settings.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData}>
                          Yes, clear all data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}