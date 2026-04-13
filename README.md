# Mecenate App

Feed screen for the Mecenate platform — a creator support service (Patreon/Boosty analog). Built with React Native + Expo.

## Features

- Paginated post feed with cursor-based infinite scroll
- Pull-to-refresh
- Optimistic like toggling with MobX
- Locked content overlay for paid posts
- Skeleton loading states
- Error state with retry

## Tech Stack

- **React Native + Expo** (SDK 54)
- **TypeScript**
- **Expo Router** (file-based routing)
- **React Query** (`@tanstack/react-query`) — server state, pagination, caching
- **MobX** + `mobx-react-lite` — client state (optimistic like updates)
- **Design tokens** — centralized color, spacing, typography system

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your device or iOS Simulator / Android Emulator

### Install

```bash
npm install
```

### Run

```bash
npx expo start
```

Then press:
- `i` — iOS Simulator
- `a` — Android Emulator
- Scan QR code with Expo Go

## Environment Variables

No environment variables required. The API base URL and demo auth token are pre-configured in `src/shared/api/client.ts`:

| Variable | Value |
|---|---|
| `BASE_URL` | `https://k8s.mectest.ru/test-app` |
| `AUTH_TOKEN` | `550e8400-e29b-41d4-a716-446655440000` |

To override for production, extract these into an `.env` file using `expo-constants` or `react-native-dotenv`.

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full architecture description.

```
src/
  features/feed/     # Feed feature (screens, components, hooks, store, api)
  shared/            # Shared utilities (api client, design tokens, providers)
app/                 # Expo Router file-based routes
```
