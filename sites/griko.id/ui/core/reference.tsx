import * as React from "react";

export type ReferenceProps = React.PropsWithChildren<{}>;

export default function Reference({ children }: ReferenceProps) {
  return (
    <div className="pl-4 border-l-4 border-gray-600">
      <div className="h-px" />
      {children}
      <div className="h-px" />
    </div>
  );
}
