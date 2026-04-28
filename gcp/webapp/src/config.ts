interface AppConfig {
  GRID_URL: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: Partial<AppConfig>;
  }
}

const FALLBACK_GRID_URL = "http://localhost:3000/api/grid";

export function getConfig(): AppConfig {
  return {
    GRID_URL: window.__APP_CONFIG__?.GRID_URL ?? FALLBACK_GRID_URL,
  };
}
