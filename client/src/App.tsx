// Reference: blueprint:javascript_log_in_with_replit
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScheduleMenu } from "@/components/ScheduleMenu";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { ProfileSettings } from "@/components/ProfileSettings";
import { LiloChat } from "@/components/LiloChat";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "calendar">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleScheduleView = (view: "daily" | "weekly" | "monthly" | "yearly") => {
    console.log("Schedule view:", view);
    setCurrentView("calendar");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-chart-2 to-chart-3">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  const userEmail = user?.email || "User";
  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || "Student";

  return (
    <div className="min-h-screen bg-bg-panel">
      <Navbar onMenuToggle={setSidebarOpen} isOpen={sidebarOpen} />
      <Sidebar
        isOpen={sidebarOpen}
        onNavigate={(view) => {
          setCurrentView(view);
          setSidebarOpen(false);
        }}
        onLogout={handleLogout}
        userName={userName}
      />

      <main className="pt-0">
        {currentView === "dashboard" ? (
          <Dashboard userName={userName} user={user} />
        ) : (
          <CalendarPage />
        )}
      </main>

      <ProfileSettings
        open={profileOpen}
        onOpenChange={setProfileOpen}
        userEmail={userEmail}
        user={user}
      />

      <LiloChat />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
