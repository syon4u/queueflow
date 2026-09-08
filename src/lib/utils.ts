import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Reads `.message` off an unknown thrown value, returning undefined when
 * there is none — the same result `error.message` gave when `error` was `any`.
 */
export function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error as { message?: unknown };
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
}

/** `value?.[key]` when `value` is an object and the property is a string; otherwise undefined. */
export function getStringProp(value: unknown, key: string): string | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const prop = (value as Record<string, unknown>)[key];
  return typeof prop === 'string' ? prop : undefined;
}

/** `value?.[key]` when `value` is an object and the property is a number; otherwise undefined. */
export function getNumberProp(value: unknown, key: string): number | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const prop = (value as Record<string, unknown>)[key];
  return typeof prop === 'number' ? prop : undefined;
}
