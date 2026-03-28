import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
});

export const getMeetings = () => api.get('/meetings/');
export const getMeeting = (id) => api.get(`/meetings/${id}/`);
export const uploadAudio = (formData) => api.post('/meetings/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMeetingStatus = (id) => api.get(`/meetings/${id}/status/`);
export const analyzeMeeting = (id) => api.post(`/meetings/${id}/analyze/`);
export const sendChatMessage = (id, question) => api.post(`/meetings/${id}/chat/`, { question });

export default api;
