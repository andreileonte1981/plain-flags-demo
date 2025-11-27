import PlainFlags from "plain-flags-node-sdk";

export default class GridState {
    static flags: PlainFlags = new PlainFlags({
        policy: "poll",
        serviceUrl: "http://localhost:5001",
        timeout: 20000,
        pollInterval: 1000,
        apiKey: process.env.PLAIN_FLAGS_API_KEY || "",
        logStateUpdatesOnPoll: true,
    }, null, null);

    static grid: number[][] = [];
    static gridSize: number = 0;

    static async init(gridSize: number): Promise<void> {
        GridState.grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        GridState.gridSize = gridSize;

        await GridState.flags.init();

        this.updateLoop(gridSize);
    }

    private static async updateLoop(gridSize: number): Promise<void> {
        await GridState.getGridStateFromFlags()

        setTimeout(() => this.updateLoop(gridSize), 1000);
    }

    private static async getGridStateFromFlags(): Promise<void> {
        for (let row = 0; row < GridState.gridSize; row++) {
            for (let col = 0; col < GridState.gridSize; col++) {
                const flagName = `pixel-${row}-${col}`;
                const flagValue = await GridState.flags.isOn(flagName) ? 1 : 0;

                GridState.grid[row][col] = flagValue;
            }
        }
    }
}