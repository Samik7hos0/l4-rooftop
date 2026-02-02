/**
 * Reservation time slots – restaurant hours 5:30 PM – 11:00 PM, 30-min intervals.
 */

export const RESERVATION_TIME_SLOTS: { value: string; label: string }[] = (() => {
  const slots: { value: string; label: string }[] = [];
  for (let hour = 17; hour <= 23; hour++) {
    for (const min of [0, 30]) {
      if (hour === 23 && min === 30) break;
      const h = hour > 12 ? hour - 12 : hour;
      const m = min === 0 ? "00" : "30";
      const label = `${h}:${m} PM`;
      slots.push({ value: label, label });
    }
  }
  return slots;
})();
