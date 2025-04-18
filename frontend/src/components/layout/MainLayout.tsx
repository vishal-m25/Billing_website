
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Package, FileText, Info } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-app-blue-dark text-white p-4 shadow-md">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package size={28} />
            <h1 className="text-xl font-bold">AutoParts Manager</h1>
          </div>
          <span className="text-sm hidden md:inline">Spare Parts Billing & Inventory System</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4 space-y-2">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-3 p-3 rounded-md transition-colors",
                isActive("/")
                  ? "bg-app-blue text-white"
                  : "text-gray-700 hover:bg-app-blue-light hover:text-app-blue-dark"
              )}
            >
              <FileText size={20} />
              <span className="font-medium">Billing</span>
            </Link>
            <Link
              to="/inventory"
              className={cn(
                "flex items-center space-x-3 p-3 rounded-md transition-colors",
                isActive("/inventory")
                  ? "bg-app-blue text-white"
                  : "text-gray-700 hover:bg-app-blue-light hover:text-app-blue-dark"
              )}
            >
              <Package size={20} />
              <span className="font-medium">Inventory</span>
            </Link>
          </nav>
          
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <footer className="bg-app-gray-dark text-white p-3 text-center text-sm">
        <div className="container">
          <p>© {new Date().getFullYear()} AutoParts Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
