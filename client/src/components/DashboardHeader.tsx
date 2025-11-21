import { format } from "date-fns";
import { User } from "@shared/schema";

interface DashboardHeaderProps {
  user?: User;
  userName: string;
}

export function DashboardHeader({ user, userName }: DashboardHeaderProps) {
  const today = new Date();
  const dateStr = format(today, "MMMM d, yyyy");
  const dayOfWeek = format(today, "EEEE");

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="flex justify-between items-start">
        {/* Left: Date & Time */}
        <div className="flex flex-col">
          <div className="text-sm font-medium text-text-muted">Today</div>
          <div className="text-2xl font-bold text-text-primary mt-1">{dayOfWeek}</div>
          <div className="text-sm text-text-muted mt-0.5">{dateStr}</div>
        </div>

        {/* Right: User Info */}
        <div className="flex flex-col items-end">
          <div className="text-sm text-text-muted">Welcome back</div>
          <div className="text-xl font-bold text-text-primary mt-1">{userName}</div>
          {user?.email && (
            <div className="text-xs text-text-muted mt-1">{user.email}</div>
          )}
        </div>
      </div>
    </div>
  );
}
