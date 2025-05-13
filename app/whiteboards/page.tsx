"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WhiteboardDialog } from "@/components/features/whiteboard/whiteboard-dialog";
import { useTaskStore } from "@/lib/store";
import { format } from "date-fns";
import { Plus, Users, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhiteboardsPage() {
  const { whiteboards, tags } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateWhiteboard = () => {
    setSelectedWhiteboard(undefined);
    setIsDialogOpen(true);
  };

  const handleEditWhiteboard = (whiteboard: any) => {
    setSelectedWhiteboard(whiteboard);
    setIsDialogOpen(true);
  };

  const filteredWhiteboards = whiteboards?.filter(board =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div>
      <PageHeader 
        title="Whiteboards" 
        description="Turn your ideas into coordinated actions"
        action={{
          label: "New Whiteboard",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: handleCreateWhiteboard,
        }}
      />

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search whiteboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredWhiteboards.map((board) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
            >
              <Card className="group relative">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{board.title}</h3>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {board.collaborators.length}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {board.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {board.tags.map((tagId: string) => {
                      const tag = tags.find((t) => t.id === tagId);
                      if (!tag) return null;

                      return (
                        <Badge
                          key={tagId}
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            borderColor: `${tag.color}40`,
                          }}
                          variant="outline"
                        >
                          {tag.name}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Updated {format(new Date(board.updatedAt), "PP")}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditWhiteboard(board)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {/* Delete whiteboard */}}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}

          {filteredWhiteboards.length === 0 && (
            <motion.div
              className="col-span-full flex flex-col items-center justify-center p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-medium mb-2">No whiteboards found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first whiteboard to start collaborating
              </p>
              <Button onClick={handleCreateWhiteboard}>
                <Plus className="h-4 w-4 mr-2" />
                Create Whiteboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WhiteboardDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        whiteboard={selectedWhiteboard}
      />
    </div>
  );
}