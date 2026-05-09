import api from "./api";
export const getTodaySummary = (deviceId) => api.get(`/water/${deviceId}/today`);
export const getUsageHistory = (deviceId, range = "7d") => api.get(`/water/${deviceId}/history?range=${range}`);
export const controlValve = (deviceId, valveStatus) => api.patch(`/water/${deviceId}/valve`, { valveStatus });