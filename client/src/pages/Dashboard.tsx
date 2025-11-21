import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { Card } from "@/components/ui/card";
import { Sparkles, CheckCircle2, Calendar } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Task, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";

interface DashboardProps {
  userName?: string;
  user?: User;
}

export default function Dashboard({ userName = "Student", user }: DashboardProps) {
  const { toast } = useToast();
  
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  // Check for unauthorized errors
  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      await apiRequest("PATCH", `/api/tasks/${id}`, { completed: !completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async (task: any) => {
      const response = await apiRequest("POST", "/api/tasks", task);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      const isRecurring = data?.tasks && data?.count;
      toast({
        title: "Success",
        description: isRecurring 
          ? `Created ${data.count} recurring tasks successfully!`
          : "Task created successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      toggleTaskMutation.mutate({ id, completed: task.completed });
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleAddTask = (taskData: any) => {
    addTaskMutation.mutate(taskData);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const today = format(new Date(), "EEEE, MMMM d");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-chart-3/5 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-panel">
      <DashboardHeader user={currentUser || user} userName={userName} />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-primary to-chart-3 text-primary-foreground rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Good day, {userName}!</h1>
          </div>
          <p className="text-primary-foreground/90">{today}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{completedCount}/{tasks.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">{tasks.filter((t) => !t.completed).length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-chart-3/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Tasks</h2>
              <AddTaskDialog onAdd={handleAddTask} />
            </div>
            {tasks.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first task or ask Lilo to help you get started!
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    time={task.time}
                    notes={task.notes || undefined}
                    repeat={task.repeat as any}
                    priority={task.priority as any}
                    completed={task.completed}
                    onToggle={handleToggleTask}
                    onEdit={(id) => console.log("Edit task:", id)}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Tips & Insights</h2>
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-chart-3/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Lilo's Tip</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Try breaking down large tasks into smaller, manageable chunks. It helps maintain momentum and track progress!
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-chart-2/5 to-chart-3/5 border-chart-2/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-chart-2" />
                <h3 className="font-semibold">Quick Tip</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use the chat with Lilo to create tasks naturally. For example: "Remind me to study DBMS every Sunday at 8 PM"
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
