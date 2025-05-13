"use client";

import { FC, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  Tag, 
  Settings, 
  Zap,
  Timer,
  FileText,
  PanelLeft,
  ChevronRight,
  ChevronLeft,
  FolderKanban,
  Target,
  Users,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: <FolderKanban className="h-5 w-5" />,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    title: "Teams",
    href: "/teams",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Upcoming",
    href: "/upcoming",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Focus",
    href: "/focus",
    icon: <Timer className="h-5 w-5" />,
  },
  {
    title: "Docs",
    href: "/docs",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Whiteboards",
    href: "/whiteboards",
    icon: <Pencil className="h-5 w-5" />,
  },
  {
    title: "Tags",
    href: "/tags",
    icon: <Tag className="h-5 w-5" />,
  },
  {
    title: "Automations",
    href: "/automations",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hoverSound, setHoverSound] = useState<HTMLAudioElement | null>(null);
  const [clickSound, setClickSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    setHoverSound(new Audio(''));
    setClickSound(new Audio('https://www.soundjay.com/buttons/sounds/button-41.mp3'));

    // Cleanup function
    return () => {
      if (hoverSound) {
        hoverSound.pause();
        hoverSound.currentTime = 0;
      }
      if (clickSound) {
        clickSound.pause();
        clickSound.currentTime = 0;
      }
    };
  }, []);

  const playHoverSound = () => {
    if (hoverSound) {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const playClickSound = () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(e => console.log("Audio play failed:", e));
    }
  };
  
  return (
    <div className={cn("relative flex flex-col", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-4 translate-x-1/2 z-10 hidden md:flex"
        onClick={() => {
          playClickSound();
          setCollapsed(!collapsed);
        }}
        onMouseEnter={playHoverSound}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    
      <motion.div 
        className={cn(
          "flex h-screen border-r bg-background",
          collapsed ? "w-16" : "w-64"
        )}
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex flex-col w-full">
          <div className="px-4 py-6">
            <motion.div 
              className="flex items-center gap-2"
              initial={false}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="h-6 w-6 text-primary" />
              <span className={cn(
                "font-bold text-xl transition-opacity", 
                collapsed ? "opacity-0" : "opacity-100"
              )}>
                TaskFlow
              </span>
            </motion.div>
          </div>
          <ScrollArea className="flex-1">
            <nav className="grid gap-1 px-2">
              {sidebarLinks.map((link) => (
                <motion.div 
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.1 }}
                >
                  <Link 
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                    onMouseEnter={playHoverSound}
                    onClick={playClickSound}
                  >
                    {link.icon}
                    <span className={cn(
                      "transition-opacity",
                      collapsed ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100"
                    )}>
                      {link.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto">
            <Separator />
            <div className="p-4">
              <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-xs text-muted-foreground transition-opacity",
                  collapsed ? "hidden" : "block"
                )}
              >
                <p>TaskFlow</p>
                <p>Version 3.0.0</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};