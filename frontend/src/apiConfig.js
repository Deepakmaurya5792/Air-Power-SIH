// Centralized API configuration supporting environment variables
const rawUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

// In HTTPS production (e.g. on Vercel), default to empty or configured URL to prevent browser mixed-content blockage
export const API_BASE_URL = rawUrl || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? '' : 'http://127.0.0.1:8000');
