import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, AlertTriangle, Users, ArrowRight, Loader2, X } from 'lucide-react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import * as rantsApi from '../../api/rants';
import * as reportsApi from '../../api/reports';
import * as usersApi from '../../api/users';
import { truncateText, timeAgo, getRantStatus } from '../../utils/helpers';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ rants: [], users: [], reports: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults({ rants: [], users: [], reports: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults({ rants: [], users: [], reports: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [rantsRes, usersRes, reportsRes] = await Promise.allSettled([
          rantsApi.getAdminPosts({ search: trimmed, limit: 3 }),
          usersApi.getUsers({ search: trimmed, limit: 3 }),
          reportsApi.getReports({ search: trimmed, limit: 3 }),
        ]);

        setResults({
          rants: rantsRes.status === 'fulfilled' && rantsRes.value.success ? rantsRes.value.data || [] : [],
          users: usersRes.status === 'fulfilled' && usersRes.value.success ? usersRes.value.data || [] : [],
          reports: reportsRes.status === 'fulfilled' && reportsRes.value.success ? reportsRes.value.data || [] : [],
        });
      } catch (err) {
        // Silently catch search errors
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  const hasResults =
    results.rants.length > 0 || results.users.length > 0 || results.reports.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, rants, reports..."
            autoFocus
            className="w-full bg-slate-50/80 border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 text-sm rounded-2xl pl-12 pr-10 py-3.5 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
            <span className="text-xs font-medium">Searching across database...</span>
          </div>
        ) : query.trim().length >= 2 && !hasResults ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Nothing matched your search</p>
            <p className="text-xs text-slate-400">Try searching for keywords, usernames, emails, or departments.</p>
          </div>
        ) : (
          <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
            {/* Rants Group */}
            {results.rants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 border-b border-[var(--border-color)] pb-1.5 font-mono">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Rants</span>
                  </span>
                  <button
                    onClick={() => handleSelect(`/rants?search=${encodeURIComponent(query)}`)}
                    className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 normal-case font-bold cursor-pointer"
                  >
                    View all in Rants
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {results.rants.map((rant) => (
                    <div
                      key={rant._id || rant.id}
                      onClick={() => handleSelect(`/rants?highlight=${rant._id || rant.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-indigo-50/40 border border-[var(--border-color)] hover:border-indigo-200 shadow-2xs transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs text-slate-800 line-clamp-1 group-hover:text-[var(--color-primary)] font-medium">
                          "{truncateText(rant.text, 80)}"
                        </p>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {rant.isAnonymous ? 'Anonymous' : rant.user?.name || 'Student'} · {rant.department} · {timeAgo(rant.createdAt)}
                        </span>
                      </div>
                      <StatusBadge status={getRantStatus(rant)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Group */}
            {results.users.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 border-b border-[var(--border-color)] pb-1.5 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-500" />
                    <span>Users</span>
                  </span>
                  <button
                    onClick={() => handleSelect(`/users?search=${encodeURIComponent(query)}`)}
                    className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 normal-case font-bold cursor-pointer"
                  >
                    View all in Users
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {results.users.map((user) => (
                    <div
                      key={user._id || user.id}
                      onClick={() => handleSelect(`/users?highlight=${user._id || user.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-indigo-50/40 border border-[var(--border-color)] hover:border-indigo-200 shadow-2xs transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 pr-3">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[var(--color-primary)] block">
                          {user.name} ({user.anonymousUsername || 'student'})
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {user.email} · {user.department || 'General'}
                        </span>
                      </div>
                      <StatusBadge status={user.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Group */}
            {results.reports.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 border-b border-[var(--border-color)] pb-1.5 font-mono">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reports</span>
                  </span>
                  <button
                    onClick={() => handleSelect(`/reports?search=${encodeURIComponent(query)}`)}
                    className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 normal-case font-bold cursor-pointer"
                  >
                    View all in Reports
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {results.reports.map((report) => (
                    <div
                      key={report._id || report.id}
                      onClick={() => handleSelect(`/reports?highlight=${report._id || report.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-indigo-50/40 border border-[var(--border-color)] hover:border-indigo-200 shadow-2xs transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 pr-3">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[var(--color-primary)] block">
                          Reason: {report.reason} ({report.targetType})
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Reported by {report.reporter?.name || 'User'} · {timeAgo(report.createdAt)}
                        </span>
                      </div>
                      <StatusBadge status={report.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GlobalSearchModal;
