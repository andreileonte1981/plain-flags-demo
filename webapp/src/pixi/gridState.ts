type Row = Array<number>

export default class GridState {
    static readonly gridSize = 24;

    grid: Array<Row> = new Array<Row>(GridState.gridSize);

    constructor() {
        for (let i = 0; i < GridState.gridSize; i++) {
            this.grid[i] = new Array<number>(GridState.gridSize).fill(0);
        }

        this.toggleRandomCells(100);
    }

    getCell(x: number, y: number): number {
        return this.grid[y][x];
    }

    setCell(x: number, y: number): void {
        this.grid[y][x] = 1;
    }

    clearCell(x: number, y: number): void {
        this.grid[y][x] = 0;
    }

    toggleCell(x: number, y: number): void {
        this.grid[y][x] = this.grid[y][x] === 0 ? 1 : 0;
    }

    toggleRandomCells(count: number): void {
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * GridState.gridSize);
            const y = Math.floor(Math.random() * GridState.gridSize);
            this.toggleCell(x, y);
        }
    }
}