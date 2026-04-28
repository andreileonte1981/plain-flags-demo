import { Application } from "pixi.js";
import GridState from "./gridState";
import GridGraphics from "./gridGraphics";

export default class PixiContent {
  static readonly canvasSize = 384;

  static async init(document: Document) {
    const canvasContainer = document.getElementById("canvas");
    if (!canvasContainer) {
      console.error("Canvas container not found");
      return;
    }

    // Clear any existing canvas
    canvasContainer.innerHTML = "";

    try {
      const webglSupported = this.isWebGLSupported();
      console.log(`WebGL supported: ${webglSupported}`);

      const pixiApp = new Application();

      const initOptions = {
        width: this.canvasSize,
        height: this.canvasSize,
        backgroundColor: 0x000000,
        ...(webglSupported
          ? { preference: "webgl" as const, antialias: true }
          : {
            preference: "webgl" as const,
            failIfMajorPerformanceCaveat: false,
            antialias: false,
          }),
      };

      await pixiApp.init(initOptions);

      console.log(`PIXI renderer type: ${pixiApp.renderer.type}`);
      console.log("PIXI Application initialized successfully");

      canvasContainer.appendChild(pixiApp.canvas);

      const gridState = new GridState();
      const gridGraphics = new GridGraphics(this.canvasSize);

      this.updateLoop(gridState, gridGraphics, pixiApp);
    } catch (error) {
      console.error("Failed to initialize PIXI:", error);

      if (
        error instanceof Error &&
        (error.message.includes("CanvasRenderer is not yet implemented") ||
          error.message.includes("WebGL") ||
          error.message.includes("canvas"))
      ) {
        console.log("Attempting fallback initialization...");
        try {
          await this.initFallback(canvasContainer);
          return;
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }

      this.showFallbackError(canvasContainer, error);
    }
  }

  private static async initFallback(canvasContainer: HTMLElement) {
    const pixiApp = new Application();

    await pixiApp.init({
      width: this.canvasSize,
      height: this.canvasSize,
      backgroundColor: 0x000000,
      antialias: false,
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: false,
      clearBeforeRender: true,
    });

    console.log(`Fallback PIXI renderer type: ${pixiApp.renderer.type}`);
    canvasContainer.appendChild(pixiApp.canvas);

    const gridState = new GridState();
    const gridGraphics = new GridGraphics(this.canvasSize);

    this.updateLoop(gridState, gridGraphics, pixiApp);
  }

  private static isWebGLSupported(): boolean {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") ||
        canvas.getContext(
          "experimental-webgl"
        )) as WebGLRenderingContext | null;

      if (!gl) {
        console.log("WebGL context creation failed");
        return false;
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        console.log(
          "WebGL Renderer:",
          gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        );
        console.log(
          "WebGL Vendor:",
          gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        );
      }

      const shader = gl.createShader(gl.VERTEX_SHADER);
      if (!shader) {
        console.log("WebGL shader creation failed");
        return false;
      }

      gl.deleteShader(shader);
      return true;
    } catch (e) {
      console.log("WebGL support check failed:", e);
      return false;
    }
  }

  private static showFallbackError(container: HTMLElement, error: unknown) {
    const webglSupported = this.isWebGLSupported();
    const isCanvasRendererError =
      error instanceof Error &&
      error.message.includes("CanvasRenderer is not yet implemented");

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-96 w-96 bg-gray-100 border-2 border-gray-300 rounded-lg text-center p-4">
        <div class="text-red-600 text-2xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Graphics Initialization Failed</h3>
        <p class="text-sm text-gray-600 mb-4">
          ${isCanvasRendererError
        ? "Canvas rendering is not supported in this PIXI.js version."
        : "Your browser may have WebGL disabled or graphics acceleration issues."}
        </p>
        <div class="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-800">
          <strong>WebGL Status:</strong> ${webglSupported ? "✅ Supported" : "❌ Not Available"}
        </div>
        <details class="text-xs text-gray-500 max-w-full mb-4">
          <summary class="cursor-pointer hover:text-gray-700 mb-2">Technical Details</summary>
          <pre class="whitespace-pre-wrap wrap-break-word text-left bg-gray-50 p-2 rounded">${error instanceof Error ? error.message : String(error)}</pre>
        </details>
        <div class="text-sm text-gray-600">
          <p class="font-semibold mb-2">Suggestions:</p>
          <ul class="text-left space-y-1">
            ${!webglSupported
        ? "<li>• Enable WebGL in your browser settings</li><li>• Check if hardware acceleration is enabled</li>"
        : ""}
            <li>• Update your graphics drivers</li>
            <li>• Try a different browser (Chrome, Firefox, Edge)</li>
            ${isCanvasRendererError
        ? "<li>• This may require a PIXI.js version with Canvas support</li>"
        : ""}
          </ul>
          <div class="mt-3 p-2 bg-yellow-50 rounded text-yellow-800">
            <strong>Brave Browser Users:</strong> Try disabling "Block fingerprinting" in Shields settings
          </div>
        </div>
      </div>
    `;
  }

  private static async updateLoop(
    gridState: GridState,
    gridGraphics: GridGraphics,
    pixiApp: Application
  ) {
    await gridState.update();
    gridGraphics.render(gridState, pixiApp.stage);
    setTimeout(() => this.updateLoop(gridState, gridGraphics, pixiApp), 2000);
  }
}
