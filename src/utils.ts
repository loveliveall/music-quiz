export function choice<T>(arr: T[]) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}
