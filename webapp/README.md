# Plain Flags Web App

React single page application for the plain flags demo.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Navigate to the webapp directory:

   ```bash
   cd webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development mode:

```bash
npm start
```

The app will run on http://localhost:3000 and automatically reload when you make changes.

#### Build for production:

```bash
npm run build
```

#### Run tests:

```bash
npm test
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (one-way operation)

## Project Structure

```
webapp/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
└── tsconfig.json
```
