# Plain Flags Service

Express.js service with TypeScript for the plain flags demo application.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Navigate to the service directory:

   ```bash
   cd service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Service

#### Development mode (with auto-restart using Node's watch mode):

```bash
npm run dev
```

#### Production mode:

```bash
npm start
```

#### Build only:

```bash
npm run build
```

The service will start on port 3000 by default (or the port specified in the PORT environment variable).

## API Endpoints

### GET /api/data

Returns an empty JSON object with 200 status.

**Response:**

```json
{}
```

**Status Code:** 200
