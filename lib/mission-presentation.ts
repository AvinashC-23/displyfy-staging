import type { Mission } from "./types";

const missionImages: Record<string, string> = {
  "7fa93180-4c69-40f2-8984-7a3f28506b3a": "/assets/editorial/tech-creator-laptop-sticker.webp",
  "97f54005-fb9e-4ef2-a734-9643442cdb42": "/assets/editorial/style-creator-natural-placement.webp",
  "a76c0dc8-0b47-4736-91cb-3e9cdf336772": "/assets/editorial/cooking-creator-natural-placement.webp"
};

const categoryImages: Record<string, string> = {
  fashion: "/assets/editorial/style-creator-natural-placement.webp",
  fitness: "/assets/editorial/fitness-creator-balcony.webp",
  food: "/assets/editorial/cooking-creator-natural-placement.webp",
  lifestyle: "/assets/editorial/travel-creator-bookshop-cafe.webp",
  home: "/assets/editorial/cooking-creator-natural-placement.webp",
  tech: "/assets/editorial/tech-creator-laptop-sticker.webp"
};

export function getMissionImage(mission: Mission) {
  return missionImages[mission.id] ?? categoryImages[mission.category] ?? "/assets/editorial/creator-collaboration-editing.webp";
}

export function getMissionAvailability(mission: Mission) {
  const remaining = Math.max(0, mission.capacity - mission.reservedSlots);
  if (mission.status !== "live") return { label: mission.status.replaceAll("_", " "), available: false, remaining };
  if (remaining === 0) return { label: "Fully booked", available: false, remaining };
  return { label: `${remaining} creator spots`, available: true, remaining };
}

export function formatMissionDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}
