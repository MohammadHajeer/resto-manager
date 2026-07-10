import { useId, useMemo, useState } from "react";
import { ChevronDown, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  OpeningHour,
  OpeningHourDay,
} from "@/services/owner/owner.types";

type RestaurantOpeningHoursProps = {
  openingHours?: OpeningHour[] | null;
};

const orderedDays: OpeningHourDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function RestaurantOpeningHours({
  openingHours,
}: RestaurantOpeningHoursProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scheduleId = useId();
  const today = getTodayName();
  const hoursByDay = useMemo(
    () =>
      new Map(
        (openingHours ?? []).map((openingHour) => [
          openingHour.day,
          openingHour,
        ]),
      ),
    [openingHours],
  );
  const todayHours = hoursByDay.get(today);

  return (
    <section
      className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5"
      aria-labelledby="opening-hours-title"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Clock className="size-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <h2
            id="opening-hours-title"
            className="text-xs font-semibold uppercase tracking-wide text-primary"
          >
            Today’s hours
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-foreground sm:text-base">
            <span>{today}</span>
            <span className="mx-2 text-border" aria-hidden="true">
              •
            </span>
            <span>{formatSchedule(todayHours)}</span>
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls={scheduleId}
          className="shrink-0"
        >
          <span className="hidden sm:inline">Weekly hours</span>
          <span className="sm:hidden">Week</span>
          <ChevronDown
            className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </Button>
      </div>

      <div id={scheduleId} hidden={!isExpanded}>
        <ul className="mt-4 border-t border-border pt-3" aria-label="Weekly opening hours">
          {orderedDays.map((day) => {
            const isToday = day === today;

            return (
              <li
                key={day}
                className={`flex items-center justify-between gap-4 rounded-lg px-2 py-2 text-sm ${
                  isToday ? "bg-primary/8 text-primary" : "text-foreground"
                }`}
              >
                <span className={isToday ? "font-semibold" : "font-medium"}>
                  {day}
                  {isToday && <span className="sr-only"> (today)</span>}
                </span>
                <span
                  className={
                    isToday
                      ? "text-right font-semibold"
                      : "text-right text-muted-foreground"
                  }
                >
                  {formatSchedule(hoursByDay.get(day))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function getTodayName(): OpeningHourDay {
  const dayIndex = new Date().getDay();
  return orderedDays[(dayIndex + 6) % 7];
}

function formatSchedule(openingHour?: OpeningHour) {
  if (!openingHour) return "Hours unavailable";
  if (openingHour.isClosed) return "Closed";

  const openTime = formatTime(openingHour.openTime);
  const closeTime = formatTime(openingHour.closeTime);

  if (!openTime || !closeTime) return "Hours unavailable";
  return `${openTime} – ${closeTime}`;
}

function formatTime(value?: string) {
  const match = /^(\d{1,2}):(\d{2})/.exec(value?.trim() ?? "");
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}
