const trimTrailingSlashes = (value = '') => value.replace(/\/+$/, '');

const stripApiSuffix = (value = '') => value.replace(/\/api$/i, '');

const normalizeBackendBaseUrl = (rawUrl = '') => {
  const trimmed = trimTrailingSlashes(String(rawUrl).trim());
  return stripApiSuffix(trimmed);
};

export const getBackendBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return normalizeBackendBaseUrl(envUrl);
  }

  if (import.meta.env.MODE === 'production' && typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const host = window.location.host;

    if (host.includes('vercel.app')) {
      return 'https://hireviva.onrender.com';
    }

    return `${protocol}//${host}`;
  }

  return 'http://localhost:5009';
};

export const getApiBaseUrl = () => `${getBackendBaseUrl()}/api`;
