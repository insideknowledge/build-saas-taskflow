"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/features/project/project-card";
import { ProjectDialog } from "@/components/features/project/project-dialog";
import { Project } from "@/lib/types";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
  const { projects, tags } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleAddProject = () => {
    setSelectedProject(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tagId => project.tags.includes(tagId));
    return matchesSearch && matchesTags;
  });
  
  return (
    <div>
      <PageHeader 
        title="Projects" 
        description="Manage and organize your projects"
        action={{
          label: "New Project",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: handleAddProject,
        }}
      />
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
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
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={handleEditProject} 
            />
          ))}
          
          {filteredProjects.length === 0 && (
            <motion.div 
              className="col-span-full flex flex-col items-center justify-center p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to get started
              </p>
              <Button
                onClick={handleAddProject}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        project={selectedProject} 
      />
    </div>
  );
}