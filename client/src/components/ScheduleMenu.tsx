import { Menu, Calendar, CalendarDays, CalendarRange, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface ScheduleMenuProps {
  onSelectView?: (view: "daily" | "weekly" | "monthly" | "yearly") => void;
}

export function ScheduleMenu({ onSelectView }: ScheduleMenuProps) {
  const [open, setOpen] = useState(false);

  const scheduleItems = [
    { label: "Daily Schedule", icon: Calendar, view: "daily" as const },
    { label: "Weekly Schedule", icon: CalendarDays, view: "weekly" as const },
    { label: "Monthly Schedule", icon: CalendarRange, view: "monthly" as const },
    { label: "Yearly Schedule", icon: CalendarClock, view: "yearly" as const },
  ];

  const handleSelect = (view: "daily" | "weekly" | "monthly" | "yearly") => {
    onSelectView?.(view);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-schedule-menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Schedules</SheetTitle>
          <SheetDescription>
            View your daily, weekly, monthly, or yearly schedules
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {scheduleItems.map((item) => (
            <Button
              key={item.view}
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => handleSelect(item.view)}
              data-testid={`button-schedule-${item.view}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
