"use client";

import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  action,
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div 
      className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        {action && (
          <Button onClick={action.onClick}>
            {action.icon || <Plus className="mr-2 h-4 w-4" />}
            {action.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
};