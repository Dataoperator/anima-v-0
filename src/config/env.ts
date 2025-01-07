export const ENV = {
  // Canister IDs
  ANIMA_CANISTER_ID: process.env.ANIMA_CANISTER_ID || "l2ilz-iqaaa-aaaaj-qngjq-cai",
  ASSETS_CANISTER_ID: process.env.ASSETS_CANISTER_ID || "lpp2u-jyaaa-aaaaj-qngka-cai",

  // Identity Provider
  II_URL: process.env.II_URL || "https://identity.ic0.app",

  // Development flags
  IS_DEVELOPMENT: process.env.NODE_ENV !== "production",
  
  // Network configuration
  HOST: process.env.DFX_NETWORK === "ic" 
    ? "https://icp-api.io"
    : `http://localhost:${process.env.DFX_PORT || 4943}`,

  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
  OPENAI_VISION_MODEL: process.env.OPENAI_VISION_MODEL || "gpt-4-vision-preview",
  OPENAI_MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || "300"),
  OPENAI_TEMPERATURE: parseFloat(process.env.OPENAI_TEMPERATURE || "0.85"),
  OPENAI_PRESENCE_PENALTY: parseFloat(process.env.OPENAI_PRESENCE_PENALTY || "0.6"),
  OPENAI_FREQUENCY_PENALTY: parseFloat(process.env.OPENAI_FREQUENCY_PENALTY || "0.3"),
  OPENAI_TOP_P: parseFloat(process.env.OPENAI_TOP_P || "0.95"),
  OPENAI_MAX_RETRIES: parseInt(process.env.OPENAI_MAX_RETRIES || "3"),
  OPENAI_RETRY_DELAY: parseInt(process.env.OPENAI_RETRY_DELAY || "1000"),
  
  // Memory Configuration
  MAX_RECENT_MEMORIES: parseInt(process.env.MAX_RECENT_MEMORIES || "10"),
  MAX_MEMORY_TOKENS: parseInt(process.env.MAX_MEMORY_TOKENS || "2000"),
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS: parseInt(process.env.RATE_LIMIT_REQUESTS || "20"),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
  USER_RATE_LIMIT_REQUESTS: parseInt(process.env.USER_RATE_LIMIT_REQUESTS || "5"),
  USER_RATE_LIMIT_WINDOW_MS: parseInt(process.env.USER_RATE_LIMIT_WINDOW_MS || "10000"),
};