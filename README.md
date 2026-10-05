## Install Frontend

npm create vite@latest web -- --template react-ts
cd web
npm install

## install tailwindcss

npm install tailwindcss @tailwindcss/vite

## In vite.config.ts:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
plugins: [react(), tailwindcss()],
})

web/.env:
VITE_API_URL=http://localhost:3000/api

Optional router:
cd web
npm install react-router-dom

1. Tiny API helper — web/src/api.ts

## Create Generic API Helper

const API = import.meta.env.VITE_API_URL;
export async function api<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
    const message = body?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
    }
    return body as T;
}
