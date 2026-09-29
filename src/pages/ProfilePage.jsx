import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Shield, Mail, Sun, Moon, LogOut, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { admin, logout } = useAdminAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)] text-white font-black text-2xl flex items-center justify-center border-2 border-indigo-200 shadow-sm shrink-0">
            {admin?.name?.charAt(0) || 'A'}
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {admin?.name || 'Administrator'}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-indigo-50 text-[var(--color-primary)] border border-indigo-200 font-bold self-center sm:self-auto">
                <Shield className="w-3.5 h-3.5" />
                <span>{admin?.role || 'admin'}</span>
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{admin?.email || 'admin@campus.edu'}</span>
            </div>

            <p className="text-xs text-slate-500 pt-1">
              Authorized Rantea Platform Administrator · Full Moderation Privileges
            </p>
          </div>
        </div>

        {/* Administration Privileges Section */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
            System Privileges
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rant Soft-delete & Restoration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Grievance & Report Moderation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>User Suspension & Permanent Bans</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-time Feed Surveillance</span>
            </div>
          </div>
        </div>

        {/* Preferences & Quick Actions */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
            Interface Preferences
          </span>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-[var(--border-color)]">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Interface Color Scheme
              </span>
              <span className="text-[11px] text-slate-500">
                Currently running in <strong className="capitalize text-[var(--color-primary)]">{theme}</strong> mode
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              icon={isDark ? Sun : Moon}
            >
              Switch to {isDark ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-2">
          <Button
            variant="danger"
            size="md"
            onClick={logout}
            icon={LogOut}
            className="w-full font-bold cursor-pointer"
          >
            Sign Out of Admin Console
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
