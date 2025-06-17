/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_FUNCTION_API_URL: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
  readonly VITE_RAZORPAY_KEY_SECRET: string;
  readonly NEXT_PUBLIC_ENV: string;
  // Add more env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
