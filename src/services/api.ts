import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
};

export const hoagies = {
  getAll: (page: number = 1, search: string = '', limit: number = 10) =>
    api.get(`/hoagies?page=${page}&limit=${limit}&searchTerm=${search}`),
  getOne: (id: string) => api.get(`/hoagies/${id}`),
  create: (data: { name: string; ingredients: string[]; picture?: string }) =>
    api.post('/hoagies', data),
  update: (id: string, data: Partial<{ name: string; ingredients: string[]; picture?: string }>) =>
    api.patch(`/hoagies/${id}`, data),
  delete: (id: string) => api.delete(`/hoagies/${id}`),
  addCollaborator: (id: string, collaboratorId: string) =>
    api.post(`/hoagies/${id}/collaborators`, { collaboratorId }),
  removeCollaborator: (id: string, collaboratorId: string) =>
    api.delete(`/hoagies/${id}/collaborators/${collaboratorId}`),
  search: (query: string) =>
    api.get(`/hoagies/search?query=${query}`),
};

export const comments = {
  getByHoagie: (hoagieId: string) =>
    api.get(`/comments/hoagie/${hoagieId}`),
  create: (hoagieId: string, text: string) =>
    api.post('/comments', { hoagie: hoagieId, text }),
  update: (id: string, text: string) =>
    api.patch(`/comments/${id}`, { text }),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

export const user = {
  getAll: (page: number = 1, limit: number = 10) => api.get(`/users?page=${page}&limit=${limit}`),
};

export default api;
