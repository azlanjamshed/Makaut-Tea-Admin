import React, { useState, useRef } from "react";
import {
  Megaphone,
  Upload,
  X,
  ShieldCheck,
  GraduationCap,
  Image as ImageIcon,
  CheckCircle,
  Eye,
  Send,
  Loader2,
} from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { SEMESTERS } from "../../utils/constants";
import * as rantsApi from "../../api/rants";
import { useToast } from "../../context/ToastContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { admin } = useAdminAuth();
  const { showToast } = useToast();

  const [text, setText] = useState("");
  const [semester, setSemester] = useState("All Semesters");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setText("");
    setSemester("All Semesters");
    setImageFile(null);
    setImagePreview(null);
    setIsSubmitting(false);
    setShowPreview(false);
    setError("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Announcement text is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("text", text.trim());
      formData.append("semester", semester);
      formData.append("department", "");
      formData.append("isAnonymous", "false");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await rantsApi.createAdminPost(formData);
      showToast("Official announcement published successfully!", "success");
      resetForm();
      onPostCreated?.(res.data);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to publish official post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Official Campus Post"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner note */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
          <div className="p-2 rounded-lg bg-indigo-100 text-[var(--color-primary)] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-[var(--color-primary)]">
              Official University Broadcast
            </p>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              This post will be marked as an{" "}
              <strong className="text-slate-900">
                Official Campus Announcement
              </strong>{" "}
              with a verified badge, distinct university styling, and elevated
              visibility across the student platform.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Target Semester Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">
            Target Semester
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-slate-50/70 border border-[var(--border-color)] text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white cursor-pointer font-medium"
            >
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem === "All Semesters" ? "All Semesters (Campus-wide)" : sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Post Text */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
              Announcement Content
            </label>
            <span
              className={`text-xs ${
                text.length > 1900
                  ? "text-amber-600 font-bold"
                  : "text-slate-400 font-mono"
              }`}
            >
              {text.length} / 2000
            </span>
          </div>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            placeholder="Write the official announcement, notice, event info, or guideline..."
            className="w-full bg-slate-50/70 border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 text-sm rounded-xl p-3.5 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-indigo-100 resize-y leading-relaxed transition-all"
          />
        </div>

        {/* Image Attachment */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">
            Attach Image / Poster (Optional)
          </label>

          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] bg-slate-50 max-h-48 group">
              <img
                src={imagePreview}
                alt="Announcement attachment preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/80 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--color-primary)] rounded-xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/70 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500">
                <Upload className="w-6 h-6 text-[var(--color-primary)]" />
                <p className="text-xs font-bold text-slate-800">
                  Click to upload image poster or photo
                </p>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, or WebP up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] hover:underline font-bold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {showPreview
                ? "Hide Live Student Preview"
                : "Show Live Student Preview"}
            </span>
          </button>

          {showPreview && (
            <div className="mt-3 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200">
              {/* Official Banner */}
              <div className="flex items-center justify-between px-3 py-1.5 mb-3 rounded-lg bg-indigo-100/80 border border-indigo-200 text-indigo-950">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                    Official Campus Announcement
                  </span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 border border-indigo-300">
                  Verified
                </span>
              </div>

              {/* Author header */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">
                  {admin?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      Head of MAKAU-TEA Affairs
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Admin
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {semester} · Just now
                  </span>
                </div>
              </div>

              {/* Text */}
              <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {text || "Announcement message preview will display here..."}
              </p>

              {/* Image preview */}
              {imagePreview && (
                <div className="mt-2.5 rounded-xl overflow-hidden border border-[var(--border-color)] bg-slate-50 flex items-center justify-center p-1 max-h-48">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-44 w-auto h-auto max-w-full object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !text.trim()}
            className="flex items-center gap-2 cursor-pointer font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish Announcement</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
