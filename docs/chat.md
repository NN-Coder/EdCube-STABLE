# EdCube Global Chat Architecture (Archived)

This document serves as an architectural overview of the Global Chat system that was implemented in EdCube before being removed. It is preserved here to provide a starting point in case the feature is re-implemented in the future.

## Infrastructure & Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **Real-time Database**: Supabase (PostgreSQL + Realtime Channels)
- **Styling**: Tailwind CSS with a "Cyberpunk/Space" aesthetic (glassmorphism, neon glows)
- **Icons**: Lucide React

## Core Components
The chat was located primarily under `src/app/chat` and `src/components/chat`.

1. **`ChatContainer.tsx`**: The main wrapper. Maintained the state for `safeMode` and `isFrozen` (subscribing to `chat_settings` table via Supabase Realtime). Handled the layout splitting between the main chat area and the active users sidebar.
2. **`MessageFeed.tsx`**: Responsible for rendering the list of messages in real-time, integrating with Supabase Realtime for instant updates.
3. **`ChatInput.tsx`**: Provided the form for users to send messages, invoking Next.js Server Actions.
4. **`OnlineUsers.tsx`**: Displayed a list of active users via Supabase Presence.

## Backend & Logic (`src/app/actions/chat.ts`)
Message processing was handled via Next.js Server Actions to ensure security and reduce client-side payload. 

### Features
- **Authentication Check**: Required users to be logged in to send messages.
- **Message Validation**: Prevented empty messages and enforced a 500-character limit.
- **Slur Filter**: A hardcoded array of blocked words that prevented messages from being sent if triggered.
- **Global Freeze**: Checked against a `chat_settings` table (where `id = "global"`). If `is_frozen` was true, only admins could send messages.
- **Admin Commands**: Hardcoded against an Admin UUID (`1ff896ac-ee93-4e70-8c75-d98cb41f3c69`). Admins could use slash commands:
  - `/broadcast <msg>`: Sends an announcement message.
  - `/freeze`: Locks the chat for all non-admin users.
  - `/unfreeze`: Unlocks the chat.
  - `/tempmute <user_id> <minutes>`: Temporarily mutes a user by updating `is_muted_until` on their profile.
  - `/permamute <user_id>`: Permanently mutes a user (sets `is_muted_until` to year 9999).
  - `/unmute <user_id>`: Removes any mute restrictions.

## Database Schema
The chat relied on the following Supabase tables:

1. **`messages`**: Stored chat messages with `id`, `user_id`, `content`, `created_at`, and `is_announcement` fields.
2. **`chat_settings`**: Stored global configuration, primarily the `is_frozen` state.
3. **`profiles`**: Extended with an `is_muted_until` timestamp to enforce muting logic.

## Real-time Sync
- Messages and global settings were synced to clients instantly using `supabase.channel("public:...")` with `postgres_changes`.
- Active users list utilized Supabase's `presence` feature.

## Reason for Removal
The chat feature was stripped out to streamline the application, improve performance, and reduce the moderation overhead of maintaining a global, real-time communication platform in an unblocked gaming environment.
