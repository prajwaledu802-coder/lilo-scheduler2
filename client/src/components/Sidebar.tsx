import { Calendar, Home, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (view: "dashboard" | "calendar") => void;
  onLogout: () => void;
  userName: string;
}

export function Sidebar({ isOpen, onNavigate, onLogout, userName }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-[260px] bg-white shadow-lg transition-transform duration-300 z-30 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <div>
            <div className="font-bold text-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-orange-500 bg-clip-text text-transparent">
              Lilo
            </div>
            <div className="text-xs text-gray-500">Scheduler</div>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-3 pt-3 border-t">{userName}</div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => onNavigate("dashboard")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          data-testid="nav-dashboard"
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate("calendar")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          data-testid="nav-calendar"
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          data-testid="nav-settings"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Logout */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors font-medium"
          data-testid="nav-logout"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
