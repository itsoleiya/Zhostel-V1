const env = import.meta.env;

export const SITE_URL = (env.VITE_SITE_URL ?? "https://zhostel.com").replace(/\/$/, "");
// Where /wp-content/... files load from. Empty (default) = this deployment's own copies in public/wp-content,
// prefixed with the base path (e.g. /Zhostel-V1/ on GitHub Pages). Set a full origin only for temporary hotlinking.
export const ASSET_ORIGIN = (env.VITE_ASSET_ORIGIN || env.BASE_URL || "/").replace(/\/$/, "");
export const CONTACT_ENDPOINT = env.VITE_CONTACT_ENDPOINT ?? "";

// Supabase project "Zhostel V1". The publishable key is designed to be public: the database only
// lets it INSERT into contact_messages (row-level security + column grants), nothing else.
export const SUPABASE_URL = (env.VITE_SUPABASE_URL ?? "https://pdiypxgvfzaiweiuhstf.supabase.co").replace(/\/$/, "");
export const SUPABASE_PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_GbIC2cAwr9zQJyekbS3ZMQ_5BxeKJB0";
export const LOAD_RALEWAY = env.VITE_LOAD_RALEWAY === "true";
