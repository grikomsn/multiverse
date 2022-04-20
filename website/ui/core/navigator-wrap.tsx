export interface NavigatorWrapProps {
  children: (opts: { navigator: Navigator }) => JSX.Element;
  has?: keyof Navigator;
}

export function NavigatorWrap({ children, has: key }: NavigatorWrapProps) {
  if (typeof navigator === "undefined") return null;
  if (key) if (!(key in navigator)) return null;
  return children({ navigator });
}
