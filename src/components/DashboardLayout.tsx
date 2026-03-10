import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  ShoppingCart,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["super_admin", "admin"] },
  { label: "Admins", icon: UserCog, path: "/dashboard/admins", roles: ["super_admin"] },
  { label: "Customers", icon: Users, path: "/dashboard/customers", roles: ["super_admin", "admin"] },
  { label: "Drivers", icon: Truck, path: "/dashboard/drivers", roles: ["super_admin", "admin"] },
  { label: "Orders", icon: ShoppingCart, path: "/dashboard/orders", roles: ["super_admin", "admin"] },
  { label: "Settings", icon: Settings, path: "/dashboard/settings", roles: ["super_admin", "admin"] },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Nav Rail */}
      <aside className="nav-rail w-[72px] hidden lg:flex">
        <div className="mb-8">
          <span className="text-primary font-bold text-lg">TF</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {filteredNav.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`nav-rail-item ${location.pathname === item.path ? "active" : ""}`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="nav-rail-item mt-auto"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px]">Logout</span>
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b bg-card">
        <span className="text-primary font-bold text-lg font-heading">TireFleet</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-muted"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 pt-14">
          <nav className="flex flex-col p-4 gap-1">
            {filteredNav.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 mt-4"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-[72px] pt-14 lg:pt-0">
        {/* Top Bar */}
        <header className="h-14 border-b flex items-center justify-between px-6 bg-card">
          <div>
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono uppercase">
              {user.role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{user.email}</span>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
