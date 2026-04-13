import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
let unauthorizedHandler = null;

export const api = axios.create({
  baseURL,
  timeout: 20000
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  }
);


export function attachToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}


export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}


export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
