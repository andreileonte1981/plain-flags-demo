import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// GET endpoint that returns empty JSON
app.get('/api/data', (req: Request, res: Response) => {
    res.status(200).json({});
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
