import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Application } from "pixi.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const pixiApp = new Application();

await pixiApp.init({ width: 384, height: 384, backgroundColor: 0x000000 });

document.getElementById("canvas")!.appendChild(pixiApp.canvas);
