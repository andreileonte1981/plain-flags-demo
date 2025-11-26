import { Application } from "pixi.js";
import GridState from "./gridState";
import GridGraphics from "./gridGraphics";

export default class PixiContent {
    static readonly canvasSize = 384;

    static async init(document: Document) {
        const pixiApp = new Application();

        await pixiApp.init({
            width: this.canvasSize,
            height: this.canvasSize
        });

        document.getElementById("canvas")!.appendChild(pixiApp.canvas);

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
