import React, { useEffect, useState } from "react";

const FermentationTimer = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - start) / 1000);
      setElapsed(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return <span>{formatTime(elapsed)}</span>;
};

export default FermentationTimer;
