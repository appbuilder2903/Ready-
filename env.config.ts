/**
 * Environment Configuration Module
 * Manages environment variables for production-ready deployment
 * All API keys and sensitive data should be loaded from environment variables
 */

interface EnvironmentConfig {
  // Gemini API
  GEMINI_API_KEY: string;
  
  // OAuth Configuration
  GOOGLE_CLIENT_ID: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  
  // External AI Services
  EDEN_AI_KEY: string;
  OPENAI_KEY: string;
  OPENROUTER_KEY: string;
  
  // App Configuration
  APP_NAME: string;
  APP_VERSION: string;
}

/**
 * Loads environment variables with fallback support
 * Priority: import.meta.env (Vite) > window.process.env (legacy) > defaults
 */
function loadEnvVar(key: string, fallback: string = ''): string {
  // Try Vite environment variables first (production-ready approach)
  if (typeof import.meta !== 'undefined') {
    const env = (import.meta as any).env;
    if (env && env[key]) {
      return env[key] as string;
    }
  }
  
  // Fallback to window.process.env for development
  if (typeof window !== 'undefined' && 
      window.process && 
      window.process.env && 
      window.process.env[key]) {
    return window.process.env[key];
  }
  
  return fallback;
}

/**
 * Validates that required environment variables are present
 */
function validateEnvironment(config: EnvironmentConfig): void {
  const requiredKeys: (keyof EnvironmentConfig)[] = ['GEMINI_API_KEY'];
  const missing: string[] = [];
  
  for (const key of requiredKeys) {
    if (!config[key] || config[key] === 'your_gemini_api_key_here') {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    console.warn(
      '⚠️ Missing required environment variables:',
      missing.join(', '),
      '\nPlease check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Production-ready environment configuration
 * Loads all environment variables with proper fallbacks
 */
export const ENV: EnvironmentConfig = {
  // Gemini API Key (Required)
  GEMINI_API_KEY: loadEnvVar('VITE_GEMINI_API_KEY', loadEnvVar('API_KEY', '')),
  
  // OAuth Configuration
  GOOGLE_CLIENT_ID: loadEnvVar('VITE_GOOGLE_CLIENT_ID', loadEnvVar('GOOGLE_CLIENT_ID', '')),
  GITHUB_CLIENT_ID: loadEnvVar('VITE_GITHUB_CLIENT_ID', loadEnvVar('GITHUB_CLIENT_ID', '')),
  GITHUB_CLIENT_SECRET: loadEnvVar('VITE_GITHUB_CLIENT_SECRET', loadEnvVar('GITHUB_CLIENT_SECRET', '')),
  
  // External AI Services (Optional)
  EDEN_AI_KEY: loadEnvVar('VITE_EDEN_AI_KEY', loadEnvVar('EDEN_AI_KEY', '')),
  OPENAI_KEY: loadEnvVar('VITE_OPENAI_KEY', loadEnvVar('OPEN_AI_KEY', '')),
  OPENROUTER_KEY: loadEnvVar('VITE_OPENROUTER_KEY', loadEnvVar('OPEN_ROUTER_KEY', '')),
  
  // App Configuration
  APP_NAME: loadEnvVar('VITE_APP_NAME', 'Codesphere 2.0'),
  APP_VERSION: loadEnvVar('VITE_APP_VERSION', '2.0.0'),
};

// Validate environment on module load
validateEnvironment(ENV);

// Export utility function for runtime checks
export function isConfigured(): boolean {
  return !!ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY !== 'your_gemini_api_key_here';
}

export function getConfigStatus(): { configured: boolean; missing: string[] } {
  const required = ['GEMINI_API_KEY'];
  const missing = required.filter(key => {
    const value = ENV[key as keyof EnvironmentConfig];
    return !value || value === `your_${key.toLowerCase()}_here`;
  });
  
  return {
    configured: missing.length === 0,
    missing
  };
}
