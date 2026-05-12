# Discord Webhook Architect Skill

## Overview
Integrates site events and changelogs with Discord via webhooks.

## Capabilities
- Send automated deployment notifications to Discord channels.
- Bridge site-wide "Changelog" updates to a dedicated Discord feed.
- Notify admins of critical errors or DMCA reports via secure webhooks.

## Rules
- NEVER leak webhook URLs in public code (use `.env`).
- FORMAT messages with rich embeds and Lucide-like emojis.
- IMPLEMENT debounce/throttling for high-frequency events.
- INCLUDE direct links to the relevant site pages in the notification.
