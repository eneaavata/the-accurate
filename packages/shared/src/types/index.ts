// Shared types used across the monorepo

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};
