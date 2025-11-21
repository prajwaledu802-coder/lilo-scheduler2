import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface CalendarViewProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
}

export function CalendarView({ events = [], onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = getDaysInMonth(currentDate);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "prev" ? -1 : 1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("prev")}
            data-testid="button-prev-month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())} data-testid="button-today">
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("next")}
            data-testid="button-next-month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
        <TabsList className="mb-4">
          <TabsTrigger value="day" data-testid="tab-day-view">Day</TabsTrigger>
          <TabsTrigger value="week" data-testid="tab-week-view">Week</TabsTrigger>
          <TabsTrigger value="month" data-testid="tab-month-view">Month</TabsTrigger>
        </TabsList>

        <TabsContent value="month">
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && onDateClick?.(day)}
                className={`aspect-square p-2 rounded-md text-sm hover-elevate ${
                  !day ? "invisible" : ""
                } ${isToday(day) ? "bg-gradient-to-br from-primary to-chart-3 text-primary-foreground font-semibold" : ""}`}
                data-testid={day ? `calendar-day-${day.getDate()}` : undefined}
              >
                {day?.getDate()}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="week">
          <div className="space-y-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date(currentDate);
              date.setDate(date.getDate() - date.getDay() + i);
              return (
                <div key={i} className="flex items-center gap-4 p-3 rounded-md hover-elevate">
                  <div className="w-20 text-sm">
                    <div className="font-medium">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}</div>
                    <div className="text-muted-foreground">{date.getDate()}</div>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-1 h-12">
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="day">
          <div className="space-y-2">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex items-center gap-4 p-2 hover-elevate rounded-md">
                <div className="w-16 text-sm text-muted-foreground">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div className="flex-1 h-12 border rounded"></div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
