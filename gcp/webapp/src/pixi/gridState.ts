import { getConfig } from "../config";

export default class GridState {
  gridSize = 0;

  grid: number[][] = [];

  getCell(x: number, y: number): number {
    return this.grid[y][x];
  }

  async update(): Promise<void> {
    try {
      const gridUrl = getConfig().GRID_URL;
      const response = await fetch(gridUrl);
      const data: { grid: number[][] } = await response.json();
      this.grid = data.grid;
      this.gridSize = Math.min(this.grid.length, this.grid[0]?.length || 0);
    } catch (error) {
      console.error("Failed to fetch grid state:", error);
    }
  }
}
