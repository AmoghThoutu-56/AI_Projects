import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
// Load environment variables from .env file (Port # of the middleware server)
// __dirname, "..") gets the parent directory of the current file
// This is because the .env file is located in the parent directory
// of the chatbot_client directory
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, path.resolve(__dirname, ".."));

  //throw an error if the port is not defined in the .env file 
  // or if the .env file is missing
  if (!env.VITE_MIDDLEWARE_PORT) {
    throw new Error("env file not found or VITE_MIDDLEWARE_PORT not defined in .env");
  }

  return {
    plugins: [react()],
    define: {
      // Define the environment variable for the API port
      // This makes the variable available in the React app
      __MIDDLEWARE_PORT__: JSON.stringify(env.VITE_MIDDLEWARE_PORT),
    },
  };
});

