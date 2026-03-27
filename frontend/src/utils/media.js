import { getApiBaseUrl } from "../config/apiBaseUrl";

const API_BASE_URL = getApiBaseUrl();

const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const FALLBACK_IMAGE = "/logo192.png";

export const resolvePrimaryImage = (item) => {
  if (!item) return "";

  const candidates = [
    ...(Array.isArray(item.images) ? item.images : []),
    item.image,
    item.coverImage,
  ];

  return candidates.find((value) => typeof value === "string" && value.trim()) || "";
};

export const resolveMediaUrl = (inputPath) => {
  if (!inputPath) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(inputPath)) return inputPath;

  const normalized = String(inputPath).startsWith("/")
    ? String(inputPath)
    : `/${String(inputPath)}`;

  return `${BACKEND_ORIGIN}${normalized}`;
};
