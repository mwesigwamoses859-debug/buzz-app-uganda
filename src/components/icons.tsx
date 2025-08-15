import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 13.5L20 5.5" />
      <path d="M12 13.5L4 5.5" />
      <path d="M12 13.5V22" />
      <path d="M8 8.5h8" />
      <path d="M7 5.5L4.5 3" />
      <path d="M17 5.5l2.5-2.5" />
    </svg>
  );
}
