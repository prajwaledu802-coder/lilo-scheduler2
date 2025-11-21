import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onMenuToggle: (open: boolean) => void;
  isOpen: boolean;
}

export function Navbar({ onMenuToggle, isOpen }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center">
      <button
        onClick={() => onMenuToggle(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        data-testid="button-menu-toggle"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-text-primary" />
        )}
      </button>
    </nav>
  );
}
