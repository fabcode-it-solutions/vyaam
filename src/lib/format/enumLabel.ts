/** Turns a backend snake_case enum value into a display label, e.g. "north_indian" -> "North Indian". */
export function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
