# Architecture

## Overview

Feature-based architecture. Each feature owns its API layer, components, hooks, store, and screens. Shared code lives in `src/shared/`. Components are split into individual folders — each with its own `.tsx` and `index.ts` barrel.

## Directory Structure

```
mecenate-app/
├── app/                              # Expo Router routes
│   ├── _layout.tsx                   # Root layout (providers, global StatusBar)
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Tab navigator (Slot)
│   │   └── index.tsx                 # Feed tab → FeedScreen
│   └── post/
│       └── [id].tsx                  # Post detail → PostDetailScreen
├── assets/
│   └── icons/                        # Custom SVG icon components
├── src/
│   ├── features/
│   │   └── feed/                     # Feed feature module
│   │       ├── api/
│   │       │   ├── feedApi.ts        # getPosts, getPost, likePost, getComments, addComment
│   │       │   └── index.ts
│   │       ├── components/
│   │       │   ├── CommentsDrawer/   # Bottom sheet with comment list + input
│   │       │   ├── CommentInputBar/  # Re-export of shared InputBar
│   │       │   ├── CommentItem/      # Single comment row (avatar + text)
│   │       │   ├── FeedError/        # Full-screen error state
│   │       │   ├── FeedFooterLoader/ # Infinite scroll footer spinner
│   │       │   ├── FeedListHeader/   # Feed title + FilterTabs
│   │       │   ├── LockedOverlay/    # Paid content blur + donate CTA
│   │       │   ├── PostActions/      # Like + comment action buttons
│   │       │   ├── PostAuthorRow/    # Avatar + display name + subtitle
│   │       │   ├── PostCard/         # Feed item (free & paid variants)
│   │       │   ├── PostDetailHeader/ # Post header for detail screen
│   │       │   ├── PostSkeleton/     # Shimmer loading skeleton
│   │       │   └── index.ts          # Barrel export
│   │       ├── hooks/
│   │       │   ├── useAddComment.ts  # Mutation — prepends new comment to cache
│   │       │   ├── useComments.ts    # Infinite query for comments
│   │       │   ├── useFeed.ts        # Infinite query + keepPreviousData on tab switch
│   │       │   ├── useLikePost.ts    # Optimistic like mutation
│   │       │   ├── usePost.ts        # Single post query
│   │       │   └── index.ts
│   │       ├── screens/
│   │       │   ├── FeedScreen.tsx    # Feed list + filter tabs + comments drawer
│   │       │   ├── PostDetailScreen.tsx # Full post + inline comments
│   │       │   └── index.ts
│   │       ├── store/
│   │       │   ├── feedStore.ts      # MobX — optimistic like state
│   │       │   └── index.ts
│   │       ├── types.ts              # Author, Post, Comment, *Page types
│   │       └── index.ts
│   └── shared/
│       ├── api/
│       │   ├── client.ts             # Fetch wrapper (Bearer auth, JSON parse)
│       │   └── index.ts
│       ├── design/
│       │   ├── tokens.ts             # Colors, Spacing, Radius, Typography, Shadow
│       │   ├── components/
│       │   │   ├── Button.tsx        # Pressable button (primary/outline, sm/md/lg)
│       │   │   ├── FilterTabs.tsx    # Animated tab selector
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── lib/
│       │   └── format/
│       │       ├── formatCount.ts    # 1200 → "1.2K"
│       │       ├── formatDate.ts     # ISO → relative/locale date
│       │       └── index.ts
│       ├── providers/
│       │   ├── QueryProvider.tsx     # React Query client setup
│       │   └── index.ts
│       ├── types/
│       │   ├── api.ts                # ApiResponse<T> discriminated union
│       │   └── index.ts
│       └── ui/
│           ├── EmptyState/           # Icon + title + retry button
│           ├── InputBar/             # Fixed-height comment input with send button
│           └── NavBar/               # Back navigation bar
└── package.json
```

## Data Flow

```
FeedScreen
  └── useFeed(tier)                        # React Query infinite query
        ├── placeholderData: keepPreviousData  # No flicker on tab switch
        └── feedApi.getPosts → GET /posts?cursor=&tier=

PostDetailScreen / CommentsDrawer
  └── useComments(postId)                  # React Query infinite query
  └── useAddComment(postId)
        └── onSuccess → setQueryData        # Prepend new comment, dedup across all pages

PostActions (like button)
  ├── feedStore.getIsLiked / getLikesCount  # MobX observer — instant read
  └── useLikePost()
        ├── onMutate  → feedStore.optimisticLike   # Instant UI update
        ├── onSuccess → feedStore.setLikeState     # Confirm with server truth
        └── onError   → feedStore.setLikeState     # Rollback
```

## State Management

| Concern | Tool | Why |
|---|---|---|
| Server data / pagination / caching | React Query | Cursor pagination, stale/revalidation, `keepPreviousData` |
| Optimistic like state | MobX | Reactive instant UI, independent of query cache |

## Design System

All visual constants live in `src/shared/design/tokens.ts`.

| Token group | Key values |
|---|---|
| `Colors` | `primary #6115CD`, hover `primaryElevated`, pressed `primaryDark`, disabled `primaryDim` |
| `Colors` | `icon #57626F`, `iconLight #A4AAB0`, `actionDefault/Hover/Pressed/Disabled` |
| `Spacing` | `xs=4` `sm=8` `md=16` `lg=24` `xl=32` `xxl=48` |
| `Radius` | `sm=8` `md=12` `lg=16` `xl=20` `full=9999` |
| `Typography` | Size scale `xs(11)→xxxl(28)`, weight `regular→bold` |

### Button states (via `Pressable`)
- **Primary**: default `primary` → hover `primaryElevated` → pressed `primaryDark` → disabled `primaryDim`
- **Outline**: default transparent/`primary` border → hover/pressed `primaryDim` bg → disabled `textMuted` border

## API

Base URL: `https://k8s.mectest.ru/test-app`
Auth: `Bearer 550e8400-e29b-41d4-a716-446655440000`

| Endpoint | Method | Usage |
|---|---|---|
| `/posts` | GET | Paginated feed (`limit`, `cursor`, `tier`) |
| `/posts/:id` | GET | Single post |
| `/posts/:id/like` | POST | Toggle like |
| `/posts/:id/comments` | GET | Paginated comments |
| `/posts/:id/comments` | POST | Add comment → returns `Comment` |

All responses: `{ ok: true, data: T }` or `{ ok: false, error: { code, message } }`.

## Android Notes

- **expo-blur**: `experimentalBlurMethod="dimezisBlurView"` enabled on `LockedOverlay`. JitPack and `com.github.Dimezis:BlurView:version-2.0.6` wired via expo-blur's own `build.gradle`. Requires dev/production build (not Expo Go).
- **Status bar**: Managed globally via `expo-status-bar` (`style="dark"`) in root `_layout.tsx`. Per-screen React Native `StatusBar` components removed to avoid conflicts.
- **Edge-to-edge**: `edgeToEdgeEnabled: true` in `app.json`.

## Conventions

- Each component folder has `ComponentName.tsx` + `index.ts` barrel
- Screen files contain only orchestration logic (state, hooks, callbacks) — no inline component definitions
- No barrel re-exports of internal implementation details
- `FeedTier` type exported from `useFeed.ts`, consumed by `FeedScreen`
- TypeScript strict mode; no `any` except `InputBar.TextInputComponent` (intentional — ref type incompatibility between `TextInput` and `BottomSheetTextInput`)
