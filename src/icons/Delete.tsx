import { IconBase, type IconProps } from "./IconBase";

export const Delete = (props: IconProps) => {
  return (
    <IconBase className="preview-icon" {...props}>
      <path d="M10 11v6M14 11v6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </IconBase>
  );
};
