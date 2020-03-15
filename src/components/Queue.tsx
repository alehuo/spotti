import React from "react";

interface Props {
  token: string;
}

export const Queue: React.FC<Props> = ({ token }) => <div className="queue" />;
