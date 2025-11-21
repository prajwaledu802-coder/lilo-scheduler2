import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTaskDialogProps {
  onAdd?: (task: {
    title: string;
    time: string;
    date: string;
    notes: string;
    repeat: string;
    priority: string;
    generateRecurring?: boolean;
  }) => void;
}

export function AddTaskDialog({ onAdd }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [repeat, setRepeat] = useState("one-time");
  const [priority, setPriority] = useState("medium");
  const [generateRecurring, setGenerateRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd?.({ 
      title, 
      time, 
      date, 
      notes, 
      repeat, 
      priority,
      generateRecurring: repeat !== "one-time" && generateRecurring
    });
    setTitle("");
    setTime("");
    setDate("");
    setNotes("");
    setRepeat("one-time");
    setPriority("medium");
    setGenerateRecurring(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-add-task">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task with schedule and reminders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., DBMS Revision"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                data-testid="input-task-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  data-testid="input-task-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  data-testid="input-task-time"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="repeat">Repeat</Label>
                <Select value={repeat} onValueChange={setRepeat}>
                  <SelectTrigger data-testid="select-task-repeat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger data-testid="select-task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="textarea-task-notes"
              />
            </div>
            {repeat !== "one-time" && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                <Checkbox
                  id="recurring"
                  checked={generateRecurring}
                  onCheckedChange={(checked) => setGenerateRecurring(checked === true)}
                  data-testid="checkbox-generate-recurring"
                />
                <Label htmlFor="recurring" className="text-sm cursor-pointer">
                  Auto-generate 30 {repeat} tasks starting from this date
                </Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" data-testid="button-submit-task">
              Add Task{generateRecurring && repeat !== "one-time" ? "s" : ""}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
