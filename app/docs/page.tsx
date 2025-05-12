"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/lib/types";
import { Plus, Search, FileText, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Editor } from "@/components/features/docs/editor";

export default function DocsPage() {
  const { documents, addDocument, updateDocument, deleteDocument, tags } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  const handleCreateDocument = () => {
    const newDoc = {
      title: "Untitled Document",
      content: "",
      tags: [],
    };
    
    addDocument(newDoc);
  };
  
  const handleUpdateDocument = (id: string, updates: Partial<Document>) => {
    updateDocument(id, updates);
  };
  
  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="h-[calc(100vh-2rem)]">
      <PageHeader 
        title="Documents" 
        description="Create and manage your notes and documentation"
        action={{
          label: "New Document",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: handleCreateDocument,
        }}
      />
      
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        <div className="col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="space-y-2">
            <AnimatePresence>
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <Card
                    className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                      selectedDoc?.id === doc.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                          if (selectedDoc?.id === doc.id) {
                            setSelectedDoc(null);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {doc.tags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        if (!tag) return null;
                        
                        return (
                          <Badge
                            key={tagId}
                            variant="outline"
                            style={{
                              backgroundColor: `${tag.color}20`,
                              color: tag.color,
                              borderColor: `${tag.color}40`,
                            }}
                          >
                            {tag.name}
                          </Badge>
                        );
                      })}
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Updated {format(new Date(doc.updatedAt), "PP")}
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {filteredDocs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No documents found</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your first document to get started
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="col-span-9">
          {selectedDoc ? (
            <Editor
              document={selectedDoc}
              onUpdate={handleUpdateDocument}
              availableTags={tags}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No document selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a document from the sidebar or create a new one
                </p>
                <Button
                  className="mt-4"
                  onClick={handleCreateDocument}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}