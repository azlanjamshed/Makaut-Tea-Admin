import React from "react";
import { Heart, Skull } from "lucide-react";

export const PoopIcon = ({
  className = "w-3.5 h-3.5",
  isSelected = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill={isSelected ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2.5c.8 1.2 2 1.8 3 1.8-1.5.8-2 2-2 3.2 1.8-.4 3.5.3 4.2 1.8.8 1.6.2 3.5-1.2 4.4 1.2.6 2 1.9 2 3.3 0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4 0-1.4.8-2.7 2-3.3-1.4-.9-2-2.8-1.2-4.4.7-1.5 2.4-2.2 4.2-1.8 0-1.2-.5-2.4-2-3.2 1 0 2.2-.6 3-1.8z" />
    <circle cx="9" cy="14" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="0.8" fill="currentColor" stroke="none" />
    <path d="M10.5 17c.5.5 1 .6 1.5.6s1-.1 1.5-.6" fill="none" />
  </svg>
);

const ReactionIcon = ({
  emoji,
  isSelected = false,
  className = "w-3.5 h-3.5",
}) => {
  switch (emoji) {
    case "❤️":
      return (
        <Heart
          className={`${className} ${
            isSelected ? "text-rose-600 fill-rose-600" : "text-rose-500"
          }`}
          fill={isSelected ? "currentColor" : "none"}
          strokeWidth={2}
        />
      );
    case "💩":
      return (
        <PoopIcon
          className={`${className} ${
            isSelected ? "text-amber-800" : "text-amber-700"
          }`}
          isSelected={isSelected}
        />
      );
    case "💀":
      return (
        <Skull
          className={`${className} ${
            isSelected ? "text-purple-700 fill-purple-200" : "text-purple-600"
          }`}
          fill={isSelected ? "currentColor" : "none"}
          strokeWidth={2}
        />
      );
    default:
      return <span>{emoji}</span>;
  }
};

export default ReactionIcon;
