# Investment Tracker

This project is an investment tracking application built with Node.js and Express.
It allows users to track their investments by storing information such as the name and value of each investment in a MongoDB database.

## Features

- Retrieve a list of all investments
- Create new investments

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv

## Setup Instructions

### Technological Requirements

- Node.js version 18 or higher

### Steps

1. Create a `.env` file in the root directory and add your MongoDB connection URI:

   ```
   MONGODB_URI=<your_mongodb_connection_uri>
   ```

   **Note:** The `MONGODB_URI` environment variable is required to connect to the MongoDB database. Make sure to replace `<your_mongodb_connection_uri>` with your actual MongoDB connection string.

2. Install the dependencies:

   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

## Usage

- To retrieve all investments, send a GET request to `/api/investments`.
- To create a new investment, send a POST request to `/api/investments` with the investment details in the request body.
