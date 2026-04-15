# Mecenate Feed — Test Assignment

React Native + Expo app for the Mecenate author support platform.

## Stack

- TypeScript
- React Native + Expo (iOS & Android)
- MobX + React Query (state management)
- Design tokens (`src/tokens/index.ts`)

## Features

- Scrollable feed with cursor-based infinite pagination
- Pull-to-refresh
- Paid post lock overlay with "Отправить донат" CTA
- Optimistic like toggle (MobX + React Query mutation)
- Comments bottom sheet with pagination and add comment
- Error state: "Не удалось загрузить публикации" + retry button
- Empty state

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | API base URL | `https://k8s.mectest.ru/test-app` |
| `EXPO_PUBLIC_USER_UUID` | Any valid UUID used as Bearer token | `550e8400-e29b-41d4-a716-446655440000` |

Generate a UUID at https://www.uuidgenerator.net/

### 3. Run

```bash
npx expo start
```

Then:
- Press `a` — Android emulator
- Press `i` — iOS simulator (macOS only)
- Press `w` — browser preview
- Scan QR with **Expo Go** app on your phone

## API

Base URL: `https://k8s.mectest.ru/test-app`  
Auth: `Authorization: Bearer <UUID>`  
Spec: https://k8s.mectest.ru/test-app/openapi.json
