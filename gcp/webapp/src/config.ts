interface AppConfig {
  GRID_URL: string;
}

declare global {
  interface Window {
    ENV?: Partial<AppConfig>;
  }
}

const FALLBACK_GRID_URL = "http://localhost:3000/api/grid";

export function getConfig(): AppConfig {
  // Priority: runtime-injected ENV (prod) -> Vite .env value (dev) -> fallback
  const runtimeGridUrl = window.ENV?.GRID_URL;
  const devGridUrl = import.meta.env.GRID_URL as string | undefined;
  const gridUrl = runtimeGridUrl || devGridUrl;

  return {
    GRID_URL:
      gridUrl && !gridUrl.includes("__") ? gridUrl : FALLBACK_GRID_URL,
  };
}
