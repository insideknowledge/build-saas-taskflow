"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { GoalCard } from "@/components/features/goal/goal-card";
import { GoalDialog } from "@/components/features/goal/goal-dialog";
import { Goal } from "@/lib/types";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GoalsPage() {
  const { goals, tags } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleAddGoal = () => {
    setSelectedGoal(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tagId => goal.tags.includes(tagId));
    return matchesSearch && matchesTags;
  });
  
  return (
    <div>
      <PageHeader 
        title="Goals" 
        description="Track and achieve your goals"
        action={{
          label: "New Goal",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: handleAddGoal,
        }}
      />
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              setSelectedTags([]);
            }}
          >
            Reset
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              style={{
                backgroundColor: selectedTags.includes(tag.id) ? tag.color : "transparent",
                color: selectedTags.includes(tag.id) ? "white" : tag.color,
                borderColor: tag.color,
              }}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={handleEditGoal} 
            />
          ))}
          
          {filteredGoals.length === 0 && (
            <motion.div 
              className="col-span-full flex flex-col items-center justify-center p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium mb-2">No goals found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first goal to start tracking your progress
              </p>
              <Button
                onClick={handleAddGoal}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <GoalDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        goal={selectedGoal} 
      />
    </div>
  );
}