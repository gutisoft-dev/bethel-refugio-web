import { IconBase, type IconProps } from "./IconBase";

export const Close = (props: IconProps) => {
  return (
    <IconBase className="size-4" {...props}>
      <path d="m18 6-12 12M6 6l12 12" />
    </IconBase>
  );
};
