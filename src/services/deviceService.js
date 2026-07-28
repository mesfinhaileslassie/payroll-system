// src/services/deviceService.js
import api from './api'; // ✅ default import

export const deviceService = {
  registerDevice: async (data) => {
    const response = await api.post('/device/register', data);
    return response.data;
  },
  activateDevice: async (data) => {
    const response = await api.post('/device/activate', data);
    return response.data;
  },
  verifyOTP: async (data) => {
    const response = await api.post('/device/verify-otp', data);
    return response.data;
  },
  generateOTP: async (data) => {
    const response = await api.post('/device/generate-otp', data);
    return response.data;
  },
  getDevices: async () => {
    const response = await api.get('/device');
    return response.data;
  },
  getDeviceStatus: async (deviceId) => {
    const response = await api.get(`/device/${deviceId}/status`);
    return response.data;
  }
};