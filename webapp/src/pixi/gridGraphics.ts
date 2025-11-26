import { Graphics, type Container } from "pixi.js";
import GridState from "./gridState";

export default class GridGraphics {
    private cellSize: number = 16;

    private canvasSize: number = 384;

    constructor(canvasSize: number) {
        this.canvasSize = canvasSize;
    }

    render(state: GridState, stage: Container): void {
        stage.removeChildren();

        if (state.gridSize === 0) {
            return;
        }

        this.cellSize = this.canvasSize / state.gridSize;

        for (let y = 0; y < state.gridSize; y++) {
            for (let x = 0; x < state.gridSize; x++) {
                if (state.getCell(x, y) === 1) {
                    const cellGraphic = new Graphics();

                    cellGraphic.rect(
                        x * this.cellSize, y * this.cellSize,
                        this.cellSize, this.cellSize
                    ).fill(0x00aa00)

                    stage.addChild(cellGraphic);
                }
            }
        }
    }
}