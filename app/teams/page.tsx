"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, MessageSquare, Calendar, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Date;
}

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Design Team",
    description: "Responsible for product design and user experience",
    members: [
      {
        id: "1",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        role: "Team Lead",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
      },
      {
        id: "2",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "Designer",
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
      }
    ],
    createdAt: new Date()
  },
  {
    id: "2",
    name: "Development Team",
    description: "Frontend and backend development",
    members: [
      {
        id: "3",
        name: "Alex Chen",
        email: "alex@example.com",
        role: "Tech Lead",
        avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg"
      }
    ],
    createdAt: new Date()
  }
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Teams" 
        description="Collaborate and communicate with your team members"
        action={{
          label: "Create Team",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: () => {/* Add team creation logic */}
        }}
      />

      <div className="mb-6">
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTeams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {team.name}
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="members" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="members">
                        <Users className="h-4 w-4 mr-2" />
                        Members
                      </TabsTrigger>
                      <TabsTrigger value="chat">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="schedule">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="members" className="space-y-4">
                      <div className="flex flex-col gap-4 mt-4">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <img src={member.avatar} alt={member.name} />
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <Badge variant="secondary">{member.role}</Badge>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="chat">
                      <div className="h-[200px] flex items-center justify-center border rounded-md">
                        <p className="text-muted-foreground">Team chat coming soon</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="schedule">
                      <div className="h-[200px] flex items-center justify-center border rounded-md">
                        <p className="text-muted-foreground">Team schedule coming soon</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}