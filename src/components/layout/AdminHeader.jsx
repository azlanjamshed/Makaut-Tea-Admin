import React from 'react';
import { Menu, Search, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminHeader = ({ title = 'Dashboard', onOpenMobileNav, onOpenSearch }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b border-[var(--border-color)] shadow-2xs">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Mobile Hamburger + Title & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-display tracking-tight">
              {title}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
              <Link to="/" className="hover:text-slate-900 transition-colors">
                Admin
              </Link>
              <span>/</span>
              <span className="text-[var(--color-primary)] font-medium">{title}</span>
            </div>
          </div>
        </div>

        {/* Right: Search, Admin Avatar & Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-[var(--border-color)] hover:border-slate-300 text-slate-500 hover:text-slate-900 transition-all text-xs"
            title="Global search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-600 font-mono shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Admin Avatar & Details */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-color)]">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 group"
              title="Admin Profile"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white font-bold text-xs flex items-center justify-center border border-white/20 shadow-xs group-hover:scale-105 transition-transform">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                  {admin?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {admin?.email || 'admin@makaut.edu'}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden sm:flex p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
              title="Log out"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
