import { Card } from "@/components/ui/card";
import { CheckInType } from "@/types/event-types";
import { format, isValid } from "date-fns";
import React from "react";

interface EventCardProps {
  event: CheckInType;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = "" }) => {
  // Parse the event date
  const eventDate = new Date(event.startTime);
  if (!isValid(eventDate)) return null;

  // Format times
  const startTime = eventDate.getTime();
  const endTime = event.endTime ? new Date(event.endTime).getTime() : null;

  // Format event details with fallbacks
  const eventName = String(event.name) || "unnamed check-in";
  const eventLocation = String(event.location) || "";
  const eventAssignee = String(event.assigneeId) || "";
  const eventCategory = event.category || "Other";

  // Define color mapping for categories
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Hot Meal": "bg-orange-100",
      "Hygiene Kit": "bg-blue-100",
      "Snack Pack": "bg-green-100",
      Other: "bg-gray-100",
    };
    return colors[category] || colors["Other"];
  };

  return (
    <Card
      key={String(event.id)}
      className={`flex items-center justify-between gap-4 h-[100px] w-full border border-gray-200 shadow-sm ${className}`}
    >
      {/* Time Column */}
      <div className="text-sm text-gray-500 text-center w-[80px]">
        <span>{format(startTime, "p")}</span>
        <br />
        <span>{endTime && format(endTime, "p")}</span>
      </div>

      {/* Event Details Column */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold truncate">{eventName}</h2>
        <p className="text-gray-600 truncate">{eventLocation}</p>
      </div>

      {/* Category Column */}
      <div
        className={`${getCategoryColor(
          eventCategory
        )} w-[120px] h-[50px] border border-gray-200 rounded-md p-2 flex items-center justify-center`}
      >
        <h2 className="text-sm font-medium truncate">{eventCategory}</h2>
      </div>

      {/* Assignee Column */}
      <div className="w-[100px] text-center">
        <h2 className="text-lg">{eventAssignee || "-"}</h2>
      </div>
    </Card>
  );
};

export default EventCard;
