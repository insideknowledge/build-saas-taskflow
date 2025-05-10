"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { AutomationCard } from "@/components/features/automation/automation-card";
import { AutomationDialog } from "@/components/features/automation/automation-dialog";
import { Automation } from "@/lib/types";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AutomationsPage() {
  const { automations } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | undefined>();
  
  const handleAddAutomation = () => {
    setSelectedAutomation(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditAutomation = (automation: Automation) => {
    setSelectedAutomation(automation);
    setIsDialogOpen(true);
  };
  
  return (
    <div>
      <PageHeader 
        title="Automations" 
        description="Create rules to automate your tasks"
        action={{
          label: "Add Automation",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: handleAddAutomation,
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <AnimatePresence>
          {automations.map((automation) => (
            <AutomationCard 
              key={automation.id} 
              automation={automation} 
              onEdit={handleEditAutomation} 
            />
          ))}
          
          {automations.length === 0 && (
            <motion.div 
              className="col-span-full flex flex-col items-center justify-center p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium mb-2">No automations found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first automation to start streamlining your workflow.
              </p>
              <button
                className="text-primary hover:underline"
                onClick={handleAddAutomation}
              >
                + Add a new automation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AutomationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        automation={selectedAutomation} 
      />
    </div>
  );
}