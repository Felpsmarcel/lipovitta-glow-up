import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

const CountdownTimer = ({ targetDate, className = "" }: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={`inline-flex items-center gap-1 font-sans text-sm font-bold ${className}`}>
      <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(timeLeft.days)}d</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(timeLeft.hours)}h</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(timeLeft.minutes)}m</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(timeLeft.seconds)}s</span>
    </div>
  );
};

export default CountdownTimer;
