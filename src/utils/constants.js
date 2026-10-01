export const DEPARTMENTS = [
  "All",
  "Computer Science and Engineering (CSE)",
  "Information Technology (IT)",
  "Forensic",
  "Bio Informatic",
  "LLB",
  "VLSI",
  "MTech",
  "Biotech Building",
  "Other",
];

export const SEMESTERS = [
  "All Semesters",
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

export const REACTIONS = [
  { emoji: '❤️', name: 'love', label: 'Love' },
  { emoji: '👎', name: 'dislike', label: 'Dislike' },
  { emoji: '💀', name: 'dead', label: 'Dead' },
];

export const ALLOWED_REACTIONS = ['❤️', '👎', '💀'];

export const RANT_STATUSES = [
  { id: "all", label: "All Rants" },
  { id: "official", label: "Admin / Official" },
  { id: "active", label: "Active" },
  { id: "hidden", label: "Hidden" },
  { id: "deleted", label: "Deleted" },
];

export const REPORT_STATUSES = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "investigating", label: "Investigating" },
  { id: "resolved", label: "Resolved" },
  { id: "rejected", label: "Rejected" },
];

export const TARGET_TYPES = [
  { id: "all", label: "All Targets" },
  { id: "post", label: "Post" },
  { id: "comment", label: "Comment" },
  { id: "user", label: "User" },
];

export const USER_STATUSES = [
  { id: "all", label: "All Statuses" },
  { id: "active", label: "Active" },
  { id: "suspended", label: "Suspended" },
  { id: "banned", label: "Banned" },
];

export const USER_ROLES = [
  { id: "all", label: "All Roles" },
  { id: "user", label: "Students / Users" },
  { id: "admin", label: "Administrators" },
];

export const SUSPENSION_DURATIONS = [
  { value: 1, label: "24 Hours (1 Day)" },
  { value: 3, label: "3 Days" },
  { value: 7, label: "7 Days (1 Week)" },
  { value: 14, label: "14 Days (2 Weeks)" },
  { value: 30, label: "30 Days (1 Month)" },
];

export const RESOLVE_ACTIONS = [
  {
    id: "dismiss",
    label: "Dismiss / No Action",
    desc: "Mark report as reviewed without penalties",
  },
  {
    id: "hide_post",
    label: "Hide Post",
    desc: "Hide the reported post from public views",
  },
  {
    id: "delete_post",
    label: "Delete Post",
    desc: "Soft-delete the reported post permanently",
  },
  {
    id: "suspend_user",
    label: "Suspend User",
    desc: "Temporarily lock account from posting",
  },
  {
    id: "ban_user",
    label: "Ban User Permanently",
    desc: "Block the user permanently from the university board",
  },
];
