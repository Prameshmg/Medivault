# Medivault

This project is a comprehensive medical record management system, divided into a client-side frontend application and a server-side backend API.

## Project Structure

The repository is structured into two main directories to separate the client and server concerns:

```
Medivault/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── uploads/
└── frontend/
    ├── assets/
    └── src/
        ├── context/
        ├── navigation/
        └── screens/
```

- `frontend/`: Contains the React Native / Expo application for the user interface.
- `backend/`: Contains the Node.js / Express backend server, which handles the API, database interactions, and business logic.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for running the frontend)

## Installation and Setup

### 1. Backend Setup

Navigate to the backend directory, install dependencies, and start the server.

```bash
cd backend
npm install

# Make sure to configure your environment variables in backend/.env before starting
npm start
```

### 2. Frontend Setup

Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Expo development server.

```bash
cd frontend
npm install

# Start the Expo development server
npm start
```

## Features
- **Frontend**: Cross-platform mobile application built with React Native and Expo.
- **Backend**: RESTful API built with Express.js and Node.js.
