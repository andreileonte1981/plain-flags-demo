import { Graphics, type Container } from "pixi.js";
import GridState from "./gridState";

export default class GridGraphics {
    render(state: GridState, stage: Container): void {
        stage.removeChildren();
        for (let y = 0; y < GridState.gridSize; y++) {
            for (let x = 0; x < GridState.gridSize; x++) {
                if (state.getCell(x, y) === 1) {
                    const cellGraphic = new Graphics();
                    cellGraphic.rect(x * 16, y * 16, 16, 16).fill(0x00aa00)
                    stage.addChild(cellGraphic);
                }
            }
        }
    }
}