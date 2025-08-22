import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Wrapper: React.FC<Props> = ({ className, children }) => {
  return (
    <section className={`p-2 bg-neutral-950 ${className}`}>{children}</section>
  );
};

export default Wrapper;
