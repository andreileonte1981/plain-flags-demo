import express, { Request, Response, NextFunction } from 'express';

// Logging utility
export const logger = {
    info: (message: string, data?: any) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    },
    error: (message: string, error?: any) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`, error ? JSON.stringify(error, null, 2) : '');
    },
    request: (req: Request) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] REQUEST: ${req.method} ${req.originalUrl}`, {
            headers: req.headers,
            body: req.body,
            query: req.query,
            params: req.params
        });
    },
    response: (req: Request, res: Response, responseBody?: any) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] RESPONSE: ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`, {
            responseBody: responseBody || 'No body'
        });
    }
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.request(req);

    // Capture the original res.json method
    const originalJson = res.json;

    // Override res.json to log responses
    res.json = function (body: any) {
        logger.response(req, res, body);
        return originalJson.call(this, body);
    };

    next();
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, {
        message: err.message,
        stack: err.stack,
        body: req.body,
        query: req.query,
        params: req.params
    });

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};
