import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,

  paramsSerializer: {
    indexes: null,
  },
});
