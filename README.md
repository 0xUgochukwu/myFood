# myFood App

## Project Overview

**myFood** is a cross-platform mobile application designed to simplify meal planning by generating personalized weekly meal plans using AI. Built with React Native and Expo, the app leverages a Large Language Model (LLM) and Retrieval-Augmented Generation (RAG) via the Open AI Assistant to create meal plans based on users’ dietary needs, nutritional goals, and available ingredients. It features ingredient inventory tracking to reduce food waste, grocery list generation, and a community platform for sharing recipes and achievements. The backend, built with Express and Node.js, handles data management and AI integration, using MongoDB for storage. The app aims to alleviate meal planning stress, particularly for international students adapting to new environments, by providing tailored, healthy meal options.

## Project Structure

This project is organized into a monorepo structure for clarity and ease of management:

- **`packages/app`**: Contains the React Native frontend of the "myFood" app, built with Expo. This folder includes all the mobile app code, including screens (e.g., Meal Plan, Ingredients), services (e.g., `api.ts` for API calls), and assets.
- **`packages/backend`**: Contains the Express backend, responsible for API endpoints, data management, and communication with the Open AI Assistant for meal generation. It uses MongoDB for storing user data, meal plans, and ingredient inventories.

## Setup and Running Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or Yarn
- MongoDB (local or cloud instance)
- Expo CLI (`npm install -g expo-cli`)
- Open AI API key (for meal generation)

### Steps to Run the Project

1. **Clone the Repository**  
   Clone this repository to your local machine.

2. **Install Dependencies**  
   Navigate to the root directory and install dependencies for both the app and backend:
   ```
   cd packages/app && npm install
   cd ../backend && npm install
   ```

3. **Set Up Environment Variables**  
   - In `packages/backend`, create a `.env` file and add your MongoDB URI and Open AI API key:
     ```
     MONGODB_URI=your_mongodb_uri
     OPENAI_API_KEY=your_openai_api_key
     ```
   - In `packages/app`, ensure the backend URL is correctly set in `services/api.ts`.

4. **Run the Backend**  
   Start the Express server from the `packages/backend` folder:
   ```
   cd packages/backend && npm start
   ```
   The backend will run on `http://localhost:3000` (or your configured port).

5. **Run the App**  
   Start the React Native app from the `packages/app` folder:
   ```
   cd packages/app && expo start
   ```
   Use the Expo Go app on your mobile device or an emulator to view the app.

## Notes for Review
- The app has been tested on both iOS and Android devices via Expo.
- Sample user data and meal plans are included in the MongoDB database for testing.
- The project report provides detailed documentation of the development process, testing, and findings.

Thank you for reviewing my project! I hope "myFood" demonstrates the potential to simplify meal planning with AI.
