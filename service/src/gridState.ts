export default class GridState {
    static grid: number[][] = [];
    static gridSize: number = 0;

    static init(gridSize: number): void {
        GridState.grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        GridState.gridSize = gridSize;

        this.updateLoop(gridSize);
    }

    private static async updateLoop(gridSize: number): Promise<void> {
        GridState.toggleRandomCells(Math.floor((gridSize * gridSize) / 4));

        setTimeout(() => this.updateLoop(gridSize), 1000);
    }

    static toggleCell(x: number, y: number): void {
        this.grid[y][x] = this.grid[y][x] === 0 ? 1 : 0;
    }

    static toggleRandomCells(count: number): void {
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * GridState.gridSize);
            const y = Math.floor(Math.random() * GridState.gridSize);
            this.toggleCell(x, y);
        }
    }
}
