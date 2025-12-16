/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOVU_API_URL?: string;
  readonly VITE_NOVU_API_KEY?: string;
  readonly VITE_INTEGRATION_IDENTIFIER?: string;
  readonly VITE_AZURE_CLIENT_ID?: string;
  readonly VITE_AZURE_CLIENT_SECRET?: string;
  readonly VITE_AZURE_TENANT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
