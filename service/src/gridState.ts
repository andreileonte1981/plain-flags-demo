import PlainFlags from "plain-flags-node-sdk";
import { promises as fs } from "fs";
export default class GridState {
    static flags: PlainFlags

    static grid: number[][] = [];
    static gridSize: number = 0;

    static async init(gridSize: number): Promise<void> {
        GridState.grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        GridState.gridSize = gridSize;

        const apiKeyFile = process.env.PLAIN_FLAGS_API_KEY_FILE || "";

        const apiKey = apiKeyFile.length > 0 ? (await fs.readFile(apiKeyFile, "utf-8")).trim() || "" : (process.env.PLAIN_FLAGS_API_KEY || "");

        GridState.flags = new PlainFlags({
            policy: "poll",
            serviceUrl: process.env.PLAIN_FLAGS_STATES_URL || "",
            timeout: 20000,
            pollInterval: 1000,
            apiKey,
            logStateUpdatesOnPoll: true,
        },
            null,   // Mute logs
            null    // Mute errors
        );

        await GridState.flags.init(true);

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
                let flagValue = 0;

                /**************************
                *  Feature enabling code: *
                **************************/
                if (GridState.flags.isOn(flagName)) {
                    flagValue = 1;
                }

                GridState.grid[row][col] = flagValue;
            }
        }
    }
}
