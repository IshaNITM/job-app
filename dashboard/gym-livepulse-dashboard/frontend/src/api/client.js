import axios from 'axios';

const base =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export const api = axios.create({
  baseURL: base ? `${base}/api` : '/api',
  timeout: 120_000,
});

export async function fetchGyms() {
  const { data } = await api.get('/gyms');
  return data;
}

export async function fetchGym(id) {
  const { data } = await api.get(`/gyms/${id}`);
  return data;
}

export async function fetchOccupancy(id) {
  const { data } = await api.get(`/gyms/${id}/occupancy`);
  return data;
}

export async function fetchRevenue(params) {
  const { data } = await api.get('/analytics/revenue', { params });
  return data;
}

export async function fetchChurnRisk() {
  const { data } = await api.get('/analytics/churn-risk');
  return data;
}

export async function fetchAnomalies() {
  const { data } = await api.get('/anomalies');
  return data;
}

export async function fetchMembers(params) {
  const { data } = await api.get('/members', { params });
  return data;
}
