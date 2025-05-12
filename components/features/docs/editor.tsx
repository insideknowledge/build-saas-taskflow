"use client";

import { FC, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Document, Tag } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Code, Undo, Redo, Link as LinkIcon, CheckSquare, Highlighter as HighlighterCircle } from 'lucide-react';

interface EditorProps {
  document: Document;
  onUpdate: (id: string, updates: Partial<Document>) => void;
  availableTags: Tag[];
}

export const Editor: FC<EditorProps> = ({ document, onUpdate, availableTags }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: document.content,
    onUpdate: ({ editor }) => {
      onUpdate(document.id, { content: editor.getHTML() });
    },
  });

  const toggleTag = useCallback((tagId: string) => {
    const newTags = document.tags.includes(tagId)
      ? document.tags.filter(id => id !== tagId)
      : [...document.tags, tagId];
    
    onUpdate(document.id, { tags: newTags });
  }, [document.tags, onUpdate, document.id]);

  if (!editor) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-4">
        <Input
          value={document.title}
          onChange={(e) => onUpdate(document.id, { title: e.target.value })}
          className="text-xl font-bold border-none px-0 focus-visible:ring-0"
          placeholder="Document Title"
        />
        
        <div className="flex flex-wrap gap-1">
          {availableTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={document.tags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              style={{
                backgroundColor: document.tags.includes(tag.id) ? tag.color : 'transparent',
                color: document.tags.includes(tag.id) ? 'white' : tag.color,
                borderColor: tag.color,
              }}
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-accent' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-accent' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-accent' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-accent' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'bg-accent' : ''}
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-accent' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-accent' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'bg-accent' : ''}
          >
            <HighlighterCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('Enter the URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={editor.isActive('link') ? 'bg-accent' : ''}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
};