const seoulDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
});

export function todayInSeoul() {
  const parts = Object.fromEntries(seoulDate.formatToParts(new Date()).map(({ type, value }) => [type, Number(value)]));
  return new Date(parts.year, parts.month - 1, parts.day);
}

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function dateKey(date: Date) {
  return `${monthKey(date)}-${String(date.getDate()).padStart(2, '0')}`;
}

export function weekInSeoul(today: Date) {
  const monday = today.getDate() - (today.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, index) => new Date(today.getFullYear(), today.getMonth(), monday + index));
}
