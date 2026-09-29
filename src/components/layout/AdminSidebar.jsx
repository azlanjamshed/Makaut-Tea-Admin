import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Users,
  Settings,
  User,
  LogOut,
  X,
  ShieldCheck,
  Megaphone,
  Lightbulb,
  Plus,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import appLogo from "../../assets/logo.png";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/rants", label: "Rants Feed", icon: FileText },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/reports", label: "Reports", icon: AlertTriangle },
  { to: "/users", label: "Users", icon: Users },
  { to: "/feedback", label: "Feedback & Ideas", icon: Lightbulb },
];

const AdminSidebar = ({
  isOpen,
  onClose,
  pendingReportsCount = 0,
  pendingAnnouncementsCount = 0,
  newFeedbackCount = 0,
}) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navContent = (
    <>
      {/* Top Header & Navigation Links */}
      <div className="space-y-6">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-1 group"
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition-transform bg-white/10">
              <img
                src={appLogo}
                alt="MAKAU-TEA"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display block leading-tight">
                MAKAU<span className="text-gray-900">-TEA</span>
              </span>
              <span className="text-[10px] text-white/75 font-medium tracking-tight block">
                Admin Control Center
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-white/75 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action: New Announcement */}
        <Link
          to="/rants"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-white text-[var(--color-primary)] hover:bg-white/95 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </Link>

        {/* Main Navigation List */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 px-3.5 block mb-2 font-mono">
            Platform Moderation
          </span>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-white/20 text-white border border-white/20 font-bold backdrop-blur-xs shadow-xs"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-display">{item.label}</span>
                  </div>
                  {item.label === "Reports" && pendingReportsCount > 0 && (
                    <span className="bg-amber-300 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-2xs">
                      {pendingReportsCount}
                    </span>
                  )}
                  {item.label === "Announcements" &&
                    pendingAnnouncementsCount > 0 && (
                      <span className="bg-white text-[var(--color-primary)] text-xs px-2.5 py-0.5 rounded-full font-extrabold animate-pulse">
                        {pendingAnnouncementsCount}
                      </span>
                    )}
                  {item.label === "Feedback & Ideas" &&
                    newFeedbackCount > 0 && (
                      <span className="bg-white text-[var(--color-primary)] text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                        {newFeedbackCount}
                      </span>
                    )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: System Settings, Admin Profile, Sign Out */}
      <div className="space-y-3 pt-6 border-t border-white/15">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 px-3.5 block mb-1.5 font-mono">
            System & Settings
          </span>
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white/20 text-white border border-white/20 font-bold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="font-display">Admin Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white/20 text-white border border-white/20 font-bold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="font-display">System Settings</span>
          </NavLink>
        </div>

        {/* Admin logged in user info card with Logout */}
        {admin && (
          <div className="pt-3 border-t border-white/15 flex items-center justify-between">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 overflow-hidden flex-1 group"
            >
              <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-sm font-bold text-white shrink-0 group-hover:scale-105 transition-transform">
                {admin.name?.charAt(0) || "A"}
              </div>
              <div className="truncate min-w-0">
                <span className="text-xs font-bold text-white block truncate font-display leading-tight">
                  {admin.name}
                </span>
                <span className="text-[10px] text-white/75 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-300 shrink-0" />
                  <span className="truncate">
                    {admin.role || "Super Admin"}
                  </span>
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-white/75 hover:text-rose-200 rounded-xl hover:bg-rose-500/20 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside
        style={{
          backgroundColor: "var(--bg-sidebar)",
          overscrollBehavior: "contain",
        }}
        className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-white/15 p-5 justify-between shrink-0 text-white overflow-y-auto overscroll-contain z-30"
        onWheel={(e) => e.stopPropagation()}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 animate-in fade-in duration-200"
            onClick={onClose}
          />
          <div
            style={{
              backgroundColor: "var(--bg-sidebar)",
              overscrollBehavior: "contain",
            }}
            className="relative w-72 max-w-[85vw] h-full border-r border-white/15 p-5 flex flex-col justify-between overflow-y-auto text-white z-10 animate-in slide-in-from-left duration-200"
            onWheel={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
