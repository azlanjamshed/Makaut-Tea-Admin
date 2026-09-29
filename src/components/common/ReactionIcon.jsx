import React from "react";
import { Heart, ThumbsDown, Skull } from "lucide-react";

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
    case "👎":
      return (
        <ThumbsDown
          className={`${className} ${
            isSelected ? "text-amber-700 fill-amber-700" : "text-amber-600"
          }`}
          fill={isSelected ? "currentColor" : "none"}
          strokeWidth={2}
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
