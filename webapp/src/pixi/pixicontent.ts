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
        canvasContainer.innerHTML = '';

        const pixiApp = new Application();

        await pixiApp.init({
            width: this.canvasSize,
            height: this.canvasSize,
            backgroundColor: 0x000000 // Add explicit black background
        });

        canvasContainer.appendChild(pixiApp.canvas);

        const gridState = new GridState();
        const gridGraphics = new GridGraphics(this.canvasSize);

        this.updateLoop(gridState, gridGraphics, pixiApp);
    }

    private static async updateLoop(gridState: GridState, gridGraphics: GridGraphics, pixiApp: Application) {
        await gridState.update();

        gridGraphics.render(gridState, pixiApp.stage);

        setTimeout(() => this.updateLoop(gridState, gridGraphics, pixiApp), 2000);
    }
}
