const LOCAL_API_ORIGIN = "http://localhost:5000";
const PRODUCTION_API_ORIGIN = "https://renattire.onrender.com";

const isLocalHostname = (hostname) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1";

export const getApiOrigin = () => {
  const envUrl = process.env.REACT_APP_API_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");

  if (typeof window !== "undefined" && !isLocalHostname(window.location.hostname)) {
    return PRODUCTION_API_ORIGIN;
  }

  return LOCAL_API_ORIGIN;
};

export const getApiBaseUrl = () => {
  const apiOrigin = getApiOrigin();
  return apiOrigin.endsWith("/api") ? apiOrigin : `${apiOrigin}/api`;
};
