import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import ReviewAnnouncementModal from "../components/announcements/ReviewAnnouncementModal";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import { TableSkeleton } from "../components/common/Skeleton";
import { useToast } from "../context/ToastContext";
import { timeAgo, formatDateTime, resolveImageUrl } from "../utils/helpers";
import * as announcementsApi from "../api/announcements";

const STATUS_FILTERS = [
  { id: "all", label: "All Requests" },
  { id: "pending", label: "Pending Review" },
  { id: "approved", label: "Approved & Broadcasted" },
  { id: "rejected", label: "Rejected" },
];

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "event", label: "Event / Workshop" },
  { id: "academic", label: "Academic & Exam" },
  { id: "club", label: "Cultural & Club" },
  { id: "urgent", label: "Urgent Advisory" },
  { id: "lost_found", label: "Lost & Found" },
  { id: "general", label: "General" },
];

const AnnouncementsPage = () => {
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Selected Request Modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { showToast } = useToast();

  const fetchCounts = async () => {
    try {
      const res = await announcementsApi.getAnnouncementRequestCounts();
      if (res.success && res.data) {
        setCounts(res.data);
      }
    } catch (_) {}
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 15,
        status: status !== "all" ? status : undefined,
        category: category !== "all" ? category : undefined,
        search: search.trim() || undefined,
      };

      const res = await announcementsApi.getAnnouncementRequests(params);
      if (res.success) {
        setRequests(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load announcement requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchCounts();
  }, [page, status, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-[var(--color-primary)]" />
            <span>Campus Announcements Pipeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, verify, and broadcast official campus updates proposed by students & societies.
          </p>
        </div>

        <button
          onClick={() => {
            fetchRequests();
            fetchCounts();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[var(--border-color)] text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[var(--color-primary)]" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => {
            setStatus("pending");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            status === "pending"
              ? "border-amber-400 ring-2 ring-amber-100 bg-amber-50/30"
              : "border-[var(--border-color)] hover:border-amber-300 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 font-mono uppercase tracking-wider">
              Pending Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-black text-slate-900">
              {counts.pending}
            </span>
            {counts.pending > 0 && (
              <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold animate-pulse">
                Needs attention
              </span>
            )}
          </div>
        </div>

        <div
          onClick={() => {
            setStatus("approved");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            status === "approved"
              ? "border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/30"
              : "border-[var(--border-color)] hover:border-emerald-300 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 font-mono uppercase tracking-wider">
              Broadcasted
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">
              {counts.approved}
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            setStatus("rejected");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            status === "rejected"
              ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/30"
              : "border-[var(--border-color)] hover:border-rose-300 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 font-mono uppercase tracking-wider">
              Rejected
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">
              {counts.rejected}
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            setStatus("all");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            status === "all"
              ? "border-[var(--color-primary)] ring-2 ring-indigo-100 bg-indigo-50/30"
              : "border-[var(--border-color)] hover:border-[var(--color-primary)] hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 font-mono uppercase tracking-wider">
              Total Proposals
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">
              {counts.total}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements by title, keyword, target..."
              className="w-full bg-slate-50/70 border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </form>

          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-[var(--border-color)] text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/30 cursor-pointer font-medium"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-white text-slate-900">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar border-t border-[var(--border-color)]">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setStatus(st.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                status === st.id
                  ? "bg-[var(--color-primary)] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {st.label}
              {st.id === "pending" && counts.pending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                  {counts.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main List / Table */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <ErrorState
          title="Failed to load requests"
          message={error}
          onRetry={fetchRequests}
        />
      ) : requests.length === 0 ? (
        <EmptyState
          emoji="📢"
          title="No announcement proposals found"
          message={
            search || status !== "all" || category !== "all"
              ? "No proposals match your current filters. Try changing filter criteria."
              : "No student announcement proposals have been submitted yet."
          }
          actionLabel={
            search || status !== "all" || category !== "all"
              ? "Clear Filters"
              : null
          }
          onAction={() => {
            setSearch("");
            setStatus("all");
            setCategory("all");
            setPage(1);
          }}
        />
      ) : (
        <div className="bg-white border border-[var(--border-color)] rounded-2xl shadow-2xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80">
                  <th className="py-3.5 px-4">Title & Description</th>
                  <th className="py-3.5 px-4">Applicant Student</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Target Audience</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-xs">
                {requests.map((req) => {
                  const isPending = req.status === "pending";
                  const isApproved = req.status === "approved";
                  const isRejected = req.status === "rejected";
                  const applicant = req.user || {};

                  return (
                    <tr
                      key={req.id || req._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 font-display truncate">
                          {req.title}
                        </div>
                        <div className="text-slate-500 truncate text-[11px] mt-0.5">
                          {req.text}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-[var(--color-primary)] text-xs shrink-0">
                            {applicant.name?.charAt(0) || "S"}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-slate-900 block truncate leading-tight">
                              {applicant.name || "Student"}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {applicant.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {req.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {req.targetAudience || "All Students"}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {timeAgo(req.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Pending</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Broadcasted</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-[var(--border-color)] hover:border-indigo-200 text-slate-700 hover:text-[var(--color-primary)] font-bold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>
                            {isPending ? "Review & Action" : "View Details"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden divide-y divide-[var(--border-color)]">
            {requests.map((req) => {
              const isPending = req.status === "pending";
              const isApproved = req.status === "approved";
              const isRejected = req.status === "rejected";

              return (
                <div key={req.id || req._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {req.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm font-display mt-1">
                        {req.title}
                      </h4>
                    </div>

                    {isPending && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        Pending
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Broadcasted
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                        Rejected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {req.text}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                    <span>By: {req.user?.name || "Student"}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-[var(--border-color)] text-slate-800 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                    >
                      {isPending ? "Review" : "Details"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.total}
            pageSize={15}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Review & Action Modal */}
      <ReviewAnnouncementModal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onActionComplete={() => {
          fetchRequests();
          fetchCounts();
        }}
      />
    </div>
  );
};

export default AnnouncementsPage;
