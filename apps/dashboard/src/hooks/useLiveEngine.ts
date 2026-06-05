"use client";

export function useLiveEngine() {
  return {
    available: Boolean(process.env.NEXT_PUBLIC_ENGINE_URL),
  };
}
