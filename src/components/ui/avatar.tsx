import Image from "next/image";

import { initials } from "@/lib/utils";

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
} as const;

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  return src ? (
    <div className={`${sizeMap[size]} relative overflow-hidden rounded-2xl`}>
      <Image alt={name} className="object-cover" fill sizes="64px" src={src} />
    </div>
  ) : (
    <div
      className={`${sizeMap[size]} flex items-center justify-center rounded-2xl bg-[#7bff48]/18 font-semibold text-[#7bff48]`}
    >
      {initials(name)}
    </div>
  );
}
