import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ImageLightbox from '../common/ImageLightbox';
import {
  Megaphone,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  Building2,
  Calendar,
  ZoomIn,
  Send,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { formatDateTime, resolveImageUrl } from '../../utils/helpers';
import * as announcementsApi from '../../api/announcements';
import { useToast } from '../../context/ToastContext';

const ReviewAnnouncementModal = ({
  isOpen,
  onClose,
  request,
  onActionComplete,
}) => {
  if (!request) return null;

  const { showToast } = useToast();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [actionTab, setActionTab] = useState('view'); // 'view' | 'approve' | 'reject'
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [customText, setCustomText] = useState(request.text || '');
  const [targetAudience, setTargetAudience] = useState(request.targetAudience || 'All Students');
  const [isProcessing, setIsProcessing] = useState(false);

  const isPending = request.status === 'pending';
  const isApproved = request.status === 'approved';
  const isRejected = request.status === 'rejected';

  const imageSrc = request.image ? resolveImageUrl(request.image) : null;
  const applicant = request.user || {};

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const res = await announcementsApi.approveAnnouncementRequest(request.id || request._id, {
        customizedText: customText.trim() !== request.text.trim() ? customText.trim() : undefined,
        department: targetAudience.trim() || undefined,
        notes: adminNotes.trim() || undefined,
      });

      if (res.success) {
        showToast('Announcement approved and broadcasted to campus! 📢', 'success');
        onActionComplete?.();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to approve announcement', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await announcementsApi.rejectAnnouncementRequest(request.id || request._id, {
        reason: rejectReason.trim(),
      });

      if (res.success) {
        showToast('Announcement proposal rejected', 'info');
        onActionComplete?.();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to reject announcement', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Announcement Proposal Review"
      subtitle={`Request ID: ${request.id || request._id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Status Pill & Category Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl bg-indigo-50 text-[var(--color-primary)] border border-indigo-200">
              {request.category?.toUpperCase() || 'GENERAL'}
            </span>
            <span className="text-xs text-slate-500">
              Target: <strong className="text-slate-800">{request.targetAudience || 'All Students'}</strong>
            </span>
          </div>

          <div>
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Pending Review</span>
              </span>
            )}
            {isApproved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Approved & Broadcasted</span>
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Rejected</span>
              </span>
            )}
          </div>
        </div>

        {/* Applicant Profile Box */}
        <div className="p-3.5 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-[var(--color-primary)] text-sm overflow-hidden">
              {applicant.image ? (
                <img src={resolveImageUrl(applicant.image)} alt={applicant.name} className="w-full h-full object-cover" />
              ) : (
                applicant.name?.charAt(0) || 'S'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 font-display">
                  {applicant.name || 'Student Applicant'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  Student
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {applicant.email} {applicant.department ? `· ${applicant.department}` : ''}
              </span>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <span>Submitted: {formatDateTime(request.createdAt)}</span>
          </div>
        </div>

        {/* Headline / Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Announcement Title
          </label>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-[var(--border-color)] text-sm font-bold text-slate-900 font-display">
            {request.title}
          </div>
        </div>

        {/* Action Tabs for Pending Requests */}
        {isPending && (
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setActionTab('view')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                actionTab === 'view' ? 'bg-white text-[var(--color-primary)] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Request Details
            </button>
            <button
              type="button"
              onClick={() => setActionTab('approve')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                actionTab === 'approve' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Approve & Broadcast
            </button>
            <button
              type="button"
              onClick={() => setActionTab('reject')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                actionTab === 'reject' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Reject Proposal
            </button>
          </div>
        )}

        {/* Tab Content: View Details */}
        {actionTab === 'view' && (
          <div className="space-y-4">
            {/* Announcement Text Body */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Message Body
              </label>
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-[var(--border-color)] text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
                {request.text}
              </div>
            </div>

            {/* Optional Attached Poster / Flyer */}
            {imageSrc && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Attached Flyer / Evidence
                </label>
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-950/80 max-h-72 flex items-center justify-center cursor-zoom-in hover:border-indigo-400 transition-all group"
                >
                  <img
                    src={imageSrc}
                    alt="Flyer"
                    className="max-h-72 w-auto h-auto max-w-full object-contain group-hover:scale-[1.01] transition-transform"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    <span>Inspect</span>
                  </div>

                  <ImageLightbox
                    isOpen={isLightboxOpen}
                    onClose={() => setIsLightboxOpen(false)}
                    imageSrc={imageSrc}
                    alt={`Flyer for ${request.title}`}
                    caption={`Attached by ${applicant.name || 'Student'}`}
                  />
                </div>
              </div>
            )}

            {/* Contact details */}
            {request.contactInfo && (
              <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs text-slate-700">
                <strong className="text-slate-900">Contact / Info: </strong> {request.contactInfo}
              </div>
            )}

            {/* If approved or rejected, show history notes */}
            {request.adminFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                isApproved
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Feedback / Decision Notes:</span>
                </div>
                <p>{request.adminFeedback}</p>
                {request.reviewedBy?.name && (
                  <p className="text-[10px] text-slate-500 pt-0.5">
                    Reviewed by {request.reviewedBy.name} on {formatDateTime(request.reviewedAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Approve Form */}
        {actionTab === 'approve' && (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Megaphone className="w-4 h-4 text-emerald-600" />
              <span>Broadcast as Head of MAKAU-TEA Affairs 📢</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Approving will instantly publish an official campus announcement post visible to all students with the verified admin badge.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Broadcast Target Department / Audience:
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-white border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Customize / Edit Announcement Text (Optional):
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
                className="w-full bg-white border border-[var(--border-color)] rounded-xl p-3 text-xs text-slate-900 resize-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Admin Note to Student (Optional):
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Approved and verified with department advisor."
                className="w-full bg-white border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionTab('view')}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs cursor-pointer"
              >
                {isProcessing ? 'Broadcasting...' : 'Confirm & Broadcast Live 📢'}
              </Button>
            </div>
          </div>
        )}

        {/* Tab Content: Reject Form */}
        {actionTab === 'reject' && (
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3.5">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Reject Proposal</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              Please explain why this announcement cannot be broadcasted. The student will receive a notification with this feedback.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Reason / Feedback <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="e.g. Notice lacks verified faculty approval. Please attach department sign-off and resubmit."
                className="w-full bg-white border border-[var(--border-color)] rounded-xl p-3 text-xs text-slate-900 resize-none focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionTab('view')}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                disabled={isProcessing || !rejectReason.trim()}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                {isProcessing ? 'Rejecting...' : 'Reject Proposal'}
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Close Button if on view mode */}
        {actionTab === 'view' && (
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            {isPending && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActionTab('reject')}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer"
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActionTab('approve')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Approve & Broadcast
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReviewAnnouncementModal;
