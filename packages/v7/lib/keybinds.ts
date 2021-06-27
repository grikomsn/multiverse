export const KEYBINDS_MAP = {
  "g h": "Navigate to home",
  "g b": "Navigate to blog posts",
  "g a": "Navigate to appearances",
  "g p": "Navigate to projects",
  "g m": "Navigate to about page",
  "g d": "Navigate to CMS dashboard",
  "Shift+?": "Show keybinds cheatsheet",
  "Meta+KeyK": "Show navigation menu",
} as const;

export type KeybindsKeys = keyof typeof KEYBINDS_MAP;

export type KeybindsRecord<T> = Record<KeybindsKeys, T>;

export function createKeybindsRecord<T>(record: KeybindsRecord<T>) {
  return record;
}
