
interface Props {
  text: string;
}

export const ContentEmpty = ({ text }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <p className="text-sm font-semibold text-slate-900">{text}</p>
    </div>
  );
};
