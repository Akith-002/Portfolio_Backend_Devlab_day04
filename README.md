# Portfolio Backend

This is the backend for my portfolio project, built with Node.js, Express, and MongoDB. It provides various APIs to handle data for blog management, file uploads, user authentication, and communication with an AI chatbot powered by the Gemini API.

## Features

- **Express.js**: Server-side framework for creating routes and handling requests.
- **MongoDB**: Database to store blog data, user information, and other dynamic content.
- **Multer**: File upload handler for managing file uploads (e.g., images).
- **Google Generative AI**: Provides AI-powered chatbot responses via the Gemini API.
- **Environment variables**: Managed securely using `dotenv`.
- **CORS**: Handles cross-origin requests to ensure smooth communication between the frontend and backend.
- **Compression**: Reduces the size of the response body to improve performance.
- **Nodemon**: Development tool to automatically restart the server when changes are detected.

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Multer**
- **Google Generative AI**
- **dotenv**
- **Nodemon**

## Prerequisites

Ensure you have the following installed:

- **Node.js**: >= 14.x
- **MongoDB**: Installed and running on your local machine or cloud-based MongoDB (e.g., MongoDB Atlas).
  
## Getting Started

1. Clone this repository:

    ```bash
    git clone https://github.com/Akith-002/portfolio_backend.git
    cd portfolio_backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    ```

4. Start the development server:

    ```bash
    npm start
    ```

## Dependencies

- **[@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)**: `^0.19.0`
- **[compression](https://www.npmjs.com/package/compression)**: `^1.7.4`
- **[cors](https://www.npmjs.com/package/cors)**: `^2.8.5`
- **[dotenv](https://www.npmjs.com/package/dotenv)**: `^16.4.5`
- **[express](https://www.npmjs.com/package/express)**: `^4.21.0`
- **[mongoose](https://www.npmjs.com/package/mongoose)**: `^8.3.3`
- **[multer](https://www.npmjs.com/package/multer)**: `^1.4.5-lts.1`
- **[nodemon](https://www.npmjs.com/package/nodemon)**: `^3.1.0`

## License

This project is licensed under the ISC License.

## Author

B. A. Akith Chandinu
