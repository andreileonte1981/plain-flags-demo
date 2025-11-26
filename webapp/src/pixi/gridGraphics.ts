import { Graphics, type Container } from "pixi.js";
import GridState from "./gridState";

export default class GridGraphics {
    private cellSize: number;

    constructor(cellSize: number = 16) {
        this.cellSize = cellSize;
    }

    render(state: GridState, stage: Container): void {
        stage.removeChildren();
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