import { useState, useEffect } from 'react';

export interface DateTimeInfo {
  now: Date;
  timeString: string; // e.g. "2:16" or "9:41"
  timeWithSeconds: string; // e.g. "02:16:45"
  timeWithPeriod: string; // e.g. "2:16 AM"
  fullDateString: string; // e.g. "Tuesday, September 1"
  shortDateString: string; // e.g. "Tue, Sep 1"
  dayOfWeekShort: string; // e.g. "TUE"
  dayOfWeekLong: string; // e.g. "Tuesday"
  dayOfMonth: number; // e.g. 1
  monthName: string; // e.g. "September"
  monthShort: string; // e.g. "Sep"
  year: number; // e.g. 2026
}

export function formatDateTimeInfo(date: Date = new Date()): DateTimeInfo {
  // Format 12-hour time without AM/PM for iOS Status Bar & Lock Screen (e.g. "2:16" or "11:45")
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' should be '12'
  const timeString = `${hours}:${minutes}`;
  const timeWithPeriod = `${timeString} ${period}`;
  const timeWithSeconds = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${period}`;

  // Formatted date strings
  const dayOfWeekLong = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const dayOfWeekShort = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date).toUpperCase();
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  const fullDateString = `${dayOfWeekLong}, ${monthName} ${dayOfMonth}`;
  const shortDateString = `${dayOfWeekShort}, ${monthShort} ${dayOfMonth}`;

  return {
    now: date,
    timeString,
    timeWithSeconds,
    timeWithPeriod,
    fullDateString,
    shortDateString,
    dayOfWeekShort,
    dayOfWeekLong,
    dayOfMonth,
    monthName,
    monthShort,
    year
  };
}

export function useLiveClock(): DateTimeInfo {
  const [timeInfo, setTimeInfo] = useState<DateTimeInfo>(() => formatDateTimeInfo(new Date()));

  useEffect(() => {
    const update = () => setTimeInfo(formatDateTimeInfo(new Date()));
    // Initial call
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeInfo;
}

export function getWorldCityTime(timeZone: string, baseDate: Date = new Date()): { time: string; diff: string } {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const targetTimeString = formatter.format(baseDate);

    // Calculate hour difference
    const localHour = baseDate.getHours() + baseDate.getMinutes() / 60;
    const targetDate = new Date(baseDate.toLocaleString('en-US', { timeZone }));
    const targetHour = targetDate.getHours() + targetDate.getMinutes() / 60;
    
    let diffHours = Math.round(targetHour - localHour);
    if (diffHours > 12) diffHours -= 24;
    if (diffHours < -12) diffHours += 24;

    const diffStr = diffHours === 0
      ? 'Same as local'
      : diffHours > 0
      ? `+${diffHours} HRS${diffHours >= 12 ? ', Tomorrow' : ''}`
      : `${diffHours} HRS`;

    return {
      time: targetTimeString,
      diff: diffStr
    };
  } catch (e) {
    return {
      time: '9:41 AM',
      diff: 'Timezone unavailable'
    };
  }
}
