import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical, Repeat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  id: string;
  title: string;
  time: string;
  completed?: boolean;
  notes?: string;
  repeat?: "one-time" | "daily" | "weekly" | "monthly" | "yearly";
  priority?: "high" | "medium" | "low";
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({
  id,
  title,
  time,
  completed = false,
  notes,
  repeat = "one-time",
  priority = "medium",
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const priorityColors = {
    high: "border-l-destructive",
    medium: "border-l-chart-2",
    low: "border-l-muted-foreground",
  };

  return (
    <Card className={`p-4 border-l-4 ${priorityColors[priority]} hover-elevate`} data-testid={`task-card-${id}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={completed}
          onCheckedChange={() => onToggle?.(id)}
          className="mt-1"
          data-testid={`checkbox-task-${id}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium ${completed ? "line-through opacity-60" : ""}`}>
              {title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" data-testid={`button-task-menu-${id}`}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {notes && <p className="text-sm text-muted-foreground mt-1">{notes}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {time}
            </Badge>
            {repeat !== "one-time" && (
              <Badge variant="outline" className="gap-1">
                <Repeat className="h-3 w-3" />
                {repeat}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
