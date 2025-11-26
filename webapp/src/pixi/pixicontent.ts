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
        await gridState.update();

        const gridGraphics = new GridGraphics(this.canvasSize);

        gridGraphics.render(gridState, pixiApp.stage);
    }
}
