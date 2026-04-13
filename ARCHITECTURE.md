# Architecture

## Overview

Feature-based architecture. Each feature owns its API layer, components, hooks, store, and screens. Shared code lives in `src/shared/`.

## Directory Structure

```
mecenate-app/
├── app/                          # Expo Router routes
│   ├── _layout.tsx               # Root layout with providers
│   └── (tabs)/
│       ├── _layout.tsx           # Tab navigator
│       └── index.tsx             # Feed tab → renders FeedScreen
├── src/
│   ├── features/
│   │   └── feed/                 # Feed feature
│   │       ├── api/
│   │       │   ├── feedApi.ts    # API calls (getPosts, likePost, getPost)
│   │       │   └── index.ts
│   │       ├── components/
│   │       │   ├── PostCard/     # Single post card (free & paid)
│   │       │   ├── LockedOverlay/# Paid post lock UI
│   │       │   ├── FeedError/    # Error state with retry
│   │       │   ├── PostSkeleton/ # Loading skeleton
│   │       │   └── index.ts
│   │       ├── hooks/
│   │       │   ├── useFeed.ts    # Infinite query for posts
│   │       │   ├── useLikePost.ts# Like mutation with optimistic update
│   │       │   └── index.ts
│   │       ├── screens/
│   │       │   ├── FeedScreen.tsx# Main feed screen
│   │       │   └── index.ts
│   │       ├── store/
│   │       │   ├── feedStore.ts  # MobX store (like state)
│   │       │   └── index.ts
│   │       ├── types.ts          # Post, Author, PostsPage types
│   │       └── index.ts          # Public feature API
│   └── shared/
│       ├── api/
│       │   ├── client.ts         # Base fetch wrapper with auth
│       │   └── index.ts
│       ├── design/
│       │   ├── tokens.ts         # Colors, spacing, radius, typography
│       │   └── index.ts
│       ├── providers/
│       │   ├── QueryProvider.tsx  # React Query client provider
│       │   └── index.ts
│       └── types/
│           ├── api.ts            # ApiResponse<T> types
│           └── index.ts
├── constants/
│   └── theme.ts                  # Legacy theme (updated to match design tokens)
└── assets/                       # Images, fonts, icons
```

## Data Flow

```
FeedScreen
  └── useFeed (React Query infinite query)
        └── feedApi.getPosts → GET /posts?cursor=...
              └── apiClient (fetch + Bearer token)

PostCard
  ├── reads: feedStore.getIsLiked / getLikesCount (MobX observer)
  └── useLikePost (React Query mutation)
        ├── onMutate  → feedStore.optimisticLike (instant UI update)
        ├── onSuccess → feedStore.setLikeState (server truth)
        └── onError   → feedStore.setLikeState (rollback)
```

## State Management

| Concern | Tool | Why |
|---|---|---|
| Server data / pagination / caching | React Query | Automatic stale/revalidation, cursor pagination built-in |
| Optimistic like state | MobX | Reactive, instant UI without waiting for React Query invalidation |

## Design System

All visual values live in `src/shared/design/tokens.ts`:

| Token group | Values |
|---|---|
| `Colors` | Dark theme: background `#0D0D0D`, surface `#1A1A1A`, primary `#7C3AED` |
| `Spacing` | `xs=4` `sm=8` `md=16` `lg=24` `xl=32` `xxl=48` |
| `Radius` | `sm=8` `md=12` `lg=16` `xl=20` `full=9999` |
| `Typography` | Size scale xs→xxxl, weight regular→bold |

## API

Base URL: `https://k8s.mectest.ru/test-app`

Auth: `Bearer 550e8400-e29b-41d4-a716-446655440000`

| Endpoint | Usage |
|---|---|
| `GET /posts?limit&cursor` | Paginated feed |
| `POST /posts/:id/like` | Toggle like |

All responses: `{ ok: boolean, data: T }` or `{ ok: false, error: { code, message } }`.

## Conventions

- Each folder has `index.ts` exporting public API
- No barrel re-exports of internal implementation details
- No inline comments — code is self-explanatory
- TypeScript strict mode
