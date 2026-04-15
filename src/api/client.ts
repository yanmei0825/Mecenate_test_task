import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://k8s.mectest.ru/test-app';
const USER_UUID = process.env.EXPO_PUBLIC_USER_UUID ?? '550e8400-e29b-41d4-a716-446655440000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${USER_UUID}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
