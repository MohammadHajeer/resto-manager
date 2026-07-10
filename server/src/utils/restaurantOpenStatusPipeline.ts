import type { PipelineStage } from "mongoose";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const getRestaurantOpenStatusPipeline = (): PipelineStage[] => [
  // Add the current Beirut day and time.
  {
    $set: {
      currentDay: {
        $arrayElemAt: [
          WEEK_DAYS,
          {
            $subtract: [
              {
                $isoDayOfWeek: {
                  date: "$$NOW",
                  timezone: "Asia/Beirut",
                },
              },
              1,
            ],
          },
        ],
      },

      currentTime: {
        $dateToString: {
          date: "$$NOW",
          format: "%H:%M",
          timezone: "Asia/Beirut",
        },
      },
    },
  },

  // Find today's opening-hours entry.
  {
    $set: {
      todayOpeningHours: {
        $arrayElemAt: [
          {
            $filter: {
              input: {
                $ifNull: ["$openingHours", []],
              },
              as: "openingHour",
              cond: {
                $eq: ["$$openingHour.day", "$currentDay"],
              },
            },
          },
          0,
        ],
      },
    },
  },

  // Replace isOpen in the response with the calculated value.
  {
    $set: {
      isOpen: {
        $and: [
          // Owner's manual switch must be enabled.
          {
            $eq: ["$isOpen", true],
          },

          // Today's opening-hours entry must exist.
          {
            $ne: [
              {
                $ifNull: ["$todayOpeningHours", null],
              },
              null,
            ],
          },

          // Restaurant must not be marked closed today.
          {
            $eq: [
              {
                $ifNull: ["$todayOpeningHours.isClosed", false],
              },
              false,
            ],
          },

          // Restaurant must already be open.
          {
            $lte: ["$todayOpeningHours.openTime", "$currentTime"],
          },

          // Restaurant must not have closed yet.
          {
            $gt: ["$todayOpeningHours.closeTime", "$currentTime"],
          },
        ],
      },
    },
  },
];
