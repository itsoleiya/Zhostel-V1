const env = import.meta.env;

export const SITE_URL = (env.VITE_SITE_URL ?? "https://zhostel.com").replace(/\/$/, "");
export const ASSET_ORIGIN = (env.VITE_ASSET_ORIGIN ?? "https://zhostel.com").replace(/\/$/, "");
export const CONTACT_ENDPOINT = env.VITE_CONTACT_ENDPOINT ?? "";
export const LOAD_RALEWAY = env.VITE_LOAD_RALEWAY === "true";
