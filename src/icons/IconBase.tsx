import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

interface IconBaseProps extends IconProps {
  children: React.ReactNode;
}

export const IconBase = ({ children, ...props }: IconBaseProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);
