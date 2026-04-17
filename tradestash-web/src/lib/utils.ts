import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatRelativeTime(value?: string | null) {
  if (!value) {
    return "No recent activity";
  }

  return `${formatDistanceToNowStrict(new Date(value))} ago`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function safeDate(value?: string | null) {
  return value ? new Date(value) : new Date();
}
