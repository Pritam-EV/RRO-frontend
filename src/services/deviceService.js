import api from "./api";
export const connectDevice = (deviceCode) => api.post("/devices/connect", { deviceCode });
export const getMyDevice = () => api.get("/devices/my");