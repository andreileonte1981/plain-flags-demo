import { Application } from "pixi.js";
import GridState from "./gridState";
import GridGraphics from "./gridGraphics";

export default class PixiContent {
    static readonly canvasWidth = 384;
    static readonly canvasHeight = 384;

    static async init(document: Document) {
        const pixiApp = new Application();

        await pixiApp.init({
            width: this.canvasWidth,
            height: this.canvasHeight
        });

        document.getElementById("canvas")!.appendChild(pixiApp.canvas);

        const gridState = new GridState();
        await gridState.update();

        const gridGraphics = new GridGraphics();

        gridGraphics.render(gridState, pixiApp.stage);
    }
}
