
import { IconBase, type IconProps } from "./IconBase";

export const Clock = (props: IconProps) => {
  return (
    <IconBase className="size-3 shrink-0" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </IconBase>
  );
};
