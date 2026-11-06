const express = require('express');
const cors = require('cors');

function createApp() {
  // Create an Express application.
  const app = express();

  // Allow local dev clients (React/Vite default ports).
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }));

  // Middleware to parse JSON bodies
  /**
   * Own notes: required to get access to data from the body property
   * of the request object (POST).
   * Without the json-parser, the body property would be undefined.
   */
  app.use(express.json());

  // Middleware function to print information about every request sent to server.
  const logger = (request, _response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
  };

  // Middleware for logging requests.
  app.use(logger);

  // Define routes.
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'fog-server',
      ts: new Date().toISOString(),
    });
  });

  app.get('/', (_req, res) => {
    res.status(200).json({
      message: 'FOG server is running',
    });
  });

  // Middleware function to catch requests to non-existent routes.
  const unknownEndpoint = (_request, response) => {
    response.status(404).json({ error: 'Unknown endpoint' });
  };

  app.use(unknownEndpoint);

  // Ensure middleware and CORS errors are consistently returned as JSON.
  const errorHandler = (error, _request, response, next) => {
    if (error.message === 'Not allowed by CORS') {
      return response.status(403).json({ error: 'Not allowed by CORS' });
    }

    if (response.headersSent) {
      return next(error);
    }

    return response.status(500).json({ error: 'Internal server error' });
  };

  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
