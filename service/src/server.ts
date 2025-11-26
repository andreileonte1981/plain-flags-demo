import express, { Request, Response } from 'express';
import GridState from './gridState';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

GridState.init(24);

app.get('/api/grid', (req: Request, res: Response) => {
    res.status(200).json({ grid: GridState.grid });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
