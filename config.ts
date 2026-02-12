// Environment configuration
export const ENV = {
  // Backend API URL - change this to your deployed backend URL
  API_URL: import.meta.env.VITE_API_URL || 'https://aio-llmo-strategy-osint-analyzer.vercel.app',
} as const;
