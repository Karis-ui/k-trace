import React from "react";

export default function CountUpNumber({ target, duration = 1200, className }) {
  const [n, setN] = React.useState(0);

  React.useEffect(() => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setN(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span className={className}>{n.toLocaleString()}</span>;
}
