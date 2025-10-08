export const nanoid = (): string =>
  Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

export const STORAGE_KEY = 'pre-mortem-workshop-data-v1';
