export function choice<T>(arr: T[]) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

export function mod(n: number, m: number) {
  // Always return positive modular
  return ((n % m) + m) % m;
}
