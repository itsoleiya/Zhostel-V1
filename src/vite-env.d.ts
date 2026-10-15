/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_BASE?: string;
  readonly VITE_ASSET_ORIGIN?: string;
  readonly VITE_CONTACT_ENDPOINT?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_LOAD_RALEWAY?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv; }
