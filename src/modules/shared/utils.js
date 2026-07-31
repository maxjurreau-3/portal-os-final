export function uid(prefix = '') {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export function nowISO() {
  return new Date().toISOString();
}
