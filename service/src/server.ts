import express, { Request, Response, NextFunction } from 'express';
import GridState from './gridState';
import { errorHandler, logger, requestLogger } from './logger';

const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(requestLogger);
app.use(cors());

GridState.init(24);

app.get('/api/grid', (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Fetching grid state');
        res.status(200).json({ grid: GridState.grid });
    } catch (error) {
        logger.error('Error fetching grid state', error);
        next(error);
    }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

export default app;
