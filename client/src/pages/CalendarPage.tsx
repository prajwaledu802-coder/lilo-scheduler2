import { CalendarView } from "@/components/CalendarView";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-chart-3/5">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and manage your schedule</p>
        </div>
        <CalendarView onDateClick={(date) => console.log("Date clicked:", date)} />
      </div>
    </div>
  );
}
