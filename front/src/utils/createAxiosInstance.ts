import axios, { AxiosInstance } from 'axios';

export const createAxiosInstance = (): AxiosInstance => {
  let baseURL: string;
  console.log('processenv:',process.env.NEXT_PUBLIC_TRENCHES_BACKEND_PORT);
  if (process.env.NEXT_PUBLIC_TRENCHES_BACKEND_PORT) {
    baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_TRENCHES_BACKEND_PORT}`;
  } else {
    baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
  }
  console.log( "alert", baseURL);
  return axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};