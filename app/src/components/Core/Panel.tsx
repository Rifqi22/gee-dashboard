import React from "react";

interface Props {
  children: React.ReactNode;
}

const Panel: React.FC<Props> = ({ children }) => {
  return (
    <aside className="h-full flex flex-col  max-w-xs space-y-4 p-4 bg-neutral-950">
      {children}
    </aside>
  );
};

export default Panel;
