/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
    readonly VITE_FUNCTION_API_URL: string;
    // add more as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  