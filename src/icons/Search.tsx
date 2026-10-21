import { IconBase, type IconProps } from "./IconBase";

export const Search = ({ className = "", ...props }: IconProps) => {
  return (
    <IconBase className={className} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </IconBase>
  );
};
